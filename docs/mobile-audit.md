# Zone 0 Landscaping Website
## Mobile Responsiveness Audit

**Last Updated:** July 30, 2026

---

# Method

`css/styles.css` has zero `@media` rules. Every section relies on CSS Grid
`auto-fit`/`minmax` (which reflows without breakpoints) except the header,
which is a plain `display: flex` row. To get accurate findings rather than
guessing from the CSS alone, the page was rendered headlessly (Playwright/
Chromium) at 320px, 375px, 768px, and 1280px, with full-page screenshots and
measured element metrics (widths, heights, column counts, overflow) at each
width. Findings below are based on that render, not just the source.

Section names below follow the actual `index.html` structure, since it
differs slightly from generic page-section naming — mapped to your list:
**Why Zone 0 → The Risk**, **Process → Trust Strip**, **Contact → Photo
Check Form** (the site has no separate contact section; the form is the
only contact mechanism).

---

# Header & Navigation

- **Desktop behavior (1280px):** Single row — logo, 4 nav links, CTA
  button. Header height 78px. Clean.
- **Mobile behavior (375px):** Header balloons to **233px tall**. The nav
  block gets compressed to roughly 65–80px wide instead of sharing the row
  proportionally — "Zone 0 Guide" wraps onto two lines, the 4 links stack
  in a narrow vertical column, and "Free Photo Check" wraps onto three
  lines. Logo and CTA end up vertically centered against this abnormally
  tall nav column (verified visually via headless render, not just CSS
  inspection).
- **Layout issues:** At 320px this actually overflows the viewport
  horizontally (measured `scrollWidth` 363px vs `clientWidth` 320px — 43px
  of forced horizontal scroll). At 375px there's no horizontal scroll, but
  the header is visibly broken: illegible, cramped, and looks unfinished
  rather than intentional.
- **Accessibility concerns:** Nav link tap targets shrink to ~25.6px tall
  when compressed — right at the WCAG 2.5.8 minimum (24px), not the
  recommended 44px. Combined with the narrow column width, mis-taps are
  likely.
- **Recommended fix (conceptual, no code yet):** The header needs an
  explicit mobile treatment — either a hamburger/drawer nav, or stacking
  the nav below the logo row instead of forcing all three elements into one
  unwrapped flex row. This is a layout decision, not a one-line CSS patch.
- **Severity: Critical (blocks launch).** This is the first thing every
  mobile visitor sees, and it currently looks broken rather than cramped.

---

# Hero

- **Desktop behavior:** Centered headline (fluid via `clamp()`, already
  responsive), lead paragraph, two CTA buttons side by side, before/after
  image pair at 501×334px each.
- **Mobile behavior:** Headline scales down correctly (the `clamp()` sizing
  already works with no changes needed). CTA buttons stack to one column
  automatically (grid `auto-fit` behaves correctly here — confirmed, no
  issue). Before/after images shrink to 138×92px at 375px, 111×74px at
  320px.
- **Layout issues:** None structurally. The before/after images get quite
  small on narrow phones — still legible, but the visual impact of the
  proof point is reduced right where it matters most (the hero is the #1
  trust element per `02-content-plan.md`).
