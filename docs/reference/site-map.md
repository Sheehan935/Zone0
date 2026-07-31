# Zone 0 Landscaping Website
## Site Map

**Version:** 1.1 (current build)

**Last Updated:** July 30, 2026

---

# Current State

The live site is a single page, `index.html`, with anchor-linked sections.
There are no separate `.html` pages built yet — `pages/` is empty. The nav
and footer already link to page paths (`/zone-0/`, `/services/`, `/faq/`,
etc.) that don't exist yet; those are captured below as **Referenced, Not
Built** so this map reflects what's actually deployed versus what's only
linked.

---

# Built Pages

Home
(index.html) — the entire site today

---

# Home Page Structure (index.html)

1. Header — logo, primary nav, "Free Photo Check" CTA
2. Hero — headline, lead copy, before/after image pair, primary + secondary CTA
3. Trust Strip — 5-step process labels (Inspect, Preserve, Redesign, Implement, Document)
4. Regulation Status Banner — Zone 0 rule-change alert
5. The Risk — "5-Foot Zone Matters Most" explainer
6. Design Principles — 4-card grid (Hardscape, Privacy, Plant Palettes, Structure Protection)
7. Before & After Gallery Preview — single gallery card + link out
8. Services Overview — 4-card grid (Photo Check, Design Review, On-Site Consultation, Zone 0 Redesign)
9. Free Photo Check Form (`#photo-check`) — embedded Tally form
10. Guide Preview — 3-link card list
11. FAQ (excerpt) — 3 questions + "View all FAQs" link
12. Footer — 4-column link grid + copyright bar

---

# Primary Navigation (header)

- Zone 0 Guide → `/zone-0/`
- Design → `/design/`
- Materials → `/materials/`
- Local → `/local/berkeley/`
- Services → `/services/`
- Free Photo Check → `#photo-check` (in-page anchor, only working link)

---

# Footer Navigation

**Zone 0 Guide**
- What is Zone 0? → `/zone-0/what-is-zone-0/`
- Rules & Timeline → `/zone-0/rules-and-timeline/`
- 5-Foot Checklist → `/zone-0/the-5-foot-checklist/`
- Mulch Alternatives → `/zone-0/mulch-and-ground-cover/`

**Design & Materials**
- Design Without Barren → `/design/fire-adapted-without-barren/`
- Privacy Solutions → `/design/privacy-without-fuel/`
- Gravel & DG → `/materials/gravel-and-decomposed-granite/`
- Fencing Options → `/materials/noncombustible-fencing/`

**Local Jurisdictions**
- Berkeley Hills → `/local/berkeley/`
- Oakland Hills → `/local/oakland-hills/`
- Kensington → `/local/kensington/`
- Orinda / Lafayette → `/local/orinda/`

**Company**
- Our Services → `/services/`
- About Us → `/about/`
- FAQ → `/faq/`
- Contact → `/contact/`

---

# Conversion Path (current)

The only functioning conversion surface is the embedded Tally form at
`#photo-check`. All service-card CTAs and the header CTA point here or to
unbuilt page paths — see [ux-review.md](ux-review.md) for the audit of this gap.

---

# Referenced, Not Built

Every route below is linked from the nav or footer but has no corresponding
file yet:

- `/zone-0/` and its sub-pages (what-is-zone-0, rules-and-timeline, the-5-foot-checklist, mulch-and-ground-cover)
- `/design/` and its sub-pages (privacy-without-fuel, plant-palette-east-bay, fire-adapted-without-barren, before-and-after)
- `/materials/` and its sub-pages (gravel-and-decomposed-granite, noncombustible-fencing)
- `/local/` and its sub-pages (berkeley, oakland-hills, kensington, orinda)
- `/services/` and its sub-pages (design-review, on-site-consultation, zone-0-redesign)
- `/about/`
- `/contact/`
- `/faq/`
- `pages/thank-you.html` (folder exists, file does not)

---

# Decided: V1 Is Single-Page

Per [decisions.md](decisions.md) (2026-07-30), V1 ships as one page. The
routes listed above under **Referenced, Not Built** do not get built out —
they get trimmed from the nav/footer or repointed to in-page anchors. This
also makes `01-project-brief.md`'s V1 scope (which lists separate
Services/Before & After/FAQ/Contact pages) stale; it should be reconciled
with this decision.

**Not yet done:** the actual trim pass on `index.html`'s nav and footer.
