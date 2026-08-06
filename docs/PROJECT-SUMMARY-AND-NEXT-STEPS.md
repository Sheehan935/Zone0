# Zone 0 Landscaping — Project Summary & Next Steps

**Last updated:** 2026-08-05
**Covers:** the structural audit and cleanup session starting from baseline commit `b9bbcd3`.

---

## What this project was

A structural audit of the local site folder, prompted by the same problem noted elsewhere in this repo: multiple AI tools editing the site over time with no single source of truth for what's current, what's dead, and what's safe to remove. The goal was to map the project, find what's actually broken or unused, and fix issues one at a time with your sign-off — not a mass reorganization.

Full findings are in `docs/reference/` and `SITE-AUDIT-REPORT.md` at the repo root (that report predates this file and holds the detailed asset-by-asset breakdown; this file is the current status and what's left).

---

## Completed this session

- **Header logo fixed site-wide.** `faq/`, `materials/`, and `zone-0/` were still showing the old text wordmark after the homepage logo swap. All four live pages now use `/assets/logos/zone0-wordmark.png`.
- **Asset paths made absolute.** `index.html` had two relative paths (`assets/logos/...`, `assets/images/...`); both now use absolute `/assets/...` paths, matching every other live page. Every local asset reference was verified to resolve to a real file.
- **Internal branding guide removed from the public site.** `design/system/` (an internal component/color reference, never meant for visitors) is now `docs/branding-guide/`, retitled "Zone 0 Branding Guide" and labeled internal. The card linking to it was removed from the `/design/` hub.
- **`_config.yml` added.** This tells GitHub Pages not to publish `docs/`, `archive/`, and the root project markdown files. Two things this closes: the branding guide can no longer be reached by a guessed URL, and — more importantly — `archive/` (old page backups, a prior abandoned multi-page build) was live on the public domain this whole time. It won't be after this deploys.

**Not yet committed.** All of the above is sitting as uncommitted changes in the working tree.

---

## Important finding, not yet acted on

`docs/00-project-dashboard.md` and `docs/decisions.md` are dated July 30 and describe the site as **single-page** — nav trimmed to in-page anchors, no `/zone-0/`, `/design/`, `/materials/`, `/faq/` routes. That's no longer true. The live site today is multi-page with real routes at all of those paths. Either the site direction changed again after July 30 without the docs catching up, or a separate branch/session moved it back to multi-page. Worth resolving so `decisions.md` — the file that exists specifically to prevent decisions from being silently reversed — is trustworthy again.

---

## Open decisions (yours to make, not assumed)

1. **`design/privacy-without-fuel/`** — a finished page, well-written, that nothing links to. Left untouched per your instruction. Still needs a home: linked from the `/design/` hub, or archived.
2. **Two unused Cal Fire infographics** (`assets/Infographics/*.png`) — strong content for `/zone-0/`, currently invisible to visitors.
3. **Stock photography vs. real project photos.** The homepage hero uses 8 Unsplash images while your own before/after project photos (`House Before.jpg`, `House After.jpg`) sit unused.
4. **`css/styles.css` and `js/main.js`** — both orphaned from the live site, kept alive only by `pages/thank-you.html` (styles.css) and files inside `archive/` (main.js). Decide whether `thank-you.html` still needs to exist, which determines whether `styles.css` can go too.
5. **Google Drive sync risk.** This project folder is inside a Drive-synced directory (`.tmp.drivedownload` / `.tmp.driveupload` present). A git repo under active Drive sync is a real corruption risk — `decisions.md` already documents one working-tree wipe this project suffered from an unexplained `git reset --hard`. Worth moving the repo to a non-synced folder (e.g. `~/Developer/`) and letting GitHub, not Drive, be the backup.

---

## Housekeeping still open (low-risk, mechanical)

- Empty directories: `services/`, `design/system/` (leftover after the move — git ignores it, but it's still on disk)
- `.DS_Store` files tracked in a few places despite `.gitignore`
- Duplicate `local/` line in `.gitignore`
- Five branches (`agents/*`, `sheehan935-automatic-disco`) are fully merged into `main` — safe to delete, removes ambiguity about which branch is authoritative
- Move the loose report files (`CHANGE-CONTROL-REPORT.md`, `HERO-IMAGE-VERIFICATION.md`, `SITE-AUDIT-REPORT.md`) into `docs/` for consistency, now that `docs/` is confirmed as where internal files belong

---

## Recommended next steps, in order

1. **Commit and push what's already done** (logo fix, absolute paths, branding guide move, `_config.yml`). Nothing has been saved to git yet.
2. **Reconcile `decisions.md`/`00-project-dashboard.md`** with the actual multi-page site, so the project's own decision log is accurate again.
3. **Decide the four open content questions above** (privacy-without-fuel, infographics, stock photos, thank-you page) — one at a time, as you've been doing.
4. **Address the Drive-sync risk** before it causes another working-tree wipe.
5. **Run the mechanical housekeeping** (empty dirs, `.DS_Store`, merged branches) — safe any time, no content decisions required.

**Software:** VS Code for reviewing file changes, Terminal (or ask me) for git commands.
