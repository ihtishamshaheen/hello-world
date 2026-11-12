import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !fromEmail) {
    throw new Error("Missing reminder function secrets.");
}

const admin = createClient(supabaseUrl, serviceRoleKey);
const reminderOffsets = {
    one_day: 24 * 60 * 60 * 1000,
    one_hour: 60 * 60 * 1000,
    at_deadline: 0
};
const claimTimeoutMs = 10 * 60 * 1000;
const leaseHeartbeatMs = 2 * 60 * 1000;
const initialCatchUpWindowMs = 15 * 60 * 1000;
const initialFutureWindowMs = 2 * 60 * 1000;
const maxRetryDelayMs = 24 * 60 * 60 * 1000;
const maxAttempts = 5;

function isDue(dueAt: string, offset: number, now: number) {
    const target = new Date(dueAt).getTime() - offset;
    return target >= now - initialCatchUpWindowMs && target <= now + initialFutureWindowMs;
}

async function sendEmail(to: string, subject: string, text: string, signal: AbortSignal) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ from: fromEmail, to: [to], subject, text }),
        signal
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);
}

type Task = {
    id: string;
    user_id: string;
    text: string;
    due_at: string | null;
    reminder_options: string[] | null;
    reminder_enabled: boolean;
    completed: boolean;
};

type Delivery = {
    id: string;
    status: "pending" | "processing" | "failed" | "sent" | "cancelled";
    attempts: number;
    claimed_at: string | null;
    next_retry_at: string | null;
};

type DeliveryClaim = {
    id: string;
    attempts: number;
    claimedAt: string;
};

async function findDelivery(task: { id: string; due_at: string }, reminderType: string) {
    const { data, error } = await admin
        .from("TaskReminderDeliveries")
        .select("id,status,attempts,claimed_at,next_retry_at")
        .eq("task_id", task.id)
        .eq("reminder_type", reminderType)
        .eq("due_at", task.due_at)
        .maybeSingle();
    if (error) throw error;
    return data as Delivery | null;
}

async function ensureDelivery(task: Task, reminderType: string) {
    const { error } = await admin.from("TaskReminderDeliveries").insert({
        task_id: task.id,
        user_id: task.user_id,
        reminder_type: reminderType,
        due_at: task.due_at,
        sent_at: null
    });
    if (error && error.code !== "23505") throw error;
}

async function claimDelivery(task: Task, reminderType: string, initialReminderDue: boolean) {
    let delivery = await findDelivery(task, reminderType);
    if (!delivery && !initialReminderDue) return null;

    if (!delivery) {
        await ensureDelivery(task, reminderType);
        delivery = await findDelivery(task, reminderType);
    }

    if (!delivery || delivery.status === "sent" || delivery.status === "cancelled") return null;

    const now = Date.now();
    if (delivery.status === "pending" && !initialReminderDue) return null;
    if (delivery.attempts >= maxAttempts && delivery.status !== "processing") return null;

    const claimedAt = delivery.claimed_at ? new Date(delivery.claimed_at).getTime() : 0;
    if (delivery.status === "processing" && now - claimedAt < claimTimeoutMs) return null;

    if (delivery.status === "processing" && delivery.attempts >= maxAttempts) {
        const { error: exhaustedError } = await admin
            .from("TaskReminderDeliveries")
            .update({
                status: "failed",
                claimed_at: null,
                next_retry_at: null,
                sent_at: null,
                last_error: "Maximum delivery attempts reached."
            })
            .eq("id", delivery.id)
            .eq("status", "processing")
            .eq("claimed_at", delivery.claimed_at);
        if (exhaustedError) throw exhaustedError;
        return null;
    }

    if (delivery.status === "failed"
        && delivery.next_retry_at
        && new Date(delivery.next_retry_at).getTime() > now) {
        return null;
    }

    const updateValues = {
        status: "processing",
        attempts: delivery.attempts + 1,
        claimed_at: new Date(now).toISOString(),
        sent_at: null,
        last_error: null
    };
    const staleClaim = new Date(now - claimTimeoutMs).toISOString();
    const claimQuery = delivery.status === "processing"
        ? admin.from("TaskReminderDeliveries")
            .update(updateValues)
            .eq("id", delivery.id)
            .eq("status", "processing")
            .lt("claimed_at", staleClaim)
        : admin.from("TaskReminderDeliveries")
            .update(updateValues)
            .eq("id", delivery.id)
            .eq("status", delivery.status);
    const { data: claimed, error: claimError } = await claimQuery
        .select("id,attempts")
        .maybeSingle();
    if (claimError) throw claimError;

    return claimed
        ? { id: claimed.id, attempts: claimed.attempts, claimedAt: updateValues.claimed_at }
        : null;
}

