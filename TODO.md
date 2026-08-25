# Zone 0 Landscaping — Tasks

Locked decisions and the detailed verification log live in `PROJECT-TRUTH.md`
(merged from that file + `docs/PROJECT-STATE.md` 2026-08-25, along with this
file absorbing `docs/00-project-dashboard.md` — four task/state docs down to
two, since keeping the same fact in sync across more files than that was
causing real drift). This file is the single place for "what's active" and
"what's next."

Never more than 3 active items in **Next**.

---

## Next

**0 active items as of 2026-08-25** — the Photo Check redesign (per-side
photos, address field, zone-based review categories) is fully deployed and
verified live, including the Review Portal's first authenticated send. See
`PROJECT-TRUTH.md` §3.6–3.8 for the full record.

No new items have been identified. Add one here only when there's a
concrete, evidenced reason to — don't invent speculative next steps.

---

## Recently completed (evidence in `PROJECT-TRUTH.md`)

- [x] **Photo Check redesign, deployed & verified** (2026-08-25): per-side
  photo capture, address field, zone-based Pass/Needs-Work/Fail review
  categories — D1 migration applied to remote, both Workers redeployed,
  static site pushed, real production submission confirmed end-to-end.
- [x] **Review Portal — first production workflow run** (2026-08-25):
  queue → analysis → complete → send, completed successfully by the owner
  through Cloudflare Access.
- [x] **R2/D1 test-data cleanup, partial** (2026-08-25): deleted the 3
  unambiguous test leads and their 10 R2 objects; 3 real historical leads
  and several unlabeled pre-D1 R2 objects deliberately left for the owner's
  own call — see `PROJECT-TRUTH.md` §3.8 for the full inventory.
- [x] **Perimeter Photo Review** (2026-08-20): replaced Tally with a custom
  Cloudflare Worker form — see `worker/README.md`.

## Backlog

### Homepage & Copy
- [ ] **Dual-Pillar Messaging**: Align hero and feature copy around *Stress-Free Compliance* and *Beautiful Native Ecology*.
- [ ] **Zone 0 Materials Matrix**: Insert 2-column "Allowed vs. Banned" comparison table (wood bark vs. DG/river rock).
- [ ] **Runoff & Slope Protection**: Add "Fire-Safe in Summer, Slope-Stable in Winter" 3-card grid for East Bay hillside erosion control.
- [ ] **Native Plant Highlights**: Feature Coast Live Oak, Toyon, Lemonade Berry, Dudleya, California Fuchsia, Yarrow, and Salvia.

### Interactive Tools & Local Features
- [ ] **East Bay ZIP Code Lookup**: Implement dynamic status lookup for `94708`, `94611`, `94563`, and `94549`.
- [ ] **Direct Contact CTA**: Configure "Have questions on new Zone 0 guidelines>>>" heading with clickable SMS/email links.
- [ ] **Email aliases (6-address roster)**: ImprovMX account/domain/alias setup still outstanding — see `PROJECT-TRUTH.md` §3.9 for the full roster and current status. Photo Check lead notifications are unaffected.
- [ ] **Privacy Policy / Terms page**: No such page exists yet. The Photo Check flow collects homeowner photos, name, email, phone, and address, so there's a real case for one. Explicitly deferred 2026-08-24 — revisit before any paid product launch.

### Site Expansion & Landing Pages
- [ ] **Create New Landing Pages**: Add dedicated pages for "Zone 0 Hardscape" and "Fire-Adapted Native Planting" under a new "Wildfire Defense" menu tab.
- [ ] **Add Portfolio Proof**: Create photo gallery showing "Before & After" fire-hazard mitigation (messy Zone 0 -> clean DG).
- [ ] **Develop Audit Product**: Define scope and price of paid Pre-Inspection Compliance Audit.
- [ ] Add real testimonials only when real reviews exist.
- [ ] Add a real service-area/town list if approved.
- [ ] Add more before/after project photos.
- [ ] Confirm final pricing before publishing.
- [ ] Evaluate additional guide/content pages only after architecture is resolved.
- [ ] Evaluate local SEO pages only after explicit scope approval.

### Business Discovery & Deployment
- [ ] **Google Business Profile**: Setup Service-Area Business profile for East Bay search visibility.
- [ ] **Web Analytics**: Install GA4 / Plausible tracking script to monitor page views and CTA clicks.
- [ ] **NotebookLM Sync**: Link Google Drive project folder as sources in NotebookLM.

---

## Explicitly out of scope (not current launch requirements)

- Previous 12-page architecture (UNLOCKED/RETIRED, not deleted from project history).
- Unapproved multi-page expansion.
- Shopify plant catalog / e-commerce.
- Gravel/stone firebreak packages.
- Advanced developer tooling.
- Astro SSG framework migration.
- Any new route not explicitly approved.

---

## Status Legend

🔴 Blocked
🟠 Open
🔵 In Progress
🟡 Needs Review
🟢 Complete
⚪ Deferred
🚨 Requires Decision
