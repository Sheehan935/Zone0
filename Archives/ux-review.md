# Zone 0 Landscaping — First-Time User UX Review

**Reviewer persona:** Homeowner in the Oakland Hills who just received an insurance
non-renewal notice. Searched "wildfire zone 0 help East Bay," landed on this page.
**Date:** 2026-05-27

---

## Critical — Blocks Conversions

### 1. The form does not work
The lead form uses `action="mailto:hello@zone0landscaping.com"` with
`method="post" enctype="text/plain"`. On Chrome, Firefox, Safari for iOS, and
any device without a configured mail client, this either opens a broken mail
draft or fails silently. The user clicks "Request Photo Check," nothing happens,
and they leave. There is no fallback, no success state, no thank-you page. This
is the only conversion surface on the site and it is broken.

**Fix:** Replace with Tally, Typeform, or a Netlify form endpoint before any
traffic lands here. The form note in the HTML even says to do this — it just
has not been done.

### 2. "Photo Check" has no photo upload
The section is named "Get a free Zone 0 photo check." The form asks for name,
email, ZIP, and a textarea. There is no file input. A homeowner who wants a
photo review has nowhere to send photos. The promise and the form are
mismatched, which reads as either unfinished or untrustworthy.

**Fix:** Add a multi-file `<input type="file" accept="image/*" multiple>` or
link directly to a Tally/Typeform form with photo upload built in.

### 3. FAQ has a live placeholder
Under "What areas do you serve?" the answer reads: *"Add your initial towns here
once your first service area is confirmed."* This placeholder is visible to
every visitor. It signals that the site is unfinished and that the business may
not actually serve them. For a high-trust local service, this destroys
credibility on the one question that most local visitors will click.

**Fix:** Write a real answer with actual town names or remove the question until
it can be answered.

### 4. Mobile navigation is completely gone
At `max-width: 980px` the nav is hidden with `display: none`. There is no
hamburger menu or drawer to replace it. Tablet and laptop users see a header
with only the logo — no way to jump to Services, FAQ, or the form. At
`max-width: 660px` the "Get Free Check" CTA button also disappears. A mobile
visitor landing on this site has no navigation and no visible call to action in
the header.

**Fix:** Add a hamburger/drawer nav below 980px. Keep the CTA button visible on
mobile or replace it with a persistent sticky CTA at the bottom of the screen.

### 5. All service CTAs route to the same free form
Every service card — Free Photo Check, Zone 0 Inspection ($199+), Clear
Package, Zone 0 Upgrade — links to `#photo-check`. Someone ready to book a
paid inspection does not want to fill out the free photo check form. The
conflated destination makes all paid tiers feel speculative rather than
bookable.

**Fix:** Give the Zone 0 Inspection card a distinct booking path (Calendly,
separate Tally form, or even a direct email link with a subject line) so
high-intent visitors can act without being routed to the entry-level form.

---

## High Impact — Leaking Conversions

### 6. No social proof anywhere
The page asks visitors to trust a business with their home, their insurance
documentation, and up to $800 for an inspection. There are zero testimonials,
no homeowner count, no "X homes inspected in Oakland Hills," no press mentions,
no before/after photos from real jobs. The only visual proof is CSS-drawn
cartoon houses. In a market where trust is the purchase, this is the biggest
conversion gap after the broken form.

**Fix:** Add 2–3 real testimonials above or below the services section. Even
one sentence from a real homeowner with a first name and neighborhood beats the
current zero.

### 7. Pricing is vague for the services that cost money
"Custom quote" and "Project-based" are not prices. "From $199" is better but
still leaves the visitor guessing. High-anxiety buyers — people who just lost
their insurance — want to know whether they can afford this before they fill out
a form. Vague pricing signals either that it will be expensive or that the
business is not established enough to name a number.

