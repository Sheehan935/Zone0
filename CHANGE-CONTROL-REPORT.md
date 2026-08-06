# CHANGE CONTROL REPORT — zone0landscaping.com

*Generated 2026-08-05. Read-only analysis — no files, branches, or worktrees were modified, merged, deleted, or reset.*

## 1. Three-state comparison

| State | Commit | Notes |
|---|---|---|
| **LIVE** (`origin/main`) | `3cbbe0e` — "docs: add v1.4 changelog entry" | What visitors currently see |
| **LOCAL main** | `3a32651` — "fix: repoint hero/OG image after reorganizing photo library" | 2 commits ahead of live, **not pushed** |
| **WORKING TREE** | uncommitted | 2 modified files on top of local main |

Local main is **strictly ahead** of live — no divergence, no conflicts. `git log HEAD..origin/main` returns nothing, so a `git push` would be a fast-forward.

### Commits not yet live

| Commit | File(s) | What changed | Evidence of why | Affects | Safe to keep | Live? |
|---|---|---|---|---|---|---|
| `c1f5059` docs: remove Codex from README editing workflow | `README.md` | Removed "or Codex" from the editing-workflow step, leaving "Edit in VS Code." | Commit body: "Only Claude Code and VS Code are used on this repo." | Docs only | Yes | No |
| `3a32651` fix: repoint hero/OG image after reorganizing photo library | `index.html`, 11 asset renames | Renames images into `assets/images/Houses/`, `assets/images/Materials/`, `assets/Infographics/`, `assets/logos/`; updates `index.html`'s `og:image` and hero `<img src>` to match | Commit body states the old flat paths were 404ing after a prior reorg. Verified: both new target files exist on disk. | Content, SEO (og:image), routing (broken image → fixed) | Yes — fixes a real production bug | No (this is why it's currently broken live if origin's index.html still points at old paths) |

**Note:** since these are unpushed, the **live site currently has broken hero/OG image links** — `3a32651` is the fix, sitting locally, not yet deployed.

## 2. Uncommitted working-tree changes

### `index.html`

```diff
+        .skip-link { position: absolute; left: -999px; top: auto; width: 1px; height: 1px; overflow: hidden; }
+        .skip-link:focus { position: static; left: auto; width: auto; height: auto; overflow: visible; background: #ffffff; color: #1a1a1a; padding: 0.5rem 1rem; border-radius: 6px; box-shadow: 0 6px 18px rgba(15,23,42,0.12); z-index: 1000; }
```

**What it does:** Adds CSS for a visually-hidden-until-focused "skip to content" link — a standard WCAG 2.4.1 accessibility pattern.

**Problem found:** This is CSS only. Checking the rest of `index.html`:
- There is **no `<a class="skip-link">` element anywhere in `<body>`** — the class is never applied to any tag.
- `<main>` exists at line 254 but **has no `id`**, so even a skip link with `href="#main"` would have nothing to jump to.

This change is **incomplete/orphaned** — dead CSS with no functional counterpart. It won't break anything, but it doesn't do anything either.

**Affects:** Accessibility (intended), currently inert.

### `design/index.html`

```diff
-      <a href="/design/system/" class="p-6 ...">
+      <a href="system/index.html" class="p-6 ...">
-      <a href="/design/gallery/" class="p-6 ...">
+      <a href="gallery/index.html" class="p-6 ...">
```

**What it does:** Converts two links from site-root-absolute paths to page-relative paths with explicit `index.html`.

**Problem found:** Every other internal link in this repo (`index.html`, `design/gallery/index.html`, `design/system/index.html`) uses absolute root paths (`/zone-0/`, `/design/`, `/faq/`, etc.), including the **children's own back-links**, which still point to `/design/` (absolute). This change makes `design/index.html` inconsistent with the pattern its own linked pages use to link back. Per `README.md`, this is a GitHub Pages root-published static site — both styles resolve correctly at the live domain, so it isn't a functional break, but it's a convention regression, and mixing styles increases the chance of a future case-sensitivity or path-depth bug (README explicitly warns about GitHub Pages' case-sensitive filesystem).

**Affects:** Design docs routing/navigation only (internal `/design/` hub, not customer-facing). No content, no SEO, no deployment impact.

## 3. Stale agent worktrees vs. current main

| Worktree/branch | Tip commit | Relationship to main |
|---|---|---|
| `agents/detailed-folder-structure-view` | `54ae50e` — "feat(hero): add before/after image comparison" (2026-07-30) | **Fully-merged ancestor of main** — confirmed with `git merge-base --is-ancestor`. It's commit 105 of 156 in main's own history. |
| `agents/website-review-suggest-changes` | `54ae50e` (same commit) | Identical to the above — `git diff` between the two branches is empty. |

`git log main..<branch>` returns nothing for both — neither branch has a single commit that isn't already in main. The large diffs seen comparing `main` against them (README, docs/, archive/, css/styles.css, faq/, materials/, zone-0/, design/system, etc.) are not new work — they're main's *later* history (51 commits of restructuring since 2026-07-30) shown in reverse, i.e. "what main removed/renamed since this old checkpoint." These are stale snapshots left over from a prior agent run, superseded in every respect.

## 4. Recommendations

| # | Item | Recommendation | Reason |
|---|---|---|---|
| 1 | `c1f5059` (README Codex removal, local/unpushed) | **A. KEEP** | Trivial, accurate doc fix, no risk |
| 2 | `3a32651` (hero/OG image path fix, local/unpushed) | **A. KEEP** — and push soon | Fixes a real broken-image bug that's currently live on production |
| 3 | Uncommitted `index.html` (skip-link CSS) | **C. INVESTIGATE FURTHER** | Incomplete — needs an actual `<a class="skip-link" href="#main">` element plus `id="main"` on the `<main>` tag before it does anything. Finish it or drop it; don't leave dead CSS. |
| 4 | Uncommitted `design/index.html` (relative link paths) | **C. INVESTIGATE FURTHER** | Works on GitHub Pages but breaks the sitewide absolute-path convention and is now inconsistent with its own children's back-links. Confirm intent before committing — otherwise revert to `/design/system/` and `/design/gallery/` to match the rest of the codebase. |
| 5 | `agents/detailed-folder-structure-view` worktree | **B. DISCARD** | Fully merged into main, zero unique commits, superseded by 51 later commits |
| 6 | `agents/website-review-suggest-changes` worktree | **B. DISCARD** | Identical duplicate of #5, same status |

**Bottom line on "what should become authoritative":** local `main` (`3a32651`) plus a completed/fixed version of the skip-link work, pushed to `origin/main`, is the right target — the two unpushed commits are safe wins sitting on top of a currently-broken live site. The two working-tree edits need a decision (finish vs. revert) before they're folded in; nothing in the stale worktrees is worth pulling forward.
