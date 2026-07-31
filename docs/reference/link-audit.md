# Zone 0 Landscaping Website
## Link Audit

**Version:** 1.0

**Last Updated:** July 30, 2026

---

# Purpose

Catalogs every internal link in `index.html` that still points to a page
that hasn't been built (the nav and footer were already trimmed to in-page
anchors — see [decisions.md](decisions.md), 2026-07-30). This is the input
for deciding what's in scope for V1 versus deferred to V2. No HTML has been
changed as part of this audit.

15 links across 8 distinct target routes. All hrefs are absolute paths
(`/zone-0/...`, `/design/...`, `/materials/...`, `/services/...`, `/local/...`,
`/faq/`) — none of these files exist in the repo.

---

# Hero Section

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "See Zone 0 Rules" | `/zone-0/rules-and-timeline/` | A page detailing the Zone 0 regulation timeline (what's required, by when, by jurisdiction) | Future standalone page — regulatory/legal content is dense enough to warrant its own page and is a strong SEO target. Interim: the on-page Regulation Status Band covers this topic briefly already, but not in enough depth to substitute. |

---

# Regulation Status Band

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "Read the Timeline →" | `/zone-0/rules-and-timeline/` | Same destination as the hero link above (duplicate target) | Future standalone page — same reasoning as above. Two links driving to the same unbuilt page; whichever gets built, both should point there. |

---

# The Risk ("The 5-Foot Zone Matters Most")

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "Learn how embers ignite homes →" | `/zone-0/what-is-zone-0/` | An explainer on ember ignition physics / what Zone 0 is at a conceptual level | Future standalone page — this is foundational educational content (the "why") that's currently only summarized in two sentences on the home page. Good V2 anchor content for SEO on "what is zone 0" searches. |

---

# Design Principles (4 cards)

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "Gravel & DG Options →" | `/materials/gravel-and-decomposed-granite/` | Material spec/selection page for decomposed granite and gravel | Future standalone page — material-specific pages are natural V2 content-marketing/SEO targets, not needed to ship V1. |
| "Privacy Solutions →" | `/design/privacy-without-fuel/` | Design guide for noncombustible privacy screening | Future standalone page — same reasoning. |
| "East Bay Plant Palette →" | `/design/plant-palette-east-bay/` | A curated plant list for Zone 1/2 planting | Future standalone page — this one may eventually pull from the "Plant Project" spreadsheet mentioned in the master control doc, so it's more data-dependent than the others. |
| "Noncombustible Fencing →" | `/materials/noncombustible-fencing/` | Material spec page for fencing alternatives | Future standalone page — same reasoning as the gravel/DG link. |

---

# Before & After Gallery Preview

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "Explore the Before & After Gallery" | `/design/before-and-after/` | A full project gallery with multiple before/after pairs | Future standalone page — but blocked on content, not just build effort. `03-content-plan.md` already flags that only one real project photo pair exists today; building this page now would just showcase the same single example that's already on the home page. |

---

# Services Overview (4 cards)

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "Submit Photos →" | `#photo-check` | *(not dead — in-page anchor, working)* | — |
| "Learn More →" (Design Review, $299) | `/services/design-review/` | Detail page for the $299 tier: what's included, how it's delivered | Replace with anchor link — flagged in `ux-review.md` #5 as a conversion problem: every paid tier currently has nowhere distinct to send a ready-to-buy visitor. Repointing to `#photo-check` (or a new lightweight contact anchor) is a faster V1 fix than writing three full service pages. Full pages remain a reasonable V2 upgrade once there's demand data to justify the content. |
| "Book Consult →" (On-Site Consultation, $750) | `/services/on-site-consultation/` | Detail/booking page for the $750 on-site visit | Replace with anchor link — same reasoning; this is the highest-intent CTA on the page and currently dead-ends. |
| "View Full Services →" (Zone 0 Redesign, Custom) | `/services/zone-0-redesign/` | Detail page for full custom redesign scope | Replace with anchor link — same reasoning. |

---

# Guide Preview ("Essential Zone 0 Guides")

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "The 5-Foot Zone Checklist" | `/zone-0/the-5-foot-checklist/` | A step-by-step self-audit checklist homeowners can follow | Future standalone page — strong lead-magnet / SEO candidate, but genuinely new content to write, not a trim. |
| "Mulch & Ground Cover Rules" | `/zone-0/mulch-and-ground-cover/` | Explains why bark mulch is non-compliant and lists alternatives | Future standalone page — same reasoning. |
| "Berkeley Hillside Standards" | `/local/berkeley/` | Local jurisdiction specifics for Berkeley (inspection rules, EMBER program, deadlines) | Future standalone page — but blocked on the same missing data `03-content-plan.md` and `ux-review.md` #17 already flag: there's no confirmed service-area/town data yet. Don't build this page until that data exists, regardless of V1/V2 timing. |

---

# FAQ Section

| Visible Text | Current href | Intended Destination | Recommendation |
|---|---|---|---|
| "View all FAQs →" | `/faq/` | An expanded FAQ page with more questions than the 3 shown inline | Remove for V1 — there is currently no additional FAQ content behind this link; the home page section already shows all 3 written questions. The link implies more content exists when it doesn't, which is a smaller version of the same problem `ux-review.md` #3 flagged for the placeholder FAQ answer. Revisit as a real page once the FAQ list grows past what fits inline. |

---

# Summary by Recommendation

**Future standalone page (V2 candidate):** 10 links across 6 unique routes
— rules-and-timeline, what-is-zone-0, the two materials pages, the two
design pages, before-and-after, the-5-foot-checklist, mulch-and-ground-cover,
local/berkeley.

**Replace with anchor link (V1 candidate):** 3 links — the three paid
service-tier CTAs. Highest priority of this list since these are
conversion-path links, not content-marketing links.

**Remove:** 1 link — "View all FAQs," since there's no content behind it yet.

**Keep as placeholder:** 0 — none recommended; every dead link above has a
clearer disposition than "leave it dead and unlabeled."

---

# Not Included

- Nav and footer links — already resolved to in-page anchors (see
  [decisions.md](decisions.md)).
- `#photo-check` and other in-page anchors — functional, not dead.
- `href="/"` on the logo — resolves to the built home page.