async function updateDelivery(id: string, claimedAt: string, values: Record<string, unknown>) {
    const { data, error } = await admin
        .from("TaskReminderDeliveries")
        .update(values)
        .eq("id", id)
        .eq("status", "processing")
        .eq("claimed_at", claimedAt)
        .select("id")
        .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Delivery claim was lost before it could be updated.");
}

function startLeaseHeartbeat(delivery: DeliveryClaim, controller: AbortController) {
    let stopped = false;
    let updating = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    let activeHeartbeat: Promise<void> | null = null;
    let heartbeatError: Error | null = null;

    const stop = () => {
        stopped = true;
        if (timer) clearInterval(timer);
    };

    const heartbeat = async () => {
        if (stopped || updating) return;
        updating = true;
        const nextClaimedAt = new Date().toISOString();
        try {
            const { data, error } = await admin
                .from("TaskReminderDeliveries")
                .update({ claimed_at: nextClaimedAt })
                .eq("id", delivery.id)
                .eq("status", "processing")
                .eq("claimed_at", delivery.claimedAt)
                .select("id")
                .maybeSingle();
            if (error || !data) {
                heartbeatError = error || new Error("Delivery claim was lost during heartbeat.");
                controller.abort();
                stopped = true;
                if (timer) clearInterval(timer);
                return;
            }
            delivery.claimedAt = nextClaimedAt;
        } catch (error) {
            heartbeatError = error as Error;
            controller.abort();
            stopped = true;
            if (timer) clearInterval(timer);
        } finally {
            updating = false;
        }
    };

    timer = setInterval(() => {
        if (!activeHeartbeat) {
            activeHeartbeat = heartbeat().finally(() => {
                activeHeartbeat = null;
            });
        }
    }, leaseHeartbeatMs);
    return async () => {
        stop();
        if (activeHeartbeat) await activeHeartbeat;
        if (heartbeatError) throw heartbeatError;
    };
}

async function cancelTaskDeliveries(task: Task) {
    const { data: deliveries, error } = await admin
        .from("TaskReminderDeliveries")
        .select("id,status,claimed_at,reminder_type")
        .eq("task_id", task.id);
    if (error) throw error;

    const activeReminderTypes = new Set(task.reminder_options || []);
    for (const delivery of deliveries || []) {
        if (delivery.status === "sent" || delivery.status === "cancelled") continue;
        const shouldCancel = task.completed
            || !task.reminder_enabled
            || !activeReminderTypes.has(delivery.reminder_type);
        if (!shouldCancel) continue;

        const cancellation = {
            status: "cancelled",
            claimed_at: null,
            next_retry_at: null,
            sent_at: null,
            last_error: "Task reminder is no longer active."
        };
        let query = admin
            .from("TaskReminderDeliveries")
            .update(cancellation)
            .eq("id", delivery.id)
            .neq("status", "sent")
            .neq("status", "cancelled");
        if (delivery.status === "processing") {
            query = query
                .eq("status", "processing")
                .lt("claimed_at", new Date(Date.now() - claimTimeoutMs).toISOString());
        } else {
            query = query.eq("status", delivery.status);
        }
        const { error: cancellationError } = await query;
        if (cancellationError) throw cancellationError;
    }
}

