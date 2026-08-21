# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md` and `docs/decisions.md`. For supporting audit evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-20 (Photo Check fully live: real homeowner-path submission through the production site confirmed delivered)

---

## Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD: `379a221` ("Record ImprovMX DNS records added at GoDaddy for hello@ forwarding").
- `main` and `origin/main` confirmed synchronized at this HEAD (`git fetch` + compare).
- Working tree clean.
- Deployment: GitHub Pages, custom domain `zone0landscaping.com`, HTTPS certificate approved.

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

**Locked one-page homepage is now live in production**, not just a target: `index.html` (10 sections: Header, Hero, Lean/Green/Clean, Landscaping/Hardscaping/Design, Visual Proof, Understand the Zones, Resources, How We Help, Free Photo Check, Footer) + `pages/thank-you.html`.

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
  From     leads@zone0landscaping.com
  To       sheehan935@gmail.com  (was hello@zone0landscaping.com; changed
           2026-08-20 so lead delivery does not depend on forwarding)
  Reply-To the homeowner's own address, set per-lead by the Worker

**Final verification — real homeowner-path submission, not a synthetic test:**
the site owner submitted the live production form at `zone0landscaping.com`
through an actual browser. Result: notification email received at
`sheehan935@gmail.com`, from `leads@zone0landscaping.com`, subject "New Photo
Check lead — Brian Sheehan (Kensington)", containing the submitted
name/email/phone/city/notes and a working photo link
(`/photo/ba752818-.../d3804fa2-....png`). This is the strongest possible
confirmation short of a real customer lead — the entire path (form → Worker →
R2 → Resend → inbox) is confirmed working for a real user on the real site,
not just via `curl` against the Worker directly.

Earlier same-day `curl`-driven tests against the Worker directly also confirm
each stage in isolation: CORS/origin allowlisting, honeypot/timing spam
checks, R2 storage, and — after the `NOTIFY_EMAIL` fix and Resend domain
verification were both completed — clean `{"ok":true}` responses with no
email-failure warning.

The Origin allowlist accepts `https://zone0landscaping.com`. The bare
`workers.dev` origin is **not** allowed, so functional testing must be done
from the real site, not from a local file or a `file://` page.

### Open items

- 6 test/verification objects remain in the R2 bucket (5 synthetic `curl`
  tests plus the 1 real browser-submitted verification above) and should be
  deleted once the owner is done reviewing them.

See `worker/README.md` for the backend implementation and `docs/decisions.md`'s
2026-08-20 entry for the full decision record.

## Email Architecture — DECIDED 2026-08-20, PARTIALLY IMPLEMENTED

**Public-facing:**
- `hello@zone0landscaping.com` — general contact. Appears in the homepage
  footer (`index.html`, added 2026-08-20), `faq/index.html`, and
  `pages/thank-you.html` (both already correct, unchanged).
- `support@zone0landscaping.com` — decided but **not placed anywhere on the
  site**. No genuine support/help/billing context exists on any live or
  orphaned page (verified via repo-wide search 2026-08-20). Alias-only per
  explicit decision, so it works if ever given out directly, without
  inventing a support page or section that doesn't otherwise exist.
- `privacy@zone0landscaping.com` — decided but **not placed anywhere on the
  site**, for the same reason: no Privacy Policy or Terms page exists in the
  repository at all. Alias-only.

**Internal/operational:**
- `leads@zone0landscaping.com` — Photo Check's Resend `FROM_EMAIL` only
  (`worker/wrangler.toml`). Never displayed publicly. Notification
  destination is `NOTIFY_EMAIL = sheehan935@gmail.com`, unaffected by this
  decision.

**Infrastructure decision:** all three public addresses stay **free ImprovMX
aliases** forwarding to the owner's Gmail — explicitly not a paid mailbox,
to avoid an unrequested recurring cost. Root domain has no MX record today
(DNS at GoDaddy, `ns47/ns48.domaincontrol.com`); Resend's MX sits only on
`send.zone0landscaping.com` and doesn't cover the root. ImprovMX MX/TXT
records (`mx1`/`mx2.improvmx.com`, SPF) were added at GoDaddy 2026-08-20.

**Still outstanding (external, owner-only):** create the free ImprovMX
account, add `zone0landscaping.com`, and configure all three aliases
(`hello@`, `support@`, `privacy@`) to forward to Gmail. Until that's done,
mail to any of these addresses bounces. Photo Check lead notifications do
not depend on this and are unaffected.

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
