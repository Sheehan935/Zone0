# Changelog

All notable website changes are documented here. History before
2026-08-24 (the Netlify-era, multi-page site — v1.0 through v1.5) is
archived at `archive/CHANGELOG-v1-netlify-era.md`, not deleted.

## Unreleased

### Changed (To-Do List conversion zone)
- Added a "Done with these? Get your official plan." link to the
  bottom of both To-Do List cards, linking to `#photo-check`.
- Wrapped the "0 of 7 complete" counter, the disclaimer, and the main
  "Get Your Free Photo Review" button in one unified white card at the
  end of the To-Do List section (see `PROJECT-TRUTH.md` 1.13/3.21).

### Changed (bottom CTA, branch `bottom-cta`, deployed 2026-09-15)
- Contact section: added "Want a plan for your property instead?" and
  a "Get Your Free Photo Review" button above the form, linking to
  `#photo-check`. Form, "Send message" button, and phone line unchanged.
- FAQ: added a "Want this for your property? Start your free photo
  review →" link to 2 of 5 answers (mulch; plants/what-to-remove) —
  not added to the compliance-timeline answer, which already links to
  a Photo Review.

### Changed (mockup sections, branch `mockup-sections`, deployed 2026-09-15)
- New homepage section order (see `PROJECT-TRUTH.md` 1.11/3.19): Hero →
  **What Is Zone 0** (new) → **Your First-5-Feet To-Do List** (new) →
  Free Detailed Photo Review → the rest of the page, unchanged.
- "Understand the Zones" removed — its 3 zones were near-duplicated by
  the new "What Is Zone 0" section. All "Zones" nav links now point to
  `#what-is-zone-0` and read "What Is Zone 0".
- The Compliance Checklist moved (not duplicated) from Resources into
  "Your First-5-Feet To-Do List", expanded from 4 items to 7, split into
  two cards ("15-Minute Weekend Fixes" / "Structural Upgrades"). Its ids
  are unchanged, so existing links to it still work.
- Resources is FAQ-only now; heading/intro reworded, FAQ open by default.
- Photo Review section intro restyled (new copy, field hints on Address/
  Email); the form itself — fields, photo slots, `areas` multi-select,
  validation, submit logic — has zero diff.

### Changed (homepage cleanup, branch `homepage-cleanup`, deployed 2026-09-15)
- **Photo Review: all photos now optional**, client and server (see
  `PROJECT-TRUTH.md` 1.10/3.18 — reopens the "four sides hard-required"
  decision locked in 1.7 and reaffirmed in 1.8). A submission with zero
  photos attached now saves and notifies successfully.
- Removed "Free while spots last" and "— free while we have capacity"
  scarcity copy (added in 1.8 less than a week earlier); added "East Bay
  based" to the form reassurance line instead.
- Hero simplified to a single CTA ("Get Your Free Photo Review" only,
  "Explore the Approach" removed); hero badge text changed to white for
  legibility against the background photo.
- Added two mid-page "Get Your Free Photo Review" CTAs (after the
  Compliance Checklist, and after the Landscaping/Design section) and a
  new "Does this apply to your home?" block linking to CAL FIRE's
  official Fire Hazard Severity Zone page, at the end of "Understand the
  Zones".
- Added the phone number `(510) 394-2590` to the footer, the Contact
  section intro, and as a mobile-only call icon in the header.

### Removed (homepage cleanup, deployed 2026-09-15)
- Property Fire Risk Audit Calculator (introduced in 3.13) removed from
  Resources — the Compliance Checklist and FAQ stay, along with both
  Resources nav links. `js/zone0-tools.js`, which powered only the
  calculator, is no longer loaded on the page.

### Added
- New "Contact us" section (`PROJECT-TRUTH.md` 1.9/3.17): name, email,
  optional phone, subject dropdown, message, honeypot. Posts to a new
  `/contact` route on the existing `zone0-photo-check` Worker — email
  notification only, no D1 persistence.
- Optional "areas of interest" multi-select on the Photo Review intake
  (six whitelisted slugs, stored comma-joined in a new nullable `areas`
  column via `review-worker/migrations/0003_areas.sql`).