Deno.serve(async () => {
    const now = Date.now();
    const { data: tasks, error } = await admin
        .from("Tasks")
        .select("id,user_id,text,due_at,reminder_options,reminder_enabled,completed");
    if (error) return new Response(error.message, { status: 500 });

    let sent = 0;
    for (const task of (tasks || []) as Task[]) {
        try {
            await cancelTaskDeliveries(task);
        } catch (cancelError) {
            return new Response((cancelError as Error).message, { status: 500 });
        }
        if (task.completed || !task.reminder_enabled || !task.due_at) continue;

        for (const reminderType of task.reminder_options || []) {
            const offset = reminderOffsets[reminderType as keyof typeof reminderOffsets];
            const initialReminderDue = offset !== undefined && isDue(task.due_at, offset, now);

            let delivery;
            try {
                delivery = await claimDelivery(task, reminderType, initialReminderDue);
            } catch (claimError) {
                return new Response((claimError as Error).message, { status: 500 });
            }
            if (!delivery) continue;

            const { data: currentTask, error: currentTaskError } = await admin
                .from("Tasks")
                .select("completed")
                .eq("id", task.id)
                .maybeSingle();
            if (currentTaskError) return new Response(currentTaskError.message, { status: 500 });
            if (!currentTask || currentTask.completed) {
                await updateDelivery(delivery.id, delivery.claimedAt, {
                    status: "cancelled",
                    claimed_at: null,
                    next_retry_at: null,
                    sent_at: null,
                    last_error: "Task is no longer active."
                });
                continue;
            }

            const { data: userData, error: userError } =
                await admin.auth.admin.getUserById(task.user_id);
            if (userError || !userData.user?.email) {
                const attempts = Math.max(1, Number(delivery.attempts));
                const exhausted = attempts >= maxAttempts;
                const retryDelay = Math.min(maxRetryDelayMs, 15 * 60 * 1000 * 2 ** (attempts - 1));
                await updateDelivery(delivery.id, delivery.claimedAt, {
                    status: "failed",
                    claimed_at: null,
                    next_retry_at: exhausted ? null : new Date(Date.now() + retryDelay).toISOString(),
                    sent_at: null,
                    last_error: exhausted
                        ? `Maximum delivery attempts reached: ${userError?.message || "User email is unavailable."}`
                        : userError?.message || "User email is unavailable."
                });
                continue;
            }

            const controller = new AbortController();
            const stopHeartbeat = startLeaseHeartbeat(delivery, controller);
            try {
                await sendEmail(
                    userData.user.email,
                    `Study Desk reminder: ${task.text}`,
                    `"${task.text}" is due ${reminderType === "at_deadline" ? "now" : reminderType === "one_hour" ? "in one hour" : "tomorrow"}.\n\nSign in to Study Desk to review it.`,
                    controller.signal
                );
                await stopHeartbeat();
                await updateDelivery(delivery.id, delivery.claimedAt, {
                    status: "sent",
                    claimed_at: null,
                    next_retry_at: null,
                    last_error: null,
                    sent_at: new Date().toISOString()
                });
                sent += 1;
            } catch (emailError) {
                try {
                    await stopHeartbeat();
                } catch (heartbeatError) {
                    emailError = heartbeatError;
                }
                const attempts = Math.max(1, Number(delivery.attempts));
                const exhausted = attempts >= maxAttempts;
                const retryDelay = Math.min(maxRetryDelayMs, 15 * 60 * 1000 * 2 ** (attempts - 1));
                await updateDelivery(delivery.id, delivery.claimedAt, {
                    status: "failed",
                    claimed_at: null,
                    next_retry_at: exhausted ? null : new Date(Date.now() + retryDelay).toISOString(),
                    sent_at: null,
                    last_error: exhausted
                        ? `Maximum delivery attempts reached: ${(emailError as Error).message}`
                        : (emailError as Error).message
                });
            }
        }
    }

    return Response.json({ sent });
});
