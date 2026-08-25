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
- [ ] **Email aliases (6-address roster)**: Root domain has no MX, so mail to any `@zone0landscaping.com` address bounces. Decision 2026-08-20, roster revised 2026-08-24: all addresses stay free ImprovMX aliases forwarding to the owner's Gmail (no paid mailbox). MX/TXT DNS records for ImprovMX were added at GoDaddy 2026-08-20; still outstanding: create the free ImprovMX account, add the domain, and configure all six aliases (`hello@`, `support@`, `legal@`, `info@`, `leads@`, `brion@`) to forward to Gmail. `legal@` replaced `privacy@` on 2026-08-24; `info@` and `brion@` were added the same day. `hello@` is the only address placed in the markup — homepage footer (`index.html`), `faq/index.html`, and `pages/thank-you.html` — and remains the Photo Check `FROM_EMAIL` (re-confirmed 2026-08-24 against the owner's note pairing `leads@` with the photo form). The other five are alias-only: no genuine support, legal, or second-general-contact context exists on the site. Photo Check lead notifications are unaffected (`NOTIFY_EMAIL` already goes straight to Gmail).
- [ ] **Privacy Policy / Terms page**: No such page exists anywhere in the repo, which is why `legal@` has no home in the markup. The Photo Check flow collects homeowner photos, name, email, phone, and address details, so there is a real case for one. Offered and explicitly deferred 2026-08-24 — revisit before any paid product launch.
- [ ] **Photo Check — R2 cleanup**: Delete the 9 test objects in `zone0-photo-check-uploads` (see `docs/PROJECT-STATE.md`).
- [ ] **Review Portal — first production workflow run**: Cloudflare Access and the portal's own Resend secret are both confirmed live 2026-08-21; the actual queue → complete → send walkthrough hasn't been run yet. Needs the owner's own browser login through Access — see `docs/PROJECT-STATE.md`'s Photo Check Review Portal section and `docs/00-project-dashboard.md`'s Next section. Do this after the redesign deploy below, so it exercises the current categories.
- [ ] **Deploy the Photo Check redesign**: Per-side photo capture (Front/Back/Left/Right), address field replacing city, and zone-based review categories with Pass/Needs Work/Fail rating are implemented and locally verified (2026-08-24) but not deployed — the D1 migration (`review-worker/migrations/0002_address.sql`) hasn't been applied to the remote database and neither Worker has been redeployed. See `worker/README.md`'s "Deploying the per-side photo redesign" section and `docs/00-project-dashboard.md`'s Next section.

## 3. Site Expansion & Landing Pages
- [ ] **Create New Landing Pages**: Add dedicated pages for "Zone 0 Hardscape" and "Fire-Adapted Native Planting" under a new "Wildfire Defense" menu tab.
- [ ] **Add Portfolio Proof**: Create photo gallery showing "Before & After" fire-hazard mitigation (messy Zone 0 -> clean DG).
- [ ] **Develop Audit Product**: Define scope and price of paid Pre-Inspection Compliance Audit.

## 4. Business Discovery & Deployment
- [ ] **Google Business Profile**: Setup Service-Area Business profile for East Bay search visibility.
- [ ] **Web Analytics**: Install GA4 / Plausible tracking script to monitor page views and CTA clicks.
- [ ] **NotebookLM Sync**: Link Google Drive project folder as sources in NotebookLM.
