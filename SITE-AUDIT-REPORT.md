# Zone 0 Landscaping — Site Audit Report

**Date:** 2026-08-05
**Baseline commit:** `b9bbcd3` (local `main` = `origin/main`)
**Scope:** Structural audit only. No files changed.

---

## Headline findings

1. **No broken links on the live site.** Every dead path (`/about/`, `/contact/`, `/services/`, `/local/*`, the `/zone-0/` and `/materials/` sub-pages) exists **only** in `docs/_template.html`, which is a planning template and is not published. The four live pages link cleanly to each other.
2. **`css/styles.css` is not used by the live site.** 840 lines, tracked in git, referenced only by `pages/thank-you.html` and `docs/_template.html`. The live pages use the Tailwind CDN plus inline `<style>` blocks.
3. **`js/main.js` is orphaned.** 93 lines, tracked in git, referenced only by files inside `archive/`.
4. **The logo fix only landed on the homepage.** `index.html` uses the wordmark image. `faq/`, `materials/`, and `zone-0/` still render the old text wordmark. The header is now inconsistent across the site.
5. **12 of 14 asset files are unused** — roughly 30 MB of the repo's 33 MB.
6. **All five side branches are fully merged.** Nothing is competing with `main`.

---

## The live site

```text
index.html          ──> /design/  /faq/  /materials/  /zone-0/
faq/index.html      ──> same nav
materials/index.html──> same nav
zone-0/index.html   ──> same nav
design/index.html   ──> /design/gallery/  /design/system/

Shared: /js/modal.js  (the only JS actually loaded)
Styling: Tailwind CDN + inline <style> + Google Fonts + Font Awesome CDN
```

### Orphans inside the live tree

| File | Status |
|---|---|
| `design/privacy-without-fuel/index.html` | Exists, links back to `/design/`, but `design/index.html` never links **to** it. Unreachable by navigation. |
| `pages/thank-you.html` | Not linked from anywhere. Looks like a leftover form-submission page. |
| `css/styles.css` | Only used by `thank-you.html`. Dead weight for the live site. |
| `js/main.js` | Only used by archived files. |
| `services/` | Empty directory. |
| `local/` | Empty except `.DS_Store`; already gitignored. |

---

## Asset audit

**Used (3):**

- `assets/logos/zone0-wordmark.png` — header, `index.html` only
- `assets/images/Houses/Hill House.jpg` — hero
- `assets/images/Houses/Berkeley House.jpg` — `og:image` meta tag

**Unused (11):**

```text
assets/logos/logo1.png
assets/logos/logo2.png
assets/logos/logo3.png
assets/logos/logo4.png
assets/logos/House vector.png
assets/images/Houses/House Before.jpg
assets/images/Houses/House After.jpg
assets/images/Materials/DG.jpg
assets/images/Materials/DG2.jpg
assets/Infographics/Firewise_Landscaping_with_California_Natives.png
assets/Infographics/zone-defensible-space-diagram.png
```

Sizes: `images/` 19 MB · `logos/` 7.8 MB · `Infographics/` 6.5 MB.

**Content note:** `index.html` pulls **8 photographs from Unsplash** while real project photos (`House Before.jpg`, `House After.jpg`, the DG material shots) sit unused in the repo. That is a content decision, not a bug.

---

## Classification

### KEEP

```text
index.html
faq/index.html
materials/index.html
zone-0/index.html
design/index.html
design/gallery/index.html
design/system/index.html
js/modal.js
assets/logos/zone0-wordmark.png
assets/images/Houses/Hill House.jpg
assets/images/Houses/Berkeley House.jpg
CNAME
.gitignore
README.md  CHANGELOG.md  TODO.md
docs/
archive/
.claude/settings.local.json
```

### DECIDE

```text
design/privacy-without-fuel/index.html   → link it from design/index.html, or archive it
pages/thank-you.html                     → is there a form that needs it?
css/styles.css                           → only thank-you.html needs it; keep or fold in
assets/images/Houses/House Before.jpg    → use as real before/after, or archive
assets/images/Houses/House After.jpg     → same
assets/images/Materials/DG*.jpg          → use on /materials/, or archive
assets/Infographics/*.png                → strong content for /zone-0/; currently invisible
docs/_template.html                      → aspirational sitemap, ~11 pages that don't exist
```

### ARCHIVE

```text
js/main.js               → belongs with the archived HTML that uses it
assets/logos/logo1-4.png → superseded by zone0-wordmark.png
assets/logos/House vector.png
```

### REMOVE

```text
services/                → empty directory
local/                   → empty, already gitignored
.DS_Store (all)          → gitignored but still on disk
.gitignore               → duplicate `local/` line (cosmetic)
```

### MOVE

```text
CHANGE-CONTROL-REPORT.md     → docs/  (audit output, not a site file)
HERO-IMAGE-VERIFICATION.md   → docs/
SITE-AUDIT-REPORT.md         → docs/  (this file)
```

---

## Recommended actions, one at a time

**Software: VS Code for edits, Terminal for git.**

### ACTION 1 — Fix the header on the three inner pages

Highest value, most visible. In `faq/index.html`, `materials/index.html`, `zone-0/index.html`, replace the text wordmark at line 42–43 with the same `<img>` block `index.html` uses at line 224 (adjust the path to `/assets/logos/zone0-wordmark.png`).

### ACTION 2 — Decide on `design/privacy-without-fuel/`

It's a finished page nobody can reach. Either add a link on `design/index.html` or move it to `archive/`.

### ACTION 3 — Decide on the infographics

Two Cal Fire / firewise diagrams are sitting unused. `/zone-0/` is the natural home. This is the biggest content win available.

### ACTION 4 — Replace Unsplash photos with real project photos

Stock imagery on a local landscaping site undercuts credibility. `House Before.jpg` / `House After.jpg` are the obvious first swap.

### ACTION 5 — Housekeeping

Remove `services/` and `local/`, clear `.DS_Store` files, dedupe `.gitignore`, move the three report files into `docs/`.

### ACTION 6 — Delete the merged branches

All five are 0 commits ahead of `main`. Deleting them removes ambiguity about which version is authoritative.

---

## Production note (not part of this audit's scope)

`index.html` loads `https://cdn.tailwindcss.com`. That is Tailwind's **play CDN**, which Tailwind explicitly labels as development-only — it compiles CSS in the browser on every page load. It works, but it costs page speed and depends on a third party staying up. Worth revisiting later; not urgent.
