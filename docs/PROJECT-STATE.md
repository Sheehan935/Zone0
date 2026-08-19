# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md`. For supporting evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-18

**Note on architecture:** the "Multi-page static HTML/CSS/JS" architecture described below reflects what is physically on disk as of the snapshot date — it has not changed since. As of 2026-08-19, the *target* architecture is locked to a one-page homepage (see `PROJECT-TRUTH.md` and `docs/decisions.md`). Consolidation has not yet been implemented; this file will be updated once `index.html` is rebuilt.

---

## Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD: `87ad910e0e7aa0e4ea24c08536ce905ec46d05a4`
- `main` and `origin/main` were synchronized (identical commit) at audit time
- Deployment: GitHub Pages
- Production domain: `zone0landscaping.com`

## Architecture

Multi-page static HTML/CSS/JS. Pages present in the current working tree:

- `index.html`
- `zone-0/index.html`
- `materials/index.html`
- `faq/index.html`
- `design/index.html`, `design/gallery/index.html`, `design/privacy-without-fuel/index.html`
- `pages/thank-you.html`

`pages/services.html` is **not** currently present (though referenced in some pre-audit documentation as built, and archived copies exist at `archive/services.html` and `archive/legacy_builds/src-multipage-attempt/services.html`).

## Photo Check

**As of 2026-08-18, latest** (superseding the original snapshot below):

- `js/modal.js` has been deleted. No page references it. No dangling script tags.
- `index.html` has a `#photo-check` section with a Tally iframe (form ID `81VgKP`) plus the Tally widget loader script (`tally.so/widgets/embed.js`, line 1054) — appears functional.
- `zone-0/index.html`, `materials/index.html`, `faq/index.html` — header and sidebar "Free Photo Check" CTAs (6 links total) all point to `/#photo-check`, correctly routing to the homepage's Tally section.
- Net: the migration from custom modal to Tally embed appears complete and consistent across all 4 pages, in the current uncommitted working tree. Nothing here is committed yet. See `docs/AUDIT-BATCH-3.md` for the fuller before/after detail.

**Original snapshot (pre-2026-08-18), for reference:**

- Implementation: custom `js/modal.js`, reachable from every page's "Free Photo Check" CTAs and `#photo-check` anchors.
- Behavior: client-side only; no demonstrated submission backend (no `fetch`/`FormData`/`XHR`/form `action`).
- Tally: not present in production or in any live-served file at that time. An archived Tally iframe implementation exists at `archive/index-current-backup.html`, form ID `81VgKP`, but `archive/` is excluded from the GitHub Pages build via `_config.yml`.

## Tools

- Risk Calculator (`js/zone0-tools.js`) — present, 5-question ember-hazard quiz.
- Ordinance Lookup (`js/ordinance-lookup.js`) — present, local hardcoded jurisdiction data, no external API calls.
- Compliance Checklist — present in the current uncommitted working tree (`index.html` + `js/main.js`), uses `window.localStorage` for persistence.

## Working Tree

Implementation files currently contain uncommitted modifications relative to HEAD `87ad910`: `TODO.md`, `css/styles.css`, `docs/00-project-dashboard.md`, `faq/index.html`, `index.html`, `js/main.js`, `js/modal.js`, `materials/index.html`, `zone-0/index.html`. These are recorded here as state, not altered by this document or by producing it.

## Documentation

- `docs/decisions.md` exists (committed, lowercase filename) and contains historical decision evidence, including the 2026-08-05 reconciliation of the decision log with the live multi-page site.
- `docs/DECISION-REGISTER.md` exists in the working tree, uncommitted, and is currently byte-identical to `docs/decisions.md` — it does not currently hold a distinct structured decision record for the architecture or Photo Check questions.
- `PROJECT-TRUTH.md` exists in the working tree but has never been committed (zero entries in `git log --all -- PROJECT-TRUTH.md`).
- `PROJECT-TRUTH.md`'s single-page-architecture claim conflicts with verified repository and production state (see `docs/AUDIT-BATCH-3.md`, "Documentation Conflicts").
- `PROJECT-TRUTH.md` is not treated as authoritative by this document.
