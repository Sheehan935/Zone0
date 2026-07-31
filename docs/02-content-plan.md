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
- **Call to action:** Get Your Free Zone 0 Assessment (primary, working).
  The secondary "See Zone 0 Rules" CTA was removed (2026-07-30) rather than
  left dead — see `decisions.md`.
- **Required images:** Before/after hero pair — in place, now eager-loaded
  (was `loading="lazy"` on an above-the-fold image, which hurts perceived
  load speed) with above-image Before/After labels instead of captions
  below.
- **Status:** Built, including a trust-bar checklist (4 true, non-numeric
  claims), CTA reassurance line, and a 3-item trust-indicator row (icons +
  label). No fabricated claims (no star ratings, no unconfirmed
  service-area list) — see `decisions.md` (2026-07-30, "Premium polish
  pass"). Single, fully-working CTA.

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
- **Call to action:** None. "Read the Timeline" link removed (2026-07-30)
  since the destination page doesn't exist — see `decisions.md`.
- **Required images:** None.
- **Status:** Built. Regulation claim should be re-verified as current
  before launch.

---

# The Risk ("The 5-Foot Zone Matters Most")

- **Purpose:** Explain why this specific 5 feet matters more than the rest
  of the property.
- **Visitor question(s):** Why does this narrow zone matter more than
  everything else in my yard?
- **Key message:** Embers ignite homes via combustibles right at the
  structure, not the whole property.
- **Call to action:** None. "Learn how embers ignite homes" link removed
  (2026-07-30) — see `decisions.md`.
- **Required images:** None currently; a supporting diagram or photo would
  strengthen this but isn't required for launch.
- **Status:** Built.

---

# Design Principles (4 cards)

- **Purpose:** Show that design solutions exist for the objections visitors
  raise before they raise them (barren look, lost privacy, lost plants).
- **Visitor question(s):** Will my yard look barren? Will I lose privacy or
  my plants?
- **Key message:** Fire safety and an attractive, private, planted yard are
  not mutually exclusive.
- **Call to action:** None. The 4 "learn more" links were removed
  (2026-07-30) rather than left dead — see `decisions.md`. Cards are now
  heading + description only.
- **Required images:** None shown per card today; real material/design
  photos would strengthen this but aren't required for launch.
- **Status:** Built.

---

# Before & After Gallery Preview (`#gallery`)

- **Purpose:** Provide visual proof that results look intentional, not
  barren. Now a nav destination (`#gallery`).
- **Visitor question(s):** What does this actually look like when it's done?
- **Key message:** Real conversions exist and preserve architectural
  character.
- **Call to action:** None. "Explore the Before & After Gallery" button
  removed (2026-07-30) — see `decisions.md`.
- **Required images:** More real before/after project pairs — only one
  exists today. This is the largest content gap on the page.
- **Status:** Weakest section on the site content-wise. Needs more real
  photos before it's launch-strong.

---

# Services Overview (4 cards) — home page section AND `pages/services.html`

- **Purpose:** Make the offer concrete — what can be bought, at what price.
- **Visitor question(s):** What do I actually get, and what does it cost?
- **Key message:** There's a free entry point (Photo Check) and paid tiers
  matched to different levels of commitment.
- **Call to action:** All 4 cards (Submit Photos, Learn More, Book Consult,
  View Full Services) point to `#photo-check` (same-page anchor on the home
  page; `../index.html#photo-check` on `pages/services.html`).
- **Required images:** None currently; not required for launch.
- **Status:** Built in two places with identical copy (2026-07-30, see
  `decisions.md` "Superseded: V1 is no longer single-page"): the home
  page's `#services` section (now unreachable from nav, still present)
  and the new `pages/services.html` (linked from nav/footer). Which one
  stays authoritative — trim the home section to a teaser, or keep both —
  is an open call, tracked in `00-project-dashboard.md`'s Next list. Note:
  all 4 tiers still route to the same free-tier form, which
  `reference/ux-review.md` #5 flags as making paid tiers feel speculative
  rather than bookable — acceptable for now, worth a dedicated booking
  path in the future.

---

# Free Photo Check Form

- **Purpose:** Capture the lead — the site's only conversion mechanism.
- **Visitor question(s):** How do I actually start this?
- **Key message:** A low-commitment way to get expert eyes on this specific
  property.
- **Call to action:** Embedded Tally form (working)
- **Required images:** None.
- **Status:** Fully working, including the post-submit redirect to
  `pages/thank-you.html` (configured directly in Tally, 2026-07-30).

---

# Guide Preview ("Essential Zone 0 Guides")

- **Purpose:** Demonstrate depth of expertise beyond the sales pitch.
- **Visitor question(s):** Do they actually know the specifics, or is this
  generic marketing?
- **Key message:** Detailed, specific guidance exists (checklist, mulch
  rules, local standards).
- **Call to action:** None. The 3 cards were links to unbuilt pages;
  converted to plain (non-interactive) cards (2026-07-30) — see
  `decisions.md`. The Berkeley card's underlying content is additionally
  blocked on missing local service-area data.
- **Required images:** None.
- **Status:** Built.

---

# FAQ

- **Purpose:** Pre-handle objections and reduce repetitive inbound
  questions (per business goals in `01-project-brief.md`).
- **Visitor question(s):** The 3 currently answered — does Zone 0 mean
  clearing all plants, will it look like a parking lot, is this legally
  enforced.
- **Key message:** Zone 0 is narrower and less disruptive than visitors
  fear.
- **Call to action:** None. "View all FAQs" removed since no additional
  FAQ content exists yet.
- **Required images:** None.
- **Status:** Built.

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
