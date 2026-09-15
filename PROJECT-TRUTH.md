# ZONE 0 LANDSCAPING — PROJECT TRUTH

**Purpose:** Authoritative decision record *and* detailed verification/state
log for all AI sessions working on this project. This file used to be split
across `PROJECT-TRUTH.md` (decisions) and `docs/PROJECT-STATE.md` (detailed
state) — merged 2026-08-25 to stop the same fact needing to be kept in sync
across two files (a real failure mode: a false "Resend domain unverified"
claim briefly existed in one file after being corrected in the other before
this merge). Section 1 is the terse, skimmable decision layer; Section 3 is
the detailed evidence trail behind those decisions.

**Last synchronized:** 2026-09-11 — local `main`, `origin/main`, and the
live GitHub Pages build are all confirmed at commit `b917a10`
(`gh api repos/Sheehan935/Zone0/pages/builds/latest` → `status: built`).
The public Worker is deployed at the same point (version
`f13c7faa-5dc3-4f00-ae75-231b22db7442`). See 1.8/3.16 for the free-again
Photo Review reversal and 1.9/3.17 for the new Contact form, both
verified live as of this commit.

---

## 1. LOCKED DECISIONS

### 1.1 One-Page Homepage — LOCKED 2026-08-19, section order updated 2026-08-24

