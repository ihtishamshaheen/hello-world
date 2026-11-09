import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing recurrence function secrets.");

const admin = createClient(supabaseUrl, serviceRoleKey);

function nextDeadline(current: Date, rule: { frequency: string; interval?: number; weekday?: number }) {
    const result = new Date(current);
    const interval = Math.max(1, Number(rule.interval || 1));
    if (rule.frequency === "daily" || rule.frequency === "custom") {
        result.setUTCDate(result.getUTCDate() + interval);
    } else if (rule.frequency === "weekly") {
        result.setUTCDate(result.getUTCDate() + 7 * interval);
    } else {
        result.setUTCMonth(result.getUTCMonth() + interval);
    }
    return result;
}

Deno.serve(async () => {
    const { data: roots, error } = await admin
        .from("Tasks")
        .select("*")
        .eq("recurrence_active", true)
        .is("recurrence_parent_id", null)
        .not("recurrence_rule", "is", null)
        .not("due_at", "is", null);
    if (error) return new Response(error.message, { status: 500 });

    let generated = 0;
    for (const root of roots || []) {
        const rule = root.recurrence_rule;
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
            recurrence_active: false
        });
        if (insertError?.code === "23505") continue;
        if (insertError) return new Response(insertError.message, { status: 500 });
        generated += 1;
    }

    return Response.json({ generated });
});
