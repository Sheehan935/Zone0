# Zone 0 Landscaping Website
## Business Plan Structure

**Last Updated:** August 10, 2026

This file turns the website from a collection of pages into a simple business
plan. It should guide what gets built, written, measured, and sold next.

---

# 1. Business Thesis

Zone 0 Landscaping helps California hillside homeowners understand and act on
the 0-5 foot ember-resistant zone without making their properties look barren.

The opportunity sits at the intersection of:

- wildfire risk awareness
- AB 3074 and local defensible-space rules
- insurance pressure
- homeowner desire to preserve curb appeal, privacy, shade, and native plants

The site should win trust by being more useful than a sales page: objective
education first, design help second, paid services third.

---

# 2. Core Customer

Primary customer:

- Homeowner in a Very High Fire Hazard Severity Zone or hillside community
- Owns a home with mulch, shrubs, fences, deck edges, or plants near siding
- Feels pressure from insurance, inspections, neighbors, or recent fire news
- Wants clear answers without destroying the look of the property

Secondary customer:

- Realtor preparing a listing
- Architect or designer working on a remodel
- Contractor asked to make a property inspection-ready
- HOA or neighborhood group looking for educational material

---

# 3. Positioning

Primary promise:

> Know what to fix. Get the work done. Keep the proof.

Supporting messages:

- Zone 0 is specific: the first 0-5 feet around the structure.
- The risk is ember ignition, not only direct flame contact.
- Non-combustible materials can look intentional and high-end.
- Native and fire-adapted planting still has a role outside the most critical
  structure-adjacent area.
- The service is educational guidance, not a formal legal compliance ruling.

Avoid:

- "fireproof"
- "guaranteed compliant"
- "CAL FIRE certified"
- guaranteed insurance outcomes
- alarmist language

---

# 4. Offer Ladder

## Free Photo Check

Purpose:

- low-friction lead capture
- identify obvious Zone 0 issues from user-submitted photos
- route serious prospects toward paid review or consultation

Current implementation:

- embedded Tally form
- form ID: `81VgKP`
- redirect target configured in Tally, not in repo

## Design Review

Purpose:

- paid remote analysis
- useful for homeowners who want a plan before hiring installation help

Needs:

- final scope
- deliverable format
- price confirmation
- booking/payment workflow

## On-Site Consultation

Purpose:

- in-person property walkthrough
- action plan for perimeter, plants, vents, fences, and materials

Needs:

- service area
- scheduling path
- price confirmation
- what the homeowner receives afterward

## Zone 0 Redesign

Purpose:

- full design or project-management engagement
- highest-value offer

Needs:

- qualification criteria
- portfolio examples
- clear scope boundaries
- referral/contractor workflow if installation is not handled directly

---

# 5. Funnel

1. Visitor arrives from search, referral, local forum, Nextdoor, Instagram, or
   insurance/inspection concern.
2. Homepage explains Zone 0 in plain English.
3. Guide content builds trust with specific, useful detail.
4. Before/after and materials content lowers the "will it look ugly?" concern.
5. Visitor submits the Tally Photo Check form.
6. Follow-up response routes them to:
   - quick DIY recommendations
   - paid Design Review
   - On-Site Consultation
   - full Redesign

---

# 6. Content Pillars

## Regulation and Compliance

Goal: answer "what is required and when?"

Pages:

- What is Zone 0?
- AB 3074 FAQ
- Rules and timeline
- Local fire authority lookup

## Ember Science

Goal: answer "why does this matter?"

Pages:

- ember dynamics
- 0-5 foot ignition mechanisms
- gutters, vents, decks, corners, and mulch as ember traps

## Materials and Design

Goal: answer "what should I use instead?"

Pages:

- gravel, river rock, and decomposed granite
- pavers and stone edges
- non-combustible privacy
- design without barren landscapes

## Planting and Native Landscapes

Goal: answer "what can stay or be planted nearby?"

Pages:

- Zone 0 plant caveats
- Zone 1 and Zone 2 plant palettes
- flora swaps for hazardous plants
- California native plant database by defensible-space zone

## Local SEO

Goal: answer "what applies where I live?"

Pages:

- Berkeley Hills
- Oakland Hills
- Kensington
- Orinda / Lafayette
- Moraga-Orinda
- San Ramon
- Marin and other future areas

---

# 7. Operating Plan

Weekly rhythm:

- choose one content page or one conversion improvement
- write from `docs/04-zone-0-guide-content.md`
- update the relevant HTML page
- run local preview
- check links and mobile layout
- commit with a focused Conventional Commit

Monthly rhythm:

- review Tally submissions
- identify common homeowner questions
- turn repeated questions into FAQ/content updates
- add before/after project photos when available
- update service-area and local authority information

---

# 8. Metrics

Track:

- Tally submissions
- form completion rate
- top landing pages
- search queries in Google Search Console
- local page traffic
- inquiries by city
- conversion from Photo Check to paid review/consult

Qualitative signals:

- repeated questions in submitted forms
- unclear service expectations
- local jurisdiction confusion
- objections about appearance, privacy, cost, and enforcement

---

# 9. Near-Term Business Decisions

Before pushing hard on promotion, decide:

- final service area
- whether paid services are design-only, consultation-only, or include
  installation/project management
- whether prices stay public
- how follow-up emails are handled after Tally submission
- whether photo-check responses include a PDF/report template
- whether to collect testimonials, project photos, and permission to publish
  before/after case studies

