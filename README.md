# Zone 0 Landscaping

Static GitHub Pages landing page for `zone0landscaping.com`.

## Project status

- Source repo: `Sheehan935/Zone0`
- Production domain: `zone0landscaping.com`
- Hosting: GitHub Pages
- Publish source: root of the `main` branch
- Form provider: Tally
- Tally form ID: `81VgKP`

## File structure

```text
zone0landscaping.com/
├── index.html
├── css/
├── js/
├── zone-0/
├── materials/
├── faq/
├── design/
├── CNAME
├── README.md
├── CHANGELOG.md
├── assets/
├── docs/
└── archive/
```

## Planning docs

- `docs/00-project-dashboard.md` - current project state and next tasks
- `docs/01-project-brief.md` - project purpose, audience, scope, and stack
- `docs/02-content-plan.md` - current section-by-section content plan
- `docs/03-business-plan-structure.md` - offer ladder, funnel, positioning,
  content pillars, and operating plan
- `docs/04-zone-0-guide-content.md` - pulled Zone 0 guide source content
- `docs/05-content-plan-steps.md` - phased content production roadmap

## Open locally

Open `index.html` in a browser, or run a simple local server from this folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

The embedded Tally form loads from `tally.so`, so it needs an internet
connection even when the rest of the page is opened locally.

## Deploy with GitHub Pages

This repository is set up to publish from the root of the `main` branch.
The `CNAME` file points the Pages site at `zone0landscaping.com`.

After editing, commit and push to `origin/main`; GitHub Pages will rebuild
the live site from `index.html`, `styles.css`, and the `assets/` folder.

Use lowercase `assets/...` paths in HTML and CSS. GitHub Pages runs on a
case-sensitive filesystem, so `Assets/...` can work locally on macOS but
break after deployment.

## Photo check form

The Photo Check section embeds this Tally form:

```html
https://tally.so/embed/81VgKP
```

The public form must be published in Tally before the embed will work for
visitors. Tally handles the file uploads; GitHub Pages only serves the static
site files.

## Editing workflow

1. Edit in VS Code.
2. Preview locally with `python3 -m http.server 8080`.
3. Run `git status --short --branch` before committing.
4. Commit focused changes using Conventional Commits.
5. Push `main` to publish with GitHub Pages.

## Replace before launch

- The photo-check form is embedded from Tally and supports photo uploads.
- Add real before/after project photos when available.
- Confirm the initial service area and update the FAQ.
- Replace `hello@zone0landscaping.com` if you use a different inbox.
- Add analytics, Search Console verification, and basic privacy/terms pages before running paid ads.

## Current photo assets

- `assets/berkeley-house-hero.jpg`: Unsplash photo of a Berkeley, CA home by Andy Feliciotti, used under the Unsplash License.
- `assets/paver-material-hero.jpg`: Unsplash paver/hardscape photo, used under the Unsplash License.

## Positioning

Primary promise:

> Know what to fix. Get the work done. Keep the proof.

Avoid claims like "fireproof," "guaranteed compliant," "CAL FIRE certified,"
or "insurance discount guaranteed" unless formally supported.
