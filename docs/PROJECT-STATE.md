# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md` and `docs/decisions.md`. For supporting audit evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-21 (Photo Check live and verified; footer nav, copy simplification, and new logo all live; Photo Check Review Portal built as an MVP but not yet fully live — see its section below)

---

## Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD: `bf075d0` ("feat(brand): refine logo to premium/restrained wordmark treatment").
- `main` and `origin/main` confirmed synchronized at this HEAD (`git fetch` + compare).
- Working tree: untracked only — `assets/logos/Canva Logomark Side/` and `assets/logos/Canva Logomark Top/` (raw logo source exports, intentionally not committed; see Logo / Brand section below).
- Deployment: GitHub Pages, custom domain `zone0landscaping.com`, HTTPS certificate approved. GitHub Pages API confirms deployed commit = `bf075d0`, status `built`.

## Visual / Design System Pass — COMPLETE, DEPLOYED 2026-08-20

Following the visual/design-system audit (evidence: computed-style measurements against production, see prior audit report in conversation history — not separately filed), the 4 highest-priority findings from its "Recommended Design Pass" were implemented, verified locally, committed as `40227b5`, and confirmed live in production:

1. **Free Photo Check H2** — was rendering as body text (16px/400/Inter); now matches the site-wide H2 pattern (`text-3xl sm:text-4xl font-display font-bold`). Verified live: `36px`.
2. **CTA button shape unified to `rounded-full`** across all three instances (hero, header nav, Risk Calculator submit). Fixing the Risk Calculator button required also guarding a previously-unguarded legacy rule in `css/styles.css` (`button[type="submit"]`) that had higher CSS specificity than the Tailwind utility class and was silently overriding both its radius and background color — same `:not(.tw-shell)` guard pattern used earlier for `main`/`nav a`. Verified live: header CTA radius `9999px`.
3. **How We Help 5-card grid** — was orphaning the 5th card alone on its own row at 768–1023px widths; switched from CSS grid to `flex flex-wrap justify-center` with explicit `calc()` widths per breakpoint, so any incomplete row self-centers at any width in that range, not just the one width originally measured.
4. **Zone severity colors tokenized** (`zone.red`/`amber`/`amberdark`/`green` added to `tailwind.config`, replacing 4 raw arbitrary hex values) and the Zones/Resources section eyebrow labels consolidated to the standard pattern used by the other 5 sections.

**Explicitly not touched** (audit findings noted but excluded from this controlled pass): Zones/Resources H2 font-size variance (30px vs. 36px elsewhere), Visual Proof card corner-radius (0px, differs from the 8px card standard). Both confirmed still unchanged post-pass — regression-checked, not accidentally caught by the fix.

**Verification chain, repository → deployed → live:**
- GitHub Pages API (`gh api repos/Sheehan935/Zone0/pages/builds/latest`) confirms deployed `commit` = `40227b5`, status `built`.
- Live production spot-check (`https://zone0landscaping.com/`, real headless render): Photo Check H2 = `36px` (was `16px`), header CTA `border-radius` = `9999px` (was `0px`), zero console errors, zero horizontal overflow.

## Production Verification — VERIFIED 2026-08-19

- **GitHub Pages API** (`gh api repos/Sheehan935/Zone0/pages/builds/latest`) confirms the live build's `commit` field is `5ff1975109fcfa90b5d297c938e6978c4be3999f` — an exact match to local/origin HEAD. Build status `"built"`, pushed by `Sheehan935`. This is authoritative (from GitHub itself), not inferred from page content.
- **HTTP smoke test** (direct `curl`, status codes):
  - `/` → 200, `<title>` matches the rebuild exactly ("Zone 0 Landscaping | Protecting Homes. Preserving Landscapes.")
  - `/zone-0/`, `/materials/`, `/faq/` → 200
  - `/pages/thank-you.html` → 200
  - `/assets/images/houses/Hill House.jpg` (hero image) → 200
  - `/css/styles.css`, `/js/main.js`, `/js/zone0-tools.js` → 200
  - `/js/modal.js` → **404** (correctly absent — confirms the deletion deployed)
  - `/js/ordinance-lookup.js` → 200 (file still present on disk as required, simply unreferenced from `index.html`)
  - `/zone-0/`'s cross-page anchors (`/#compliance-checklist-section`, `/#photo-check`) confirmed present in the live HTML.
