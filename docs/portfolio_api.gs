/**
 * Public, read-only portfolio API for GitHub Pages.
 *
 * Setup:
 * 1. Set the Script Property PORTFOLIO_SPREADSHEET_ID to the private Sheet ID.
 * 2. Deploy as a web app that executes as the owner and permits public access.
 * 3. Keep every returned field public. The site uses JSONP for cross-origin reads.
 *
 * Supported requests use fixed query names, for example:
 *   ?query=Projects&callback=portfolioJsonp_1
 */

const SPREADSHEET_ID_PROPERTY = 'PORTFOLIO_SPREADSHEET_ID';
const JSONP_CALLBACK_PATTERN = /^portfolioJsonp_[0-9]+$/;

const PUBLIC_FIELDS = Object.freeze({
  Profile: ['name', 'designation', 'location', 'about_me'],
  Projects: ['href', 'header', 'sub_title', 'description', 'category'],
  Experience: ['title', 'span', 'description'],
  Education: ['place', 'span', 'description'],
  Skills: ['name'],
  Certifications: ['title', 'span'],
  Blogs: ['href', 'header', 'date_time', 'sub_title']
});

const VISIBILITY_QUERIES = Object.freeze([
  'Profile',
  'Projects',
  'Experience',
  'Education',
  'Skills',
  'Certifications',
  'Blogs'
]);

/** Returns an allowlisted response as JSON or as the site's restricted JSONP. */
function doGet(e) {
  const callback = getSingleCallback_(e);
  const query = getSingleQuery_(e);

  if (!Object.prototype.hasOwnProperty.call(PUBLIC_FIELDS, query)) {
    return apiOutput_({ ok: false, error: 'Unsupported query.' }, callback);
  }

  try {
    const spreadsheetId = PropertiesService.getScriptProperties()
      .getProperty(SPREADSHEET_ID_PROPERTY);
    if (!spreadsheetId) throw new Error('Spreadsheet property is not configured.');

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const data = readPublicRows_(spreadsheet, query);
    return apiOutput_({ ok: true, query: query, data: query === 'Profile' ? (data[0] || null) : data }, callback);
  } catch (error) {
    // Never return sheet contents, IDs, stack traces, or private values.
    console.error('Portfolio API request failed for query %s: %s', query, error);
    return apiOutput_({ ok: false, query: query, error: 'Portfolio data is temporarily unavailable.' }, callback);
  }
}

/** Accepts exactly one query parameter. */
function getSingleQuery_(e) {
  const values = e && e.parameters && e.parameters.query;
  if (!Array.isArray(values) || values.length !== 1) return '';
  return String(values[0] || '');
}

/** Accepts only the callback names emitted by the static portfolio client. */
function getSingleCallback_(e) {
  const values = e && e.parameters && e.parameters.callback;
  if (!Array.isArray(values) || values.length !== 1) return '';
  const callback = String(values[0] || '');
  return JSONP_CALLBACK_PATTERN.test(callback) ? callback : '';
}

/** Reads checked rows only and projects fixed public fields. */
function readPublicRows_(spreadsheet, query) {
  const sheet = spreadsheet.getSheetByName(query);
  if (!sheet) throw new Error('Required portfolio tab is missing: ' + query);

  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];

  const headers = values[0].map(function (header) {
    return String(header == null ? '' : header).trim();
  });
  if (new Set(headers).size !== headers.length) {
    throw new Error('Portfolio tab has duplicate headers: ' + query);
  }

  const requiredHeaders = PUBLIC_FIELDS[query].concat(['visible']);
  const missing = requiredHeaders.filter(function (header) {
    return headers.indexOf(header) === -1;
  });
  if (missing.length) throw new Error('Portfolio tab is missing required headers: ' + query);

  const visibleIndex = headers.indexOf('visible');
  const fields = PUBLIC_FIELDS[query];
  return values.slice(1)
    .filter(function (row) {
      return row.some(function (cell) { return cell !== '' && cell !== null; }) && isChecked_(row[visibleIndex]);
    })
    .map(function (row) {
      const record = {};
      fields.forEach(function (field) {
        const index = headers.indexOf(field);
        record[field] = normalizeCell_(row[index]);
      });
      return record;
    });
}

/** Accepts Google Sheets checkbox booleans and common imported equivalents. */
function isChecked_(value) {
  return value === true || value === 1 ||
    ['true', '1', 'yes'].indexOf(String(value).toLowerCase()) !== -1;
}

/** Converts spreadsheet dates to JSON-safe ISO date strings. */
function normalizeCell_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
  }
  return value;
}

/** Uses a strict callback identifier; callback input is never evaluated as code. */
function apiOutput_(payload, callback) {
  const json = JSON.stringify(payload)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  if (callback && JSONP_CALLBACK_PATTERN.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
