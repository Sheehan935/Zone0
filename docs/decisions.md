# Zone 0 Landscaping Website
## Decisions Log

**Last Updated:** July 30, 2026

---

Chronological record of decisions that aren't obvious from reading the code
or file structure — so they don't get re-litigated or accidentally reversed
later. Newest at the bottom.

---

### 2026-07-30 — Rename `Archives/` to `legacy/`, keep separate from `archive/`

**Decision:** The old capitalized `Archives/` folder (prior multi-page build
attempt, business-plan generator script, misc project files) is renamed to
`legacy/`, not merged into the new lowercase `archive/`.

**Why:** `archive/` holds the intentional single-file snapshots called for in
`01-project-brief.md`'s file org (`_template.html`, `oldIndex.html`).
`legacy/` holds an entire prior *attempt* at the site (a different multi-page
build with its own `styles.css`, plus non-web assets like the business-plan
script). Keeping them separate avoids conflating "reference snapshot" with
"abandoned build."

---

### 2026-07-30 — Move `thank-you.html` from `legacy/` into `pages/`

**Decision:** `thank-you.html` (the one at the root of the old `Archives/`,
not the copy inside `legacy/src-multipage-attempt/`) moves to `pages/`.

**Why:** The live site's Photo Check form should eventually redirect here —
it's part of the current build, not an abandoned attempt, so it doesn't
belong in `legacy/`. Its relative asset paths (`styles.css`, `index.html`
links) were rewritten with `../` prefixes since it now lives one directory
deeper than before.

**Follow-up:** ~~Nothing currently links to `pages/thank-you.html` yet — the
Tally form has no configured redirect.~~ Resolved 2026-07-30 — Brian
configured the redirect directly in the Tally dashboard.

---

### 2026-07-30 — Site map and content plan describe the current single-page build, not future architecture

**Decision:** `reference/site-map.md` and `03-content-plan.md` document what's
actually deployed (`index.html` as the entire site) rather than the
multi-page structure implied by the nav/footer links or by
`01-project-brief.md`'s V1 scope.

**Why:** Docs describing an aspirational architecture stop being useful once
they no longer match the deployed site — they mislead more than they help.

---

### 2026-07-30 — V1 ships single-page

**Decision:** V1 is a single page (`index.html`). The nav and footer links to
`/zone-0/`, `/design/`, `/materials/`, `/local/`, `/services/`, `/about/`,
`/contact/`, `/faq/`, and their sub-pages do not get built out — they get
trimmed or repointed to in-page anchors instead.

**Why:** Resolves the fork left open in `reference/site-map.md` and
`03-content-plan.md`. Keeps V1 scoped to what's already built rather than
committing to building ~20 additional pages of content.

**Follow-up:** `01-project-brief.md`'s V1 scope (which lists separate
Services/Before & After/FAQ/Contact pages) is now stale and should be
reconciled with this decision.

---

### 2026-07-30 — Trimmed index.html nav/footer to in-page anchors

**Decision:** Header nav and footer now link to `#guide`, `#design`,
`#services`, `#faq`, `#photo-check` — real sections on the page — instead of
`/zone-0/`, `/design/`, `/materials/`, `/local/`, `/services/`, `/about/`,
`/contact/`, `/faq/`. Added `id` attributes to the Design Principles, Services
Overview, Guide Preview, and FAQ sections so the anchors resolve. Dropped
"Materials" and "Local" nav items outright — no on-page section corresponds
to either.

**Why:** Direct consequence of the single-page decision above. Also fixes
`pages/thank-you.html`'s "Back to Services" link, which already pointed at
`index.html#services` before the `id="services"` existed.

**Not done:** ~14 links inside body copy (service cards, design-principle
cards, guide-preview cards, the regulation banner, the gallery CTA) still
point to the same unbuilt routes. Left alone deliberately — each is tied to
specific unwritten content, and deciding whether to strip the link or
repoint it to a section is a content call, not a mechanical one.