- **Content smoke test** (fetched render of `/`): H1 "Protecting Homes. Preserving Landscapes." present; nav reads "Approach / Landscaping / Zones / Resources / Free Photo Check"; "Lean. Green. Clean." heading present; Resources section lists Risk Calculator, Compliance Checklist, Inspection Checklist, FAQ & Official Resources; Free Photo Check CTA present with "Know what to fix. Get the work done. Keep the proof."; no broken/placeholder content or visible errors detected.

## Architecture

**Locked one-page homepage** (structure, not current section order below, is live in production): `index.html` + `pages/thank-you.html`.

**2026-08-24 (uncommitted, not yet deployed):** Free Photo Check moved from position 9 to position 3, immediately after Hero and before Lean/Green/Clean. Current order: Header, Hero, Free Photo Check, Lean/Green/Clean, Landscaping/Hardscaping/Design, Visual Proof, Understand the Zones, Resources, How We Help, Footer. See `PROJECT-TRUTH.md` for the locked-decision update. Production still serves the prior order (Photo Check at position 9) until this is committed and deployed.

Legacy multi-page content remains on disk and deployed (still reachable by direct URL, still 200), but is no longer linked from primary navigation:
- `zone-0/index.html`, `materials/index.html`, `faq/index.html`, `design/index.html` (+ `design/gallery/`, `design/privacy-without-fuel/`) — all present, all serving 200, each still links back into the new homepage via `/#photo-check` and `/#compliance-checklist-section` (both confirmed live).
- `pages/services.html` — still not present (matches prior snapshots; archived copies only).

## Photo Check — REPLACED 2026-08-20, LIVE AND VERIFIED

**Correction to this file's own prior claim:** the entry below (superseded by
this one) previously stated the Tally embed was "confirmed functional...
real form fields render." That was wrong. A dedicated live-production
investigation (2026-08-19 functional/navigation audit) found Tally's hosted
form (`81VgKP`) had only 3 real fields — Name, Email, Phone — the
City/Photo-upload/Notes controls shown on the page were inert text, not bound
form fields, confirmed identically at 1440/768/390px via `frameLocator`
inspection of the live iframe. This was a Tally-dashboard-side defect, not
fixable from the repository. See that session's audit report and
`docs/decisions.md`'s 2026-08-19 entry for the original evidence.

**Current implementation:** Tally has been removed entirely
(`js/photo-check-form.js` replaces the widget script; the iframe and
`.tally-embed` CSS rule are deleted). The Photo Check section
(`index.html#photo-check`) is now a real HTML form — Name, Email, Phone, City,
Photos (1–3 files, image types only, 8MB each), Notes — that posts to a
Cloudflare Worker (`worker/src/index.js`).

**Locally verified, this session** (`npx wrangler dev` + Playwright, real
browser, real file uploads, not just HTML inspection):
- All 6 fields render as real, labeled, functional controls at 1440px and 390px.
- Native HTML5 `required` validation blocks an empty submit before any network call.
- Selected-file names/sizes display after choosing photos.
- Full valid submission (real multipart POST, real JPEG file) → Worker
  validates → stores the photo in a local-emulated R2 bucket (confirmed via
  the bucket's object listing, and confirmed the stored bytes are
  byte-identical to the uploaded file via `GET /photo/{key}`) → responds
  `{ok:true}` → frontend redirects to `pages/thank-you.html`. Zero console
  errors.
- Server-side validation independently confirmed via `curl`: wrong CORS
  origin rejected (403), missing required fields rejected with specific
  messages, honeypot-filled submissions silently accepted (200, discarded),
  submissions faster than 3 seconds rejected (basic bot mitigation), non-image
  file types rejected, >3 files rejected.
- Email delivery path (Resend) is implemented with graceful degradation — if
  the Resend API call fails, the lead and photos are still saved in R2 and
  the homeowner still sees success — but was not verified with a real API key
  in local testing (none configured; that requires the owner's own Resend
  account).

### Backend — COMPLETE, verified 2026-08-20

Cloudflare Worker `zone0-photo-check`
  URL      https://zone0-photo-check.zone0landscaping.workers.dev
  Endpoint POST /submit  (multipart/form-data, Origin-allowlisted)
  Photos   GET /photo/:leadId/:photoId.jpg
  Storage  R2 bucket `zone0-photo-check-uploads`
  Secret   RESEND_API_KEY (Worker secret)

Email (Resend)
  Domain   zone0landscaping.com — DKIM, SPF, MX verified 2026-08-20
  From     hello@zone0landscaping.com (changed 2026-08-20 from
           leads@zone0landscaping.com, so the homeowner sees Zone 0's public
           identity rather than an internal-looking address; leads@ is no
           longer used anywhere in this system)
  To       sheehan935@gmail.com  (was hello@zone0landscaping.com; changed
           2026-08-20 so lead delivery does not depend on forwarding)
  Reply-To the homeowner's own address, set per-lead by the Worker (unchanged
           by the From-address change above)

