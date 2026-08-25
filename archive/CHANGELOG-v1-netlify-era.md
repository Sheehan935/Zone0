# Zone 0 Landscaping — Site Changelog

## v1.5 — Wordmark Logo, Asset Reorganization, Housekeeping
- Header Wordmark: Replaced the text-based "Zone0 / educational guide"
  header lockup with an image wordmark
  (`assets/logos/zone0-wordmark.png`, background made transparent)
  across every page.
- Broken Image Fix: Repointed the hero background and `og:image` tag to
  the correct lowercase `assets/images/houses/` path after a folder
  rename left them 404ing in production.
- Asset Reorganization: Consolidated assets under `assets/`, organized
  by type; normalized all folder names to lowercase to avoid
  case-sensitivity 404s between local (macOS) and production.
- Internal Docs: Moved the internal branding guide out of the public
  `/design/` hub to `docs/branding-guide/`; added a GitHub Pages
  `_config.yml` to keep `docs/`, `archive/`, and internal report files
  off the live site; reconciled `decisions.md` and the project
  dashboard with the site's actual (multi-page) structure.
- Housekeeping: Removed empty leftover directories, deduplicated
  `.gitignore`, deleted merged branches, consolidated report files into
  `docs/`.

## v1.4 — Zone 3, Plant Expansion, System Overview, Accessibility
- Zone 3 Tab: Added a 4th "Wildland Transition Zone" tab (100+ ft),
  framed around thinning/managing existing vegetation rather than
  new planting.
- Plant Inventory Expansion: Every zone tab now lists 9 plant
  examples (36 total), all real California natives with honest
  care/fire-safety notes.
- Zone Key Removed: Dropped the redundant 4-card legend added in
  v1.3 once the zone tabs themselves already showed the same
  badge/title/range at a glance.
- Flora Swap: Added a 4th card (Juniper -> Manzanita), moved the
  whole section to the bottom of the page, added a cross-link to
  the plant tabs.
- System Overview: Replaced the old Risk Visualizer section (Ember-
  Trap diagram + compliance slider) with a new "Defensible Space &
  Native Plant Integration" section directly below the hero;
  iterated its background from dark, to white, to matching the
  site's actual background color, fixing a color seam against the
  section below it.
- Accessibility: Ran an axe-core audit and fixed 4 real WCAG AA
  color-contrast failures (brand sage-green and one zone accent
  color were too light as small text on light backgrounds).
- Source Citation: Added a footer link to the official AB 3074 bill
  text, since the site referenced the law repeatedly without citing
  it anywhere.
- Design System Page: Built out design/system/index.html with the
  site's actual color palette, typography, logo/wordmark, and
  button styles, pulled directly from the live code.
- Bug Fixes: Repaired index.html twice after an external script
  broke the document structure (content stranded after `</html>`);
  fixed a CSS border-color bug on the Zone Key cards; corrected
  mislabeled Ember-Trap hazard diagram callouts.

## v1.3 — Plant Guide Redesign & Flora Swap Fixes
- Zone Plant Guide Overhaul: Replaced the hover-accordion plant table with a
  click-based, color-coded Zone 0/1/2 tab UI and a spacious card grid
  (larger fonts, ARIA tab pattern, arrow-key navigation).
- Zone Key: Added a 4-card legend (Zone 0-3) summarizing distance and
  defensible-space guidance above the plant tabs.
- Flora Swap Fixes: Replaced broken/hotlinked Unsplash images with verified
  real photos and text overlays; corrected the sage card species label to
  White Sage (Salvia apiana).
- Risk Visualizer: Swapped the Ember-Trap Hazard Diagram to a self-hosted
  photo.
- Accessibility & Meta: Added a working mobile hamburger nav, SEO/OG meta
  tags, and keyboard/touch fallback for the Flora Swap cards.
- Content: Added a reality-check callout banner and an expanded native
  plant dataset organized by defensible space zone.

## v1.2 — Hero & Header Navigation Fixes
- Updated Hero Title: Changed primary header copy to "Clean, Green & Fire Safe".
- Fixed Whitespace Bug: Removed inline layout rules pushing hero content down.
- Streamlined Main Navigation: Updated header links to route directly to live site pages (Home, Services, Plant Guide, Education).
- Netlify Build Settings: Created a root netlify.toml file to set the publish directory to src/.

## v1.1 — Multi-Page Site Expansion
- Added New HTML Pages: Built and connected services.html, plants.html, and education.html.
- Form Enhancements: Implemented Netlify form handling for Photo Check and Design Inquiries.
- Redirect Setup: Created thank-you.html confirmation page for form submissions.

## v1.0 — Initial Site Deployment
- Core Layout & Design: Set up HTML shell, CSS styling structure, and local Berkeley Hills copy.
- Brand Assets: Integrated native SVG brand mark into header and footer.
- Git & Netlify Integration: Initialized GitHub repo and connected deployment via Netlify.
