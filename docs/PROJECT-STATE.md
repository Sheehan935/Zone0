# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md` and `docs/decisions.md`. For supporting audit evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-19 (production verification pass)

---

## Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD: `5ff1975109fcfa90b5d297c938e6978c4be3999f` ("Complete Zone 0 homepage rebuild and audit")
- `main` and `origin/main` synchronized at this commit — confirmed via `git fetch`.
- Working tree: **clean** — no uncommitted changes (this session's entire rebuild, docs, and cleanup work is now committed as this single commit; pushed by `Sheehan935` directly, not through this session's own git actions).
- Deployment: GitHub Pages, custom domain `zone0landscaping.com`, HTTPS certificate approved.

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
