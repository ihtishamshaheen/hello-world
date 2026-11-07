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

The remote schema was not available in this repository, so the integration expects the existing `Tasks` table to have these columns:

- `id`: primary key returned by Supabase
- `user_id`: UUID referencing `auth.users.id`
- `text`: task text
- `priority`: text containing `low`, `medium`, or `high`
- `completed`: boolean

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
