# ZONE 0 LANDSCAPING — PROJECT TRUTH

**Purpose:** Authoritative current-state and decision record for all AI chats working on this project.

**Last Updated:** August 19, 2026

---

## 1. CURRENT ARCHITECTURE

### LOCKED DECISION — One-Page Homepage

**Status: LOCKED — 2026-08-19; section order updated 2026-08-24**

The Zone 0 public site is a ONE-PAGE HOMEPAGE (`index.html`) plus `pages/thank-you.html`.

Homepage sections, in order:
1. Header
2. Hero
3. Free Photo Check
4. Lean. Green. Clean.
5. Landscaping / Hardscaping / Design
6. Visual Proof
7. Understand the Zones
8. Resources
9. How We Help
10. Footer

**2026-08-24 change:** Free Photo Check moved from position 9 (just before Footer) to position 3 (immediately after Hero, before Lean. Green. Clean.), per explicit user request to surface the lead-gen form higher on the page. The `id="photo-check"` anchor and its `form-section`/`form-container` classes were preserved; only position changed.

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

**Custom Cloudflare Worker — LIVE 2026-08-20**

Tally has been replaced with a custom Photo Check backend, per explicit
request. Reason: live investigation confirmed Tally's hosted form (`81VgKP`)
never had real City/Photo-upload/Notes fields — only Name/Email/Phone existed
as functional controls — making photo submission (the entire point of the
form) impossible. This was not fixable from the repository since Tally's form
composition is dashboard-side only. See `docs/decisions.md`, 2026-08-20 entry.

Current architecture: real HTML form (`index.html#photo-check`,
`js/photo-check-form.js`) → Cloudflare Worker (`worker/`) → photos stored in
R2, lead emailed via Resend. Confirmed live: the Worker is deployed, the
Resend sending domain is verified, and a real submission through the
production site was confirmed delivered to the owner's inbox. See
`docs/PROJECT-STATE.md`'s Photo Check section for the verification evidence
and `worker/README.md` for the implementation.

An internal, Cloudflare Access-gated extension (`review-worker/`) was added
2026-08-20/21 for the owner to work leads end-to-end (queue, six-category
analysis, homeowner response). It does not change anything above — the
public form/Worker/R2/Resend path is unmodified except for one additive D1
insert. See `docs/PROJECT-STATE.md`'s Photo Check Review Portal section for
current status; not yet fully exercised in production.

### Photo Check Redesign — IMPLEMENTED AND DEPLOYED, VERIFIED LIVE (2026-08-24/25)

Per explicit decision, the intake form and review console were redesigned:

- **Form fields:** `city` replaced with a full property `address` (plain
  text, no map autocomplete/API). Name, Phone, Email kept.
- **Photos:** replaced the flat "1-3 generic photos" limit with **per-side
  capture** — Front/Back/Left/Right, up to 5 photos each, at least 1
  required per side. R2 keys now encode the side:
  `{leadId}/{zone}/{uuid}.{ext}`.
- **Public form UX:** `index.html#photo-check` is now a 3-step stepper
  (Property → Photos → Concerns) instead of one long form. See
  `js/photo-check-form.js`.
- **Review console categories:** the six categories changed from
  Landscape/Plants, Organic/Combustible Materials, Structure/Foundation,
  Hardscape/Ground Surface, Trees/Overhead Vegetation, Maintenance/Ongoing
  Risk — to zone-based categories: Zone 0 Ground Cover, Zone 0 Vegetation,
  Zone 1 Ladder Fuels, Zone 2 Spacing, Home Hardening, Combustible
  Storage/Attachments. The old per-category Status/Risk/Priority scheme
  (OK/Needs Attention/Critical, etc.) was replaced with a single
  **Pass / Needs Work / Fail** rating + one notes field per category. The
  more granular fields it replaced (Zone 0 Applicability, How Zone 0 Can
  Help, separate Risk/Priority) are gone, not preserved elsewhere — a
  deliberate simplification, not an oversight.