- **Accessibility concerns:** The `.eyebrow` label ("FIRE-ADAPTED HILLSIDE
  DESIGN") uses the accent orange (`#d97706`) on white. Measured contrast
  ratio is **3.19:1** — fails WCAG AA for normal text (needs 4.5:1; it's
  bold but at 13px doesn't qualify as "large text," which would only need
  3:1).
- **Recommended fix (conceptual):** Consider a larger or stacked
  before/after treatment on narrow viewports so the proof point doesn't
  shrink as aggressively. Darken the eyebrow color or increase its weight/
  size to clear contrast requirements.
- **Severity: Important.** Not broken, but underselling the site's
  strongest trust signal on the devices most visitors will use.

---

# Trust Strip ("Process")

- **Desktop behavior:** 5 items in a row.
- **Mobile behavior:** Collapses cleanly to a single column (grid
  `auto-fit, minmax(180px,1fr)` — confirmed via render, no issue).
- **Layout issues:** None.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed.
- **Severity: Nice to have.** Already works; no action required.

---

# Regulation Status Band

- **Desktop behavior:** Badge, text, and "Read the Timeline" link in one
  row.
- **Mobile behavior:** Wraps cleanly (`flex-wrap: wrap` is already set)
  into a stacked block.
- **Layout issues:** None.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed.
- **Severity: Nice to have.**

---

# The Risk ("Why Zone 0 Matters")

- **Desktop / mobile behavior:** Plain centered text block, no columns.
  Renders identically in proportion at all widths tested.
- **Layout issues:** None.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed.
- **Severity: Nice to have.**

---

# Design Principles (4 cards)

- **Desktop behavior (1280px):** 4 columns.
- **Tablet behavior (768px):** 3 columns — leaves an uneven last row (1
  card alone).
- **Mobile behavior (375px):** Collapses cleanly to 1 column. Confirmed via
  render, no breakage.
- **Layout issues:** Only the tablet 3-column/uneven-last-row case is
  slightly awkward visually. Not a functional problem.
- **Accessibility concerns:** None found.
- **Recommended fix (conceptual):** Optional polish — could pin this grid
  to 2 or 4 columns at tablet width instead of letting `auto-fit` land on
  3. Cosmetic only.
- **Severity: Nice to have.**

---

# Before & After Gallery Preview

- **Desktop / mobile behavior:** Single column at all widths (already
  `grid-template-columns: 1fr`) — no reflow needed, nothing to break.
- **Layout issues:** None from a responsiveness standpoint. (Separately,
  `02-content-plan.md` already flags that this section only has one real
  project photo — a content gap, not a layout one.)
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed for responsiveness.
- **Severity: Nice to have.**

---

# Services Overview (4 cards)

- **Desktop behavior:** 4 columns.
- **Tablet behavior:** 2 columns.
- **Mobile behavior:** Collapses cleanly to 1 column. Confirmed via render.
- **Layout issues:** None structural.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed for responsiveness. (Separately, 3 of
  the 4 card CTAs are dead links — already tracked as a `Next` item in
  `00-project-dashboard.md`, not a layout issue.)
- **Severity: Nice to have** (for the responsiveness aspect specifically).

---

# Photo Check Form ("Contact")

- **Desktop / mobile behavior:** The Tally `<iframe>` is `width: 100%`, so
  it resizes with its container at every width tested. Tally's own embedded
  form content is a separate document we can't inspect from the parent
  page — its internal responsiveness wasn't auditable here, but the
  embedding itself is correctly fluid.
- **Layout issues:** None found in the embedding. `min-height: 620px` may
  leave extra empty space below a short form on some screens, but this
  doesn't cause overflow or breakage.
- **Accessibility concerns:** The iframe has a descriptive `title`
  attribute — good.
- **Recommended fix:** None needed.
- **Severity: Nice to have.**

---

# Guide Preview ("Essential Zone 0 Guides")

- **Desktop behavior:** 3 columns.
- **Tablet behavior:** 2 columns.
- **Mobile behavior:** Collapses cleanly to 1 column. Confirmed via render.
- **Layout issues:** None.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed.
- **Severity: Nice to have.**

---

# FAQ

- **Desktop / mobile behavior:** Simple stacked blocks at every width
  tested — no columns to reflow.
- **Layout issues:** None.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed.
- **Severity: Nice to have.**

---

# Footer

- **Desktop / tablet behavior:** 2 columns.
- **Mobile behavior:** Collapses cleanly to 1 column. Confirmed via render.
- **Layout issues:** None.
- **Accessibility concerns:** None found.
- **Recommended fix:** None needed.
- **Severity: Nice to have.**

---

# Summary

| Section | Severity |
|---|---|
| Header & Navigation | **Critical** |
| Hero (image scale + eyebrow contrast) | Important |
| Everything else (Trust Strip, Regulation Band, The Risk, Design Principles, Gallery, Services, Form, Guides, FAQ, Footer) | Nice to have / none |

The header is the only genuinely broken thing on mobile. Every other
section already degrades gracefully because it was built with fluid CSS
Grid (`auto-fit`/`minmax`) rather than fixed columns — no `@media` rules
were needed for those, and none are needed now. The original assumption
that "zero `@media` rules" meant "zero mobile support" was too broad; the
real problem is narrower and concentrated in one component.

No HTML or CSS was modified as part of this audit.
