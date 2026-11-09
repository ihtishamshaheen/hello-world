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

function isDue(dueAt: string, offset: number, now: number) {
    const target = new Date(dueAt).getTime() - offset;
    return target >= now - 2 * 60 * 1000 && target <= now + 2 * 60 * 1000;
}

async function sendEmail(to: string, subject: string, text: string) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ from: fromEmail, to: [to], subject, text })
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);
}

Deno.serve(async () => {
    const now = Date.now();
    const { data: tasks, error } = await admin
        .from("Tasks")
        .select("id,user_id,text,due_at,reminder_options")
        .eq("completed", false)
        .eq("reminder_enabled", true)
        .not("due_at", "is", null)
        .gte("due_at", new Date(now - 24 * 60 * 60 * 1000).toISOString())
        .lte("due_at", new Date(now + 24 * 60 * 60 * 1000).toISOString());
    if (error) return new Response(error.message, { status: 500 });

    let sent = 0;
    for (const task of tasks || []) {
        for (const reminderType of task.reminder_options || []) {
            const offset = reminderOffsets[reminderType as keyof typeof reminderOffsets];
            if (offset === undefined || !isDue(task.due_at, offset, now)) continue;

            const { data: delivery, error: claimError } = await admin
                .from("TaskReminderDeliveries")
                .insert({
                    task_id: task.id,
                    user_id: task.user_id,
                    reminder_type: reminderType,
                    due_at: task.due_at
                })
                .select("id")
                .maybeSingle();
            if (claimError?.code === "23505") continue;
            if (claimError) return new Response(claimError.message, { status: 500 });

            const { data: currentTask, error: currentTaskError } = await admin
                .from("Tasks")
                .select("completed")
                .eq("id", task.id)
                .maybeSingle();
            if (currentTaskError) return new Response(currentTaskError.message, { status: 500 });
            if (!currentTask || currentTask.completed) {
                await admin.from("TaskReminderDeliveries").delete().eq("id", delivery.id);
                continue;
            }

            const { data: userData, error: userError } = await admin.auth.admin.getUserById(task.user_id);
            if (userError || !userData.user?.email) {
                await admin.from("TaskReminderDeliveries").delete().eq("id", delivery.id);
                continue;
            }

            try {
                await sendEmail(
                    userData.user.email,
                    `Study Desk reminder: ${task.text}`,
                    `"${task.text}" is due ${reminderType === "at_deadline" ? "now" : reminderType === "one_hour" ? "in one hour" : "tomorrow"}.\n\nSign in to Study Desk to review it.`
                );
                sent += 1;
            } catch (emailError) {
                await admin.from("TaskReminderDeliveries").delete().eq("id", delivery.id);
                return new Response((emailError as Error).message, { status: 502 });
            }
        }
    }

    return Response.json({ sent });
});
