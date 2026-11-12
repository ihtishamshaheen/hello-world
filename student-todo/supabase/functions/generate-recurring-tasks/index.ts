import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing recurrence function secrets.");

const admin = createClient(supabaseUrl, serviceRoleKey);

type RecurrenceRule = {
    frequency: "daily" | "weekly" | "monthly" | "custom";
    interval: number;
    weekday?: number;
};

function parseRecurrenceRule(value: unknown, taskId: string): RecurrenceRule {
    if (typeof value !== "string" && (typeof value !== "object" || value === null)) {
        throw new Error(`Task ${taskId} has an invalid recurrence_rule value.`);
    }

    if (typeof value === "string") {
        const text = value.trim();
        if (!text || text === "none") {
            throw new Error(`Task ${taskId} has no recurrence rule.`);
        }
        if (!["daily", "weekly", "monthly", "custom"].includes(text)) {
            throw new Error(`Task ${taskId} has recurrence_rule text that is not a supported frequency.`);
        }
        value = { frequency: text, interval: 1 };
    }

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error(`Task ${taskId} has an invalid recurrence_rule object.`);
    }

    const candidate = value as Record<string, unknown>;
    const frequencies = ["daily", "weekly", "monthly", "custom"];
    if (!frequencies.includes(String(candidate.frequency))) {
        throw new Error(`Task ${taskId} has an unsupported recurrence frequency.`);
    }

    const interval = Number(candidate.interval ?? 1);
    if (!Number.isInteger(interval) || interval < 1) {
        throw new Error(`Task ${taskId} has an invalid recurrence interval.`);
    }

    if (candidate.weekday !== undefined
        && (!Number.isInteger(candidate.weekday) || Number(candidate.weekday) < 0 || Number(candidate.weekday) > 6)) {
        throw new Error(`Task ${taskId} has an invalid recurrence weekday.`);
    }

    return {
        frequency: candidate.frequency as RecurrenceRule["frequency"],
        interval,
        ...(candidate.weekday === undefined ? {} : { weekday: Number(candidate.weekday) })
    };
}

function nextDeadline(current: Date, rule: RecurrenceRule) {
    const interval = Math.max(1, Number(rule.interval || 1));
    if (rule.frequency === "daily" || rule.frequency === "custom") {
        const result = new Date(current);
        result.setUTCDate(result.getUTCDate() + interval);
        return result;
    } else if (rule.frequency === "weekly") {
        const result = new Date(current);
        result.setUTCDate(result.getUTCDate() + 7 * interval);
        return result;
    }

    const year = current.getUTCFullYear();
    const month = current.getUTCMonth() + interval;
    const day = current.getUTCDate();
    const targetYear = year + Math.floor(month / 12);
    const targetMonth = ((month % 12) + 12) % 12;
    const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    const result = new Date(current);
    result.setUTCFullYear(targetYear, targetMonth, Math.min(day, lastDay));
    return result;
}

function parseInterval(value: unknown, taskId: string) {
    const interval = Number(value ?? 1);
    if (!Number.isInteger(interval) || interval < 1) {
        throw new Error(`Task ${taskId} has an invalid recurrence interval.`);
    }
    return interval;
}

Deno.serve(async () => {
    const { data: roots, error } = await admin
        .from("Tasks")
        .select("*")
        .eq("recurrence_active", true)
        .eq("completed", false)
        .is("recurrence_parent_id", null)
        .not("recurrence_rule", "is", null)
        .not("due_at", "is", null);
    if (error) return new Response(error.message, { status: 500 });

    const parsedRoots = [];
    for (const root of roots || []) {
        try {
            parsedRoots.push({
                root,
                rule: {
                    ...parseRecurrenceRule(root.recurrence_rule, root.id),
                    interval: parseInterval(root.recurrence_interval, root.id)
                }
            });
        } catch (error) {
            return new Response((error as Error).message, { status: 422 });
        }
    }

    let generated = 0;
    for (const { root, rule } of parsedRoots) {
        const { data: latest, error: latestError } = await admin
            .from("Tasks")
            .select("due_at")
            .eq("recurrence_series_id", root.recurrence_series_id)
            .not("due_at", "is", null)
            .order("due_at", { ascending: false })
            .limit(1)
            .maybeSingle();
        if (latestError) return new Response(latestError.message, { status: 500 });
        const latestDeadline = new Date(latest?.due_at || root.due_at);
        if (latestDeadline.getTime() > Date.now() + 24 * 60 * 60 * 1000) continue;
        const next = nextDeadline(latestDeadline, rule);
        if (root.recurrence_end_date && next.toISOString().slice(0, 10) > root.recurrence_end_date) continue;

        const { error: insertError } = await admin.from("Tasks").insert({
            user_id: root.user_id,
            text: root.text,
            description: root.description,
            priority: root.priority,
            completed: false,
            status: "todo",
            due_date: next.toISOString().slice(0, 10),
            due_at: next.toISOString(),
            category: root.category,
            reminder_enabled: root.reminder_enabled,
            reminder_options: root.reminder_options,
            recurrence_series_id: root.recurrence_series_id,
            recurrence_parent_id: root.id,
            recurrence_interval: rule.interval,
            recurrence_active: false
        });
        if (insertError?.code === "23505") continue;
        if (insertError) return new Response(insertError.message, { status: 500 });
        generated += 1;
    }

    return Response.json({ generated });
});