The Zone 0 public site is a ONE-PAGE HOMEPAGE (`index.html`) plus the
orphaned legacy `pages/thank-you.html` (kept on disk, no longer linked —
Photo Check's success state is an in-page modal now, see 3.5).

Current section order: Header, Hero, Free Photo Check, Lean/Green/Clean,
Landscaping/Hardscaping/Design, Visual Proof, Understand the Zones,
Resources, How We Help, Footer. (Free Photo Check moved from position 9 to
position 3 on 2026-08-24, per explicit request to surface the lead-gen form
higher on the page — only position changed, not the `id="photo-check"`
anchor or its classes.)

Brand hierarchy: primary positioning "Protecting Homes. Preserving
Landscapes."; philosophy "Lean. Green. Clean."; practical promise "Know
what to fix. Get the work done. Keep the proof."

**Historical note (2026-08-03–08-18):** the site was deliberately built and
run as multi-page (`/zone-0/`, `/materials/`, `/faq/`, `/design/`, briefly
`pages/services.html`) before this lock — real, verified at the time, not
an error. Those directories remain on disk as source material for homepage
consolidation, not deleted, disposition otherwise still open. The earlier
12-page launch requirement is UNLOCKED/RETIRED — do not require additional
page routes without separate approval.

### 1.2 Form System — Custom Cloudflare Worker, LIVE

Tally (and Netlify Forms before it) is retired. Reason: a live investigation
found Tally's hosted form only had 3 real fields (Name/Email/Phone) — the
City/Photo-upload/Notes controls shown on the page were inert, a
dashboard-side defect not fixable from this repository.

**Current architecture:** `index.html#photo-check` (a 3-step stepper) →
`js/photo-check-form.js` → Cloudflare Worker (`worker/`) → photos in R2,
lead emailed via Resend, plus an additive D1 insert for the internal review
portal. An internal, Cloudflare Access-gated Review Portal (`review-worker/`)
lets the owner work leads end-to-end: queue → six-category zone-based
analysis (Pass/Needs Work/Fail) → send a response to the homeowner.

**Redesign, deployed and verified live 2026-08-24/25:** replaced `city`
with a full `address` field; replaced the flat "1–3 generic photos" limit
with per-side capture (Front/Back/Left/Right, up to 5 each, 1+ required per
side, R2 keys now `{leadId}/{zone}/{uuid}.{ext}`); replaced the six
categories' old Status/Risk/Priority scheme with zone-based categories
(Zone 0 Ground Cover, Zone 0 Vegetation, Zone 1 Ladder Fuels, Zone 2
Spacing, Home Hardening, Combustible Storage/Attachments) rated a single
Pass/Needs Work/Fail. Full deploy record, production test evidence, the
`sendHomeownerResponse` bug found and fixed, the Resend-422 false alarm and
its correction, and the R2/D1 cleanup are all in Section 3.4–3.9 below.

Do not create Netlify Forms or Tally work, or treat either as current.

### 1.3 Deployment

GitHub Pages, custom domain `zone0landscaping.com`, repository
`github.com/Sheehan935/Zone0`, branch `main`. See the synchronization line
at the top of this file for the current confirmed commit.

### 1.4 Technical Architecture

Plain HTML/CSS/JavaScript. No framework, no npm, no `package.json`, no
build process. (Tailwind is in fact loaded via the CDN `<script>` — a
pre-existing, unchanged setup, not a build dependency — see 3.1.) Do not
introduce a framework, build system, npm dependency, or CSS framework
without explicit approval.

### 1.5 Explicitly Out of Scope

Not current launch requirements — do not build without separate approval:
previous 12-page architecture (UNLOCKED/RETIRED, not deleted from project
history); unapproved multi-page expansion; Shopify plant catalog /
e-commerce; gravel/stone firebreak packages; advanced developer tooling;
Astro SSG framework migration; any new route not explicitly approved.

### 1.6 Currently Unresolved

- **Legacy Photo Review / Hazard Tool** (`js/modal.js`, custom hazard-quiz):
  already deleted from the repo and confirmed 404 in production (2026-08-19).
  Its longer-term disposition beyond that deletion is UNRESOLVED — do not
  restore or replace without an explicit decision.
- **Buttondown:** zero references anywhere in this repo's code or docs.
  Not confirmed absent as an external account — unverified either way.
- **Analytics** (Plausible/Fathom/GA4): same treatment — zero references in
  the repo. Not verified as installed or absent externally.

### 1.7 $29 Detailed Photo Review — SUPERSEDED 2026-09-11 (see 1.8)

Kept for history, not current. The $29 price decided and deployed below
lasted less than 24 hours before 1.8 reverted the review to free.

### 1.7 (historical) $29 Detailed Photo Review — DECIDED 2026-09-10, DEPLOYED AND VERIFIED LIVE 2026-09-10

The free Photo Check becomes the **$29 Detailed Photo Review**: an
educational, photo-based Zone 0 and landscape wildfire-readiness review
returning a prioritized plain-English action list, delivered **within 48
hours** (was "response within 24 hours").

This deliberately reopens two earlier decisions: §1.1's "Free Photo Check"
section name, and the 2026-08-01 "removed pricing, pure education framing"
decision. The $299 audit and $750 consultation tiers stay retired.

Settled with it:

- **No payment provider.** Intake is paid-*ready*: the form states the price
  and that an invoice follows submission. No Stripe, PayPal, or checkout.
- **All four side photos stay hard-required**, client and server.
- **Optional close-ups** upload as a fifth zone (`closeup`) that is
  deliberately excluded from the 4-of-4 completion gate — a close-up can
  neither satisfy nor block the four required sides.
- **Optional "areas of interest"** multi-select, six whitelisted slugs
  (`zone0`, `plants`, `mulch`, `fence_deck`, `general`, `not_sure`), stored
  comma-joined in a nullable `areas` column (migration `0003_areas.sql`).
- **The existing `notes` field is relabelled, not duplicated** — still
  exactly one free-text field.
- **No large questionnaire**: no roof age, siding, construction year,
  insurance, or mortgage fields. Intake stays low-friction.

Positioning guardrail: never "certified", "compliant", "official
inspection", "pass/fail certification", "insurance approval", or
"guaranteed safe". Distinguish REQUIREMENT / RECOMMENDATION / BEST
PRACTICE. Invent no legal requirements.

**Load-bearing string — do not change:** the lead notification subject stays
`New Photo Check lead — {name} ({address})`. The Zone Zero Control Center
and Dashboard artifacts find leads via a Gmail search on that exact
subject; renaming it silently empties both panels. Renaming it later
requires updating both artifacts in the same change.

### 1.8 Photo Review returns to FREE — DECIDED 2026-09-11

Supersedes 1.7. The $29 price is removed entirely — not discounted, not
deferred. The review is free again, framed as **"free while capacity
lasts"** with a scarcity line rather than the plain no-pricing framing
1.7 itself had reopened. Settled with it:

- **No price anywhere** — nav CTA, hero, form header, form intro,
  success modal, FAQ link, JS helper banners, and the homeowner-journey
  skill all drop "$29".
- **Scarcity replaces price** as the reason to act now: "Free while
  spots last" is prepended to the form's reassurance line, and the intro
  paragraph reads "within 48 hours — free while we have capacity" in
  place of "— $29".
- **Turnaround stays 48 hours.** Not reopened by this change.
- **Still no payment provider.** 1.7's "paid-ready, no checkout" stance
  is moot now that there's no price, not reversed.
- **The success-modal invoice line is gone.** "An invoice for the $29
  review follows by email" becomes "There's no charge and nothing to
  pay" — there is no invoice to promise.
- **Four-required-sides, optional close-ups, and the `areas` multi-select
  are all unaffected** — those are intake-shape decisions, independent of
  price, and this change touches copy only. No worker logic, D1 schema,
  or migration changed.

**Pattern worth naming:** pricing on this form has now moved three times
in six weeks — pure education framing (2026-08-01) → $29 Detailed Photo
Review (2026-09-10) → free again (2026-09-11). Treat any future pricing
proposal for this form as reopening a decision with a track record of
not sticking, not as a fresh call.

Same load-bearing-string rule as 1.7: the lead notification subject is
unchanged and still `New Photo Check lead — {name} ({address})`.

### 1.9 Contact Form — DECIDED AND DEPLOYED 2026-09-11

A second intake channel, independent of the Photo Review: a general
"Contact us" section (full name, email, optional phone, subject dropdown,
message) at the bottom of the homepage, above the footer. Settled with it:

- **Same Worker, new route.** `/contact` was added to the existing public
  `zone0-photo-check` Worker rather than standing up a second Worker —
  reuses the same `RESEND_API_KEY`, `NOTIFY_EMAIL`, `FROM_EMAIL`, and
  Origin allowlist already configured there.
- **Email notification only, no D1 persistence.** Unlike Photo Check
  leads, contact messages are not written to the `leads` table or any
  new table — this channel is intentionally lighter-weight. Revisit if
  volume ever justifies a queue/portal view.
- **Its own notification subject**, distinct from the Photo Check
  load-bearing string: `New contact form message — {fullName}
  ({subjectLabel})`. Not searched by the Control Center or Dashboard —
  no load-bearing-string constraint applies to it (yet; if that changes,
  document it here first).
- **No new anti-bot timing field.** The Photo Check form's
  `MIN_SUBMIT_TIME_MS` timing check has no equivalent here — this form's
  only anti-bot measure is the honeypot (`companyWebsite`). Acceptable
  for a low-volume contact form; revisit if spam becomes a problem.

### 1.10 Homepage Cleanup — DECIDED 2026-09-15

A batch of copy/structure changes to the homepage, done on branch
`homepage-cleanup`, pending review before merge. The one piece that
reopens a previous LOCKED decision:

- **Four-required-photos, REOPENED.** §1.7 locked "all four side photos
  stay hard-required, client and server"; §1.8 explicitly carried that
  forward unchanged through the pricing reversal. This decision reopens
  and reverses it: **all photos on the Photo Review form are now fully
  optional**, client and server. The four side zones (front/back/left/
  right) and the close-up zone are all optional now — there is no
  meaningful difference between them anymore except FormData field
  naming. A lead with zero photos attached must save and notify
  successfully; verified locally (see 3.18).

Everything else here is ordinary content/copy scope, not a reopened
lock:

- **Property Fire Risk Audit Calculator removed** from Resources
  (introduced in 3.13). The Compliance Checklist and FAQ stay, both
  Resources nav links stay. `js/zone0-tools.js` (which powered only the
  calculator) is no longer loaded on the page.
- **Two new mid-page CTAs** ("Get Your Free Photo Review", hero-button
  styled): after the Compliance Checklist, and after the Landscaping/
  Design section ("Planting With Purpose").
- **New "Does this apply to your home?" block** at the end of
  "Understand the Zones", linking out to CAL FIRE's official Fire
  Hazard Severity Zone page (`osfm.fire.ca.gov`), `target="_blank"
  rel="noopener noreferrer"`.
- **Scarcity copy removed.** "Free while spots last" (form reassurance
  line) and "— free while we have capacity" (form intro paragraph) are
  both gone — dropped less than a week after 1.8 added them. Replaced
  with a trust signal, "East Bay based", in the reassurance line.
- **Hero simplified to one CTA.** "Explore the Approach" removed; "Get
  Your Free Photo Review" is the only hero button. Hero badge text
  changed from `text-stone-300` to `text-white` for legibility against
  the photo background.
- **Phone number added**: `(510) 394-2590` / `tel:+15103942590`, in the
  footer Contact column, the Contact section intro (above the form),
  and as a mobile-only (`md:hidden`) call icon in the header.

**Not changed:** the lead notification subject (`New Photo Check lead
— {name} ({address})`), the Contact section/form/CSS/JS/`/contact`
route (kept exactly as 1.9 left it), the `areas` multi-select, the
close-up zone's existence. There is no About/"Who We Are" section on
this site to remove — never existed in the current architecture.

### 1.11 Mockup Sections — DECIDED 2026-09-15

New homepage page order, built from the site owner's own mockup, on
branch `mockup-sections`:

Header → Hero → **What Is Zone 0** (new) → **Your First-5-Feet To-Do
List** (new) → Free Detailed Photo Review → Lean.Green.Clean →
Landscaping → Visual Proof → Resources → How We Help → Contact →
Footer.

- **"What Is Zone 0" replaces "Understand the Zones", which is
  deleted.** The two covered the same three zones with near-duplicate
  copy — confirmed and flagged before removal, not assumed. All three
  "Zones" nav links (desktop, mobile, footer) now point to
  `#what-is-zone-0` and are relabeled "What Is Zone 0" so the link text
  matches its destination.
- **The Compliance Checklist moved**, not duplicated, from Resources
  into the new "Your First-5-Feet To-Do List" section, keeping its
  existing ids (`#compliance-checklist-section`, `#compliance-checklist`,
  `#compliance-progress-fill`, `#compliance-status-banner`) so nothing
  externally pointing at them breaks.
- **Checklist content fully replaced**: 4 items → 7, split into two
  cards ("15-Minute Weekend Fixes" / DIY, "Structural Upgrades" / Plan
  Ahead). `js/main.js`'s progress banner is item-count-driven now, not
  hardcoded to 4 — the "start with mulch removal" callout (mulch
  removal is no longer item 1) was genericized rather than left stale.
  Returning visitors' localStorage checklist state resets given the
  content is materially different — acceptable for a client-only
  self-check tool.
- **Resources is FAQ-only now.** Heading changed from "Tools &
  Reference Material" to "Reference Material", intro no longer mentions
  "checklists". The FAQ is open by default (same pattern as 1.10's
  Compliance-Checklist-becomes-default-open, now applied to FAQ since
  it's the only thing left).
- **CAL FIRE link exists in exactly one place** — inside "What Is Zone
  0"'s "Does it apply to me?" callout. The copy this superseded (added
  to "Understand the Zones" in 1.10/3.18) is gone along with that
  section, so the link never appears twice.
- **Photo Review section: intro/hints only, form untouched.** New intro
  copy, field hints on Address/Email. A 3-step strip (Send/Get/Decide)
  was added and then removed at the site owner's request after viewing
  it locally. `js/photo-check-form.js` has zero diff — fields, per-side
  photo slots, `areas` multi-select, honeypot, validation, and submit
  logic are byte-for-byte what 1.10 left them.

**Not changed:** the lead notification subject, the Contact section,
the phone number links, any Worker code (`worker/src/index.js`,
`review-worker/src/index.js` — zero diff, confirmed before commit).

---

## 2. GOVERNANCE RULES

- **Evidence first.** Never assume the codebase matches documentation.
  Verify a file/page/route/feature/commit/integration actually
  exists/works before claiming it, including checking local↔GitHub↔production
  sync, not just local state.
- **Decision protection.** A decision marked LOCKED/CURRENT isn't casually
  reopened; one marked UNLOCKED/RETIRED isn't treated as current; an item
  marked UNRESOLVED isn't converted into a decision by assumption.
- **Conflict handling.** When evidence conflicts with this file, don't
  silently pick a side — report **CONFLICT DETECTED** and state what this
  file says, what the evidence says, and what can't yet be verified.
- **No scope expansion.** Don't introduce new features, pages, frameworks,
  or integrations because they seem useful.
- **No silent work / no false completion claims.** Don't say "working on
  it, check back later." If blocked, state exactly what's missing. Don't
  claim something works from source inspection alone when real user-visible
  behavior can be tested instead (browser walkthrough, real API call,
  production `curl`, actual deployed state) — this file's own history
  (3.6–3.7) is a direct example of what happens when that's skipped.
- **Source-of-truth hierarchy** when sources disagree: explicit current
  decision > current repo/code evidence > current production evidence >
  this file > historical docs > AI assumptions. AI assumptions are never
  authoritative.
- **Change control.** A proposed change to a LOCKED decision must state the
  previous state, the proposed state, the evidence/reason, and whether
  explicit approval is required — never swap a locked decision just because
  an AI session prefers something different.

---

## 3. VERIFICATION & STATE LOG

Detailed, dated record of what was actually implemented and verified —
the evidence behind Section 1's decisions. Newest-relevant material is
woven in near the section it updates rather than strictly chronologically;
each entry is dated so supersession is traceable.

### 3.1 Repository & Deployment

- `Sheehan935/Zone0`, branch `main`. As of 2026-08-25: local `main`,
  `origin/main`, and the live GitHub Pages build all confirmed at commit
  `11ef747` (`gh api .../pages/builds/latest` → `built`).
- Deployment: GitHub Pages, custom domain `zone0landscaping.com`, HTTPS
  certificate approved.
- Architecture note: the site uses Tailwind CSS via the `cdn.tailwindcss.com`
  `<script>` tag (site-wide, pre-existing, unchanged by any session covered
  here) alongside `css/styles.css` for a shared component system. This is
  worth naming explicitly since Section 1.4 says "no framework" — the CDN
  script is not a build dependency (no npm/build step), but it is real
  Tailwind usage, evidence over assumption.

### 3.2 Visual / Design System Pass — COMPLETE, DEPLOYED 2026-08-20

Following a visual/design-system audit, 4 findings were fixed, verified
locally, committed as `40227b5`, confirmed live: Free Photo Check H2 now
matches the site-wide H2 pattern (was rendering as body text); CTA button
shape unified to `rounded-full` across hero/header/Risk-Calculator (required
guarding a legacy `button[type="submit"]` CSS rule that had higher
specificity than the Tailwind utility class); the How We Help 5-card grid
no longer orphans its 5th card at tablet width (switched to
`flex flex-wrap` with explicit `calc()` widths); Zone severity colors
(`zone.red`/`amber`/`amberdark`/`green`) tokenized into `tailwind.config`
in place of raw hex values. Explicitly not touched: Zones/Resources H2
font-size variance, Visual Proof card corner-radius — both confirmed still
unchanged post-pass (regression-checked, not accidentally caught).

### 3.3 Production Verification — VERIFIED 2026-08-19

GitHub Pages API confirmed the live build's commit matched local/origin
HEAD exactly, status `built`. HTTP smoke test confirmed `/`, `/zone-0/`,
`/materials/`, `/faq/`, `/pages/thank-you.html`, the hero image, and
`css/js` assets all 200; `/js/modal.js` correctly 404 (confirms the
hazard-quiz deletion deployed); cross-page anchors present in the live
HTML. Content smoke test confirmed the expected H1, nav labels, section
headings, and CTA copy present with no broken/placeholder content.

### 3.4 Photo Check — original replacement, 2026-08-20

Tally was removed entirely (widget script, iframe, and `.tally-embed` CSS
rule deleted). The Photo Check section became a real HTML form — Name,
Email, Phone, City, Photos (1–3 files, 8MB each), Notes — posting to
`worker/src/index.js`. Locally verified via `wrangler dev` + Playwright
(real browser, real file uploads): all fields render and validate at
1440px/390px, a full valid submission stores the photo in R2 byte-identical
to the upload and responds `{ok:true}`, server-side validation independently
confirmed via `curl` (CORS rejection, missing-field rejection, honeypot
silently accepted, sub-3-second submissions rejected, non-image/oversized
files rejected).

**Backend (as of the original build):** Worker `zone0-photo-check`
(`POST /submit`, `GET /photo/:leadId/:photoId.jpg`), R2 bucket
`zone0-photo-check-uploads`, `RESEND_API_KEY` Worker secret. Resend domain
`zone0landscaping.com` DKIM/SPF/MX verified 2026-08-20. `FROM_EMAIL` changed
same day from `leads@` to `hello@zone0landscaping.com` so homeowners see
Zone 0's public identity; `NOTIFY_EMAIL` is `sheehan935@gmail.com`, decoupled
from any inbound-forwarding dependency; Reply-To is the homeowner's own
address.

**Real homeowner-path verification:** the owner submitted the live
production form through an actual browser; notification email arrived with
the correct name/email/phone/city/notes and a working, byte-identical photo
link — the strongest confirmation short of a real customer lead. A first
From-address re-verification attempt was a false positive (tested
immediately after `wrangler deploy`, before edge propagation completed,
silently hit the old code path); a second test run after propagation
confirmed correctly, independently, via the owner reading the actual Gmail
message rather than trusting the API response. The Origin allowlist accepts
only `https://zone0landscaping.com` — functional testing must run from the
real site, not a local file or `workers.dev` origin directly.

**Post-submission UX, changed 2026-08-20:** the `pages/thank-you.html`
redirect was replaced with an in-page, accessible success modal (focus trap,
Escape/×/Close dismissal, submit button disabled until dismissed to prevent
duplicate submits). Backend failures leave data/files in place and show the
existing inline error. Verified locally across four breakpoints; the
now-orphaned `pages/thank-you.html` is kept on disk as a legacy/fallback
artifact.

### 3.5 Photo Check Copy Simplification — 2026-08-21

H2 changed to "Is My Home At Risk?"; a supporting sentence was removed
entirely rather than replaced. The City field's label was simplified to
"City" — the field itself was deliberately kept (not removed, despite an
initial request to do so) since its validation/D1 storage/email templates
lived in the Worker and Review Portal; removing it frontend-only would have
broken every submission server-side. Verified via Playwright at
1440px/390px.

### 3.6 Photo Check Redesign — Per-Side Photos + Address — DEPLOYED AND VERIFIED LIVE, 2026-08-24/25

Per explicit decision: `city` → full `address` (plain text, no
autocomplete/API — a real Google Places integration would need its own API
key/billing, deliberately not added); flat "1–3 photos" → per-side capture
(Front/Back/Left/Right, up to 5 each, 1+ required per side, R2 keys now
`{leadId}/{zone}/{uuid}.{ext}`); public form became a 3-step stepper
(Property → Photos → Concerns); review console's six categories changed
from Landscape/Plants, Organic/Combustible Materials, Structure/Foundation,
Hardscape/Ground Surface, Trees/Overhead Vegetation, Maintenance/Ongoing
Risk to zone-based categories (Zone 0 Ground Cover, Zone 0 Vegetation,
Zone 1 Ladder Fuels, Zone 2 Spacing, Home Hardening, Combustible
Storage/Attachments), each rated a single Pass/Needs Work/Fail instead of
separate Status/Risk/Priority — the more granular fields that scheme had
(Zone 0 Applicability, How Zone 0 Can Help) are gone, a deliberate
simplification.

**Changed files:** `index.html` (stepper rebuild), `js/photo-check-form.js`
(rewritten for per-zone file state + step navigation), `worker/src/index.js`
(per-zone `photos_{zone}` fields, `address`, zone-tagged R2 keys),
`review-worker/src/index.js` (new `CATEGORIES`, Pass/Fail/Needs-Work rating
UI with live client-side highlight, zone-grouped photo display),
`review-worker/migrations/0002_address.sql` (renames `leads.city` to
`leads.address`), `worker/README.md` (new contract + required deploy
order).

**Local verification (2026-08-24, real behavior not just source inspection):**
both Worker files and the client JS pass `node --check`. Public form
exercised in a real browser against a local static server: Step 1
validation blocks empty submits, photos added/removed across all 4 zones,
"N of 4 areas covered" gating and Continue-button enable/disable confirmed,
reached Step 3, submitted, confirmed the CORS-failure path shows a friendly
error (expected — the live Worker wasn't redeployed yet and doesn't allow
`localhost` as an origin). Review console: migration applied to a **local**
D1 instance, a synthetic lead inserted directly, `wrangler dev --local` run,
and real HTTP requests confirmed the queue/detail pages, zone-grouped
photos, all 6 categories, and a real `POST /save-draft` persisting a
rating + notes and transitioning status correctly.

**Deployed 2026-08-25:** `0002_address.sql` applied to the remote D1
database; `review-worker` redeployed first, then the public `worker`
(matching the required order); `index.html`/`js/photo-check-form.js`
committed (`29aea70`) and pushed. **Real production submission, not a
local simulation:** a clearly-marked test lead POSTed directly to the
deployed public Worker with a real `Origin` header and 5 photos across all
4 zones → `{"ok":true}`; confirmed against the **production** D1 database
that `address` and zone-tagged `photo_keys` landed correctly; confirmed via
the public `GET /photo/{leadId}/{zone}/{uuid}.ext` route that a stored
photo is retrievable and byte-identical to the upload.

### 3.7 Review Portal's first authenticated workflow — COMPLETE 2026-08-25, fully working, no blocker

The owner logged in through Cloudflare Access, opened a real lead (Brian
Sheehan, 681 Oberlin Ave), completed the six-category analysis, marked it
Complete, and successfully sent the homeowner response via
`hello@zone0landscaping.com`.

Verifying this found and fixed a real bug: `sendHomeownerResponse` in
`review-worker/src/index.js` still referenced `lead.city` for the email
subject (missed when the column was renamed to `address`), and its error
handling only surfaced the HTTP status code, not Resend's actual validation
message. Fixed and redeployed (commit `6232182`).

**Correction (superseded false alarm):** the fix above then surfaced two
422s while testing with synthetic `@example.com` addresses, initially
misread as evidence that `review-worker`'s Resend account lacked a
verified sending domain — flagged at the time as a new blocking item.
**That was wrong, and the site owner caught it** by checking the Resend
dashboard directly: `zone0landscaping.com` is Verified on the one and only
Resend account in use (`sheehan935`), covering both API keys in it
("Worker Key", "Onboarding"); the Resend Logs page showed the real error
body for every 422 — `Invalid 'to' field. Please use our testing email
address instead of domains like example.com.` Resend rejects the RFC 2606
reserved `example.com` domain as a recipient outright, regardless of
sender/domain verification, specifically to catch accidental sends to a
domain that was never meant to receive mail. The 422s were interleaved with
200s on the same endpoint minutes apart, which a genuine account/domain
problem would not produce. **There is no account, domain, or code issue**
— the synthetic test addresses were themselves invalid test data, not a
system defect. Real recipients work as expected. Any future QA sends
should target `delivered@resend.dev` or a real inbox, never `@example.com`.

### 3.8 R2/D1 test-data cleanup — 2026-08-25

The "9 pre-existing test objects" figure quoted in earlier notes was an
estimate from memory, never checked against an actual bucket listing.
`wrangler r2 object` has no `list` subcommand in the version in use, so the
real inventory was pulled via the Cloudflare REST API directly
(`GET .../r2/buckets/{bucket}/objects`, paginated, using wrangler's own
cached OAuth token). The bucket actually held **28 objects** across 6 D1
leads plus 22 orphaned (no D1 row) objects predating the review portal's
D1 wiring.

Cross-referencing the full `leads` table turned up 6 rows, not 2:

| id | name | status | disposition |
|---|---|---|---|
| `89790bbf...` | "CLAUDE TEST - review portal D1 verification, ignore/delete" | complete | **deleted** — self-labeled junk |
| `98e8b645...` | "QA TEST - DO NOT CONTACT" | complete | **deleted** — redesign-deploy test |
| `f5d474c4...` | "QA TEST 2 - DO NOT CONTACT" | complete | **deleted** — post-fix retest |
| `796cce36...` | "Brian Sheehan" / Kensington | complete | **kept** — real verification lead, 2026-08-22 |
| `9932b30b...` | "Brian Sheehan" / Kensington | new | **kept** — real lead, old flat photo-key format, never reviewed |
| `8a2291ec...` | "Brian Sheehan" / 681 Oberlin Ave | complete | **kept** — the lead used for the first successful Review Portal send, 2026-08-25 |

Deleted the 3 unambiguous rows plus their 10 R2 objects (5 + 4 + 1) via the
same REST API, then `DELETE FROM leads WHERE id IN (...)` against
production D1 — confirmed via `changes: 3` and a follow-up `SELECT`
showing exactly 3 rows remain.

**Deliberately left alone, pending the site owner's own call** (real
history, not junk): the 3 kept leads above and their photos;
`ba752818-fa13-4b92-bd50-d38be1036047/d3804fa2-....png` — an orphaned
object (no D1 row) that is the exact photo link cited in 3.4 as the
original "strongest possible confirmation" evidence; 9 more orphaned,
unlabeled objects from early Worker development before D1 was wired in.

