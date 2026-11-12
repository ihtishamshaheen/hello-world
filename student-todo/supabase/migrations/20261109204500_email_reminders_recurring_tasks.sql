alter table public."Tasks"
    add column if not exists reminder_options text[] not null default '{}',
    add column if not exists recurrence_active boolean not null default false,
    add column if not exists recurrence_series_id uuid default gen_random_uuid(),
    add column if not exists recurrence_interval integer not null default 1;

update public."Tasks"
set recurrence_series_id = gen_random_uuid()
where recurrence_series_id is null;

update public."Tasks"
set recurrence_interval = 1
where recurrence_interval is null or recurrence_interval < 1;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'tasks_reminder_options_check'
          and conrelid = 'public."Tasks"'::regclass
    ) then
        alter table public."Tasks"
            add constraint tasks_reminder_options_check
            check (reminder_options <@ array['one_day', 'one_hour', 'at_deadline']::text[]);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'tasks_recurrence_interval_check'
          and conrelid = 'public."Tasks"'::regclass
    ) then
        alter table public."Tasks"
            add constraint tasks_recurrence_interval_check
            check (recurrence_interval >= 1);
    end if;
end
$$;

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
    sent_at timestamptz,
    unique (task_id, reminder_type, due_at)
);

alter table public."TaskReminderDeliveries"
    alter column sent_at drop default,
    alter column sent_at drop not null;

alter table public."TaskReminderDeliveries" enable row level security;

do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'public'
          and tablename = 'TaskReminderDeliveries'
          and policyname = 'Users can view their own reminder deliveries'
    ) then
        create policy "Users can view their own reminder deliveries"
        on public."TaskReminderDeliveries" for select
        to authenticated
        using (auth.uid() = user_id);
    end if;
end
$$;

revoke insert, update, delete on public."TaskReminderDeliveries" from authenticated, anon;

create index if not exists task_reminder_deliveries_due_index
    on public."TaskReminderDeliveries" (due_at, reminder_type);

comment on column public."Tasks".due_at is
    'Timezone-aware deadline. Existing due_date remains the calendar-date display fallback.';
