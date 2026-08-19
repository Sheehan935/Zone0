# Zone 0 Landscaping — Audit Output Export

**Generated:** 2026-08-18

**Purpose:** point-in-time export of the current repo/audit output — a snapshot, not a living document. The living documents are `docs/AUDIT-BATCH-3.md` (evidence record) and `docs/PROJECT-STATE.md` (current-state snapshot); this file is a saved copy of their combined content plus raw repo status, as of the timestamp above. Not a decision document — see `docs/DECISION-REGISTER.md`.

---

## Repository Status

```
$ git status --short
 M TODO.md
 M css/styles.css
 M docs/00-project-dashboard.md
 M faq/index.html
 M index.html
 M js/main.js
 D js/modal.js
 M materials/index.html
 M zone-0/index.html
?? PROJECT-TRUTH.md
?? docs/AUDIT-BATCH-3.md
?? docs/DECISION-REGISTER.md
?? docs/PROJECT-STATE.md
```

- HEAD: `87ad910e0e7aa0e4ea24c08536ce905ec46d05a4`
- origin/main: `87ad910e0e7aa0e4ea24c08536ce905ec46d05a4`
- `main` and `origin/main` synchronized at time of export.
- Nothing committed or pushed as part of producing this export.

---

## docs/PROJECT-STATE.md (full content at export time)

# Zone 0 Landscaping — Project State

**This is a factual snapshot of what exists now. It is NOT a decision document.** For approved decisions, see `docs/DECISION-REGISTER.md`. For supporting evidence, see `docs/AUDIT-BATCH-3.md`.

**Snapshot date:** 2026-08-18

### Repository

- `Sheehan935/Zone0`
- Branch: `main`
- HEAD: `87ad910e0e7aa0e4ea24c08536ce905ec46d05a4`
- `main` and `origin/main` were synchronized (identical commit) at audit time
- Deployment: GitHub Pages
- Production domain: `zone0landscaping.com`

### Architecture

Multi-page static HTML/CSS/JS. Pages present in the current working tree:

- `index.html`
- `zone-0/index.html`
- `materials/index.html`
- `faq/index.html`
- `design/index.html`, `design/gallery/index.html`, `design/privacy-without-fuel/index.html`
- `pages/thank-you.html`

`pages/services.html` is **not** currently present (though referenced in some pre-audit documentation as built, and archived copies exist at `archive/services.html` and `archive/legacy_builds/src-multipage-attempt/services.html`).

### Photo Check

**As of 2026-08-18, latest:**

- `js/modal.js` has been deleted. No page references it. No dangling script tags.
- `index.html` has a `#photo-check` section with a Tally iframe (form ID `81VgKP`) plus the Tally widget loader script (`tally.so/widgets/embed.js`, line 1054) — appears functional.
- `zone-0/index.html`, `materials/index.html`, `faq/index.html` — header and sidebar "Free Photo Check" CTAs (6 links total) all point to `/#photo-check`, correctly routing to the homepage's Tally section.
- Net: the migration from custom modal to Tally embed appears complete and consistent across all 4 pages, in the current uncommitted working tree. Nothing here is committed yet.

### Tools

- Risk Calculator (`js/zone0-tools.js`) — present, 5-question ember-hazard quiz.
- Ordinance Lookup (`js/ordinance-lookup.js`) — present, local hardcoded jurisdiction data, no external API calls.
- Compliance Checklist — present in the current uncommitted working tree (`index.html` + `js/main.js`), uses `window.localStorage` for persistence.

### Working Tree

Implementation files currently contain uncommitted modifications relative to HEAD `87ad910`: `TODO.md`, `css/styles.css`, `docs/00-project-dashboard.md`, `faq/index.html`, `index.html`, `js/main.js`, `js/modal.js` (deleted), `materials/index.html`, `zone-0/index.html`.

### Documentation

- `docs/decisions.md` exists (committed, lowercase filename) and contains historical decision evidence, including the 2026-08-05 reconciliation of the decision log with the live multi-page site.
- `docs/DECISION-REGISTER.md` exists in the working tree, uncommitted, and is currently byte-identical to `docs/decisions.md` — it does not currently hold a distinct structured decision record.
- `PROJECT-TRUTH.md` exists in the working tree but has never been committed. Its single-page-architecture claim conflicts with verified repository and production state. Not treated as authoritative.

---

## docs/AUDIT-BATCH-3.md (full content at export time)

# Zone 0 Landscaping — Audit Batch 3

**Purpose:** evidence record only. Findings, not decisions.

**Audit scope:** Photo Check implementation, page architecture, repository/production state, Risk Calculator, Ordinance Lookup, Compliance Checklist, and reconciliation of Git history against `docs/decisions.md` and `PROJECT-TRUTH.md`.

**Date:** 2026-08-18

