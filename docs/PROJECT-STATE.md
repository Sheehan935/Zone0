# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md` and `docs/decisions.md`. For supporting audit evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-20 (Photo Check backend deployed to Cloudflare and verified end-to-end)

---

## Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD at the time this snapshot was written: `0c20881` ("feat(photo-check): replace Tally with custom Cloudflare Worker"). The commit carrying this update is the next one after that.
- That commit wires `js/photo-check-form.js` to the deployed Worker URL (it previously held a placeholder constant) and synchronizes this file.
- `origin/main` is **behind** until that commit is pushed. GitHub Pages redeploys on push; the live form is not functional until then.
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

## Photo Check — REPLACED 2026-08-20, BACKEND DEPLOYED AND VERIFIED

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

Verified end-to-end 2026-08-20, 2:41 PM: real form POST returned
`200 {"ok":true}` -> photo stored in R2 -> notification email delivered with
no warning payload -> photo link in the email resolved.
Resend email ID `382d8ea7-79bf-4e7f-9b44-0c2af0e4e771`; test lead ID
`994bae31-5487-4ca4-8cd9-229f576f0ae6`.

The Origin allowlist accepts `https://zone0landscaping.com`. The bare
`workers.dev` origin is **not** allowed, so functional testing must be done
from the real site, not from a local file or a `file://` page.

### Open items

- `hello@zone0landscaping.com` still receives no mail: the root domain has no
  MX record at all (checked 2026-08-20 — DNS is at GoDaddy,
  `ns47/ns48.domaincontrol.com`; Resend's MX sits on
  `send.zone0landscaping.com` and does not affect the root). The address is
  published as a `mailto:` on `faq/index.html` and `pages/thank-you.html`, so
  anything a visitor sends there is currently bounced. Fix in progress: the
  ImprovMX DNS records were added at GoDaddy on 2026-08-20 — MX
  `mx1.improvmx.com` (10) and `mx2.improvmx.com` (20) on `@`, plus TXT
  `v=spf1 include:spf.improvmx.com ~all`, all at 1/2 hour TTL. Still
  outstanding: create the free ImprovMX account, add the domain, and point the
  `hello` alias at the owner's Gmail; forwarding does not work until that is
  done. Lead notifications no longer depend on any of this (see the To address
  above).
- Frontend endpoint change is committed but **not yet pushed**; the live site
  still serves the placeholder constant until `git push` and the GitHub Pages
  rebuild complete.
- 5 test objects remain in the R2 bucket (4 x 287 B early tests, 1 x 5.8 KB
  verification photo from the 2:41 PM run) and should be deleted.

See `worker/README.md` for the backend implementation and `docs/decisions.md`'s
2026-08-20 entry for the full decision record.

Redirect to `pages/thank-you.html` is now handled entirely by
`js/photo-check-form.js` (client-side, on a successful Worker response), not
by an external dashboard setting — this removes the "not independently
verifiable" caveat that applied to the old Tally-configured redirect.

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
