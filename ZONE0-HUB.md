# Zone 0 Landscaping: Central Operations Hub

> **This is a synthesized dashboard, not a live source of truth.** It is regenerated periodically from the systems below — don't hand-edit tasks or state here. Live task tracking lives in the **[Tasks Sheet](https://docs.google.com/spreadsheets/d/1FZCOyy2eHsbIFlogOByNI50Oku7R0p0JUtNUbfvulZc/edit)**; verified code/architecture state lives in **[PROJECT-TRUTH.md](https://github.com/Sheehan935/Zone0/blob/main/PROJECT-TRUTH.md)** on git.

---

## 0. Status & Dashboard
- **Last Updated:** 2026-08-28
- **Current Overall Status:** 🟢 Active — Photo Check + Review Portal fully operational in production
- **Active Sprint Focus:** Business Discovery & Deployment — single `NOW`: **Market Research** (East Bay landscaping market/competitors)
- **Live Site Health:** 🟢 [zone0landscaping.com](https://zone0landscaping.com/) — GitHub Pages, last confirmed sync at commit `f6a72ee` (2026-08-25). Lead flow (submit → R2 photo storage → D1 → Resend email) tested end-to-end same day.

**⚠️ Two open contradictions between sources — resolve, don't assume:**
1. **Email aliases status** — Tasks Sheet lists the 6-address ImprovMX roster as *Backlog/outstanding*, but the Infrastructure Hub Sheet's DNS table shows ImprovMX forwarding as **Active** for hello@/leads@/info@/brian@/catch-all. Confirm directly with the mailbox before treating either as current.
2. **Audit/consultation pricing** — Tasks Sheet has "Develop Audit Product" as *Backlog* ("define scope and price"), but the Infrastructure Hub Sheet's site-section map already lists **$299 Pre-Inspection Audit / $750 Design Consultation** as live "Working Pricing" (Section 9). Confirm whether this is decided or still draft before treating either as authoritative.

---

## 1. Active Focus (snapshot only — live tracker is the Sheet)
- [ ] **NOW — Market Research:** local East Bay landscaping market & competitors (only active item as of 2026-08-25; ADHD guardrail — don't pull the next one until this closes or is explicitly deferred)
- Top of Backlog, for context only:
  - Dual-Pillar Messaging (align hero/feature copy around Stress-Free Compliance + Beautiful Native Ecology)
  - Privacy Policy / Terms page (no page exists yet; Photo Check collects name/email/phone/address/photos — explicitly deferred 2026-08-24, revisit before any paid launch)
  - Typography & card-radius polish pass (Zones/Resources H2 at 30px vs 36px sitewide; Visual Proof cards at 0px radius vs 8px standard — known leftover, not a regression)

Full backlog, status, and the one-`NOW`-at-a-time filter live only in the **[Tasks Sheet](https://docs.google.com/spreadsheets/d/1FZCOyy2eHsbIFlogOByNI50Oku7R0p0JUtNUbfvulZc/edit)**.

---

## 2. Project State Log ("PROJECT-TRUTH")
*Condensed from git [PROJECT-TRUTH.md](https://github.com/Sheehan935/Zone0/blob/main/PROJECT-TRUTH.md) and [docs/decisions.md](https://github.com/Sheehan935/Zone0/blob/main/docs/decisions.md). Full narrative stays in git — this is a timeline, not a replacement.*

- **2026-07-30:** Formalized standing constraints — static HTML/CSS/vanilla JS only, Tally for forms (later superseded), educational-first messaging. `Archives/` renamed to `legacy/`; 11 dead links to unbuilt pages removed. "V1 ships single-page" — ~20 planned pages cut in favor of in-page anchors.
- **2026-08-01:** Reverted to single-page structure; pricing tiers removed; hero reframed as purely educational.
- **2026-08-05:** Documented ~80 commits of undocumented multi-page work (built 08-03/08-04); `assets/` structure standardized; filenames normalized to lowercase-hyphen.
- **2026-08-19 (LOCKED):** One-page architecture finalized — `index.html` + `pages/thank-you.html`; multi-page build kept on disk as source material, not deployed.
- **2026-08-20:** Tally replaced with a custom Cloudflare Worker + R2 + Resend pipeline for photo intake; footer nav (Company/Explore/Contact) added; logo revised to leaf mark + "ZONE ZERO" wordmark.
- **2026-08-24/25:** Photo Check redesigned — per-side capture (Front/Back/Left/Right, up to 5 each), "city" → full "address" field, 3-step stepper UI. Risk Calculator UI rebuilt (scoring unchanged). Homepage copy refreshed for accessibility.
- **2026-08-25:** Bug fix (`6232182`) corrected `sendHomeownerResponse` to use the renamed `address` column. Resend domain confirmed verified (prior 422s were from rejected `@example.com` test data). Review Portal's first full production workflow run completed successfully via Cloudflare Access. R2/D1 cleanup: 3 unambiguous test leads + 10 objects deleted; 3 real historical leads deliberately left for owner review.

**Out of scope / explicitly rejected:** Shopify e-commerce, Astro SSG migration, new routes without approval, the retired 12-page launch plan. Analytics and Buttondown are unverified — zero repo references found.

---

## 3. Digital Infrastructure & Assets

### 3.1 Web & Code
- **Live Site:** [zone0landscaping.com](https://zone0landscaping.com/) — GitHub Pages, custom domain, DNS via Cloudflare
- **GitHub Repo:** [github.com/Sheehan935/Zone0](https://github.com/Sheehan935/Zone0) (branch `main`)
- **Photo Check Worker (public):** [zone0-photo-check.zone0landscaping.workers.dev](https://zone0-photo-check.zone0landscaping.workers.dev) — receives uploads, writes to R2, emails leads via Resend ([worker/](https://github.com/Sheehan935/Zone0/tree/main/worker))
- **Review Portal (Cloudflare Access-gated):** [zone0-review-portal.zone0landscaping.workers.dev/review](https://zone0-review-portal.zone0landscaping.workers.dev/review/) — internal photo-review dashboard ([review-worker/](https://github.com/Sheehan935/Zone0/tree/main/review-worker))
- **Key repo docs:** [PROJECT-TRUTH.md](https://github.com/Sheehan935/Zone0/blob/main/PROJECT-TRUTH.md) (authoritative state) · [TODO.md](https://github.com/Sheehan935/Zone0/blob/main/TODO.md) (active step only) · [README.md](https://github.com/Sheehan935/Zone0/blob/main/README.md) · [CLAUDE.md](https://github.com/Sheehan935/Zone0/blob/main/CLAUDE.md) · [worker/README.md](https://github.com/Sheehan935/Zone0/blob/main/worker/README.md) · [docs/decisions.md](https://github.com/Sheehan935/Zone0/blob/main/docs/decisions.md) (reference)
- **Source (never trust a copy over these):** [index.html](https://github.com/Sheehan935/Zone0/blob/main/index.html) · [css/styles.css](https://github.com/Sheehan935/Zone0/blob/main/css/styles.css) · [js/photo-check-form.js](https://github.com/Sheehan935/Zone0/blob/main/js/photo-check-form.js) · [js/zone0-tools.js](https://github.com/Sheehan935/Zone0/blob/main/js/zone0-tools.js) · [js/main.js](https://github.com/Sheehan935/Zone0/blob/main/js/main.js) · [CNAME](https://github.com/Sheehan935/Zone0/blob/main/CNAME)

### 3.2 Brand & Marketing
- **Brand Guide:** [Zone 0 Landscaping Brand Guide](https://docs.google.com/document/d/1awNFMUbs8eCUEQh4fzVSkxM4MiatYXU_zusjmTpsGy0/edit) — single brand reference
- **Business Strategy:** [Zone 0 Landscaping Business Strategy Summary](https://docs.google.com/document/d/1kwtCb1tXs5r_diUn6H4AOoBojRkJU2xmweLwy1-UmpQ/edit) — single strategy reference
- **E-Book:** [Ember Defense Zone 0](https://docs.google.com/document/d/10g3pEW-1qEBqH9wkqg3W4C_zIzmljrUkpW5RPS9yQhM/edit) — outline + Ch. 1–3 drafted, 4–6 outline only
- **Passive Monetization (reference):** [doc](https://docs.google.com/document/d/1cZbizzbZUt4V1kafZl2Qd78yqe0RSf46zAic__xzc7U/edit)
- **Sitemap/Content Plan (reference):** [doc](https://docs.google.com/document/d/1S31WiUVXSd0wQzZH8MFk2omO1rxSW5qL6z5R8rEaUI4/edit)
- **Planning docs (reference only):** [Single Thread Master Control Panel](https://docs.google.com/document/d/1vb1s5mdNMvFYGQIy-4t7_NKQuPao0M9sjLPb4kd6CNs/edit) · [Master Project Handoff & Directions](https://docs.google.com/document/d/1OlppvpafXMjuQgc2VkNQ4FM-SuRVdx36F3pn9H2YfwQ/edit) · [Living Changelog & Activity Log](https://docs.google.com/document/d/1s-4nn7FusM9R15UpBQ8Ia_wmWaE4GbJ1UGY-Vb36LqE/edit) · [zone0handoff.md](https://docs.google.com/document/d/1zyJm6Zbg82FqNUzuPSnwhX3z8iRmojuhUPapE5Wsyfo/edit) (Worker backend notes)

### 3.3 Operations & Subject Matter
- **Rules & Regulations:** [Zone 0 Rules & Timeline Guide](https://docs.google.com/document/d/1ehfiFXmjrGIyQYLZpcAC_AXp-p6wsIEA99R9vQQyTG8/edit) — AB 3074 / defensible space regs (reference)
- **Compliance Checklist:** [Homeowner Action Checklist & Compliance Guide](https://docs.google.com/document/d/1DnqJ44ajWzCaY0YchXLyuSaE2KksZQSTcB97TSk3RN4/edit) (reference)
- **Plant Database:** [California Native Plant & Fire-Resilience Guide](https://docs.google.com/document/d/1CsXCiyXzcHQoVjuAyqKOJ11KMK09q7cafbNr12SdAyw/edit) — full species table lives here, not duplicated below (reference)
- **Trackers:** [Zone 0 Landscaping Tasks](https://docs.google.com/spreadsheets/d/1FZCOyy2eHsbIFlogOByNI50Oku7R0p0JUtNUbfvulZc/edit) (live, day-to-day) · [Website & Infrastructure Hub](https://docs.google.com/spreadsheets/d/1662SdwNjuBvePFz4T-kakrEg8tN9hwxBm02P2Sshkq8/edit) (DNS/email/colors/plant links)
- **Drive Root:** [Zone0 Project Folder](https://drive.google.com/drive/folders/1VVrF49bPNckvZyMI7DC8GTosg2MmLxOE)

---

## 4. Technical Configuration
*From the [Website & Infrastructure Hub](https://docs.google.com/spreadsheets/d/1662SdwNjuBvePFz4T-kakrEg8tN9hwxBm02P2Sshkq8/edit) sheet.*

**Site basics** — Tagline: "Fire-adapted landscaping. Beautiful by design." · Hosting: GitHub Pages · DNS: Cloudflare · Stack: plain HTML5/CSS3/vanilla JS, no framework, no build step · Target area: East Bay Hills (Berkeley, Oakland, Orinda, Lafayette)

**DNS**
| Type | Name | Value | Priority |
|---|---|---|---|
| MX | @ | mx1.improvmx.com | 10 |
| MX | @ | mx2.improvmx.com | 20 |
| TXT | @ | `v=spf1 include:spf.improvmx.com ~all` | — |
| CNAME | www | sheehan935.github.io | — |

**Email forwarding (ImprovMX → sheehan935@gmail.com)** — hello@, leads@, info@, brian@, and catch-all `*@zone0landscaping.com`. *(See contradiction #1 above — Sheet marks aliases as Active, Tasks tracker marks the same work Backlog.)*

**Brand colors**
| Name | Hex | Role |
|---|---|---|
| Deep Forest Green | `#2d4a3f` | Primary brand / nav / headers |
| Dark Pine | `#1e332a` | Footer / dark accents |
| Terracotta Earth | `#c85a2f` | Primary CTA / alerts / accent |
| Soft Terracotta Tint | `#fbeee8` | Banner backgrounds |
| Warm Parchment | `#f8f6f0` | Body background |
| Clean White | `#ffffff` | Card backgrounds |
| Dark Charcoal Slate | `#222b27` | Body text |
| Muted Sage Slate | `#5a6660` | Subheaders / muted text |

**Typography:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. SVG badge icons fixed at 20×20px.

**Site section map (index.html, 11 sections):** Hero → Dual-Pillar (Compliance/Ecology) → Zone 0 Risk Metrics → Zones 0–3 Education → Design Principles → Materials Matrix (Allowed vs. Avoid) → Runoff & Slope Protection → Native Designs Portfolio → Services & Pricing ($299 audit / $750 consultation — see contradiction #2) → Photo Check Form → FAQ & Compliance.

**Native plant table:** 10 species (Coast Live Oak, Toyon, Lemonade Berry, Dudleya, California Fuchsia, Yarrow, Cleveland Sage, Western Redbud, Deergrass, Blue-Eyed Grass) — full table with zone/fire-benefit/care notes lives in the [Infrastructure Hub sheet](https://docs.google.com/spreadsheets/d/1662SdwNjuBvePFz4T-kakrEg8tN9hwxBm02P2Sshkq8/edit) and the [Native Plant & Fire-Resilience Guide](https://docs.google.com/document/d/1CsXCiyXzcHQoVjuAyqKOJ11KMK09q7cafbNr12SdAyw/edit); not duplicated here.

---

## 5. Archive / Superseded

- ⚠️ **PROJECT-STATE.md** (Drive doc copy) — merged into git's `PROJECT-TRUTH.md`
- ⚠️ **PROJECT-TRUTH.md** (Drive file copy) — use the [git version](https://github.com/Sheehan935/Zone0/blob/main/PROJECT-TRUTH.md), not this
- ⚠️ **00-project-dashboard.md** (Drive file copy) — no longer exists in git; merged into `TODO.md`
- ⚠️ **Zone 0 Inspection Form Draft Copy (Superseded Concept)** — describes an on-site-inspection/Calendly flow that was never built; doesn't match the real Photo Check system
- ⚠️ **index.html / styles.css / photo-check-form.js** (Drive code copies) — static mirrors that will drift; git is the only real code source
- ⚠️ **Zone 0 Local Website Review Plan** — historical audit plan, mostly superseded by actual work since
- ⚠️ **"Zone 0 Logo Options Preview"** — already trashed 2026-08-25 (redundant with Brand Guide)
- ⚠️ **"Paid Education Business Plan"** — already trashed 2026-08-25 (redundant with Business Strategy Summary)
- ⚠️ **Infrastructure Hub sheet's own internal "file index" tab** — still lists both trashed docs above plus the dead Drive code/PROJECT-TRUTH copies as if current. Worth pruning in that sheet directly; this Hub document is now the disambiguated version.

---

**Authority rule:** Git (`PROJECT-TRUTH.md`) is definitive for code and architecture decisions. The Drive Tasks Sheet is definitive for live day-to-day task status. Drive otherwise holds finalized documents and assets. This Hub file is a derived snapshot of all three — regenerate it, don't hand-edit it.
