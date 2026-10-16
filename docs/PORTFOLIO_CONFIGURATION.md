# Portfolio configuration

The site is a static GitHub Pages app. Its content model has two parts:

- The existing Google Sheet remains the source for profile, project, experience, education, skill, certification, and writing records. The site only reads those records through the Apps Script API.
- `static/data/site-config.js` holds public presentation choices: the displayed name and role, opening headline and summary, whether the side project and writing sections appear, and the titles routed to the side project section.

## Change the framing

Edit `window.PORTFOLIO_CONFIG.identity` in `static/data/site-config.js` to change the visible name, role, location, headline, or introductory paragraph. The headline uses `\n` to split across two lines; the second line receives the accent style.

## Choose professional and personal projects

The Projects query is still the only source for project descriptions. Put the exact `header` titles for self-directed work in `presentation.personalProjectTitles`. Those records will appear under “Side projects & experiments”; other visible Projects records stay under “Work in production.” Matching ignores case and punctuation. No sheet rows or values are changed by this site code.

The local-only fixture in `static/data/preview-data.js` adds examples from the personal/mini-project section of `master_data.md`, so the split can be reviewed without touching the live sheet. These fixture descriptions are not published when the Apps Script URL is configured.

To add or update a real project, edit the existing Projects sheet using its current workflow, then add the exact project title to `personalProjectTitles` if it is self-directed. The public Apps Script response must retain its fixed field allowlist (`visible`, `href`, `header`, `sub_title`, `description`, `category`). Do not expose a complete row or add private contact fields.

## Contact and privacy

There is currently no contact section, address, phone link, or email link in the page. The page does not request the SocialList query. Its Profile allowlist does not need or include an email field. `ph_no` and `birthday` remain forbidden in public API responses. The Apps Script deployment remains disabled in `static/js/portfolio.js` until its public projection is reviewed and deployed; follow `APPS_SCRIPT_PUBLIC_API.md` before connecting or publishing.

## Local preview

Opening `index.html` directly loads `static/data/preview-data.js`; the fixed banner identifies this as preview content. To review the sheet-connected experience, set the safe Apps Script deployment URL in `static/js/portfolio.js` only after applying and verifying the API allowlist.
