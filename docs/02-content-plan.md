# Zone 0 Landscaping Website
## Content Plan

**Last Updated:** July 30, 2026

This is the blueprint for the site, organized by homepage section. It
describes what each section needs to accomplish and its current status —
it does not contain marketing copy.

---

# Hero

- **Purpose:** First impression — establish who this is for and the core
  value proposition immediately, and build trust before the first ask.
- **Visitor question(s):** Is this for my situation? What do they actually
  do? Can I trust them?
- **Key message:** Fire-safe compliance without stripping the hillside's
  curb appeal, backed by a credible checklist of what they specialize in.
- **Call to action:** Get Your Free Zone 0 Assessment (primary, working) /
  See Zone 0 Rules (secondary, de-emphasized — still a dead link, see
  `reference/link-audit.md`)
- **Required images:** Before/after hero pair — in place, now eager-loaded
  (was `loading="lazy"` on an above-the-fold image, which hurts perceived
  load speed) with above-image Before/After labels instead of captions
  below.
- **Status:** Built, including a trust-bar checklist (4 true, non-numeric
  claims), CTA reassurance line, and a 3-item trust-indicator row (icons +
  label). No fabricated claims (no star ratings, no unconfirmed
  service-area list) — see `decisions.md` (2026-07-30, "Premium polish
  pass"). Secondary CTA still points to an unbuilt page.

---

# Trust Strip / Process (`#process`)

- **Purpose:** Show the process at a glance; build credibility through
  structure before asking for anything.
- **Visitor question(s):** What actually happens if I work with them?
- **Key message:** There's a defined process (Inspect, Preserve, Redesign,
  Implement, Document).
- **Call to action:** None — informational band. Now a nav destination
  (`#process`) since the header nav was revised to Services/Process/
  Gallery/FAQ.
- **Required images:** None.
- **Status:** Built.

---

# Regulation Status Band

- **Purpose:** Create urgency and relevance by tying the offer to active
  regulation.
- **Visitor question(s):** Is this actually required right now, or optional?
- **Key message:** Zone 0 rules are live in East Bay high-fire zones.
- **Call to action:** Read the Timeline (dead link, see `reference/link-audit.md`)
- **Required images:** None.
- **Status:** Built. Regulation claim should be re-verified as current
  before launch. CTA points to an unbuilt page.

---

# The Risk ("The 5-Foot Zone Matters Most")

- **Purpose:** Explain why this specific 5 feet matters more than the rest
  of the property.
- **Visitor question(s):** Why does this narrow zone matter more than
  everything else in my yard?
- **Key message:** Embers ignite homes via combustibles right at the
  structure, not the whole property.
- **Call to action:** Learn how embers ignite homes (dead link, see
  `reference/link-audit.md`)
- **Required images:** None currently; a supporting diagram or photo would
  strengthen this but isn't required for launch.
- **Status:** Built. CTA points to an unbuilt page.

---

# Design Principles (4 cards)

- **Purpose:** Show that design solutions exist for the objections visitors
  raise before they raise them (barren look, lost privacy, lost plants).
- **Visitor question(s):** Will my yard look barren? Will I lose privacy or
  my plants?
- **Key message:** Fire safety and an attractive, private, planted yard are
  not mutually exclusive.
- **Call to action:** 4 "learn more" links, one per card — all dead, see
  `reference/link-audit.md` (recommended as future standalone pages).
- **Required images:** None shown per card today; real material/design
  photos would strengthen this but aren't required for launch.
- **Status:** Built. All 4 card links point to unbuilt pages — deferred to
  V2 per `reference/link-audit.md`.

---

# Before & After Gallery Preview (`#gallery`)

- **Purpose:** Provide visual proof that results look intentional, not
  barren. Now a nav destination (`#gallery`).
- **Visitor question(s):** What does this actually look like when it's done?
- **Key message:** Real conversions exist and preserve architectural
  character.
- **Call to action:** Explore the Before & After Gallery (dead link, see
  `reference/link-audit.md`)
- **Required images:** More real before/after project pairs — only one
  exists today. This is the largest content gap on the page.
- **Status:** Weakest section on the site content-wise. Needs more real
  photos before it's launch-strong.

---

# Services Overview (4 cards)

- **Purpose:** Make the offer concrete — what can be bought, at what price.
- **Visitor question(s):** What do I actually get, and what does it cost?
- **Key message:** There's a free entry point (Photo Check) and paid tiers
  matched to different levels of commitment.
- **Call to action:** Submit Photos (`#photo-check`, working) / Learn More,
  Book Consult, View Full Services (all 3 dead — see `reference/link-audit.md`,
  recommended fix is an anchor link, not a new page)
- **Required images:** None currently; not required for launch.
- **Status:** Built. 3 of 4 CTAs are dead — highest-priority fix in
  `reference/link-audit.md` since these are conversion-path links, not
  content-marketing links.

---

# Free Photo Check Form

- **Purpose:** Capture the lead — the site's only conversion mechanism.
- **Visitor question(s):** How do I actually start this?
- **Key message:** A low-commitment way to get expert eyes on this specific
  property.
- **Call to action:** Embedded Tally form (working)
- **Required images:** None.
- **Status:** Functionally working. Post-submit redirect to
  `pages/thank-you.html` not yet configured (Tally dashboard setting, see
  `decisions.md`).

---

# Guide Preview ("Essential Zone 0 Guides")

- **Purpose:** Demonstrate depth of expertise beyond the sales pitch.
- **Visitor question(s):** Do they actually know the specifics, or is this
  generic marketing?
- **Key message:** Detailed, specific guidance exists (checklist, mulch
  rules, local standards).
- **Call to action:** 3 guide links — all dead, see `reference/link-audit.md`
  (recommended as future standalone pages; the Berkeley link is
  additionally blocked on missing local service-area data).
- **Required images:** None.
- **Status:** Built. All 3 links point to unbuilt pages — deferred to V2.

---

# FAQ

- **Purpose:** Pre-handle objections and reduce repetitive inbound
  questions (per business goals in `01-project-brief.md`).
- **Visitor question(s):** The 3 currently answered — does Zone 0 mean
  clearing all plants, will it look like a parking lot, is this legally
  enforced.
- **Key message:** Zone 0 is narrower and less disruptive than visitors
  fear.
- **Call to action:** View all FAQs (dead link — `reference/link-audit.md`
  recommends removing for V1 since no additional FAQ content exists yet).
- **Required images:** None.
- **Status:** Built. "View all FAQs" link has nothing behind it.

---

# Footer

- **Purpose:** Secondary navigation and trust/legal closure.
- **Visitor question(s):** Where do I go to find X again? Is this a real,
  accountable business?
- **Key message:** N/A — utility, not persuasion.
- **Call to action:** In-page anchor links (working) + Free Photo Check.
- **Required images:** None.
- **Status:** Built, matches single-page structure. Missing a phone number
  or explicit service-area line — not addable yet since no confirmed
  service-area list exists.
