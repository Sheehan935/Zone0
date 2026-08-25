# ZONE 0 LANDSCAPING — PROJECT TRUTH

**Purpose:** Authoritative decision record *and* detailed verification/state
log for all AI sessions working on this project. This file used to be split
across `PROJECT-TRUTH.md` (decisions) and `docs/PROJECT-STATE.md` (detailed
state) — merged 2026-08-25 to stop the same fact needing to be kept in sync
across two files (a real failure mode: a false "Resend domain unverified"
claim briefly existed in one file after being corrected in the other before
this merge). Section 1 is the terse, skimmable decision layer; Section 3 is
the detailed evidence trail behind those decisions.

**Last synchronized:** 2026-08-25 — local `main`, `origin/main`, and the
live GitHub Pages build are all confirmed at commit `11ef747`
(`gh api repos/Sheehan935/Zone0/pages/builds/latest` → `status: built`).

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

### 1.5 Currently Unresolved

- **Legacy Photo Review / Hazard Tool** (`js/modal.js`, custom hazard-quiz):
  already deleted from the repo and confirmed 404 in production (2026-08-19).
  Its longer-term disposition beyond that deletion is UNRESOLVED — do not
  restore or replace without an explicit decision.
- **Buttondown:** zero references anywhere in this repo's code or docs.
  Not confirmed absent as an external account — unverified either way.
- **Analytics** (Plausible/Fathom/GA4): same treatment — zero references in
  the repo. Not verified as installed or absent externally.

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

### 3.12 Tools (Resources accordion)

Risk Calculator, Zone 0 Compliance Checklist (`localStorage`-backed),
5-Step Inspection Checklist, FAQ & Official Resources all locally verified
functional. Ordinance Lookup (`js/ordinance-lookup.js`) is preserved on
disk and still deployed but intentionally unreferenced from `index.html`
per the locked decision to drop the jurisdiction-lookup feature from the
homepage.

### 3.13 Documentation history

`docs/decisions.md` carries the dated decision entries this file
summarizes (2026-08-05 multi-page, 2026-08-19 one-page lock, 2026-08-20
form replacement, etc.) — appended over time, not rewritten, so history is
preserved there in full narrative form. This file (formerly split as
`PROJECT-TRUTH.md` + `docs/PROJECT-STATE.md`) is the condensed
decision-plus-verification layer; `docs/decisions.md` is the fuller
decision narrative when more context is needed than Section 1 or 3 give.

---

**END PROJECT TRUTH**