### 3.9 Email Architecture — DECIDED 2026-08-20, roster revised 2026-08-24, partially implemented

Full roster restated 2026-08-24: `legal@` replaces `privacy@`; `brion@` and
`info@` added. `hello@zone0landscaping.com` is the only address placed
anywhere in the markup (footer, FAQ, thank-you page) and remains the Photo
Check `FROM_EMAIL`. `support@`, `legal@`, `info@` are decided but
alias-only — not placed on the site since no genuine support/legal/second-
contact context exists yet. `leads@` is internal-only, not used anywhere
live (replaced as `FROM_EMAIL` by `hello@` 2026-08-20, re-examined and
deliberately kept 2026-08-24). `brion@` is the owner's named address,
alias-only. `NOTIFY_EMAIL` stays `sheehan935@gmail.com`, unaffected by any
of this.

**Infrastructure decision:** all roster addresses stay free ImprovMX
aliases forwarding to the owner's Gmail — explicitly not a paid mailbox.
ImprovMX MX/TXT records were added at GoDaddy 2026-08-20. **Still
outstanding (owner-only):** create the free ImprovMX account, add the
domain, configure all six aliases to forward. Until then, mail to any of
these addresses bounces; Photo Check lead notifications are unaffected.

### 3.10 Footer Navigation — ADDED 2026-08-20, LIVE

