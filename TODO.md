# Zone 0 Landscaping — Active To-Do List

## 1. Homepage & Copy Updates
- [ ] **Dual-Pillar Messaging**: Align hero and feature copy around *Stress-Free Compliance* and *Beautiful Native Ecology*.
- [ ] **Zone 0 Materials Matrix**: Insert 2-column "Allowed vs. Banned" comparison table (wood bark vs. DG/river rock).
- [ ] **Runoff & Slope Protection**: Add "Fire-Safe in Summer, Slope-Stable in Winter" 3-card grid for East Bay hillside erosion control.
- [ ] **Native Plant Highlights**: Feature Coast Live Oak, Toyon, Lemonade Berry, Dudleya, California Fuchsia, Yarrow, and Salvia.

## 2. Interactive Tools & Local Features
- [ ] **East Bay ZIP Code Lookup**: Implement dynamic status lookup for `94708`, `94611`, `94563`, and `94549`.
- [ ] **Direct Contact CTA**: Configure "Have questions on new Zone 0 guidelines>>>" heading with clickable SMS/email links.
- [x] **Perimeter Photo Review**: Replaced with a custom Cloudflare Worker form (photos + notes), 2026-08-20 — see `worker/README.md`. Worker, R2 bucket, and Resend sending domain are live and verified end-to-end 2026-08-20.
- [ ] **hello@ inbox**: Root domain has no MX, so mail to `hello@zone0landscaping.com` bounces (it is published on the FAQ and thank-you pages). Set up ImprovMX free forwarding to Gmail at GoDaddy DNS. Lead notifications now go straight to Gmail, so this is about visitor email only.
- [ ] **Photo Check — R2 cleanup**: Delete the 5 test objects in `zone0-photo-check-uploads` (see `docs/PROJECT-STATE.md`).

## 3. Site Expansion & Landing Pages
- [ ] **Create New Landing Pages**: Add dedicated pages for "Zone 0 Hardscape" and "Fire-Adapted Native Planting" under a new "Wildfire Defense" menu tab.
- [ ] **Add Portfolio Proof**: Create photo gallery showing "Before & After" fire-hazard mitigation (messy Zone 0 -> clean DG).
- [ ] **Develop Audit Product**: Define scope and price of paid Pre-Inspection Compliance Audit.

## 4. Business Discovery & Deployment
- [ ] **Google Business Profile**: Setup Service-Area Business profile for East Bay search visibility.
- [ ] **Web Analytics**: Install GA4 / Plausible tracking script to monitor page views and CTA clicks.
- [ ] **NotebookLM Sync**: Link Google Drive project folder as sources in NotebookLM.
