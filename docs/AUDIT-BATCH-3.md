# Zone 0 Landscaping — Audit Batch 3

**Purpose:** evidence record only. Findings, not decisions. See `docs/DECISION-REGISTER.md` for approved decisions.

**Audit scope:** Photo Check implementation, page architecture, repository/production state, Risk Calculator, Ordinance Lookup, Compliance Checklist, and reconciliation of Git history against `docs/decisions.md` and `PROJECT-TRUTH.md`.

**Date:** 2026-08-18

**Method:** independent inspection of the working tree, `git log`/`git show`/`git merge-base` against actual commit hashes, and one live production fetch (`https://zone0landscaping.com/`). No claims taken from documentation without code-level or Git-history verification.

---

## Status Update — 2026-08-18

- `docs/DECISION-REGISTER.md` is now byte-identical to `docs/decisions.md` (confirmed via `diff`, both 16,449 bytes) — it no longer contains the structured `APPROVED`/`UNDECIDED` decision entries this audit originally cited. `docs/decisions.md` itself is unchanged.
- `js/modal.js` changed: the click-listener that previously intercepted `href="#photo-check"` / "free photo check" text to open the custom modal has been removed and replaced with a comment (`// Photo Check uses the live Tally embed; do not intercept #photo-check links.`) — **VERIFIED** via full file read. All of the FINDINGS/questionMarkup/reportMarkup/initModal code that builds the `#photo-modal` DOM node is still present and still runs on page load, but nothing in the file ever calls `modal.classList.remove('hidden')` anymore — **VERIFIED** (`grep` for `classList.remove`/`.add` in the file): the modal is now built but permanently unreachable. Dead code, not a decision reversal — see below for what replaced it.
- `index.html` changed: a new `<section id="photo-check" class="form-section">` was added, containing a real Tally iframe (`data-tally-src="https://tally.so/embed/81VgKP?..."`), matching the archived implementation's form ID — **VERIFIED**. Placement: after the closing `</script>` tag of the main inline script block, i.e. after `</footer>`, not integrated into `<main>`'s section flow — **VERIFIED** by line position (1040, vs. `</main>` at 949 and the footer/script block before it).
- **Gap found:** the Tally widget loader script (`<script src="https://tally.so/widgets/embed.js">`) is **not** present anywhere in `index.html` — **VERIFIED** (`grep`, zero matches). The archived implementation (`archive/index-current-backup.html`) includes this script; without it, `data-tally-src` never gets read and the iframe never receives a `src` attribute, so the form will not render for visitors as currently wired. This is a functional gap, not a judgment call.
- **Gap found:** the new `#photo-check` section exists only on `index.html` — **VERIFIED**, zero matches on `zone-0/index.html`, `materials/index.html`, `faq/index.html`. Those three pages still have "Free Photo Check" CTAs pointing at `#photo-check`/`open-photo-modal`, but (a) `js/modal.js` no longer intercepts them, and (b) they have no local element with `id="photo-check"` to scroll to. Result: on those three pages, the Free Photo Check CTA currently does nothing.
- `.form-section` (the new section's class) has no matching rule anywhere in `css/styles.css` — **VERIFIED** (`grep`, zero matches). Its child `.form-container`/`.tally-embed`/`.form-reassurance` classes are pre-existing and styled.
- Working tree otherwise unchanged from the prior audit pass in scope: same set of files carrying uncommitted modifications, same untracked docs. No new commits since `87ad910` — HEAD unchanged.

**Follow-up, same day:** the two gaps noted immediately above are now resolved in the working tree:
- `<script async src="https://tally.so/widgets/embed.js"></script>` is now present in `index.html` (line 1054) — **VERIFIED**. The Tally iframe should now function.
- `zone-0/index.html`, `materials/index.html`, `faq/index.html` — both the header CTA and sidebar CTA on all three now use `href="/#photo-check"` (were `#photo-check` / `#`) — **VERIFIED**, 6 links across 3 files. These now correctly route back to `index.html`'s Tally section.
- `js/modal.js` has been deleted entirely — **VERIFIED** (`git status` shows `D js/modal.js`; file absent from disk). No page references it anymore — **VERIFIED**, zero matches for `modal.js` across all 4 pages. No dangling script tags.
- Net effect: the Photo Check migration from custom modal to Tally embed now appears complete and internally consistent across all 4 pages, in the current uncommitted working tree. None of this is committed yet.

---

## Repository State

- Repository: `github.com/Sheehan935/Zone0` — **VERIFIED**
- Branch: `main` — **VERIFIED**
- HEAD commit: `87ad910e0e7aa0e4ea24c08536ce905ec46d05a4` — **VERIFIED**
- `main` and `origin/main` pointed to the identical commit at audit time — **VERIFIED**
- Working tree contained uncommitted modifications to `TODO.md`, `css/styles.css`, `docs/00-project-dashboard.md`, `faq/index.html`, `index.html`, `js/main.js`, `js/modal.js`, `materials/index.html`, `zone-0/index.html`, plus untracked `PROJECT-TRUTH.md` and `docs/AUDIT-BATCH-3.md` — **VERIFIED**, not modified by this audit.

## Production State

- Live fetch of `https://zone0landscaping.com/` returned the current multi-page nav (`/zone-0/`, `/design/`, `/materials/`, `/faq/`, `#photo-check`) and the exact hero copy present in the current `main`-branch `index.html` ("Mastering the 0–5 Foot Wildfire Ignition Zone") — **VERIFIED**: production corresponds to current `main`.
- No Tally form/iframe detected in the fetched page content — **VERIFIED**, consistent with code-level findings below.
- GitHub repository Settings → Pages source configuration (branch/folder/Actions) cannot be confirmed from a local checkout — **UNVERIFIED**, stated explicitly.
- `.github/workflows` does not exist; `_config.yml` (Jekyll-style Pages config) excludes `docs/`, `archive/`, and three root `.md` files from the build, consistent with README's "publish source: root of `main`" — **VERIFIED**.

## Git History Evidence

- `4d96288`, `ea94cdb`, `118f1b6`, `45a3ecc` (cited in `docs/decisions.md`) all exist, dates and subjects match exactly as cited, form a linear parent chain, and are all ancestors of HEAD `87ad910` — **VERIFIED**.
- `4d96288` (2026-08-03) is the substantive commit: archived the old build to `archive/index-current-backup.html`, restructured `index.html`, created `zone-0/index.html` with real content. `ea94cdb`, `118f1b6`, `45a3ecc` each created their respective page (`materials/index.html`, `design/index.html`, `faq/index.html`) as empty 0-byte stubs — real content for those three landed in later, uncited commits — **VERIFIED**.
- `9418528` ("docs: reconcile project brief with single-page V1 decision," 2026-07-30 17:58:46) — a single-page decision existed briefly — **VERIFIED / HISTORICAL**.
- `b725c1a` ("feat: add services page, reversing single-page V1 decision," 2026-07-30 18:40:09, ~42 min after `9418528`) — explicitly reverses it — **VERIFIED**.
- `73af738` ("docs: reconcile decisions.md and dashboard with live multi-page site," 2026-08-05 21:13:23) — reconciles the decision log with the live multi-page site — **VERIFIED**.
- All 16 commits between `73af738` and HEAD `87ad910` continue multi-page development (ordinance lookup, risk calculator, hero redesigns, housekeeping). Full-history grep (`--all`, case-insensitive) for single-page/revert/retire language after `73af738` returns zero architecture-relevant matches (two unrelated hits concern a logo wordmark revert, not page architecture) — **VERIFIED**: no committed single-page reversal exists after 2026-08-05.
- `PROJECT-TRUTH.md` has zero commits in `git log --all -- PROJECT-TRUTH.md` — **VERIFIED**: it has never been committed.

## Architecture Findings

- Current repository and production are multi-page — **VERIFIED**.
- Supporting routes confirmed present as files: `index.html`, `zone-0/index.html`, `materials/index.html`, `faq/index.html`, `design/index.html`, `design/gallery/index.html`, `design/privacy-without-fuel/index.html`, `pages/thank-you.html` — **VERIFIED**.
- `pages/services.html` does not currently exist, despite being described as "built" in the pre-audit `docs/00-project-dashboard.md` — **CONTRADICTED**. (`archive/services.html` and `archive/legacy_builds/src-multipage-attempt/services.html` exist as archived history — **VERIFIED**, not live.)
- Multi-page architecture was intentionally implemented and is supported by Git history — **VERIFIED** (see Git History Evidence above).
- No later committed single-page reversal exists — **VERIFIED**.

## Photo Check Findings

**Superseded by the 2026-08-18 status update above — restated here as of the current working tree:**

- `js/modal.js` is loaded by `index.html`, `zone-0/index.html`, `materials/index.html`, `faq/index.html` — **VERIFIED**, still true.
- The custom modal (`#photo-modal`) is built on page load but is no longer reachable by any code path — **VERIFIED** (no remaining call to open it; see status update).
- `index.html` now contains a Tally iframe embed (`data-tally-src`, form ID `81VgKP`) inside a new `#photo-check` section — **VERIFIED** — but it will not render for visitors because the required Tally widget loader script is absent — **VERIFIED**, see status update.
- `zone-0/index.html`, `materials/index.html`, `faq/index.html` have neither the custom modal trigger (removed) nor a local Tally embed — their Free Photo Check CTAs currently do nothing — **VERIFIED**.
- The custom form/modal code, while now unreachable, still does not submit data to a backend — **VERIFIED** (no `fetch`/`FormData`/`XHR`/form `action` in `js/modal.js`).
- Only one Photo Check *implementation* exists in the working tree at the code level (the now-dead custom modal); the Tally embed is present as markup on `index.html` only, and is not yet functional — **VERIFIED**. Whichever of these is meant to be the actual, working Photo Check flow going forward is not addressed by this audit — it's evidence, not a decision (see `docs/decisions.md` for the actual decision record).

## Tally Findings

See Photo Check Findings above. Additionally: Tally form ID `81VgKP` and redirect target `pages/thank-you.html` are documented consistently across `README.md`, `docs/03-business-plan-structure.md`, `docs/00-project-dashboard.md`, and `docs/02-content-plan.md` — **VERIFIED** as documentation consistency, not as evidence Tally is currently live (it is not — see above).

## Risk Calculator Findings

- `js/zone0-tools.js` implements a 5-question yes/no ember-catch-point quiz producing a score/tier output — **VERIFIED**.
- "AB 3074" terminology appears exactly once, in a disclaimer sentence ("not a substitute for... official AB 3074 compliance verification") — **VERIFIED**. The 5 questions are generic ember-hazard indicators, not tied to specific AB 3074 statutory criteria — **VERIFIED**; the site's own footer separately states AB 3074 regulations "are still being finalized by the Board of Forestry and Fire Protection."

## Ordinance Lookup Findings

- `js/ordinance-lookup.js` (107 lines) uses a hardcoded local JS object (`JURISDICTIONS`) for 6 jurisdictions — **VERIFIED**.
- Zero `fetch`/`XMLHttpRequest` calls — **VERIFIED**. Outbound URLs present are citation links to external fire-authority sites, not API calls.
- Not modified in the current working tree relative to HEAD — **VERIFIED** (`git diff` shows no changes to this file).

## Compliance Checklist Findings

- 4 checkbox items in `index.html` (`#compliance-checklist-section`), driven by `initComplianceChecklist()` in `js/main.js` — **VERIFIED**, present only in the current uncommitted working tree (added this session, not yet on any commit).
- Persistence via `window.localStorage`, key `zone0-compliance-checklist`, wrapped in try/catch — **VERIFIED**.
- Item terminology: "Organic Mulch Removal," "Vent Mesh Retrofits," "Under-Deck Clearance," "Wooden Fence Isolation" — **VERIFIED** present as written; footer disclaimer states it is "not a substitute for an official AB 3074 compliance inspection" — **VERIFIED**.

## Documentation Conflicts

- `docs/decisions.md` (committed, 2026-08-05) describes multi-page as deliberate and verified. `PROJECT-TRUTH.md` (uncommitted, 2026-08-11) describes single-page-core as current and multi-page as retired. Git history supports `docs/decisions.md`'s account and contains no commit supporting `PROJECT-TRUTH.md`'s account — **CONTRADICTED** (`PROJECT-TRUTH.md`'s architecture claim, against Git history).
- `docs/00-project-dashboard.md` (pre-audit version) claimed `pages/services.html` "has been built and exists" — **CONTRADICTED** by current working-tree file listing.
- `PROJECT-TRUTH.md`'s "TECHNICAL ARCHITECTURE: No Tailwind" claim — **CONTRADICTED** by code evidence: `index.html`, `zone-0/index.html`, `materials/index.html`, `faq/index.html`, `design/index.html` all load `cdn.tailwindcss.com` and use Tailwind utility classes throughout, predating this session's edits.
- `PROJECT-TRUTH.md`'s "Last reported commit `b7f6ccf`" — **CONTRADICTED**: actual HEAD is `87ad910`, 7 commits ahead.

## Unverified Items

- GitHub repository Settings → Pages source configuration.
- Buttondown status — not mentioned in any document read across two audit passes (`README.md`, `docs/00`, `docs/01` not fully read, `docs/02` not fully read, `docs/03`, `docs/04`, `docs/05`).
- Analytics (Plausible/Fathom) status — same, not found in documents read.
- `docs/01-project-brief.md`, `docs/02-content-plan.md`, `docs/mobile-audit.md`, `docs/reference/ux-review.md` — referenced via grep hits, not read in full.
- Whether `PROJECT-TRUTH.md` reflects information/context outside what this repository's history contains — cannot be determined from the repository alone.

## Unresolved Items

No approved decision-register entry currently exists for any of: Tally disposition, custom Photo Check tool disposition, deleting `js/modal.js`, consolidating pages, Risk Calculator methodology, Ordinance Lookup disposition, Compliance Checklist terminology (see Status Update above — `docs/DECISION-REGISTER.md` no longer holds a structured record). These remain explicitly not decided by this audit either way.

## Historical

- `9418528` single-page decision (2026-07-30) — superseded same day by `b725c1a`. See `docs/decisions.md`.
