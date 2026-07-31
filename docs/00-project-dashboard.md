# Zone 0 Landscaping Website
## Project Dashboard

**Last Updated:** July 30, 2026

This is the only working document. Everything else in `docs/` is reference
material. Never more than 3 active tasks in **Next**.

---

# Current Goal

Ship Version 1 — a single-page site (`index.html`) — to launch.

---

# Completed

- Folder reorganization: `archive/`, `legacy/`, `pages/`, `docs/`, `css/`,
  `assets/images/` match the target structure
- `pages/thank-you.html` moved into place with corrected relative paths
- Header nav and footer trimmed to in-page anchors; dead `Materials`/`Local`
  nav items removed (later revised to `#services`/`#process`/`#gallery`/`#faq`
  — see below)
- Lead form verified working — it's a live Tally embed, not the broken
  `mailto` form an earlier review flagged
- FAQ placeholder text ("Add your initial towns here...") confirmed no
  longer present
- Link audit complete (`reference/link-audit.md`) — 15 dead body-copy links
  catalogued with recommendations
- V1 confirmed as single-page (see `decisions.md`)
- Mobile audit complete (`mobile-audit.md`) — rendered the page headlessly
  at 320/375/768/1280px rather than reading CSS alone. Finding: the "zero
  `@media` rules" concern from last session was too broad. Every section
  except the header already degrades gracefully via CSS Grid `auto-fit`.
  The real problem was narrower: the header/nav broken on phones, plus one
  contrast failure.
- **Mobile fix implemented and verified** (Critical + Important items from
  the plan). `css/styles.css`: corrected `.eyebrow` color to `#b26205`
  (4.52:1 contrast, was 3.19:1) and added one `@media` block (768px:
  header stacks into logo/nav/CTA rows instead of squeezing into one row;
  480px: trims hero padding for more image room). No HTML or JS changed.
  Re-ran the same headless audit against the fix — confirmed: no
  horizontal overflow at 320px (was 43px), header height 219px vs 233px
  and now legible/tappable, nav-CTA is a single line at 44.8px (was
  wrapped to 3 lines), desktop header unaffected (77.78px, unchanged).
- **Working tree corruption recovered.** An unexplained `git reset --hard`
  + clean wiped the reorg, CSS fix, and all `docs/*.md` files mid-session
  — traced to a stash (`migration:main-agents/...`) that wasn't mine,
  meaning another session may be operating on this same repo concurrently.
  Recovered via `git stash apply` for tracked files and rewrote the
  untracked docs from conversation content; committed as `22a7537` to
  protect against it happening again. Cause still unconfirmed — worth
  checking if another Claude Code window/session has this repo open.
- **Premium polish pass** (hero, header, mobile nav) — see `decisions.md`
  for the full breakdown. Summary: inline-SVG icons (not Lucide React, to
  keep the static-only stack), nav revised to
  Services/Process/Gallery/FAQ (dropped Portfolio/About — no matching
  content), no fabricated social proof added (no star ratings, no
  unconfirmed town list). Added: hero trust bar + trust indicators + CTA
  reassurance text, before/after image labels moved above images, a real
  hamburger mobile nav (vanilla JS, `js/main.js`, replaces the earlier
  stacked-nav CSS approach), sticky/blurred header, and a corrected
  eyebrow color (now uses the primary green, 11:1 contrast). Verified via
  the same headless-render method as the mobile audit — no overflow at
  320px, hamburger open/close/Escape all work, all contrast checks pass.

---

# Next (max 3)

1. **Fix the 3 dead paid-service CTAs** (Design Review $299, On-Site
   Consultation $750, Zone 0 Redesign Custom). Per `reference/link-audit.md`, these
   are conversion-path dead ends, not content gaps — recommended fix is
   pointing them at an anchor (e.g. `#photo-check`), not writing new pages.
2. **Configure the Tally form's post-submit redirect** to
   `pages/thank-you.html`. This is a setting in the Tally dashboard, not a
   code change.
3. *(open slot)*

---

# Future

- Tablet column tuning: Design Principles grid lands on an uneven
  3-column layout at 768px (orphaned last card). Cosmetic only, deferred
  per `mobile-audit.md`.
- Remove or resolve the "View all FAQs" dead link (`#11` in `reference/link-audit.md`)
- Add real testimonials — none exist on the site currently
- Add a real service-area/town list — needed for both trust and local SEO,
  currently missing entirely
- Add more before/after project photos — only one real project pair exists
  today
- Confirm final pricing ($299 / $750 / Custom) is accurate before launch
- The 10 body-copy links `reference/link-audit.md` recommends as standalone pages
  (materials, design guides, rules timeline, checklist, mulch guide,
  local/berkeley) — explicitly V2, not proposed for V1

---

# Parking Lot

- Multi-page URL routes (`/zone-0/`, `/design/`, `/services/`, etc.) —
  superseded by the single-page V1 decision
- Shopify plant catalog / e-commerce
- Gravel/stone firebreak packages, advanced developer tooling
- Astro SSG framework migration — deferred until the site scales well
  beyond a single page