Single centered block replaced with three groups (Company, Explore,
Contact), linking only to anchors that already exist on `index.html` — no
links to the orphaned legacy pages, keeping this consistent with the
one-page lock without reopening their disposition. `hello@zone0landscaping.com`
appears in Contact. Verified via Playwright across four breakpoints
(destinations, mailto, semantic nav, keyboard focus, no console errors, no
overflow — a 768px email-wrapping bug was caught and fixed during testing).
Confirmed live.

### 3.11 Logo / Brand — REVISED 2026-08-20–21, LIVE

Text wordmark replaced with the leaf mark + "Zone Zero" logo, then refined:
first pass used the raw Canva export as-is (fixed a baked-in white
background and oversized canvas via local Pillow processing, not a repo
dependency); a revision pass drafted four candidate directions as a design
canvas, and the "premium/restrained" option was selected — implemented as
live text (not a baked image), the leaf mark recolored to the site's actual
`sage-default` plus a real "ZONE ZERO" `<span>`, properly accessible
(`aria-label="Zone Zero"`, decorative `alt=""` on the leaf). Verified via
Playwright both passes (image loads via `naturalWidth`, correct computed
color, no menu-button overlap, zero console errors). Confirmed live both
times. `assets/logos/zone-zero-leaf.png` is the only logo asset referenced
by `index.html`; the raw Canva source exports are on disk but intentionally
untracked (the owner's own source material).

### 3.12 Tools (Resources accordion) — SIMPLIFIED 2026-08-25, 4 items → 3

Now exactly 3 accordion items: Risk Calculator (rebuilt as a
diagnostic-style result, see 3.13), Zone 0 Compliance Checklist
(`localStorage`-backed, unchanged), FAQ & Official Resources. The 5-Step
Zone 0 Inspection Checklist was removed entirely (commit `ab10a59`) — it
was fully static (no JS, no state, no `id`, nothing else in the repo
linked to it) and its content was already covered by the calculator's
questions and the Compliance Checklist's items. Verified via headless
Chrome before commit: all 32 calculator answer combinations still score
and render correctly, Compliance Checklist `localStorage` persistence
survives a refresh, the calculator's "Work Through the Compliance
Checklist" CTA still opens it, keyboard `Enter` toggles all 3 accordion
items at mobile/tablet/desktop, zero new console errors. Confirmed live
via direct `curl` against production: 0 matches for the removed section's
heading text. Ordinance Lookup (`js/ordinance-lookup.js`) is preserved on
disk and still deployed but intentionally unreferenced from `index.html`
per the locked decision to drop the jurisdiction-lookup feature from the
homepage — unaffected by this change.

### 3.13 Risk Calculator Redesign + Homepage Copy Refresh — 2026-08-24/25

Presentation-only redesign of the Risk Calculator (`js/zone0-tools.js`) —
the same 5 questions and Low/Moderate/High scoring, unchanged: adds a live
progress bar, renames the CTA to "See My Risk Snapshot," and rebuilds the
result to surface the highest-priority flagged issue (ranked by a fixed
severity order, not tied to the score) with a concrete next step, a
primary CTA that opens the Compliance Checklist, and the Free Photo Check
as a secondary text link rather than an equally-weighted button (commit
`9726042`). Companion copy changes, same session:

- Calculator/checklist accordion intro copy rewritten so the two tools
  read as distinct — "how vulnerable might my home be" vs. "what should I
  fix first" — instead of two versions of the same thing (`8836490`).
- Hero subhead rewritten twice; final text: "Create a safer perimeter
  without sacrificing the design, style, or character of your landscape."
  (`a1bfad8`, `906ca8d`).
- Photo Check H2 changed to "Not Sure What Needs to Change Around Your
  Home?"; supporting copy rewritten to name what to photograph (walls,
  deck, fence) and what the homeowner gets back (`dfd8e58`, `e1d4c1e`).