**Fix:** Add a range for the Clear Package ("typically $300–$700 depending on
scope") and the Upgrade tier. Transparency on price reduces friction more than
it reduces conversions for this audience.

### 8. No mid-page CTA after the long educational scroll
The page front-loads heavy education: the risk section, bubble of starvation
panel, risk grid (4 items), ignition pathways (5 items), and 5-step process —
all before the service grid. A visitor who is sold partway through has no way
to act until they scroll significantly further. Motivated visitors are leaking.

**Fix:** Add a compact CTA band after the process steps section, before the
service grid. Something like: *"Ready to see what your Zone 0 looks like?
[Get Free Photo Check]"*

### 9. Hero tries to speak to everyone, lands for no one
The proof line reads: "Built for homeowners, HOAs, agents, and insurance
partners in high fire-risk neighborhoods." Listing four different audiences in
one sentence signals that the page was not written for any of them specifically.
A homeowner who just got a non-renewal notice does not identify with HOAs and
insurance partners.

**Fix:** Lead with the most urgent audience. Keep the homeowner as the primary
subject throughout the hero. Move the partner audiences to a separate "Who it
helps" section (one already exists lower on the page — lean into it).

### 10. "Book Inspection" is a cold second CTA in the hero
The visitor has read three lines of copy. They do not yet know what an
inspection includes, what it costs, or whether it is right for them. "Book
Inspection" as the secondary hero CTA skips the middle of the funnel entirely.
Most visitors will ignore it.

**Fix:** Replace with "See what an inspection includes" anchored to `#services`,
or change the secondary CTA to "Learn how it works" anchored to `#risk`. Let
the page do the persuasion before asking for a booking.

### 11. The "What is prompting this?" select has no default placeholder
It renders with "Insurance concern" pre-selected. A homeowner who came from a
Google search about fire season prep, not insurance, sees their situation
mis-labeled before they interact with the form. This reduces perceived relevance.

**Fix:** Add a blank default `<option value="" disabled selected>Select a
reason</option>` and make the field optional, or remove it from the form and
capture it via the notes textarea.

### 12. Submit button language is passive
"Request Photo Check" sounds like submitting a ticket. For a free, low-stakes
action, the language should feel immediate and rewarding.

**Fix:** Change to "Send My Photos for Review" or "Get My Free Check" — active,
first-person, outcome-focused.

---

## Nice to Have — Polish and Trust

### 13. CSS cartoon houses instead of real photography
The before/after hero visual is technically accomplished but reads as a
placeholder. A homeowner evaluating a real service looks for real results. One
genuine before/after photo pair from an actual job would outperform the
illustration on every trust metric.

### 14. "Guide" nav label is ambiguous
A first-time visitor does not know what "Guide" leads to. It anchors to
`#guide`, which is the "bubble of starvation" consultant framework section.
Rename to "How It Works" or "Zone 0 Risks" to set clearer expectations.

### 15. "Bubble of starvation" metaphor leads before the explanation
The section heading is "The bubble of starvation." then the subtext explains
it. On first pass, the metaphor is confusing before the reader knows what it
means. Swap order: introduce the concept, then name the metaphor.

### 16. The grant band section undercuts itself
The headline promises "Organized documentation makes the next conversation
easier." The body paragraph immediately pivots to "We do not guarantee
approval, discounts, or compliance determinations." The legal disclaimer is
appropriate, but leading with the disclaimer kills the section's value before
it lands.

**Fix:** Lead with the benefit (the documentation you receive, what it
contains), then add the disclaimer in smaller secondary text.

### 17. No phone number or service area anchor in the footer
This is a local service business. A phone number or "serving Oakland Hills,
Berkeley Hills, Orinda, and surrounding areas" line in the footer would help
with both trust and local SEO.

### 18. No sticky mobile CTA
Once the mobile nav is fixed, consider a sticky "Get Free Check" button that
follows the user while scrolling. On a page this long with a single conversion
action, removing friction at the moment of decision is worth the layout cost.

---

## Priority Order to Ship

1. Fix the form — replace mailto with Tally or similar
2. Add photo upload to the form
3. Remove the FAQ placeholder text
4. Fix mobile nav
5. Add 2–3 real testimonials
6. Separate paid service CTAs from the free form
7. Add a mid-page CTA band
8. Fix select placeholder and submit button copy
9. Refine hero proof line to homeowner-first
10. Add pricing ranges to Clear Package and Upgrade
