# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md` and `docs/decisions.md`. For supporting audit evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-20 (visual pass complete and deployed)

---

## Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD: `40227b5c32263398099c38cb256f579ec2cb4af5` ("fix(ui): unify CTA shape, fix H2 and grid bugs")
- `main` and `origin/main` synchronized at this commit — confirmed via `git fetch`.
- Working tree: **clean**.
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

## Photo Check

Custom `js/modal.js` implementation is fully retired (deleted, deployed 404). Tally embed is live in production and confirmed functional in this session's local testing (real form fields render, iframe receives a live `src`). Redirect to `pages/thank-you.html` is a Tally-dashboard setting (per `docs/decisions.md`, configured 2026-07-30), not independently re-verifiable from this side, but `pages/thank-you.html` itself is deployed and serving 200.

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