**Final verification — real homeowner-path submission, not a synthetic test:**
the site owner submitted the live production form at `zone0landscaping.com`
through an actual browser. Result: notification email received at
`sheehan935@gmail.com`, from `leads@zone0landscaping.com`, subject "New Photo
Check lead — Brian Sheehan (Kensington)", containing the submitted
name/email/phone/city/notes and a working photo link
(`/photo/ba752818-.../d3804fa2-....png`). This is the strongest possible
confirmation short of a real customer lead — the entire path (form → Worker →
R2 → Resend → inbox) is confirmed working for a real user on the real site,
not just via `curl` against the Worker directly. (Historical record, kept as
originally written: this test ran before the From-address change below and
correctly shows `leads@zone0landscaping.com` as the sender at that time.)

**From-address changed 2026-08-20, later the same day:** `FROM_EMAIL` was
switched from `leads@zone0landscaping.com` to `hello@zone0landscaping.com`
so the homeowner-facing sender identity is Zone 0's public address rather
than an internal one. `worker/src/index.js` was not changed (it already read
`from: env.FROM_EMAIL` and `reply_to: lead.email`) — only the `wrangler.toml`
config value changed, then the Worker was redeployed.

**First verification attempt was a false positive.** A `curl` test run
immediately after `wrangler deploy` returned `{"ok":true}` with no warning,
which was wrongly read as confirmation — that response only proves *some*
valid Resend sender was used, not which one, since both the old and new
`FROM_EMAIL` are equally valid senders under the same verified domain. The
deploy had gone live at the exact same minute the test ran
(`wrangler deployments list` showed the new version created
2026-08-21T01:03:13 UTC), and Cloudflare's edge network is not instantly
consistent across all POPs — the request almost certainly hit an edge that
hadn't yet received the new version, silently exercising the old code path.
The received email at that point showed `leads@zone0landscaping.com`, not
`hello@`.

**Re-verified correctly** with a second test, run well after propagation
completed, and independently confirmed by the site owner reading the actual
Gmail message rather than trusting the API response: sender displayed as
`hello@zone0landscaping.com` (not `leads@`), and hitting Reply in Gmail
addressed the response to `test-fromaddr-reverify@example.com` — the
homeowner test address supplied as Reply-To, not to `hello@` or `leads@`.
Both From and Reply-To are confirmed working as intended, verified against
the real deployed system, not inferred from source code.

Earlier same-day `curl`-driven tests against the Worker directly also confirm
each stage in isolation: CORS/origin allowlisting, honeypot/timing spam
checks, R2 storage, and — after the `NOTIFY_EMAIL` fix and Resend domain
verification were both completed — clean `{"ok":true}` responses with no
email-failure warning.

The Origin allowlist accepts `https://zone0landscaping.com`. The bare
`workers.dev` origin is **not** allowed, so functional testing must be done
from the real site, not from a local file or a `file://` page.

### Open items

