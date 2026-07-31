# Zone 0 Landscaping Website
## Project Brief

**Project Name:** Zone0Landscaping.com

**Version:** 1.2

**Last Updated:** July 30, 2026 (revised again — see `decisions.md`,
"Superseded: V1 is no longer single-page")

---

# Project Overview

Zone0Landscaping.com is a marketing website that helps homeowners understand how to create attractive, fire-adapted landscapes that comply with California's Zone 0 recommendations without sacrificing curb appeal.

The website should position the company as a trusted expert that combines wildfire resilience with high-end landscape design.

---

# Primary Goals

- Educate homeowners about Zone 0.
- Generate qualified consultation requests.
- Build trust through clear, evidence-based information.
- Showcase attractive real-world transformations.
- Establish authority in fire-adapted landscape design.

---

# Target Audience

Primary

- Homeowners in wildfire-prone communities
- Homeowners planning landscape renovations
- Property owners concerned about insurance requirements

Secondary

- Architects
- Landscape designers
- Contractors
- Real estate professionals

---

# User Goals

Visitors should be able to:

- Understand what Zone 0 is.
- Learn why it matters.
- See examples of successful projects.
- Understand the design process.
- Contact us for a consultation.

---

# Business Goals

- Increase qualified leads.
- Reduce repetitive educational conversations by answering common questions online.
- Build credibility through educational content.
- Support future SEO growth.

---

# Version 1 Scope

V1 started single-page and is now moving to a small multi-page structure
— see `decisions.md` (2026-07-30, "Superseded: V1 is no longer
single-page"). New pages live in `pages/`, matching `pages/thank-you.html`.
This section will need another pass once the Services page (and any
further pages) actually exist, to record what's built versus planned.

Included

- Home page, containing these sections as anchor-linked sections:
  - Before & After examples
  - Frequently Asked Questions
  - Contact (embedded Tally form, not a separate contact page)
- Services page (`pages/services.html`)
- Thank You page (`pages/thank-you.html`) — form redirect target only
- Mobile responsive design
- Basic SEO
- Accessibility best practices

Not Included

- Customer login
- Blog
- Online payments
- Scheduling system
- CMS
- User accounts
- E-commerce

---

# Brand Personality

The website should feel:

- Professional
- Knowledgeable
- Trustworthy
- Calm
- Modern
- Clean
- Helpful

Avoid:

- Fear-based messaging
- Alarmist language
- Technical jargon without explanation

---

# Success Metrics

- Consultation requests submitted
- Contact form conversion rate
- Time spent on page
- Search engine visibility
- Mobile usability
- Accessibility compliance

---

# Technical Stack

- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- VS Code
- Tally forms

---

# File Organization

Project follows a structured folder layout:

- docs/ — active docs (`00-project-dashboard.md`, `01-project-brief.md`,
  `02-content-plan.md`, `decisions.md`) plus a `reference/` subfolder for
  non-authoritative material (audits, old planning docs)
- assets/
- css/
- js/
- pages/
- archive/ — intentional reference snapshots (old index, template)
- legacy/ — abandoned prior build attempts, kept separate from `archive/`

---

# Development Principles

- Build one feature at a time.
- Keep components reusable where practical.
- Prioritize performance and accessibility.
- Commit frequently with meaningful Git messages.
- Test after each completed feature.

---

# Definition of Done

A feature is complete when:

- Functionality works as intended.
- Mobile layout is verified.
- Accessibility has been checked.
- Images are optimized.
- No console errors exist.
- Changes are committed to Git.