- Lean/Green/Clean card copy rewritten to homeowner-facing language,
  replacing more technical fuel-continuity/ignition-behavior phrasing
  (`b908f60`).
- Landscaping section's "Design Guidance, Not a Plant List" intro centered
  as an editorial transition between the section header and the four-card
  grid (was left-aligned); its copy and the four cards' copy reframed
  around landscape design rather than "bed"/plant-list language, with
  several fire-behavior claims (resist ignition, fire-retardant, high leaf
  moisture/low fuel volume) softened to hedge rather than assert
  (`f94efa8`, `a151ccd`).
- Header CTA vertical misalignment fixed — the desktop nav flex container
  was missing `items-center`, so the padded Free Photo Check button
  defaulted to `align-items: stretch` instead of sharing the nav links'
  centerline (`0eb879e`).

All verified via headless Chrome (screenshots at desktop/tablet/mobile;
functional testing of all 32 calculator combinations, `localStorage`
persistence, and CTA click-through) before commit, then confirmed live in
production via direct `curl` against `zone0landscaping.com` post-deploy —
hero text, Photo Check H2/copy, and the calculator's "See My Risk
Snapshot" button text (served from `js/zone0-tools.js`) all matched.

### 3.14 Documentation history

`docs/decisions.md` carries the dated decision entries this file
summarizes (2026-08-05 multi-page, 2026-08-19 one-page lock, 2026-08-20
form replacement, etc.) — appended over time, not rewritten, so history is
preserved there in full narrative form. This file (formerly split as
`PROJECT-TRUTH.md` + `docs/PROJECT-STATE.md`) is the condensed
decision-plus-verification layer; `docs/decisions.md` is the fuller
decision narrative when more context is needed than Section 1 or 3 give.

