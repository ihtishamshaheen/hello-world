alter table public."Tasks"
    add column if not exists due_at timestamptz,
    add column if not exists reminder_enabled boolean not null default false,
    add column if not exists reminder_options text[] not null default '{}',
    add column if not exists recurrence_rule jsonb,
    add column if not exists recurrence_end_date date,
    add column if not exists recurrence_active boolean not null default false,
    add column if not exists recurrence_series_id uuid default gen_random_uuid(),
    add column if not exists recurrence_parent_id uuid;

update public."Tasks"
set recurrence_series_id = gen_random_uuid()
where recurrence_series_id is null;

alter table public."Tasks"
    add constraint tasks_reminder_options_check
    check (reminder_options <@ array['one_day', 'one_hour', 'at_deadline']::text[]);

alter table public."Tasks"
    add constraint tasks_recurrence_rule_check
    check (
        recurrence_rule is null
        or (
            recurrence_rule ? 'frequency'
            and recurrence_rule->>'frequency' in ('daily', 'weekly', 'monthly', 'custom')
            and (not (recurrence_rule ? 'interval') or (recurrence_rule->>'interval')::integer > 0)
        )
    );

create unique index if not exists tasks_recurrence_occurrence_unique
    on public."Tasks" (recurrence_series_id, due_at)
    where recurrence_series_id is not null and due_at is not null;

create index if not exists tasks_due_reminders_index
    on public."Tasks" (due_at)
    where reminder_enabled = true and completed = false;

create table if not exists public."TaskReminderDeliveries" (
    id uuid primary key default gen_random_uuid(),
    task_id uuid not null references public."Tasks"(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    reminder_type text not null check (reminder_type in ('one_day', 'one_hour', 'at_deadline')),
    due_at timestamptz not null,
    sent_at timestamptz not null default now(),
    unique (task_id, reminder_type, due_at)
);

alter table public."TaskReminderDeliveries" enable row level security;

create policy "Users can view their own reminder deliveries"
on public."TaskReminderDeliveries" for select
to authenticated
using (auth.uid() = user_id);

revoke insert, update, delete on public."TaskReminderDeliveries" from authenticated, anon;

create index if not exists task_reminder_deliveries_due_index
    on public."TaskReminderDeliveries" (due_at, reminder_type);

comment on column public."Tasks".due_at is
    'Timezone-aware deadline. Existing due_date remains the calendar-date display fallback.';
comment on column public."Tasks".recurrence_rule is
    'JSON object: frequency daily|weekly|monthly|custom, interval, and optional weekday.';
