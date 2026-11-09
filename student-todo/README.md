# Study Desk Supabase setup

The app remains a plain HTML, CSS, and JavaScript site. It loads `@supabase/supabase-js` from jsDelivr and uses only the Supabase Project URL and browser-safe Publishable key.

## Local configuration

Copy `config.example.js` to `config.js` and fill in values from Supabase Project Settings > API:

```js
window.SUPABASE_CONFIG = {
    url: "https://your-project.supabase.co",
    publishableKey: "sb_publishable_your-key"
};
```

`config.js` is gitignored. Never put a Secret key or Service Role key in it.

## Database contract to verify

The integration expects the existing `Tasks` table to have these columns:

- `id`: primary key returned by Supabase
- `user_id`: UUID referencing `auth.users.id`
- `text`: task text
- `priority`: text containing `low`, `medium`, or `high`
- `completed`: boolean
- `status`: text containing `todo`, `in_progress`, or `completed`
- `due_date`: nullable `date` containing the user's calendar deadline as `YYYY-MM-DD`
- `category`: nullable text containing one of `University`, `Assignment`, `Exam Preparation`, `Personal`, `Project`, or `Other`

The `due_date` and `category` columns have been added to the live Supabase table.
The category migration used was:

```sql
alter table public."Tasks" add column if not exists category text;
```

The Kanban board requires this additional task-status migration. It backfills
existing completed tasks without changing authentication or RLS policies:

```sql
alter table public."Tasks"
    add column if not exists status text not null default 'todo';

update public."Tasks"
set status = 'completed'
where completed = true;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'tasks_status_check'
          and conrelid = 'public."Tasks"'::regclass
    ) then
        alter table public."Tasks"
            add constraint tasks_status_check
            check (status in ('todo', 'in_progress', 'completed'));
    end if;
end $$;
```

The existing `completed` boolean remains synchronized with `status`: Kanban
`Completed` uses `completed = true`, while `To Do` and `In Progress` use
`completed = false`.

No RLS policy changes were made or are required; the client continues to scope reads and writes by
`user_id`, and existing policies should continue to enforce ownership.

## Focus session persistence

The Pomodoro timer stores completed focus sessions in a separate `FocusSessions` table.
Create it once in Supabase SQL Editor, then enable RLS and add policies that restrict
all operations to `auth.uid() = user_id`:

```sql
create table if not exists public."FocusSessions" (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    task_id text,
    duration_minutes integer not null,
    completed_at timestamptz not null default now()
);

alter table public."FocusSessions" enable row level security;

create policy "Users can view their own focus sessions"
on public."FocusSessions" for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own focus sessions"
on public."FocusSessions" for insert
to authenticated
with check (auth.uid() = user_id);
```

No existing authentication or `Tasks` RLS policies need to change.

## Study streak persistence

A study day is recorded when the signed-in user marks a task completed or finishes a
focus session. The app records the user's local calendar date only once; future dates
are ignored when calculating streaks. Create this table in Supabase SQL Editor:

```sql
create table if not exists public."StudyActivity" (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    activity_date date not null,
    unique (user_id, activity_date)
);

alter table public."StudyActivity" enable row level security;

create policy "Users can view their own study activity"
on public."StudyActivity" for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can record their own study activity"
on public."StudyActivity" for insert
to authenticated
with check (auth.uid() = user_id);
```

The unique constraint prevents duplicate activity rows for the same user and date.
The client uses the browser's local date for activity events and scopes every query
by the authenticated user's ID.

## Study analytics

The Analytics view supports weekly and monthly ranges. Task metrics include tasks
whose due date falls in the selected range; tasks without a due date use their
Supabase `created_at` date. Completed-task chart buckets use that same task date
because the existing `Tasks` schema does not store a separate completion timestamp.
Pomodoro counts use the authenticated user's `FocusSessions.completed_at` values,
and streak statistics use the user's `StudyActivity` dates.

The client sends `user_id` from the authenticated session and also filters every read, update, and delete by `user_id`. It never disables or bypasses RLS.

Before deployment, verify in Supabase Table Editor or SQL Editor that:

1. `Tasks.user_id` exists and has the same UUID type as `auth.users.id`.
2. RLS is enabled on `Tasks`.
3. Policies allow an authenticated user to select, insert, update, and delete only rows where `user_id = auth.uid()`.
4. Signup email confirmation and the Site URL / redirect URLs are configured under Authentication > URL Configuration.

If the existing table uses a different task-text column name or different priority/completion types, update the insert payload and `mapTask` in `script.js` to match that verified schema before deploying. Do not guess or broaden the policies.

## Clickable confirmation email

Supabase sends the confirmation email and generates the secure confirmation link. In Supabase Dashboard > Authentication > Email Templates > Confirm signup, make sure the template includes a clickable link using:

```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

The app supplies the current site URL as the email redirect target. Configure that URL under Authentication > URL Configuration, and do not create or expose confirmation tokens in client-side code.

## Vercel deployment

For a static Vercel deployment, make `config.js` available to the deployed site without committing it to GitHub. One simple approach is to create it as part of the deployment workflow from Vercel environment variables:

```powershell
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_PUBLISHABLE_KEY = "sb_publishable_your-key"
@"
window.SUPABASE_CONFIG = {
    url: "$env:SUPABASE_URL",
    publishableKey: "$env:SUPABASE_PUBLISHABLE_KEY"
};
"@ | Set-Content student-todo/config.js
vercel --prod
Remove-Item student-todo/config.js
```

Use Vercel environment variables for the URL and Publishable key. Never use `SUPABASE_SERVICE_ROLE_KEY` or a Secret key in the browser or deployment output.
