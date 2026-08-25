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
- [x] **Photo Check — R2 cleanup (partial, unambiguous items only)**: 2026-08-25 — pulled the real bucket listing via the Cloudflare API (the "9 objects" estimate in this file's prior entries was never verified against an actual listing; the bucket in fact held 28 objects across 6 D1 leads + 22 orphaned pre-D1 objects). Deleted the 3 D1 rows and their 10 R2 objects that were unambiguous test junk: `89790bbf...` ("CLAUDE TEST - review portal D1 verification, ignore/delete"), `98e8b645...` ("QA TEST - DO NOT CONTACT"), `f5d474c4...` ("QA TEST 2 - DO NOT CONTACT"). See `docs/PROJECT-STATE.md`'s Photo Check Redesign entry for the full before/after inventory and the items deliberately left alone pending the owner's call (real verification history, not junk).
- [x] **Review Portal — first production workflow run**: Completed 2026-08-25 — owner logged in via Cloudflare Access, ran a real lead through queue → analysis → complete → send, and the send succeeded. A follow-on 422 seen while testing with `@example.com` addresses was initially misread as a missing Resend domain verification; the owner checked the Resend dashboard directly and confirmed `zone0landscaping.com` is already Verified and covers both API keys in the account — the 422s were Resend rejecting the reserved `example.com` test domain by design, not a real gap. No domain-verification action needed. See `docs/PROJECT-STATE.md`'s Photo Check Review Portal section.
- [x] **Deploy the Photo Check redesign**: Per-side photo capture (Front/Back/Left/Right), address field replacing city, and zone-based review categories with Pass/Needs Work/Fail rating — deployed and verified live 2026-08-25 (D1 migration applied to remote, both Workers redeployed, static site pushed, real production submission confirmed end-to-end). See `docs/PROJECT-STATE.md`'s Photo Check Redesign entry.

## 3. Site Expansion & Landing Pages
- [ ] **Create New Landing Pages**: Add dedicated pages for "Zone 0 Hardscape" and "Fire-Adapted Native Planting" under a new "Wildfire Defense" menu tab.
- [ ] **Add Portfolio Proof**: Create photo gallery showing "Before & After" fire-hazard mitigation (messy Zone 0 -> clean DG).
- [ ] **Develop Audit Product**: Define scope and price of paid Pre-Inspection Compliance Audit.

## 4. Business Discovery & Deployment
- [ ] **Google Business Profile**: Setup Service-Area Business profile for East Bay search visibility.
- [ ] **Web Analytics**: Install GA4 / Plausible tracking script to monitor page views and CTA clicks.
- [ ] **NotebookLM Sync**: Link Google Drive project folder as sources in NotebookLM.
