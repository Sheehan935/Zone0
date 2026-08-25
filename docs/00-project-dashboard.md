# Zone 0 Landscaping Website
## Project Dashboard

**Last Updated:** August 21, 2026

This is the primary Project Control document. `PROJECT-TRUTH.md` is the
authoritative decision/state layer. Other files in `docs/` are reference
material unless explicitly designated otherwise.

Never more than 3 active tasks in **Next**.

---

# Current Goal

Establish and maintain the verified current state of the Zone 0 website,
then use that verified state to drive content, UX, QA, and implementation
work.

## Current Working Architecture

**LOCKED — One-page homepage:**

- `index.html` (10 sections: Header, Hero, Free Photo Check, Lean/Green/Clean, Landscaping/Hardscaping/Design, Visual Proof, Understand the Zones, Resources, How We Help, Footer — Photo Check moved from position 9 to position 3 on 2026-08-24, see `PROJECT-TRUTH.md`)
- `pages/thank-you.html` — orphaned legacy page as of 2026-08-20/21; no longer
  referenced anywhere in the live site's code. Photo Check's success state is
  now an in-page modal (see `docs/PROJECT-STATE.md`'s Photo Check section),
  and Tally (which this page was originally built for) is retired.

The previous 12-page launch requirement remains **UNLOCKED / RETIRED**. The 2026-08-03–08-18 multi-page implementation (`/zone-0/`, `/materials/`, `/faq/`, `/design/`, `pages/services.html`) is superseded, not deleted — see `docs/decisions.md`, 2026-08-19 entry. Those directories are retained as source material for homepage consolidation and must not be deleted in this step.

---

# Current Decisions

## Architecture

**Current working direction:**

`index.html` + `pages/thank-you.html`

**Previous 12-page launch requirement:**

**UNLOCKED / RETIRED**

The project is no longer required to launch with 12 pages.

Additional routes require separate approval.

## Form

**Current form system: custom Cloudflare Worker — LIVE, verified end-to-end 2026-08-20**

Tally was retired 2026-08-20 after live investigation found its hosted form
never had real Photo-upload/City/Notes fields, only Name/Email/Phone — not
fixable from the repository since Tally's form composition is dashboard-side
only. See `docs/decisions.md`, 2026-08-20 entry.

The Photo Check form (`index.html#photo-check`, `js/photo-check-form.js`)
posts to a Cloudflare Worker (`worker/`) that stores photos in R2 and emails
the lead via Resend, then redirects to `pages/thank-you.html` on success.

**Confirmed live**: the Worker is deployed, the Resend sending domain
(`zone0landscaping.com`) is verified, and a real submission through the
production site was confirmed delivered to the owner's inbox. See
`docs/PROJECT-STATE.md`'s Photo Check section for the verification evidence.

### Retired Form Assumptions

**Netlify Forms: RETIRED / SUPERSEDED.** **Tally: RETIRED / SUPERSEDED
2026-08-20.**

Do not create Netlify Forms or Tally work, or treat either as the current
implementation.

## Deployment

**Reported deployment:** GitHub Pages

**Production domain:** `zone0landscaping.com`

**Repository:** `github.com/Sheehan935/Zone0`

**Branch:** `main`

**Last reported commit:** `bf075d0`

Local `main`/`origin/main`/live GitHub Pages deployment confirmed in sync at
this commit as of 2026-08-21 (`git fetch` + `gh api .../pages/builds/latest`).
Working tree carries only untracked raw logo source files — see
`docs/PROJECT-STATE.md`'s Logo / Brand section.

---

# Current Technical Architecture

Reported and verified project direction:

- Plain HTML
- CSS
- JavaScript
- No framework
- No Tailwind
- No npm
- No `package.json`
- No build process

Do not introduce a framework, build system, npm dependency, or CSS framework
without explicit approval.

---

# Completed / Verified Work

- Folder reorganization: `archive/`, `legacy/`, `pages/`, `docs/`, `css/`,
  `assets/images/`
- `pages/thank-you.html` moved into place with corrected relative paths
- Lead form replaced with live Tally embed
- Tally post-submit redirect configured to `pages/thank-you.html`
- FAQ placeholder text removed
- Link audit completed
- Mobile audit completed
- Mobile/header fixes implemented and verified
- Working-tree corruption recovered
- Recovery commit `22a7537` was previously created to protect recovered work
- Premium visual polish pass completed
- Inline SVG icons used to preserve static-only architecture
- Mobile hamburger navigation implemented with vanilla JavaScript
- Dead paid-service CTAs changed to `#photo-check`
- Tablet grid layout corrected
- Dead "View all FAQs" link removed
- Remaining dead body-copy links removed
- `index.html` reported with zero links to unbuilt pages at that point
- `pages/services.html` was built during the later multi-page exploration
- Service page reuses existing service content without invented content
- Service page CTAs point back to `index.html#photo-check`
- Logo SVG issue corrected
- Mobile navigation separation corrected
- CTA copy standardized
- `pages/thank-you.html` navigation updated during the services-page work

---

# Known Contradictions / Reconciliation Required

These items are intentionally NOT resolved by this dashboard.

## 1. Single-Page Core vs. Existing `pages/services.html` — RESOLVED 2026-08-19

One-page homepage is the locked target. `pages/services.html` (and the rest
of the multi-page build) is retained as source material only, not an
approved exception and not deleted.

## 2. Existing /zone-0/, /materials/, /faq/ Content — RESOLVED 2026-08-19

Same resolution: source material for homepage consolidation, not separate
pages going forward, not deleted in this step.

## 3. Legacy Photo Review / Hazard Tool

The project history references custom scripts including:

- `js/modal.js`
- custom hazard-analysis functionality

This line previously read "Tally is the current form system" — stale as of
2026-08-20; see the Form section above for the current (and current-current)
system. Left uncorrected in earlier versions of this file by oversight, not
because Tally was ever re-adopted.

The disposition of the legacy custom functionality is:

**UNRESOLVED**

Do not delete, restore, or replace it without an explicit decision.

## 4. Buttondown

Status:

**NOT VERIFIED**

Do not assume Buttondown is currently installed, active, or required.

## 5. Analytics

Plausible / Fathom / GA4 status:

**NOT VERIFIED**

No analytics provider should be treated as current until verified.

---

# Next

**2 active P0 items as of 2026-08-24:**

### 0a. Deploy the Photo Check Redesign — 🟠 OPEN
The per-side photo capture + address field + zone-based review categories
(see `PROJECT-TRUTH.md` and `docs/PROJECT-STATE.md`'s Photo Check Redesign
entries) are implemented and locally verified but **not deployed**: the D1
migration (`review-worker/migrations/0002_address.sql`) has not been applied
to the remote database, and neither Worker has been redeployed. This blocks
item 0b below — the "first authenticated production workflow" should be run
against this redesigned scheme, not the one it was originally scoped
against. See `worker/README.md`'s "Deploying the per-side photo redesign"
section for the exact commands/order. Requires the site owner's own
Cloudflare credentials to run `wrangler deploy` / `wrangler d1 migrations
apply --remote`, so it's the owner's action.

### 0b. Run the Review Portal's first authenticated production workflow — 🟠 OPEN
Cloudflare Access and the review portal's own `RESEND_API_KEY` secret are
both now confirmed live (see `docs/PROJECT-STATE.md`'s Photo Check Review
Portal section) — every prerequisite is in place. What's left is the actual
walkthrough: queue → open a lead → complete the six-category analysis →
send a response from `hello@zone0landscaping.com` → confirm real email
delivery. This needs a human browser login through Access, so it's the site
owner's action, not something to automate further. Do this after 0a so the
walkthrough exercises the current categories, not the superseded ones.

Non-blocking cleanup, same priority tier: delete the 9 test/verification
objects left in the `zone0-photo-check-uploads` R2 bucket, and finish the
separate ImprovMX setup for `hello@`/`support@`/`privacy@zone0landscaping.com`
inbound forwarding (does not block Photo Check or the review portal — see
`docs/PROJECT-STATE.md`'s Email Architecture section).

### Deploy the Photo Check Cloudflare Worker — 🟢 COMPLETE
`worker/` is deployed, the Resend sending domain is verified, and a real
submission through the production site was confirmed delivered to the
owner's inbox. See `docs/PROJECT-STATE.md`'s Photo Check section.

The items previously listed here are complete:

### 1. Consolidate Homepage Into Locked One-Page Architecture — 🟢 COMPLETE
`index.html` rebuilt into the 10 locked sections, deployed as commit `5ff1975`,
independently verified live in production (GitHub Pages API commit match + HTTP
smoke test + content smoke test). See `docs/PROJECT-STATE.md`.

### 2. Verify Current Repository State — 🟢 COMPLETE
Repeated `git fetch` + `gh api repos/Sheehan935/Zone0/pages/builds/latest`
checks throughout this project's recent sessions confirm local `main`,
`origin/main`, and the live GitHub Pages deployment commit have stayed in
sync at every checkpoint, most recently at commit `40227b5`.

### 3. Complete Site Audit / Fact-Based QA — 🟢 COMPLETE
Two audit passes completed and both passed:
- **Functional QA** (navigation, Risk Calculator, Compliance Checklist,
  Inspection Checklist, FAQ, Tally/Photo Check, responsive, JS/runtime,
  production-vs-repo) — 0 blockers, 0 functional defects. Result: QA PASSED.
- **Visual/design-system audit** — identified 4 highest-priority findings
  (Free Photo Check H2 rendering as body text, 3 inconsistent CTA button
  radii, a How We Help grid orphan at tablet width, 4 un-tokenized Zone
  colors). All 4 implemented, verified, committed as `40227b5`, and
  confirmed live in production. See `docs/PROJECT-STATE.md` for full detail.

No new P0/P1 items have been identified. Do not invent speculative next
steps here — add a new item only when there's a concrete, evidenced reason
to.

---

# Future

- Add real testimonials only when real reviews exist
- Add a real service-area/town list if approved
- Add more before/after project photos
- Confirm final pricing before publishing
- Evaluate additional guide/content pages only after architecture is resolved
- Evaluate local SEO pages only after explicit scope approval

---

# Parking Lot

The following are **not current launch requirements**:

- Previous 12-page architecture
- Unapproved multi-page expansion
- Shopify plant catalog / e-commerce
- Gravel/stone firebreak packages
- Advanced developer tooling
- Astro SSG framework migration
- Any new route not explicitly approved

The former 12-page launch requirement is **UNLOCKED / RETIRED**, not deleted
from project history.

---

# Status Legend

🔴 Blocked  
🟠 Open  
🔵 In Progress  
🟡 Needs Review  
🟢 Complete  
⚪ Deferred  
🚨 Requires Decision