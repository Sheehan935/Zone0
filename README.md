# Zone 0 Landscaping

Static GitHub Pages landing page for `zone0landscaping.com`.

## Project status

- Source repo: `Sheehan935/Zone0`
- Production domain: `zone0landscaping.com`
- Hosting: GitHub Pages
- Publish source: root of the `main` branch
- Form provider: custom Cloudflare Worker (`worker/`) — photos in R2, lead
  notification via Resend. See `worker/README.md` for deployment. Tally was
  retired 2026-08-20 (see `docs/decisions.md`) after its hosted form was found
  to be missing the photo-upload field entirely.

## File structure

```text
zone0landscaping.com/
├── index.html
├── css/
├── js/
├── CNAME
├── README.md
├── assets/
├── docs/              # includes CHANGELOG.md and DECISIONS.md
├── archive/           # retired content, including the pre-2026-08-24 changelog
├── worker/          # Photo Check backend (Cloudflare Worker, deployed separately)
└── archive/
```

## Planning docs

- `PROJECT-TRUTH.md` - locked decisions and the detailed verification/state log
- `TODO.md` - active, git-relevant next steps only (≤3 items); the full backlog lives in the owner's Google Drive "Zone 0 Landscaping Tasks" spreadsheet
- `docs/01-project-brief.md` - project purpose, audience, scope, and stack
- `docs/02-content-plan.md` - current section-by-section content plan
- `docs/03-business-plan-structure.md` - offer ladder, funnel, positioning,
  content pillars, and operating plan
- `docs/04-zone-0-guide-content.md` - pulled Zone 0 guide source content
- `docs/05-content-plan-steps.md` - phased content production roadmap

## Open locally

Open `index.html` in a browser, or run a simple local server from this folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

The Photo Check form posts to a Cloudflare Worker (see `worker/README.md`), so
submitting it needs an internet connection even when the rest of the page is
opened locally; the rest of the page works fully offline.

## Deploy with GitHub Pages

This repository is set up to publish from the root of the `main` branch.
The `CNAME` file points the Pages site at `zone0landscaping.com`.

After editing, commit and push to `origin/main`; GitHub Pages will rebuild
the live site from `index.html`, `styles.css`, and the `assets/` folder.

Use lowercase `assets/...` paths in HTML and CSS. GitHub Pages runs on a
case-sensitive filesystem, so `Assets/...` can work locally on macOS but
break after deployment.

## Photo check form

The Photo Check section (`index.html#photo-check`) is a real HTML form
(`js/photo-check-form.js`) that posts directly to a Cloudflare Worker. The
Worker validates the submission, stores the photos in Cloudflare R2, and
emails the lead to Zone 0 via Resend. GitHub Pages only serves the static site
files — the Worker is deployed separately, straight to Cloudflare. See
`worker/README.md` for the full setup and deployment steps.

## Editing workflow

1. Edit in VS Code.
2. Preview locally with `python3 -m http.server 8080`.
3. Run `git status --short --branch` before committing.
4. Commit focused changes using Conventional Commits.
5. Push `main` to publish with GitHub Pages.

## Replace before launch

- The Photo Check backend (`worker/`) needs one-time Cloudflare + Resend
  account setup before it can go live — see `worker/README.md`.
- Add real before/after project photos when available.
- Confirm the initial service area and update the FAQ.
- Replace `hello@zone0landscaping.com` if you use a different inbox.
- Add analytics, Search Console verification, and basic privacy/terms pages before running paid ads.

## Current photo assets

- `assets/berkeley-house-hero.jpg`: Unsplash photo of a Berkeley, CA home by Andy Feliciotti, used under the Unsplash License.
- `assets/paver-material-hero.jpg`: Unsplash paver/hardscape photo, used under the Unsplash License.

## Positioning

Primary promise:

> Know what to fix. Get the work done. Keep the proof.

Avoid claims like "fireproof," "guaranteed compliant," "CAL FIRE certified,"
or "insurance discount guaranteed" unless formally supported.