---

**END PROJECT TRUTH**

### 3.15 $29 Detailed Photo Review — SUPERSEDED 2026-09-11 (see 3.16)

Kept for history, not current. See 3.16 for the free-again reversal.

### 3.15 (historical) $29 Detailed Photo Review — DEPLOYED AND VERIFIED LIVE, 2026-09-10

Built on a fresh verified baseline of `origin/main` @ `f455aab` after
inspection confirmed an earlier attempt at this change had never been
applied to the repo (no `areas`, no `closeup`, no `0003_areas.sql`, and
production still serving "Free Photo Check" / "within 24 hours").

Changed: `index.html`, `js/photo-check-form.js`, `js/main.js`,
`js/zone0-tools.js`, `worker/src/index.js`, `review-worker/src/index.js`,
new `review-worker/migrations/0003_areas.sql`, and
`.claude/skills/homeowner-journey/SKILL.md` (missing YAML frontmatter added
so the skill registers at all, plus its outdated "Free Photo Check"
primary-business-action language; the 830-line body was otherwise left
alone).

Review portal behavior for pre-migration leads: `areas` is NULL, and those
leads render **no areas row at all** — no placeholder, no invented value —
so old data stays visibly distinct from new data. The close-up group is
likewise rendered only when close-ups exist.

Verified locally before delivery, then deployed in order — D1 migration
(`0003_areas.sql`) → `review-worker` → public `worker` → GitHub Pages — all
within the same minute, 2026-09-10 04:08–04:10 UTC.