**Method:** independent inspection of the working tree, `git log`/`git show`/`git merge-base` against actual commit hashes, and one live production fetch (`https://zone0landscaping.com/`).

### Status Update — 2026-08-18

`docs/DECISION-REGISTER.md` is byte-identical to `docs/decisions.md` (16,449 bytes each) — no structured `APPROVED`/`UNDECIDED` entries currently exist there.

Photo Check migration timeline this session: `js/modal.js`'s open-trigger was removed → a Tally `#photo-check` section was added to `index.html` only, initially missing its loader script and unreferenced by the other 3 pages → both gaps were subsequently closed (loader script added; `zone-0/`, `materials/`, `faq/` CTAs repointed to `/#photo-check`) → `js/modal.js` was deleted entirely, cleanly, with no dangling references. Net: migration from custom modal to Tally embed appears complete and consistent across all 4 pages in the current uncommitted working tree.

### Repository State

- Repository: `github.com/Sheehan935/Zone0` — VERIFIED
- Branch: `main` — VERIFIED
- HEAD: `87ad910e0e7aa0e4ea24c08536ce905ec46d05a4` — VERIFIED
- `main`/`origin/main` synchronized — VERIFIED

### Production State

- Live fetch of `https://zone0landscaping.com/` matched current `main`'s nav and hero copy — VERIFIED: production corresponds to current `main`.
- GitHub repo Settings → Pages source configuration — UNVERIFIED (not checkable from local checkout).
- `_config.yml` excludes `docs/`, `archive/`, and root `.md` files from the Pages build — VERIFIED.

### Git History Evidence

- `4d96288`, `ea94cdb`, `118f1b6`, `45a3ecc` (cited in `docs/decisions.md`) all exist, dates/subjects match, linear parent chain, all ancestors of HEAD — VERIFIED.
- `9418528` (single-page decision, 2026-07-30) — HISTORICAL, superseded same day by `b725c1a` ("reversing single-page V1 decision").
- `73af738` (2026-08-05) reconciled the decision log with the live multi-page site — VERIFIED.
- No committed single-page reversal exists anywhere after 2026-08-05 — VERIFIED (full-history grep).
- `PROJECT-TRUTH.md` has zero commits — VERIFIED, never committed.

### Architecture Findings

- Current repository and production are multi-page — VERIFIED.
- `pages/services.html` does not currently exist, despite being documented as "built" — CONTRADICTED.
- Multi-page architecture was intentional and is supported by Git history, with no later reversal — VERIFIED.

### Photo Check / Tally Findings

- Migration from custom modal to Tally embed is now complete and consistent across all 4 pages (see Status Update) — VERIFIED.
- `js/modal.js` deleted; no dangling references anywhere — VERIFIED.
- Tally form ID `81VgKP`, redirect target `pages/thank-you.html` — documented consistently across `README.md` and `docs/0X-*.md` files — VERIFIED as documentation, consistent with the now-live embed.

### Risk Calculator Findings

- 5-question ember-hazard quiz in `js/zone0-tools.js` — VERIFIED.
- "AB 3074" appears once, in a disclaimer, not as a scoring criterion — VERIFIED.

### Ordinance Lookup Findings

- Local hardcoded `JURISDICTIONS` object in `js/ordinance-lookup.js`, 6 jurisdictions, zero API calls — VERIFIED.
- Not modified this session — VERIFIED.

### Compliance Checklist Findings

- 4 items in `index.html` + `js/main.js`, `localStorage`-backed — VERIFIED, uncommitted.

### Documentation Conflicts

- `docs/decisions.md` (committed) vs. `PROJECT-TRUTH.md` (uncommitted) disagree on architecture; Git history supports `docs/decisions.md` — CONTRADICTED (`PROJECT-TRUTH.md`).
- `PROJECT-TRUTH.md`'s "No Tailwind" claim — CONTRADICTED by code (Tailwind CDN used on all 4 pages, predates this session).
- `PROJECT-TRUTH.md`'s "Last reported commit `b7f6ccf`" — CONTRADICTED, actual HEAD is `87ad910`, 7 commits ahead.

### Unverified Items

- GitHub Pages source configuration.
- Buttondown status, Analytics status — not found in any document read.
- `docs/01-project-brief.md`, `docs/02-content-plan.md`, `docs/mobile-audit.md`, `docs/reference/ux-review.md` — not read in full.

### Unresolved Items

No approved decision-register entry exists for: Tally-vs-custom-modal disposition (now moot at the code level, since the migration is complete, but never formally recorded as a decision), consolidating pages, Risk Calculator methodology, Ordinance Lookup disposition, Compliance Checklist terminology.

### Historical

- `9418528` single-page decision (2026-07-30) — superseded same day by `b725c1a`. See `docs/decisions.md`.

---

**End of export.**
