# Zone 0 Landscaping Website
## Project Dashboard

**Last Updated:** August 11, 2026

This is the primary Project Control document. `PROJECT-TRUTH.md` is the
authoritative decision/state layer. Other files in `docs/` are reference
material unless explicitly designated otherwise.

Never more than 3 active tasks in **Next**.

---

# Current Goal

Establish and maintain the verified current state of the Zone 0 website,
then use that verified state to drive content, UX, QA, and implementation
work.

## Current Working Architecture

**LOCKED — One-page homepage:**

- `index.html` (10 sections: Header, Hero, Lean/Green/Clean, Landscaping/Hardscaping/Design, Visual Proof, Understand the Zones, Resources, How We Help, Free Photo Check, Footer)
- `pages/thank-you.html` for the Tally Photo Check confirmation flow

The previous 12-page launch requirement remains **UNLOCKED / RETIRED**. The 2026-08-03–08-18 multi-page implementation (`/zone-0/`, `/materials/`, `/faq/`, `/design/`, `pages/services.html`) is superseded, not deleted — see `docs/decisions.md`, 2026-08-19 entry. Those directories are retained as source material for homepage consolidation and must not be deleted in this step.

---

# Current Decisions

## Architecture

**Current working direction:**

`index.html` + `pages/thank-you.html`

**Previous 12-page launch requirement:**

**UNLOCKED / RETIRED**

The project is no longer required to launch with 12 pages.

Additional routes require separate approval.

## Form

**Current form system: Tally**

The Photo Check uses the Tally form embedded on `index.html`.

Tally post-submit redirect to:

`pages/thank-you.html`

was configured by Brian on July 30, 2026.

The redirect configuration itself is not independently visible from the
repository and should be treated as user-confirmed until independently
verified.

### Retired Form Assumption

**Netlify Forms: RETIRED / SUPERSEDED**

Do not create Netlify Forms work or treat Netlify Forms as the current
implementation.

## Deployment

**Reported deployment:** GitHub Pages

**Production domain:** `zone0landscaping.com`

**Repository:** `github.com/Sheehan935/Zone0`

**Branch:** `main`

**Last reported commit:** `b7f6ccf`

Local Git working-tree state remains unverified.

---

# Current Technical Architecture

Reported and verified project direction:

- Plain HTML
- CSS
- JavaScript
- No framework
- No Tailwind
- No npm
- No `package.json`
- No build process

Do not introduce a framework, build system, npm dependency, or CSS framework
without explicit approval.

---

# Completed / Verified Work

- Folder reorganization: `archive/`, `legacy/`, `pages/`, `docs/`, `css/`,
  `assets/images/`
- `pages/thank-you.html` moved into place with corrected relative paths
- Lead form replaced with live Tally embed
- Tally post-submit redirect configured to `pages/thank-you.html`
- FAQ placeholder text removed
- Link audit completed
- Mobile audit completed
- Mobile/header fixes implemented and verified
- Working-tree corruption recovered
- Recovery commit `22a7537` was previously created to protect recovered work
- Premium visual polish pass completed
- Inline SVG icons used to preserve static-only architecture
- Mobile hamburger navigation implemented with vanilla JavaScript
- Dead paid-service CTAs changed to `#photo-check`
- Tablet grid layout corrected
- Dead "View all FAQs" link removed
- Remaining dead body-copy links removed
- `index.html` reported with zero links to unbuilt pages at that point
- `pages/services.html` was built during the later multi-page exploration
- Service page reuses existing service content without invented content
- Service page CTAs point back to `index.html#photo-check`
- Logo SVG issue corrected
- Mobile navigation separation corrected
- CTA copy standardized
- `pages/thank-you.html` navigation updated during the services-page work

---

# Known Contradictions / Reconciliation Required

These items are intentionally NOT resolved by this dashboard.

## 1. Single-Page Core vs. Existing `pages/services.html` — RESOLVED 2026-08-19

One-page homepage is the locked target. `pages/services.html` (and the rest
of the multi-page build) is retained as source material only, not an
approved exception and not deleted.

## 2. Existing /zone-0/, /materials/, /faq/ Content — RESOLVED 2026-08-19

Same resolution: source material for homepage consolidation, not separate
pages going forward, not deleted in this step.

## 3. Legacy Photo Review / Hazard Tool

The project history references custom scripts including:

- `js/modal.js`
- custom hazard-analysis functionality

Tally is the current form system.

The disposition of the legacy custom functionality is:

**UNRESOLVED**

Do not delete, restore, or replace it without an explicit decision.

## 4. Buttondown

Status:

**NOT VERIFIED**

Do not assume Buttondown is currently installed, active, or required.

## 5. Analytics

Plausible / Fathom / GA4 status:

**NOT VERIFIED**

No analytics provider should be treated as current until verified.

---

# Next

**Only these 3 items are active.**

### 1. Consolidate Homepage Into Locked One-Page Architecture
**Status:** 🔵 In Progress  
**Priority:** P0  
**Owner:** Implementation

Rebuild `index.html` into the 10 locked sections, drawing content from the
retained legacy pages as source material. Architecture question itself is
resolved — this task is now implementation, not reconciliation.

### 2. Verify Current Repository State
**Status:** 🟡 Needs Review  
**Priority:** P0  
**Owner:** Git / Release Control

Verify:

- local branch
- local HEAD
- `git status`
- modified files
- untracked files
- local → GitHub alignment

Do not assume local and GitHub are synchronized.

### 3. Complete Site Audit / Fact-Based QA
**Status:** 🟠 Open  
**Priority:** P1  
**Owner:** Site Audit / QA Roles

Continue the audit using the current architecture and Project Truth.

Audit findings must be based on the actual current implementation.

Do not treat historical 12-page requirements or Netlify Forms as current
requirements.

---

# Future

- Add real testimonials only when real reviews exist
- Add a real service-area/town list if approved
- Add more before/after project photos
- Confirm final pricing before publishing
- Evaluate additional guide/content pages only after architecture is resolved
- Evaluate local SEO pages only after explicit scope approval

---

# Parking Lot

The following are **not current launch requirements**:

- Previous 12-page architecture
- Unapproved multi-page expansion
- Shopify plant catalog / e-commerce
- Gravel/stone firebreak packages
- Advanced developer tooling
- Astro SSG framework migration
- Any new route not explicitly approved

The former 12-page launch requirement is **UNLOCKED / RETIRED**, not deleted
from project history.

---

# Status Legend

🔴 Blocked  
🟠 Open  
🔵 In Progress  
🟡 Needs Review  
🟢 Complete  
⚪ Deferred  
🚨 Requires Decision