**Production verified live, 2026-09-10:**
- `gh api repos/Sheehan935/Zone0/pages/builds/latest` → commit `7a99a59`,
  `status: built`.
- `curl https://zone0landscaping.com/` shows the new copy live: nav CTA
  "Photo Review — $29", hero "Get Your $29 Photo Review", form header "$29
  Detailed Photo Review", submit button "Submit My Photo Review — $29",
  the `closeup` zone card, and all six `areas` checkboxes.
- `npx wrangler deployments list` (both Workers): new versions deployed
  2026-09-10T04:08:37Z (`review-worker`) and 2026-09-10T04:08:43Z (public
  `worker`).
- `npx wrangler d1 migrations list zone0-leads --remote` → "No migrations
  to apply" (0003 applied).
- Real HTTP submission against the live public Worker with an `Origin:
  https://zone0landscaping.com` header: 3-required-sides submission
  correctly rejected (`"At least 1 photo of the right is required."`,
  HTTP 400) confirming the four-side gate is still enforced server-side
  post-deploy; a complete submission (4 sides + 1 closeup + 3 `areas`)
  returned `{"ok":true}`, HTTP 200.
- D1 row for that lead confirmed `areas: "zone0,mulch,fence_deck"` and a
  fifth `closeup` entry in `photo_keys`, alongside the four required
  sides.
- Notification email confirmed delivered to `sheehan935@gmail.com`
  (Gmail search), subject `New Photo Check lead — QA TEST - DO NOT
  CONTACT (123 Test St, Testville, CA)` — matches the load-bearing
  subject format the Control Center/Dashboard artifacts depend on — with
  body correctly listing "Areas of interest: The first 5 feet around the
  house; Ground cover and mulch; Fences, decks, and attached structures".
- Test lead cleaned up post-verification (same precedent as 3.1): D1 row
  and all 5 R2 objects deleted. The notification email was left in place
  (not part of the established cleanup precedent).

**Correction to the deploy report that triggered this verification:** it
described the push as going out via "Cloudflare Pages." Production is,
and remains, GitHub Pages per 1.3 — confirmed again above via the GitHub
Pages Builds API. No Cloudflare Pages project is involved in serving this
site; only the two Cloudflare Workers (`worker`, `review-worker`), D1, and
R2 sit behind it.

### 3.16 Photo Review returns to FREE — DEPLOYED AND VERIFIED LIVE, 2026-09-11

Reverses 3.15 less than 24 hours after it deployed. Changed: `index.html`
(nav CTA, hero, form section label, form intro paragraph, success modal,
FAQ link, form reassurance line), `js/main.js`, `js/zone0-tools.js`,
`review-worker/src/index.js` (comment only), `review-worker/migrations/0003_areas.sql`
(comment only), and `.claude/skills/homeowner-journey/SKILL.md` (all 5
"$29 Detailed Photo Review" references).

Copy-only change: no Worker request/response logic, D1 schema, or
migration behavior changed. The four-required-sides gate, optional
`closeup` zone, and `areas` multi-select from 3.15 are untouched. The
lead notification subject stays `New Photo Check lead — {name}
({address})` — not touched, per the load-bearing-string rule in 1.7/1.8.

Deployed in commits `751d02b` (copy) and `3908ed8` (this record), pushed
to `main`, GitHub Pages rebuilt. **Production verified live, 2026-09-11:**
`curl https://zone0landscaping.com/` shows zero remaining `$29` anywhere
on the page, and confirms the replacement copy — "Get Your Free Photo
Review", "Free Detailed Photo Review", "free while we have capacity",
"Free while spots last", and the success-modal's "There's no charge and
nothing to pay." (Note: this verification was itself delayed — an earlier
poll for this exact check was interrupted by a session restart and never
followed up on until this entry. No functional gap resulted since the
deploy itself succeeded; the gap was purely in confirming it.)

### 3.17 Contact Form — DEPLOYED AND VERIFIED LIVE, 2026-09-11

