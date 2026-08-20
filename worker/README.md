# Zone 0 Photo Check — Cloudflare Worker

This is the backend for the Photo Check lead form on `index.html`. It replaces the
retired Tally embed (see `docs/decisions.md` for why — the Tally form never had
real photo-upload/city/notes fields, only Name/Email/Phone).

GitHub Pages only serves static files, so this Worker is **not** deployed by GitHub
Pages — it's deployed separately, directly to Cloudflare. `_config.yml` excludes
this directory from the Pages build.

## What it does

`POST /submit` — accepts the Photo Check form (`multipart/form-data`):
validates the fields and up to 3 photos, stores the photos in an R2 bucket, and
emails the lead details + photo links to Zone 0 via Resend. Responds with
`{ ok: true }` on success or `{ ok: false, error: "..." }` on a validation
failure — the frontend (`js/photo-check-form.js`) shows that error inline and
lets the homeowner fix it and resubmit, rather than failing silently.

`GET /photo/{key}` — streams a stored photo back out of R2. Used only in the
lead-notification email links; the keys are random UUIDs, not listed or
guessable, but not further access-controlled. If that's not tight enough once
this is live, the simplest upgrade is adding a shared-secret query parameter
check to this route.

Basic spam mitigation: a hidden honeypot field (`website`) that real visitors
never fill in, plus a minimum-time-since-page-load check (rejects submissions
faster than ~3 seconds, which is faster than a human can plausibly fill the
form). No CAPTCHA. If spam becomes a real problem, Cloudflare Turnstile is the
natural next step — free, and integrates directly with Workers.

## One-time setup (you, not me — this needs your accounts/credentials)

1. **Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up
   if you don't have one. No DNS changes needed — this Worker runs on a
   `workers.dev` subdomain and is called directly by the frontend via `fetch()`;
   your domain's DNS/GitHub Pages setup is untouched.

2. **Create the R2 bucket** (from this `worker/` directory):
   ```
   npx wrangler login
   npx wrangler r2 bucket create zone0-photo-check-uploads
   ```
   (The bucket name must match `wrangler.toml` exactly — it already does.)

3. **Create a free Resend account** at https://resend.com and verify a sending
   domain (Settings → Domains → Add Domain → `zone0landscaping.com`, then add
   the TXT/DKIM records it gives you at wherever your domain's DNS is managed —
   this is a couple of DNS records, not a nameserver change). Free tier: 3,000
   emails/month, 100/day — far more than a small landscaping business's lead
   volume needs.

   Until that domain is verified, you can test with Resend's shared test domain,
   but production lead emails need the verified domain so `leads@zone0landscaping.com`
   is allowed to send.

4. **Get a Resend API key** (Settings → API Keys → Create) and set it as a
   Worker secret — never put it in a file in this repo:
   ```
   npx wrangler secret put RESEND_API_KEY
   ```
   Paste the key when prompted.

5. **Deploy the Worker:**
   ```
   npx wrangler deploy
   ```
   This prints your Worker's URL, something like:
   `https://zone0-photo-check.<your-subdomain>.workers.dev`

6. **Wire the frontend to your deployed Worker.** Open `js/photo-check-form.js`
   and replace the placeholder at the top:
   ```js
   var ENDPOINT = 'https://zone0-photo-check.YOUR-SUBDOMAIN.workers.dev/submit';
   ```
   with your real URL from step 5, keeping the `/submit` path. Send me that URL
   and I'll do this + the final live verification and commit/push, or you can
   make this one-line edit yourself.

## Confirming it works

- `NOTIFY_EMAIL` (currently `sheehan935@gmail.com`) is where lead emails
  arrive — change it in `wrangler.toml` and redeploy if that should be different.
  It was pointed straight at the owner's Gmail on 2026-08-20 so lead delivery
  does not depend on `hello@zone0landscaping.com` forwarding. `FROM_EMAIL`
  stays `leads@zone0landscaping.com` (the Resend-verified sending domain) and
  `reply_to` is still the homeowner's own address, so replies go to the lead.
- Submitting a real test lead through the live form will use your real Resend
  quota and land a real object in R2 — inexpensive, but not nothing. A
  clearly-marked test submission (e.g. name "QA TEST — DO NOT CONTACT") is the
  simplest way to confirm the full chain end-to-end once deployed.
- R2 objects are visible in the Cloudflare dashboard under R2 → `zone0-photo-check-uploads`.

## Local development

`npx wrangler dev` runs the Worker locally with a simulated R2 bucket (no
Cloudflare account needed for this). To test against `http://localhost:8000`
instead of the production origin, create a local-only `worker/.dev.vars` file
(gitignored) with:
```
ALLOWED_ORIGIN="http://localhost:8000"
```