- Optional close-up photo zone, deliberately excluded from the
  four-sides-required completion gate.

### Changed
- Reverted the $29 Detailed Photo Review back to **free** (see
  `PROJECT-TRUTH.md` 1.8/3.16) — pricing removed entirely, framed as
  "free while capacity lasts" with a scarcity line in place of a price.
  Turnaround stays 48 hours; still no payment provider. Copy-only change
  across the nav, hero, form section label, form intro, success modal,
  FAQ link, JS helper banners, and the homeowner-journey skill.
- The free Photo Check is now the **$29 Detailed Photo Review**, delivered
  within 48 hours (was "response within 24 hours"). Copy updated across the
  nav, hero, form section, submit button, FAQ, footer, calculator and
  checklist CTAs, and the success modal.
- Relabelled the existing concerns field to "Is there anything specific
  you're concerned about?" — relabelled, not duplicated.
- Added the missing YAML frontmatter to
  `.claude/skills/homeowner-journey/SKILL.md` so it registers as a skill,
  and updated its outdated "Free Photo Check" positioning.

### Preserved
- The lead notification subject `New Photo Check lead — {name} ({address})`
  is unchanged — the Control Center and Dashboard artifacts search Gmail for
  that exact string.
- All four side photos remain hard-required, client and server.
- R2 key shape `{leadId}/{zone}/{uuid}.{ext}` and the `photo_keys` JSON
  format are unchanged, so existing leads still render in the portal.

### Changed
- Simplified the Zone 0 self-check experience by removing the redundant
  static 5-Step Inspection Checklist (the interactive Compliance
  Checklist was kept).
- Reduced the resources/accordion area from four items to three.
- Updated the home-page hero message to focus on protecting the home while
  preserving landscape character.

### Preserved
- Five-question self-check behavior and all 32 answer combinations.
- Personalized result/action-plan logic.
- Checklist progress stored in localStorage.
- Calculator CTA path to the relevant checklist/action-plan experience.
- Existing visual design system and responsive behavior.

## 2026-08-27

### Changed
- Added a proper `2xs` (11px) font-size token to `tailwind.config` and
  replaced 27 hand-typed `text-[10px]` eyebrow labels with it (same
  visual size, no longer a magic number).

## 2026-08-26

### Fixed
- Mobile hero H1 now wraps in a controlled 2-line break instead of an
  uncontrolled 4-line wrap that was consuming ~60% of the first mobile
  viewport.
- Standardized the recurring card component's padding to `p-6` across all
  10 affected cards (previously an inconsistent mix of p-4/p-5/p-6/p-8).

## 2026-08-25

### Removed
- Orphaned pre-consolidation pages with no inbound links from the current
  one-page homepage: `/design/` (and `/design/gallery/`,
  `/design/privacy-without-fuel/`), `/faq/`, `/materials/`, `/zone-0/`,
  and `pages/thank-you.html`. Content is superseded by the homepage's own
  sections; confirmed live in production (all now 404).

### Fixed
- Hero H1's `leading-[1.1]` was silently losing to Tailwind's paired
  line-height default at the desktop breakpoint; forced with `!important`
  so the intended ratio applies at every breakpoint.
- Hero CTA buttons bumped from 12px to 16px — they were rendering smaller
  than body copy.
- 19 body-copy paragraphs (Lean/Green/Clean cards, plant design guidance,
  materials matrix, zone descriptions, resources section) bumped from
  14px to 16px baseline; short captions/labels left as-is.
- "Design Guidance, Not a Plant List" paragraph narrowed from 768px to
  576px max-width to stay under a comfortable line length.
- Process-step labels (Assess/Design/Landscape/Hardscape/Maintain) bumped
  from 14px to 16px so they read as headings, not body copy.
- Primary nav links bumped from 11px to 14px, with letter-tracking
  reduced to compensate for the larger size.

## 2026-08-24

### Added
- Project-level decision record in `docs/DECISIONS.md`.
- Project-level human-readable changelog in `docs/CHANGELOG.md`.
