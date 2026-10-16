# Safe public portfolio data endpoint

The portfolio remains a read-only view of the existing Google Sheets data. Do not change portfolio content or make the spreadsheet itself public. The website reads only allowlisted fields from the Apps Script web app.

## Required before publishing

The retired page rendered `ph_no` into a `tel:` link. A static GitHub Pages site cannot hide a value returned by a public API. Hiding the element in HTML/JavaScript is not sufficient: anyone can inspect the browser's Network panel or request the endpoint directly.

Update the Apps Script response code and deploy a new version **before** publishing this portfolio. Keep the same spreadsheet and its data. Return an explicit allowlist of fields for every query, never a complete row/object, and remove or revoke any old public deployments that still return private data. The retired page code referenced two Apps Script deployments, so audit both if they are still active.

## Response allowlists

Use these public projections:

| Query (`query`) | Public fields |
| --- | --- |
| `Profile` | `name`, `designation`, `location`, `about_me` |
| `Projects` | `href`, `header`, `sub_title`, `description`, `category` |
| `Experience` | `title`, `span`, `description` |
| `Education` | `place`, `span`, `description` |
| `Skills` | `name` |
| `Certifications` | `title`, `span` |
| `Blogs` | `href`, `header`, `date_time`, `sub_title` |

In each tab, add a `visible` header and checkbox column (select the data range, then **Insert > Checkbox**). Checked cells are `TRUE`; cleared cells are `FALSE`. This includes `Profile`, which should have one checked row to show profile data. Filter all seven tabs to checked rows **before** projecting the public fields. Do not include the `visible` field in API responses. The API therefore returns only the content currently selected to appear on the portfolio.

For project/blog text and all other free-text fields, return plain text. The page inserts those values as text, not HTML. The `Profile` projection must not include `ph_no`, `birthday`, or any other private field. Do not expose a general `Contacts` query.

The current page does not need the old `p=projects` / `p=blog` detail query. Remove that route or make it return no content; it previously returned arbitrary HTML that the old site inserted into the page. Reject unknown query names rather than returning a full row, sheet, or arbitrary range. Do not accept spreadsheet IDs, range names, formulas, or sheet names from request parameters.

The site calls the endpoint with a fixed `query` and a callback named `portfolioJsonp_<number>`, for example `?query=Projects&callback=portfolioJsonp_1`. JSONP is used for browser cross-origin reads. The script accepts only that callback pattern, returns only read-only allowlisted data, and never reflects arbitrary callback input. The response envelope is `{ok, query, data}`. Keep the Apps Script deployment code synchronized with [portfolio_api.gs](./portfolio_api.gs), then deploy a new version. The page's Content Security Policy permits the Apps Script response hosts so the JSONP response can load.

## Complete Apps Script

Copy the complete implementation from [portfolio_api.gs](./portfolio_api.gs) into the spreadsheet's Apps Script project. It uses a fixed query allowlist, reads only fixed tab names, filters unchecked rows from all seven tabs, and omits `visible` from public responses. It rejects unknown queries and never returns spreadsheet errors or data in error messages.

In Apps Script **Project Settings → Script Properties**, add `PORTFOLIO_SPREADSHEET_ID` with the ID from the Google Sheets URL. The sheet stays private; the web app runs as you and exposes only the explicitly allowlisted fields.

## Deployment and verification

1. Copy [portfolio_api.gs](./portfolio_api.gs) into Apps Script, set `PORTFOLIO_SPREADSHEET_ID`, and deploy as a web app that executes as you and allows public access needed for GitHub Pages' read-only requests. Save the `/exec` URL.
2. Request each allowed `?query=...` URL directly. Confirm the `{ok, query, data}` response contains only the allowlisted properties. Specifically confirm `Profile` contains no `ph_no` or `birthday`, and that `Contacts`, unknown queries, and old detail queries reveal no data on each still-active deployment.
3. Search the raw response text for your phone number and digit-only variants. The check must return no match. Also check the spreadsheet sharing settings; it should not be publicly readable.
4. Only then publish the static site. The page itself contains no phone number or `tel:` link.

Google Sheets remains the source of truth. This changes only the public API's projection, not the data stored in the sheet.
