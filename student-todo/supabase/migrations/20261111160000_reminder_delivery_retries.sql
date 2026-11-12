do $$
begin
    if to_regclass('public."TaskReminderDeliveries"') is null then
        raise exception 'TaskReminderDeliveries must be created by the earlier migration first';
    end if;
end
$$;

alter table public."TaskReminderDeliveries"
    alter column sent_at drop default,
    alter column sent_at drop not null;

alter table public."TaskReminderDeliveries"
    add column if not exists status text not null default 'pending',
    add column if not exists attempts integer not null default 0,
    add column if not exists last_error text,
    add column if not exists next_retry_at timestamptz,
    add column if not exists claimed_at timestamptz;

update public."TaskReminderDeliveries"
set status = 'sent'
where status = 'pending'
  and sent_at is not null;

update public."TaskReminderDeliveries"
set sent_at = null
where status in ('pending', 'failed');

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'task_reminder_deliveries_status_check'
          and conrelid = 'public."TaskReminderDeliveries"'::regclass
    ) then
        alter table public."TaskReminderDeliveries"
            add constraint task_reminder_deliveries_status_check
            check (status in ('pending', 'processing', 'failed', 'sent', 'cancelled'));
    end if;
end
$$;

create index if not exists task_reminder_deliveries_retry_index
    on public."TaskReminderDeliveries" (status, next_retry_at, claimed_at);
