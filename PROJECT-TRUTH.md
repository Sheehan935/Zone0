# ZONE 0 LANDSCAPING — PROJECT TRUTH

**Purpose:** Authoritative current-state and decision record for all AI chats working on this project.

**Last Updated:** August 19, 2026

---

## 1. CURRENT ARCHITECTURE

### LOCKED DECISION — One-Page Homepage

**Status: LOCKED — 2026-08-19**

The Zone 0 public site is a ONE-PAGE HOMEPAGE (`index.html`) plus `pages/thank-you.html`.

Homepage sections, in order:
1. Header
2. Hero
3. Lean. Green. Clean.
4. Landscaping / Hardscaping / Design
5. Visual Proof
6. Understand the Zones
7. Resources
8. How We Help
9. Free Photo Check
10. Footer

Brand hierarchy:
- Primary positioning: Protecting Homes. Preserving Landscapes.
- Philosophy: Lean. Green. Clean.
- Practical promise: Know what to fix. Get the work done. Keep the proof.

This resolves the "Page Architecture" item previously listed as UNRESOLVED in Section 5 (below). It does not reopen or change the separately-retired 12-page architecture.

### Historical Note — Multi-Page Implementation (2026-08-03 – 2026-08-18)

Between 2026-08-03 and 2026-08-18 the live site and repository were deliberately built and maintained as multi-page (`/zone-0/`, `/materials/`, `/faq/`, `/design/`, and briefly `pages/services.html`), per `docs/decisions.md`'s 2026-08-05 entry and confirmed independently by Git history and a production fetch. This was real, deliberate, and verified at the time — not an error or unapproved drift. It is superseded by the LOCKED one-page decision above, effective 2026-08-19. This note exists so history isn't erased or misrepresented as "the site was always one-page."

### Legacy Pages — Source Material Only

`/zone-0/`, `/materials/`, `/faq/`, `/design/`, and any other legacy public pages are retained on disk as SOURCE MATERIAL for homepage consolidation. They are not deleted as part of this decision. Their longer-term disposition (delete, archive, redirect) is a separate, still-open question, not resolved here.

### Previous 12-Page Architecture

**UNLOCKED / RETIRED**

The previous requirement that launch must contain 12 pages is no longer locked.

Do not create or require additional page routes unless separately approved.

---

## 2. CURRENT FORM SYSTEM

**Tally**

Tally is the current Photo Check / form solution.

### Legacy Decision

Netlify Forms is no longer the current form solution.

Do not propose replacing Tally with Netlify Forms unless explicitly asked to reconsider the architecture.

### Legacy Custom Tool

A custom photo-review / hazard-analysis implementation has existed or may exist in older project files.

Its current disposition is **UNRESOLVED**.

Do not delete it, restore it, or replace it without an explicit decision.

---

## 3. CURRENT DEPLOYMENT

**Reported:** GitHub Pages

**Production domain:** `zone0landscaping.com`

**Repository:** `github.com/Sheehan935/Zone0`

**Branch:** `main`

**Last reported commit:** `b7f6ccf`

These values must be re-verified before making claims about current repository or deployment state.

---

## 4. TECHNICAL ARCHITECTURE

Current reported architecture:

- Plain HTML
- CSS
- JavaScript
- No framework
- No Tailwind
- No npm
- No package.json
- No build process

Do not introduce a framework, build system, npm dependency, or CSS framework without explicit approval.

---

## 5. CURRENTLY UNRESOLVED

These are NOT decisions.

They are questions requiring evidence or explicit project decisions.

### Page Architecture — RESOLVED 2026-08-19

See Section 1. No longer unresolved. Legacy `/zone-0/`, `/materials/`, `/faq/`, `/design/` retained as source material, not deleted.

### Legacy Photo Review Tool

Determine what currently exists regarding:
- `js/modal.js`
- custom hazard-analysis quiz
- Tally implementation

Do not delete or replace anything without an explicit decision.

### Buttondown

Current status: **NOT VERIFIED**

### Analytics

Plausible/Fathom status: **NOT VERIFIED**

---

## 6. PROJECT GOVERNANCE RULES

### Evidence First

Never assume the current codebase matches documentation.

Verify before claiming:

- a file exists
- a page exists
- a route exists
- a feature exists
- a commit is current
- local and GitHub are synchronized
- GitHub and production are synchronized
- an integration is installed
- an integration works

### Decision Protection

A decision marked:

**CURRENT**

must not be casually reopened.

A decision marked:

**UNLOCKED / RETIRED**

must not be treated as current.

An item marked:

**UNRESOLVED**

must not be converted into a decision by assumption.

### Conflict Handling

When evidence conflicts with this document:

DO NOT choose which version is correct automatically.

Report:

**CONFLICT DETECTED**

Then identify:

1. What the project truth says
2. What the current evidence says
3. What cannot yet be verified

### No Scope Expansion

Do not introduce new features, pages, frameworks, integrations, or architecture changes because they appear useful.

### No Silent Work

Do not claim work was completed unless it was actually completed during the current interaction.

Do not say:

> "I'm working on it. Check back later."

If blocked, state exactly what is missing.

---

## 7. SOURCE-OF-TRUTH HIERARCHY

When sources disagree, use this order:

1. Explicit current project decision
2. Current repository/code evidence
3. Current production evidence
4. Current project documentation
5. Historical documentation
6. AI assumptions

AI assumptions are never authoritative.

---

## 8. REQUIRED AI BEHAVIOR

Before proposing changes:

1. Read this file.
2. Identify the relevant current decisions.
3. Inspect available evidence.
4. Separate facts from assumptions.
5. Report contradictions.
6. Do not silently resolve contradictions.

Every response should distinguish:

- VERIFIED
- UNVERIFIED
- CONTRADICTED
- CURRENT DECISION
- UNRESOLVED

---

## 9. CURRENT PROJECT STATE

This file is the authoritative decision/state layer.

The Project Control Dashboard is a separate document.

Do not turn this file into a task tracker.

Do not add speculative tasks here.

---

## 10. CHANGE CONTROL

Changes to this document represent project-state or project-decision changes.

Do not modify a CURRENT decision simply because another AI recommends something different.

Any proposed change must identify:

- Previous state
- Proposed state
- Evidence/reason
- Whether explicit approval is required

---

**END PROJECT TRUTH**