- **D1 schema:** `review-worker/migrations/0002_address.sql` renames
  `leads.city` to `leads.address`. Applied to the **local** D1 instance
  first, then successfully applied to the **remote/production** database
  (`wrangler d1 migrations apply zone0-leads --remote`, 2026-08-25).
- **Deployed 2026-08-25:** `review-worker` (`zone0-review-portal`) and the
  public `worker` (`zone0-photo-check`) were both redeployed via
  `wrangler deploy`, in that order, after the remote migration.
  `index.html`/`js/photo-check-form.js` were committed (`29aea70`) and
  pushed to `origin/main`, so GitHub Pages serves the new stepper.
- **Verified live in production, not just locally:** a real, clearly-marked
  test submission (name "QA TEST - DO NOT CONTACT") was POSTed directly to
  the deployed public Worker (`https://zone0-photo-check.
  zone0landscaping.workers.dev/submit`, real `Origin` header, 5 photos
  across all 4 zones) and returned `{"ok":true}`. Confirmed via direct
  queries against the **production** D1 database: the row has the new
  `address` column populated and `photo_keys` correctly encoding
  `{leadId}/{zone}/{uuid}.ext` for all 4 zones. Confirmed via the public
  `GET /photo/...` route: the stored photo is retrievable and
  byte-identical to the uploaded file. This test lead (id
  `98e8b645-4d17-43d0-8d2e-75eb2fafdfd2`) is still in R2/D1, alongside the
  9 pre-existing test objects already flagged for cleanup in `TODO.md`.
  Local-only verification (browser stepper walkthrough, local `wrangler
  dev` + local D1 round trip for `review-worker`'s categories/ratings) was
  also performed earlier the same day — see `docs/PROJECT-STATE.md` for
  that detail.
- **Still open:** the Review Portal's own authenticated UI (queue → lead
  detail → analysis → send) has not been exercised against this new
  scheme through a real Cloudflare Access browser login — see the P0 item
  below. The public submission path above is fully verified; the
  Access-gated review side still needs the owner's own browser login.

### Legacy Decision

Netlify Forms is no longer the current form solution, and remains not the
current solution now that Tally has also been retired.

### Legacy Custom Tool — RESOLVED 2026-08-19

The custom photo-review / hazard-analysis implementation (`js/modal.js`) has been deleted and confirmed absent in production (404). See Section 5 for full evidence.

---

## 3. CURRENT DEPLOYMENT

**Reported:** GitHub Pages

**Production domain:** `zone0landscaping.com`

**Repository:** `github.com/Sheehan935/Zone0`

**Branch:** `main`

**Last reported commit:** `5ff1975109fcfa90b5d297c938e6978c4be3999f` — VERIFIED 2026-08-19 via `gh api repos/Sheehan935/Zone0/pages/builds/latest`, which confirms this exact commit is the one actually deployed and built, not just pushed. See `docs/PROJECT-STATE.md` for full production verification detail.

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

### Legacy Photo Review Tool — RESOLVED 2026-08-19

`js/modal.js` (custom hazard-analysis quiz) is deleted from the repository at verified commit `5ff1975` and confirmed in production (`https://zone0landscaping.com/js/modal.js` returns 404). No further decision needed here — this was implemented, not just decided.

**Superseded 2026-08-20:** the sentence in this entry's original text claiming "Tally is the sole Photo Check implementation, confirmed live" is no longer true — Tally was retired the same day and replaced with the custom Cloudflare Worker backend described in Section 2. Preserved here for history, not as current fact.

### Buttondown — checked, not found in codebase

Every document in `docs/` and `README.md` has now been read in full (`00`–`05`, `decisions.md`). Zero references to Buttondown anywhere. This does not confirm or rule out an external Buttondown account managed outside this repository — that would need to be answered directly, not inferred from code. Status: **not referenced in the codebase; unverified as an external service.**

### Analytics — checked, not found in codebase

Same treatment: zero references to Plausible, Fathom, GA4, or any analytics provider anywhere in `docs/` or `README.md`. Status: **not referenced in the codebase; unverified as an external service.**

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