- 9 test/verification objects now remain in the R2 bucket (the original 6,
  plus 2 from the `hello@` From-address verification and 1 from the review
  portal's production D1 check, all logged elsewhere in this file) and
  should be deleted once the owner is done reviewing them.

See `worker/README.md` for the backend implementation and `docs/decisions.md`'s
2026-08-20 entry for the full decision record.

## Email Architecture — DECIDED 2026-08-20, ROSTER REVISED 2026-08-24, PARTIALLY IMPLEMENTED

The full address roster was restated by the owner 2026-08-24. Two changes
from the 2026-08-20 decision: `legal@` replaces `privacy@`, and two
additional aliases (`brion@`, `info@`) join the roster. The Photo Check
sender was re-confirmed on 2026-08-24 as `hello@` — the owner's 2026-08-24
note associating `leads@` with the photo upload form was raised as a
conflict with the 2026-08-20 From-address decision and resolved in favor of
keeping `hello@`. `leads@` remains internal-only.

**Public-facing:**
- `hello@zone0landscaping.com` — general contact, and the only address
  placed anywhere in the markup. Appears in the homepage footer
  (`index.html`, added 2026-08-20), `faq/index.html`, and
  `pages/thank-you.html`. Also the Photo Check Worker's `FROM_EMAIL`
  (`worker/wrangler.toml`) — see the Photo Check section above for that
  change and its verification. Re-confirmed 2026-08-24.
- `support@zone0landscaping.com` — decided but **not placed anywhere on the
  site**. No genuine support/help/billing context exists on any live or
  orphaned page (verified via repo-wide search 2026-08-20, re-verified
  2026-08-24). Alias-only per explicit decision, so it works if ever given
  out directly, without inventing a support page or section that doesn't
  otherwise exist.
- `legal@zone0landscaping.com` — replaces `privacy@` as of 2026-08-24.
  Decided but **not placed anywhere on the site**, for the same reason: no
  Privacy Policy or Terms page exists in the repository at all
  (`design/privacy-without-fuel` is a gallery item, not a policy page).
  Alias-only. Building a Privacy/Terms page was offered 2026-08-24 and
  explicitly deferred — see TODO.
- `info@zone0landscaping.com` — added to the roster 2026-08-24. Alias-only;
  overlaps `hello@` in purpose and is deliberately **not** placed on the
  site, so the public contact point stays single and unambiguous.

**Internal/operational:**
- `leads@zone0landscaping.com` — not used anywhere in the system. Previously
  the Photo Check `FROM_EMAIL`; replaced by `hello@` on 2026-08-20 so
  homeowners see Zone 0's public identity, not an internal-looking address.
  That decision was re-examined 2026-08-24 and deliberately kept. Remains a
  valid sender under the Resend-verified domain if ever needed again, but
  nothing currently sends from or displays it.
- `brion@zone0landscaping.com` — owner's named address, added to the roster
  2026-08-24. Alias-only, for direct correspondence; not placed on the site.
- Notification destination is `NOTIFY_EMAIL = sheehan935@gmail.com`,
  unaffected by the From-address change.

**Infrastructure decision:** all roster addresses stay **free ImprovMX
aliases** forwarding to the owner's Gmail — explicitly not a paid mailbox,
to avoid an unrequested recurring cost. Root domain has no MX record today
(DNS at GoDaddy, `ns47/ns48.domaincontrol.com`); Resend's MX sits only on
`send.zone0landscaping.com` and doesn't cover the root. ImprovMX MX/TXT
records (`mx1`/`mx2.improvmx.com`, SPF) were added at GoDaddy 2026-08-20.

**Still outstanding (external, owner-only):** create the free ImprovMX
account, add `zone0landscaping.com`, and configure all six aliases
(`hello@`, `support@`, `legal@`, `info@`, `leads@`, `brion@`) to forward to
Gmail. Until that's done, mail to any of these addresses bounces. Photo
Check lead notifications do not depend on this and are unaffected.

### Post-submission UX — CHANGED 2026-08-20: in-page success modal, no redirect

The redirect to `pages/thank-you.html` has been replaced with an in-page,
accessible success modal (`#pc-success-modal` in `index.html`, logic in
`js/photo-check-form.js`). On a successful Worker response the homeowner now
stays on `index.html#photo-check` at their existing scroll position; the form
is reset and the submit button stays disabled until the modal is dismissed
(preventing a duplicate submit), then re-enabled with focus returned to it.
The modal is dismissed via its `×` button, its `Close` button, or `Escape`,
with focus trapped inside while open. Backend failures (validation errors or
network errors) are unaffected: the modal never opens, entered data and
selected files are retained, and the existing inline error message displays.

Verified locally at 1440/1024/768/390px via Playwright: modal open/close
behavior, focus trap, Escape, duplicate-submit prevention, form reset on
success, no false-success on a real backend rejection (tested against the
live Worker from localhost, which correctly 403s on origin mismatch), zero
console errors from the new code paths, and no horizontal overflow at any
width. Not yet verified against the real deployed Worker from the actual
`zone0landscaping.com` origin — that requires this change to be pushed and
served from production first.

`pages/thank-you.html` is no longer referenced anywhere in the live site's
code (confirmed via repo-wide search across `index.html` and all `js/`/
`pages/` files) — it is now an orphaned/legacy page, reachable only by a
direct URL, not deleted. Kept in place per explicit instruction rather than
removed, as historical/fallback artifact.

## Footer Navigation — ADDED 2026-08-20, LIVE

The footer was a single centered block (AB 3074 citation + copyright only, no
site navigation). Replaced with three groups — Company, Explore, Contact —
linking only to anchors that already exist on `index.html`, per an explicit
decision to stay consistent with the locked one-page architecture: no links
to the orphaned legacy pages (`zone-0/`, `materials/`, `faq/`), since that
would reintroduce them into primary navigation, a separate still-open
question this change deliberately left untouched. `hello@zone0landscaping.com`
appears in the Contact group. Verified via Playwright at 1440/1024/768/390px:
every link's destination correct and actually navigates, mailto correct,
semantic nav landmarks, keyboard focus, zero console errors, zero horizontal
overflow (a 768px-width email-wrapping bug was caught and fixed during
testing). Confirmed live in production.

## Photo Check Redesign — Per-Side Photos + Address — DEPLOYED AND VERIFIED LIVE 2026-08-25

Per explicit decision, replaced the flat "City + up to 3 generic photos"
intake with a full property `address` field and per-side photo capture
(Front/Back/Left/Right, up to 5 photos each, 1+ required per side), and
replaced the review console's six-category Status/Risk/Priority scheme with
zone-based categories rated Pass/Needs Work/Fail. Full detail of what
changed is in `PROJECT-TRUTH.md`'s "Photo Check Redesign" entry (Section 2)
— this entry is the verification record.

**Changed files:** `index.html` (Photo Check section rebuilt as a 3-step
stepper), `js/photo-check-form.js` (rewritten for per-zone file state and
step navigation), `worker/src/index.js` (per-zone `photos_{zone}` fields,
`address` replaces `city`, R2 keys now `{leadId}/{zone}/{uuid}.{ext}`),
`review-worker/src/index.js` (new `CATEGORIES`, Pass/Fail/Needs-Work rating
UI with a small inline script for live client-side highlight, zone-grouped
photo display, updated queue/detail queries), `review-worker/migrations/
0002_address.sql` (renames `leads.city` to `leads.address`), `worker/
README.md` (documents the new contract and the required deploy order).

**Verified this session, real behavior not just source inspection:**
- Both Worker source files and the rewritten client JS pass `node --check`.
- Public form: exercised in a real browser against a local static server
  (`python3 -m http.server`, real `.claude/launch.json` preview, not a
  synthetic DOM check) — filled Step 1, confirmed empty-field validation
  blocks advancing, added/removed synthetic photos across all 4 zones,
  confirmed the "N of 4 areas covered" gating and Continue-button
  enable/disable, reached Step 3, submitted, and confirmed the
  network-failure path shows a friendly error (expected: the live Worker's
  `ALLOWED_ORIGIN` doesn't include `localhost`, and it hasn't been
  redeployed with the new contract yet, so this exercised the CORS-failure
  branch, not a real submission). Zero unexpected console errors.
- Review console: applied `0002_address.sql` to a **local** D1 instance
  (`wrangler d1 migrations apply zone0-leads --local`), inserted a synthetic
  test lead directly via `wrangler d1 execute --local`, ran `wrangler dev
  --local`, and confirmed via real HTTP requests: the queue lists the
  address column correctly; the lead-detail page groups photos by zone with
  correct per-zone counts; all 6 new categories render with Pass/Needs
  Work/Fail controls; a real `POST /save-draft` persisted a rating + notes
  per category, transitioned status `new` → `in_review`, and the
  server-rendered re-fetch showed the correct saved rating and its matching
  color highlight.

**Deployed and verified live, 2026-08-25 (same day, following session):**
- `0002_address.sql` applied to the remote/production D1 database
  (`wrangler d1 migrations apply zone0-leads --remote`).
- `review-worker` redeployed first, then the public `worker` — both via
  `wrangler deploy`, matching the required order in `worker/README.md`.
- `index.html` + `js/photo-check-form.js` committed (`29aea70`) and pushed
  to `origin/main` for GitHub Pages to build.
- **Real production submission, not a local simulation:** POSTed a
  clearly-marked test lead (name "QA TEST - DO NOT CONTACT") directly to
  `https://zone0-photo-check.zone0landscaping.workers.dev/submit` with a
  real `Origin: https://zone0landscaping.com` header and 5 photos spread
  across all 4 zones → `{"ok":true}`. Confirmed against the **production**
  D1 database via `wrangler d1 execute --remote`: the row has `address`
  populated and `photo_keys` correctly zone-tagged
  (`{leadId}/front/...`, `/back/...`, `/left/...`, `/right/...`).
  Confirmed via the public `GET /photo/{leadId}/{zone}/{uuid}.ext` route
  that a stored photo is retrievable and byte-identical to the uploaded
  file. This is the strongest confirmation short of an actual homeowner
  submission — the entire path (form contract → Worker → R2 → D1 →
  Resend) is proven against the real deployed services, not a local
  emulation.
- This test lead (id `98e8b645-4d17-43d0-8d2e-75eb2fafdfd2`) remains in R2/
  D1 — add it to the existing "9 test objects" R2 cleanup item in
  `TODO.md` rather than treating it as a separate one-off.

**Review Portal's first authenticated workflow — COMPLETE 2026-08-25,
fully working, no blocker.** The owner logged in through Cloudflare
Access, opened a real lead (Brian Sheehan, 681 Oberlin Ave), completed the
six-category analysis, marked it Complete, and successfully sent the
homeowner response via `hello@zone0landscaping.com`.

While verifying this, a real bug was found and fixed: `sendHomeownerResponse`
in `review-worker/src/index.js` still referenced `lead.city` for the email
subject (missed when the column was renamed to `address`), and its error
handling only surfaced the HTTP status code, not Resend's actual validation
message. Fixed and redeployed (commit `6232182`): subject now reads
`lead.address`, and a failed send now includes Resend's own error message.

**Correction to this file's own prior claim:** an earlier version of this
entry (superseded by this one) read the resulting 422s as evidence that
`review-worker`'s Resend account lacked a verified sending domain, and
flagged that as a new blocking item. **That was wrong, and the site owner
caught it** by checking the Resend dashboard directly: `zone0landscaping.com`
is Verified in the one and only Resend account in use (`sheehan935`, the
account behind both API keys — "Worker Key" and "Onboarding" — so the
verified domain covers either); and the Resend Logs page showed the exact
error body for every 422: `Invalid 'to' field. Please use our testing
email address instead of domains like example.com.` Resend rejects the
RFC 2606 reserved `example.com` domain as a recipient outright, regardless
of sender/domain verification, specifically to catch accidental sends to
a domain that was never meant to receive mail. The 422s were interleaved
with 200s on the same endpoint minutes apart, which a genuine account or
domain problem would not produce. **There is no account, domain, or code
issue** — the synthetic test addresses (`qa-test@example.com`,
`qa-test-2@example.com`) were themselves invalid test data, not a system
defect. Real recipients, including the one real lead's actual address,
work as expected. Any future QA sends should target `delivered@resend.dev`
(Resend's own testing address) or a real inbox, never `@example.com`.

**R2/D1 test-data cleanup — 2026-08-25.** The "9 pre-existing test objects"
figure quoted in earlier entries and `TODO.md` was an estimate from memory,
never checked against an actual bucket listing. `wrangler r2 object` has no
`list` subcommand in this wrangler version, so the real inventory was
pulled via the Cloudflare REST API directly (`GET .../r2/buckets/{bucket}/
objects`, paginated) using wrangler's own cached OAuth token. The bucket
actually held **28 objects** across 6 D1 leads plus 22 orphaned (no D1 row)
objects predating the review portal's D1 wiring.

Cross-referencing against the full `leads` table turned up 6 rows, not 2:

| id | name | status | disposition |
|---|---|---|---|
| `89790bbf...` | "CLAUDE TEST - review portal D1 verification, ignore/delete" | complete | **deleted** — self-labeled junk |
| `98e8b645...` | "QA TEST - DO NOT CONTACT" | complete | **deleted** — this session's redesign-deploy test |
| `f5d474c4...` | "QA TEST 2 - DO NOT CONTACT" | complete | **deleted** — this session's post-fix retest |
| `796cce36...` | "Brian Sheehan" / Kensington | complete | **kept** — real verification lead from 2026-08-22, predates this session |
| `9932b30b...` | "Brian Sheehan" / Kensington | new | **kept** — real lead, old flat photo-key format (submitted before this redesign's Worker was live), never reviewed |
| `8a2291ec...` | "Brian Sheehan" / 681 Oberlin Ave | complete | **kept** — the lead used for this redesign's first successful Review Portal send, 2026-08-25 |

Deleted: the 3 unambiguous rows above plus their 10 R2 objects (5 for
`98e8b645`, 4 for `f5d474c4`, 1 for `89790bbf`), via the same REST API
(`DELETE .../objects/{key}`) then `DELETE FROM leads WHERE id IN (...)`
against production D1 — confirmed via `changes: 3` in the D1 response and a
follow-up `SELECT` showing exactly 3 rows remain.

**Deliberately left alone, pending the site owner's own call** (real
history, not junk create this session):
- The 3 kept leads above and their R2 photos.
- `ba752818-fa13-4b92-bd50-d38be1036047/d3804fa2-....png` — an orphaned
  object (no D1 row) that is the exact photo link this file already cites
  elsewhere as the "strongest possible confirmation" evidence from the
  original Tally-retirement verification.
- 9 more orphaned, unlabeled objects (tiny files, no D1 row) from early
  Worker development before D1 was wired in.

The Review Portal section below documents the portal's general status;
its six categories described there are superseded by this redesign.

## Photo Check Copy Simplification — CHANGED 2026-08-21, LIVE

- H2 changed: "See what's putting your home at risk." → "Is My Home At Risk?"
- Removed entirely (not replaced): "A free, no-pressure look at your home's
  fire risk."
- The City field's label changed from "City / Neighborhood" to "City" —
  **the field itself was not removed**, despite an initial request to do so.
  Its validation, D1 storage, and email templates live in the Worker and the
  Review Portal (see below), both explicitly on a "do not change" list for
  that task; removing it from only the frontend would have broken every
  future submission with a server-side validation error. Resolved by keeping
  the field fully functional and relabeling it. The two leftover
  "neighborhood" strings in `worker/src/index.js` (a validation message and
  the notification email body) were tidied to match, along with one in the
  not-yet-deployed review portal's queue table header.
- Verified via Playwright at 1440px/390px: exact heading text, sentence
  confirmed absent, exactly 6 visible form fields (Name/Phone/Email/City/
  Photos/Notes), native required-field validation still active, zero
  console errors, zero horizontal overflow.

## Logo / Brand — REVISED 2026-08-20–21, LIVE

The header's text wordmark ("Zone0 / landscaping") was replaced with the
leaf mark + "Zone Zero" logo, then that logo itself was refined:

1. **First pass (2026-08-20):** used the raw Canva export as-is. Its source
   PNG had a solid white background baked into an oversized square canvas —
   using it directly caused a visible white box in the header and clipped
   most of the wordmark when height-constrained. Fixed by stripping the
   background to transparent and cropping to the artwork's actual bounding
   box (Python/Pillow, run locally — not a repo dependency).
2. **Revision pass (2026-08-21):** the user asked for a refined wordmark
   (the original "ZERO" treatment was a thin, hard-to-read script). Four
   candidate directions were drafted as a design canvas — horizontal
   (preferred), stacked-refined, compact-for-header, and a lighter
   "premium/restrained" option — each showing both an oversized view and a
   real ~80px header-size mockup. **Option D (premium/restrained) was
   selected.** Implemented as live text, not a baked image: the leaf mark
   alone (recolored from the source export's unrelated bright green to the
   site's actual `sage-default` `#6B7A64`) plus a real "ZONE ZERO" `<span>`
   in Plus Jakarta Sans Bold with wide letter-spacing — crisper at any size,
   smaller asset, and properly accessible (`aria-label="Zone Zero"` on the
   link, decorative `alt=""` on the leaf so screen readers don't announce
   the name twice).

Verified via Playwright at 1440px/390px both passes: image loads (checked
via `naturalWidth`, not just absence of a 404), correct computed color
(`rgb(107,122,100)`), no overlap with the mobile menu button, zero console
errors. Confirmed live in production both times.

**Assets:** `assets/logos/zone-zero-leaf.png` is the only logo asset
referenced by `index.html`, committed to git. `assets/logos/Canva Logomark
Side/` and `assets/logos/Canva Logomark Top/` (the raw source exports) are
on disk but intentionally left untracked — the user's own source material,
not something this session added to version control.

## Photo Check Review Portal — BUILT 2026-08-20–21, MVP, NOT YET FULLY LIVE

**2026-08-24 update:** the six categories and their rating scheme described
below were replaced (zone-based categories, Pass/Needs Work/Fail) as part
of the Photo Check Redesign — see that section above for what changed and
what's been verified. This section's content below is otherwise historical
(describes the original MVP build) and has not been rewritten line-by-line
to match; treat the categories named below as superseded.

An internal, authenticated tool for working Photo Check leads end-to-end:
queue → open a lead → view submitted photos → complete a six-category
fire-safety analysis → send a response to the homeowner from
`hello@zone0landscaping.com` → track status through to Closed. Full plan at
the time: a new, separate Cloudflare Worker (`zone0-review-portal`, source
in `review-worker/`) rather than merging into the public-facing Worker, for
blast-radius isolation between untrusted public intake and trusted admin
surface. New D1 database `zone0-leads` (one table, `analysis_json` as a
single JSON column rather than 42 separate columns — right-sized for
processing the first 10-20 leads, not a reporting system). Server-rendered
HTML, no framework, matching the rest of the repo.

**The only change to the existing, live public Worker:** `handleSubmit` now
also inserts a row into the same D1 database after its existing R2-store-
and-notify sequence, wrapped the same way the existing Resend call already
is so a D1 failure can never block a homeowner's submission. Uses D1
prepared statements (`.bind()`), never string-interpolated SQL, since this
is the one place public input reaches the new datastore. **Deployed and
live** — confirmed via a real test submission through the actual public
form landing correctly in production D1, with its R2 photo independently
confirmed retrievable.

**Security:** every route requires a valid Cloudflare Access JWT, verified
Worker-side (RSASSA-PKCS1-v1_5 signature check against Cloudflare's
published JWKS, audience + expiry checked) as defense-in-depth on top of
Access itself — fails closed if Access isn't configured, which was the
state through most of this build (confirmed via real production `curl`:
every route type — queue, individual lead URLs, the photo route, POST
actions, even a forged Access header — returned 403). All user-supplied
fields are HTML-escaped on render (verified against live `<script>`/`<img
onerror>` XSS probes in both the queue and detail views) and D1-bound
against SQL injection. Send-to-homeowner is idempotency-guarded (a repeat
send is silently refused, verified) and gated behind `status = 'complete'`
and a non-empty response (both guards verified). No per-lead access-control
list: there is exactly one authorized user, meant to see every lead by
design, so Access gating the whole route surface is the right-sized
control — a deliberate scope decision, not an oversight.

**Status as of this snapshot:**
- `review-worker/` deployed to Cloudflare (`zone0-review-portal.
  zone0landscaping.workers.dev`).
- Every local guard/workflow path tested via `wrangler dev` + direct D1
  queries: draft save + reload persistence, status transitions (including
  that editing after Complete or after a send doesn't corrupt the frozen
  `response_sent_body` audit record), the four send guards above.
- **Cloudflare Access is confirmed live**, not just suspected: the owner
  filled in real `ACCESS_AUD`/`ACCESS_TEAM_DOMAIN` values in
  `review-worker/wrangler.toml`, the Worker was redeployed with them, and an
  unauthenticated request now gets a real `302` to
  `spring-cell-6642.cloudflareaccess.com`'s login page carrying the matching
  AUD — both the edge-level Access policy and the Worker's own
  defense-in-depth JWT check are wired to the same application.
- **The review portal's `RESEND_API_KEY` secret is confirmed set**
  (`wrangler secret list` on `review-worker/`), separate from the public
  Worker's own key as designed.
- **Still not run:** the actual authenticated workflow (queue → open →
  complete → send) against production, and a real email delivery check.
  Both prerequisites (Access, the Resend secret) are now in place — this is
  the one remaining step, and it requires a human browser login through
  Access, so the site owner needs to click through it directly, with
  lead/R2/D1 state checked before and after.

See `review-worker/src/index.js`, `review-worker/wrangler.toml`, and
`review-worker/migrations/0001_init.sql`.

## Tools (all in the Resources accordion, all locally verified functional this session)

- Risk Calculator (`js/zone0-tools.js`) — open by default, functional, produces a result on submit.
- Zone 0 Compliance Checklist — collapsed by default, functional, `localStorage`-backed persistence confirmed.
- 5-Step Inspection Checklist — collapsed by default, condensed list format, all 5 steps present.
- FAQ & Official Resources — collapsed by default, nested FAQ items open independently, official AB 3074 link correct.
- Ordinance Lookup (`js/ordinance-lookup.js`) — file preserved on disk and still deployed (200), but intentionally not referenced from `index.html` per the locked decision to drop the jurisdiction-lookup feature from the homepage.

## Documentation

- `docs/decisions.md` and `docs/DECISION-REGISTER.md` both carry the 2026-08-19 "LOCKED: One-page homepage architecture" entry, appended (not rewritten) after the 2026-08-05 multi-page entry — history preserved, current decision recorded.
- `PROJECT-TRUTH.md`'s one-page architecture claim is now consistent with both the locked decision record and the verified deployed reality (this was not true as of the 2026-08-11 version of that file, prior to the 2026-08-19 reconciliation pass).
- This file (`docs/PROJECT-STATE.md`) supersedes its own 2026-08-18 snapshot, which described the pre-rebuild multi-page state as current — that snapshot is now historical, not current.
- This 2026-08-21 sync adds the Footer Navigation, Photo Check Copy Simplification, Logo / Brand, and Photo Check Review Portal sections, and refreshes the Repository section's HEAD/commit references, none of which were reflected in this file's prior version.
