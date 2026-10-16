# Sakthivel Raja — GenAI Engineer Portfolio

A responsive, static portfolio focused on GenAI engineering: agentic workflows, RAG, document intelligence, and reliable AI backends. The site is designed for GitHub Pages and reads portfolio content from the existing Google Sheets-backed Apps Script API.

## Run locally

Serve the repository root with any static HTTP server, then open the local URL. For example:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/?preview=1` to view the isolated local preview data. Opening `index.html` as a `file://` URL also enables that preview automatically. The preview fixture is separate from Google Sheets and is never used on the hosted page unless `?preview=1` is added.

There is no framework build step. The active page is `index.html`; its stylesheet and behavior live in `static/css/portfolio.css` and `static/js/portfolio.js`.

## Deployment

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) deploys only after changes reach `main`. It builds an explicit allowlist containing `index.html`, the active CSS and JavaScript, the site configuration, the preview fixture, and the favicon. It does not upload `node_modules`, README files, project notes, API documentation, or `master_data.md`.

Before the first deployment, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The workflow stops if `API_URL` is empty or is not an HTTPS Apps Script `/exec` URL. Before merging a release to `main`, verify directly that the endpoint returns only approved public fields; the workflow cannot establish that a public API response is safe. The published website is public, and its HTML, CSS, JavaScript, configuration, preview fixture, and displayed data can be inspected by visitors. GitHub Pages from a private source repository requires an eligible GitHub plan.

## Content source

The Apps Script endpoint remains the content source. The website requests `Profile`, `Projects`, `Experience`, `Education`, `Skills`, `Certifications`, and `Blogs` through a read-only JSONP callback. It does not update or write to Google Sheets. Configure the opening copy and personal-project grouping in [static/data/site-config.js](static/data/site-config.js); control which sheet rows appear with their `visible` checkboxes.

**Security gate:** before publishing, deploy the allowlisted, fixed-callback implementation in [docs/portfolio_api.gs](docs/portfolio_api.gs). In particular, the public `Profile` response must not contain `ph_no`, email, birthday, or other private fields. A static GitHub Pages site cannot conceal data returned by a public endpoint. Do not publish until direct endpoint checks confirm that only checked rows and allowlisted fields are returned and old detail routes no longer expose data.

## Privacy and security

- The page has no email address, phone number, `mailto:` link, or `tel:` link.
- Sheet values are rendered as text nodes; they are not treated as HTML or executable script.
- Links from the data source are limited to HTTP(S), and external links use `noopener noreferrer`.
- The page uses a restrictive Content Security Policy meta tag and does not load third-party scripts, fonts, or icon libraries.
- Keep the spreadsheet private. Only the explicitly projected, public fields should be served by Apps Script.

## Main files

- `index.html` — only portfolio page/entry point.
- `static/css/portfolio.css` — layout, visual system, and responsive styles.
- `static/js/portfolio.js` — safe, read-only loading and rendering of the Sheets-backed content.
- `static/data/preview-data.js` — local-only sample content for reviewing the page before the safe API is deployed.
- `static/data/site-config.js` — public presentation settings and project grouping.
- `docs/APPS_SCRIPT_PUBLIC_API.md` — required server-side API projection and deployment checks.
- `docs/PORTFOLIO_CONFIGURATION.md` — how to update site framing and showcase personal projects.
- `master_data.md` — career source material; it is not loaded by the live page.
