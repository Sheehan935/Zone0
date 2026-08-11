# Zone 0 Landscaping Website
## Project Dashboard

**Last Updated:** August 10, 2026

This is the only working document. Everything else in `docs/` is reference
material. Never more than 3 active tasks in **Next**.

---

# Current Goal

Site is live and multi-page: `index.html` plus `/zone-0/`, `/design/`,
`/materials/`, `/faq/` (see `decisions.md`, 2026-08-05 entry). The current
focus is organizing the business plan and turning the Zone 0 guide material
into publishable, authoritative content.

New working planning docs:

- `03-business-plan-structure.md`
- `04-zone-0-guide-content.md`
- `05-content-plan-steps.md`

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
- Fixed the 3 dead paid-service CTAs (Design Review, On-Site Consultation,
  Zone 0 Redesign) — now point to `#photo-check` instead of unbuilt
  `/services/...` pages, per `reference/link-audit.md`'s recommendation.
- Tablet grid fix: Design Principles now lands on a clean 2-column layout
  at 768px (was 3, orphaning a card) — added a `600–960px` breakpoint
  pinning `.card-grid-4` to 2 columns. Verified via headless render.
- Removed the dead "View all FAQs" link — no additional FAQ content
  existed behind it, per `reference/link-audit.md` recommendation.
- Tally form's post-submit redirect to `pages/thank-you.html` configured
  by Brian directly in the Tally dashboard (2026-07-30). Not independently
  verified from this side — Tally's redirect setting isn't visible from
  the codebase — but per Brian's confirmation.
- Stripped the remaining 11 dead body-copy links (hero secondary CTA,
  regulation band, risk section, 4 Design Principles links, gallery
  button, 3 Guide Preview cards) instead of leaving them dead or building
  the pages — see `decisions.md`. `index.html` now has zero links to
  unbuilt pages. Verified via headless render: no errors, no dead links,
  layout unaffected.
- **Built `pages/services.html`** — first page in the new multi-page
  direction (see `decisions.md`, "Superseded: V1 is no longer
  single-page"). Reuses the 4 service-tier cards verbatim from the home
  page (no invented content); CTAs link to `../index.html#photo-check`
  since the Tally form isn't duplicated across pages. Home page nav/footer
  "Services" now points here instead of `#services`. Along the way, fixed:
  the logo SVG (was rendering as a full orange circle instead of a
  green/orange split — path didn't close correctly), mobile dropdown nav
  had no visual separation from page content (added box-shadow + border),
  CTA copy was inconsistent ("Get Your Free Assessment" vs "...Zone 0
  Assessment" — standardized), and `pages/thank-you.html`'s "Back to
  Services" link (was pointing at the now-repurposed `#services` anchor).
  All verified via headless render — zero dead links, zero console errors.
- **Not yet resolved:** the home page still has its own `#services`
  section with the same 4 cards — now unreachable from nav but still
  present. Whether to trim/replace it now that a dedicated page exists is
  an open content decision, not assumed here — see `decisions.md`.

---

# Next (max 3)

1. Rewrite `/zone-0/` from `04-zone-0-guide-content.md`, replacing the
   remaining placeholder article text.
2. Clarify paid offer paths from `03-business-plan-structure.md` so service
   CTAs distinguish Photo Check, Design Review, On-Site Consultation, and
   Redesign.
3. Use `05-content-plan-steps.md` to choose the next page build: FAQ cleanup,
   materials guide, checklist lead magnet, or local SEO page.

---

# Future

- Add real testimonials — none exist on the site currently. On hold until
  real reviews exist to draw from (2026-07-30).
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