Client markup, `css/contact-form.css`, and `js/contact-form.js` arrived
pre-built and untracked in the working tree — confirmed as the site
owner's own work before integrating. `js/contact-form.js` posts JSON to
`/contact`; a companion untracked file, `worker/worker-contact-route.js`,
was a reference/instructions stub (not meant to be a real source file —
its own comments said "paste this into the existing Worker") whose spec
is now fully incorporated into `worker/src/index.js`'s `handleContact`,
which is stricter than that stub (matches the client's phone-format and
500-char message-length validation, which the stub didn't check). The
stub was deleted after its content was confirmed redundant.

Changed: `index.html` (new section 10 "Contact", footer renumbered
10→11, plus `<link>`/`<script>` tags for the two new asset files),
`worker/src/index.js` (new `/contact` POST route, `handleContact`,
`sendContactNotification`). New: `css/contact-form.css` (brand colors
corrected from a generic green to the site's actual sage palette,
`#6B7A64`/`#4A5744`, matching `tailwind.config`), `js/contact-form.js`.
Also fixed a pre-existing inconsistency in the pasted markup: the
message textarea's `maxlength` was `550` while the counter and both
client- and server-side validation capped at `500` — aligned to `500`.

**Verified locally before deploy:** `wrangler dev --local` — valid
submission reached the Resend call (failed only on missing
`RESEND_API_KEY`, expected in local dev); missing/invalid fields
returned the correct 400 with all expected error messages; honeypot
(`companyWebsite` filled) returned silent `{"ok":true}`; wrong `Origin`
returned 403.

**Production verified live:** `npx wrangler deploy` from `worker/`
(version `f13c7faa-5dc3-4f00-ae75-231b22db7442`); GitHub Pages rebuilt at
commit `b917a10`. Real HTTPS POST to
`https://zone0-photo-check.zone0landscaping.workers.dev/contact` with a
valid payload returned `{"ok":true}`, HTTP 200; an invalid payload
returned the expected 400 with all four field errors. Notification email
confirmed delivered to `sheehan935@gmail.com` (Gmail search), subject
`New contact form message — QA TEST - DO NOT REPLY (General question)`,
body correctly formatted. `curl https://zone0landscaping.com/` confirms
`<section id="contact">`, `#contact-form`, `#contact-submit`, and both
`/css/contact-form.css` and `/js/contact-form.js` are present and return
HTTP 200. No test data to clean up — this route only sends email, it
never writes to D1 or R2.

### 3.18 Homepage Cleanup — DEPLOYED AND VERIFIED LIVE, 2026-09-15

Built on branch `homepage-cleanup`, not yet merged/deployed. Changed:
`index.html`, `js/photo-check-form.js`, `worker/src/index.js`. Removed
the `<script src="/js/zone0-tools.js">` tag (file itself left on disk,
now unreferenced anywhere).

**Reference drift caught before implementing.** The instructions this
was built from initially cited several things that don't exist in this
repo: an About/"Who We Are" section, a "Your First-5-Feet To-Do List"
section, a "Does it apply to me?" section, an existing CAL FIRE FHSZ
Viewer reference, and literal copy like "Upload 3 photos". None of
these matched actual file content on inspection — flagged and
corrected with the site owner before any edit was made, per this
file's own Evidence First rule. The revised instructions that followed
matched the real section names exactly (Zone 0 Compliance Checklist,
Planting With Purpose, Understand the Zones), confirming genuine
familiarity with the corrected picture.

**Verified before implementing (not after):**
- `js/zone0-tools.js` read in full — confirmed it powers *only* the
  risk-calculator mount points (`#risk-calculator`,
  `.risk-calculator-container`) and nothing else on the page, making
  the delete safe.
- `review-worker/src/index.js`'s lead-detail rendering already handles
  zero photos per zone gracefully (`srcs.length ? thumbs : "No
  photos."`) — confirmed **no change needed** there.
- Lead status (`new`→`in_review`→`complete`) is set by human review
  action in the portal, not photo count — confirmed making photos
  optional can't cascade into a broken/stuck status.

**Verified after implementing:**
- `node --check` on both changed `.js` files: pass.
- HTML tag balance (`section`/`div`/`header`/`footer`/`form`/`main`
  open vs. close counts): all matched.
- Workspace search for `spots last`, `capacity`, `$29`, `Who We Are`,
  `Upload 3`: zero occurrences. `Resources` search confirms the section,
  both nav links, and the FAQ sub-heading survived (calculator-only
  removal, not section removal).
- All local `<script src>`/`<link href>` paths resolved to real files
  on disk (`zone0-tools.js` correctly absent from that list).
- No dangling references to `risk-calc`/`risk-calculator`/
  `initRiskCalculator` anywhere in `js/main.js` or `index.html` after
  the calculator's removal — zero console-error risk from orphaned
  selectors.
- `wrangler dev --local`: a `/submit` POST with **zero photos attached**
  (all four zones + close-up omitted) returned `{"ok":true,"warning":
  "Received, but the confirmation email failed to send."}`, HTTP 200 —
  the warning is expected in local dev (no `RESEND_API_KEY` configured
  locally), not a validation failure. Confirms the zero-photo path
  reaches submission success rather than being blocked.

**Not yet verified — requires a real browser, deferred to the site
owner's review:** rendered visual check of the diff (mobile 375px
layout, tap-target sizing, hero badge contrast, CTA placement) and a
live `console --errors` check. No headless-browser tooling
(`chromium-cli`, Playwright) is installed in this environment: a static
file server was started locally instead so these can be checked
directly in a real browser.

**Approved and deployed, 2026-09-15.** Committed on `homepage-cleanup`
(content + docs commits), merged to `main`, both Workers redeployed,
`main` pushed, GitHub Pages rebuilt. **Production verified live:** a
real `/submit` POST with zero photos returned `{"ok":true}`; D1
confirmed `photo_keys: "[]"`; notification email delivered with subject
`New Photo Check lead — {name} ({address})` unchanged; live `curl`
confirmed the scarcity copy, `$29`, and the Risk Calculator are all
gone, while "East Bay based", the CAL FIRE block, both phone numbers,
and the header call icon are present. Test lead deleted from D1
afterward (no R2 objects existed to clean up).

### 3.19 Mockup Sections — IMPLEMENTED, PENDING DEPLOY VERIFICATION (branch `mockup-sections`)

Built on branch `mockup-sections`, on top of 3.18. Changed: `index.html`
(new "What Is Zone 0" and "Your First-5-Feet To-Do List" sections,
"Understand the Zones" deleted, Photo Review intro restyled, Resources
heading/intro reworded, three "Zones" nav links repointed to
`#what-is-zone-0` and relabeled "What Is Zone 0", section-comment
numbers 3–12 renumbered sequentially), `js/main.js` (checklist banner
made item-count-driven), `css/styles.css` (`.compliance-checklist`'s
outer box styling removed — the two new DIY/Structural-Upgrades cards
carry that look instead; the class is used in exactly one place).

**Verified before this was shown for approval:**
- Zone-card content overlap between the old "Understand the Zones" and
  the new "What Is Zone 0" — confirmed near-duplicate (same 3 zones,
  same distances, close wording) and flagged for a decision rather than
  silently deleting or silently leaving a duplicate. Site owner chose
  deletion.
- Resources' post-move content — confirmed only the FAQ would remain
  and that the section's own heading/intro text referenced "checklists"
  and would go stale; flagged rather than left inaccurate.
- `js/zone0-tools.js`, `worker/`, `review-worker/`, `js/photo-check-form.js`
  — re-confirmed zero diff before every commit in this branch.
- Tag balance (`section`/`div`/`header`/`footer`/`form`/`details`), every
  `#anchor` in the file resolves to a real `id` (no orphaned `#zones`
  left behind — all three nav links repointed), single CAL FIRE link,
  single checklist instance (7 `.compliance-check-item`s), all three
  "Get Your Free Photo Review" buttons pointing to `#photo-check`.
- `node --check` on `js/main.js`: pass.

**Iterated on the site owner's own local review**, not assumed correct
on the first pass: a 3-step strip (Send/Get/Decide) was added above the
Photo Review form per the mockup, viewed locally, then removed at the
site owner's request — the intro paragraph and field hints it sat
between were unaffected by either the add or the removal.

**Not yet deployed as of this entry** — deploy/verification evidence to
follow in this section and the sync header once pushed.