**Also noted:** The `reference/ux-review.md` "broken mailto form" item (#1) is stale —
`#photo-check` is already a working Tally embed (see commit `1c7683d`). The
redirect-to-thank-you-page gap was resolved 2026-07-30 (Tally dashboard
setting, configured by Brian).

---

### 2026-07-30 — Formalized standing project constraints

**Decision:** Recording these as permanent, not to be revisited without an
explicit request: (1) static HTML/CSS/vanilla JS only — no framework, no
build step, no npm dependencies; (2) contact forms use Tally; (3) content
is educational before promotional, per the brand personality in
`01-project-brief.md` ("avoid fear-based messaging, alarmist language").

**Why:** These were already true in practice but hadn't been written down.
A large enhancement request (see next entry) asked for React-based icons,
which would have violated (1) silently if not already on record.

---

### 2026-07-30 — Premium polish pass: icons, nav, no fabricated social proof

**Decision:** Implemented a hero/header refinement pass with three
constraints applied to the original request: (1) icons are inline SVG
(Lucide-style paths), not Lucide React — keeps the static-only constraint
above intact; (2) nav is Services/Process/Gallery/FAQ, mapped to existing
sections (`#services`, `#process` on Trust Strip, `#gallery` on the
Before & After preview, `#faq`) — dropped "Portfolio" and "About" since
neither has corresponding content and V1 is single-page; (3) no star
rating or specific service-area town list was added — `02-content-plan.md`
already has both flagged as unconfirmed, and publishing either would be a
false-claims risk. The trust bar/indicators that shipped use only
already-true, non-numeric claims (e.g. "East Bay Specialists").

**Also:** A mobile hamburger menu (vanilla JS, `js/main.js`) replaced the
simpler stacked-nav CSS fix from the previous mobile-audit pass, since it
was explicitly requested this time with specific UX requirements (CTA at
top of the drawer, smooth open/close, Escape-to-close). This supersedes
the "avoid JS complexity" reasoning used in the earlier fix — that
reasoning held until a fuller nav treatment was explicitly asked for.

**Why:** Matches your instruction to ask before architectural changes and
avoid scope creep, while still delivering the parts of the request that
fit the existing static-site, single-page constraints.

**Not done:** The "Optional Enhancement" image overlay callouts (dense
vegetation / fire-adapted plants bullet lists on the before/after images)
were skipped — marked optional in the request, and adds real layout
complexity for a page that already communicates the transformation via
labeled before/after images. The SEO ask to work "Fire-Adapted
Landscaping," "East Bay," and "California" into the H1 was not applied —
it directly conflicted with the same request's explicit instruction to
"keep the existing headline," and the literal instruction was honored.

---

### 2026-07-30 — Reconciled `01-project-brief.md` V1 scope with single-page decision

**Decision:** Updated the "Version 1 Scope" section to describe anchor-linked
sections on one page instead of separate Services/Before & After/FAQ/Contact
pages. Closes the staleness flagged in the "V1 ships single-page" entry
above. Also added `legacy/` and `docs/reference/` to the File Organization
section, which existed on disk but weren't documented.

**Why:** `01-project-brief.md` is meant to only change when project
direction changes — this was a real direction change (multi-page → single-
page) that the brief hadn't caught up to yet.

---

### 2026-07-30 — Stripped the remaining 11 dead body-copy links

**Decision:** Removed every remaining link in body copy that pointed to an
unbuilt page, rather than leaving them dead or building the pages: hero
secondary CTA ("See Zone 0 Rules"), regulation band ("Read the Timeline"),
risk section ("Learn how embers ignite homes"), all 4 Design Principles
"learn more" links, the gallery's "Explore the Before & After Gallery"
button, and all 3 Guide Preview cards (converted from `<a>` to `<div>` so
the card styling stays but there's no dead click target). Cleaned up the
now-orphaned `.text-link` and `.status-banner a` CSS selectors.

**Why:** Same reasoning as the "View all FAQs" removal — a link with no
destination reads as broken or unfinished, which undercuts trust more than
having no link at all. `link-audit.md` already recommended most of these
as "Future standalone page" (V2); removing them now doesn't foreclose
building the pages later, it just stops pretending they exist today.

**Verified:** Re-rendered the full page headlessly — zero remaining
`href="/..."` links besides the logo, zero console/page errors, layout
unaffected (checked full-page screenshot).

---

### 2026-07-30 — Superseded: V1 is no longer single-page

**Decision:** The "V1 ships single-page" decision (earlier this same day)
is superseded. Brian explicitly requested a real standalone `services.html`
page, confirmed (not the existing `#services` home-page section). The
site moves to a multi-page structure starting with this page.

**Why:** Direct, explicit request — the scenario the original single-page
decision's own header says it takes to reopen ("not to be revisited unless
explicitly requested").

**Practical implications, tracked as follow-up work:**
- `01-project-brief.md`'s Version 1 Scope needs another pass (this will be
  the second reversal in one day — brief updated to single-page a few
  hours ago).
- Home page nav/footer currently point `Services` at `#services` (the
  anchor section) — needs to point at the new page instead once it exists.
  The home page's Services Overview section content and the new page's
  content will need to agree on which is authoritative.
- New pages live in `pages/` per `01-project-brief.md`'s File Organization
  (matches `pages/thank-you.html`), not at root — keeps `index.html` as
  the only root-level page.
- This reopens the question of the other 10 links stripped in the
  previous entry (materials, design guides, rules timeline, etc.) — they
  were removed on the premise that V1 stays single-page. That premise no
  longer holds; whether to rebuild those as real pages is a separate call,
  not assumed here.

---

### 2026-08-01 — Reverted back to single-page; removed pricing; pure education framing

**Decision:** `pages/services.html` is gone (moved to `archive/services.html`
outside this session's action — found already relocated on disk when this
work started). Rather than rebuild it, went back to single-page: nav/footer
"Services" removed, repointed to a "Zones" link. The `#services`
pricing-tier section (Free/$299/$750/Custom cards) was removed from
`index.html` entirely, not just unlinked. Hero headline/subheadline
rewritten to a purely educational framing ("Fire-Safe Defensible Space
Meets California Native Landscape Design") with no pricing or sales
language. Hero primary CTA now points to a new `#zones` anchor (added to
the existing "5-Foot Zone Matters Most" section) instead of the lead form.

**Why:** Explicit direction change requested directly. Net effect: the
site is single-page again, and positions the business as an educational
resource rather than a service-tier storefront — the opposite framing
from the "premium landscaping" hero rewrite earlier the same day.

**Not done:** The photo-check lead form and its own path to conversion
remain untouched — only the pricing/tier presentation and hero framing
changed. Whether the removed $299/$750/Custom tiers get reintroduced in
some other form is an open question, not decided here.
