'use strict';

// Public read-only Apps Script deployment. Its response fields must remain
// allowlisted; never expose phone, email, birthday, or other private fields.
const API_URL = 'https://script.google.com/macros/s/AKfycbx7yh21tAcxNNoEN7nbYo-24EeJijiXi4cTn71ON200JEdsabMsZZayI-Nci7AnAq0d/exec';
const API_QUERIES = new Set(['Profile', 'Projects', 'Experience', 'Education', 'Skills', 'Certifications', 'Blogs']);
const API_RESPONSE_LIMIT = 1024 * 1024;
const $ = (selector, root = document) => root.querySelector(selector);
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = String(text);
  return element;
};
const readText = (value) => typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
const safeURL = (value, { image = false } = {}) => {
  const raw = readText(value);
  if (!raw) return '';
  try {
    const url = new URL(raw, window.location.href);
    const localImagePath = image && /^(\.\.\/|\.\/|\/(?!\/))/.test(raw);
    if (!localImagePath && !/^https:\/\//i.test(raw)) return '';
    const authority = raw.match(/^https:\/\/([^/?#]*)/i)?.[1] || '';
    if ((!localImagePath && url.protocol !== 'https:') || authority.includes('@') || url.username || url.password) return '';
    if (!localImagePath && url.hostname.toLowerCase() !== 'github.com') return '';
    if (localImagePath && url.protocol !== window.location.protocol) return '';
    return url.href;
  } catch (_) { return ''; }
};
async function fetchSheet(query) {
  if (!API_QUERIES.has(query)) throw new Error('Unsupported portfolio data request');
  if (!API_URL) throw new Error('Safe Apps Script endpoint is not configured');
  const payload = await fetchSheetJSON(query);
  if (!payload || payload.ok !== true || payload.query !== query || !Object.prototype.hasOwnProperty.call(payload, 'data')) {
    throw new Error(readText(payload && payload.error) || 'Portfolio API returned an invalid response');
  }
  const data = payload.data;
  if (query === 'Profile' && data && typeof data === 'object' && ('ph_no' in data || 'birthday' in data || 'email' in data)) {
    throw new Error('Profile API returned fields this page does not use. Deploy the documented public allowlist before loading this content.');
  }
  if (query === 'Profile' ? (data !== null && (typeof data !== 'object' || Array.isArray(data))) : !Array.isArray(data)) {
    throw new Error('Portfolio API returned data in an unexpected format');
  }
  return data;
}
async function fetchSheetJSON(query) {
  const url = new URL(API_URL);
  url.searchParams.set('query', query);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url.href, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Portfolio API returned HTTP ${response.status}`);
    const finalURL = new URL(response.url);
    if (finalURL.protocol !== 'https:' || !['script.google.com', 'script.googleusercontent.com'].includes(finalURL.hostname.toLowerCase())) {
      throw new Error('Portfolio API redirected to an untrusted host');
    }
    const contentType = response.headers.get('content-type') || '';
    if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
      throw new Error(`Portfolio API returned an unexpected content type: ${contentType || 'missing'}`);
    }
    const contentLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > API_RESPONSE_LIMIT) {
      throw new Error('Portfolio API response exceeded the size limit');
    }
    const body = await response.text();
    if (new TextEncoder().encode(body).byteLength > API_RESPONSE_LIMIT) {
      throw new Error('Portfolio API response exceeded the size limit');
    }
    try { return JSON.parse(body); }
    catch (_) { throw new Error('Portfolio API returned invalid JSON'); }
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Portfolio API request timed out');
    if (error instanceof TypeError) {
      throw new Error('Portfolio API request was blocked or could not be reached; verify the endpoint CORS headers and deployment access');
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
function asArray(value) { return Array.isArray(value) ? value : []; }
function makeLink(label, href, className = '') {
  const url = safeURL(href);
  const link = make('a', className, label);
  if (url) {
    link.href = url;
    if (url.startsWith('https:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  } else {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
  }
  return link;
}
function appendProjectSummary(element, value) {
  const text = readText(value);
  const metrics = [...text.matchAll(/(?:approximately\s+|~)?\d+(?:\.\d+)?%/gi)];
  if (!metrics.length) {
    element.textContent = text;
    return;
  }
  let offset = 0;
  metrics.forEach((match) => {
    const start = match.index;
    if (start > offset) element.append(document.createTextNode(text.slice(offset, start)));
    element.append(make('mark', 'metric-highlight', match[0]));
    offset = start + match[0].length;
  });
  if (offset < text.length) element.append(document.createTextNode(text.slice(offset)));
}
function renderProjectGroup(items, list, group) {
  list.replaceChildren();
  const projects = asArray(items).filter((item) => {
    const category = readText(item.category).toLocaleLowerCase();
    const isPersonal = item.group === 'personal' || category.includes('personal');
    return group === 'personal' ? isPersonal : !isPersonal;
  });
  if (!projects.length) {
    list.append(make('p', 'empty-state', group === 'personal' ? 'No side projects are selected for display right now.' : 'No work projects are selected for display right now.'));
    return;
  }
  projects.forEach((item, index) => {
    const row = make('article', 'project-row');
    row.append(make('span', 'project-number', String(index + 1).padStart(2, '0')));
    const main = make('div', 'project-main');
    main.append(make('h3', '', readText(item.header) || readText(item.title) || 'Project'));
    const summary = readText(item.description) || readText(item.sub_title);
    if (summary) {
      const summaryElement = make('p', 'project-summary');
      appendProjectSummary(summaryElement, summary);
      main.append(summaryElement);
    }
    const tags = make('div', 'project-tags');
    const subtitle = readText(item.sub_title);
    if (subtitle && subtitle !== summary) subtitle.split(/[,|·]/).slice(0, 3).forEach((tag) => { if (tag.trim()) tags.append(make('span', 'project-tag', tag.trim())); });
    if (tags.childElementCount) main.append(tags);
    const destination = safeURL(item.href);
    if (destination) {
      const action = make('a', 'project-action', 'View project');
      action.href = destination;
      action.target = '_blank';
      action.rel = 'noopener noreferrer';
      action.setAttribute('aria-label', `View ${readText(item.header || item.title) || 'project'} in a new tab`);
      action.append(document.createTextNode(' ↗'));
      main.append(action);
    }
    row.append(main);
    row.append(make('span', 'project-category', readText(item.category)));
    list.append(row);
  });
}
function renderProjects(items) {
  renderProjectGroup(items, $('#project-list'), 'work');
  renderProjectGroup(items, $('#personal-project-list'), 'personal');
}
function renderExperience(items) {
  const list = $('#experience-list');
  list.replaceChildren();
  asArray(items).forEach((item) => {
    const row = make('article', 'timeline-item');
    row.append(make('span', 'timeline-period', readText(item.span) || readText(item.period)));
    row.append(make('h3', '', readText(item.title) || readText(item.role) || 'Engineering'));
    if (item.description) row.append(make('p', '', item.description));
    list.append(row);
  });
  if (!list.childElementCount) list.append(make('p', 'empty-state', 'No experience entries are selected for display right now.'));
}
function renderEducation(items) {
  const list = $('#education-list');
  list.replaceChildren();
  asArray(items).forEach((item) => {
    const row = make('article', 'timeline-item');
    row.append(make('span', 'timeline-period', readText(item.span) || readText(item.period)));
    row.append(make('h3', '', readText(item.place) || readText(item.title) || 'Education'));
    if (item.description) row.append(make('p', '', item.description));
    list.append(row);
  });
  if (!list.childElementCount) list.append(make('p', 'empty-state', 'No education entries are selected for display right now.'));
}
function renderSkills(items) {
  const list = $('#skill-list');
  list.replaceChildren();
  const names = asArray(items).map((item) => readText(item && (item.name || item.title))).filter(Boolean);
  [...new Set(names)].slice(0, 16).forEach((name) => list.append(make('span', 'skill-pill', name)));
  if (!list.childElementCount) list.append(make('span', 'skill-empty', 'No skills are selected for display right now.'));
}
function renderCertifications(items) {
  const list = $('#certification-list');
  if (!list) return;
  list.replaceChildren();
  asArray(items).forEach((item) => {
    const row = make('article', 'timeline-item');
    row.append(make('span', 'timeline-period', readText(item.span) || 'CERTIFICATION'));
    row.append(make('h3', '', readText(item.title) || 'Professional certification'));
    list.append(row);
  });
  if (!list.childElementCount) list.append(make('p', 'empty-state', 'No certifications are selected for display right now.'));
}
function renderBlogs(items) {
  const list = $('#blog-list');
  list.replaceChildren();
  const section = $('#writing');
  const blogs = asArray(items).slice(0, 6);
  section.hidden = blogs.length === 0;
  if (!blogs.length) return;
  blogs.forEach((item) => {
    const url = safeURL(item.href);
    const card = make('a', 'writing-row');
    if (url) { card.href = url; card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    else { card.removeAttribute('href'); card.setAttribute('aria-disabled', 'true'); }
    card.append(make('span', 'writing-date', readText(item.date_time)));
    const copy = make('div');
    copy.append(make('h3', '', readText(item.header) || readText(item.title) || 'Note'));
    if (item.sub_title) copy.append(make('p', '', item.sub_title));
    card.append(copy);
    card.append(make('span', 'writing-arrow', '↗'));
    list.append(card);
  });
}
function applyIdentity(data = {}) {
  const name = readText(data && data.name);
  const displayName = name;
  if (displayName) document.querySelectorAll('.brand').forEach((brand) => { brand.firstChild.textContent = displayName; });
  const role = readText(data && (data.designation || data.role));
  if (role) document.querySelector('.intro-role').textContent = role;
  const headline = readText(data && data.headline);
  if (headline) {
    const title = $('#intro-title');
    const lines = headline.split('\n');
    title.replaceChildren(document.createTextNode(lines[0] || ''));
    if (lines.length > 1) { title.append(document.createElement('br')); const accent = make('em', '', lines.slice(1).join(' ')); title.append(accent); }
  }
  const introduction = readText(data && (data.introduction || data.summary));
  if (introduction) $('.intro-copy').textContent = introduction;
  const location = readText(data && data.location);
  if (location) $('.intro-label').lastChild.textContent = ` ${location.toLocaleUpperCase()} · CURRENTLY AT ASPIRE SYSTEMS`;
}
function renderProfile(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return;
  applyIdentity(data);
  applyProfileLinks(data);
  const aboutValue = data.about_me;
  const about = Array.isArray(aboutValue)
    ? aboutValue.map(readText).filter(Boolean)
    : typeof aboutValue === 'string'
      ? aboutValue.split(/\r?\n\s*\r?\n/).map(readText).filter(Boolean)
      : [];
  if (about.length) {
    const copy = $('#about-copy');
    copy.replaceChildren(...about.map((paragraph) => make('p', '', paragraph)));
  }
}
function applyProfileLinks(data = {}) {
  const links = { github: data.github || data.github_url };
  document.querySelectorAll('[data-profile-link]').forEach((link) => {
    const key = link.getAttribute('data-profile-link');
    const url = safeURL(links[key]);
    if (!url) {
      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-disabled', 'true');
      return;
    }
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
  });
}
async function load(query, render) {
  try { render(await fetchSheet(query)); }
  catch (error) {
    console.warn(`Unable to load ${query} content:`, error.message);
    const labels = {
      Projects: ['work projects', 'side projects'],
      Experience: ['experience'],
      Education: ['education'],
      Skills: ['skills'],
      Certifications: ['certifications']
    };
    const targets = {
      Projects: [$('#project-list'), $('#personal-project-list')],
      Experience: [$('#experience-list')],
      Education: [$('#education-list')],
      Skills: [$('#skill-list')],
      Certifications: [$('#certification-list')]
    };
    (targets[query] || []).forEach((target, index) => {
      const state = make('div', 'error-state');
      state.setAttribute('role', 'status');
      state.append(make('p', '', `Couldn’t load ${labels[query][index] || query.toLowerCase()} right now.`));
      const retry = make('button', 'retry-button', 'Try again');
      retry.type = 'button';
      retry.addEventListener('click', async () => {
        retry.disabled = true;
        retry.textContent = 'Trying again…';
        await load(query, render);
      }, { once: true });
      state.append(retry);
      target.replaceChildren(state);
    });
    if (query === 'Blogs') renderBlogs([]);
  }
}
function setupNavigation() {
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-nav');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    menu.hidden = expanded;
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.focus();
    }
  });
}
function run() {
  setupNavigation();
  load('Profile', renderProfile);
  load('Projects', renderProjects);
  load('Experience', renderExperience);
  load('Education', renderEducation);
  load('Skills', renderSkills);
  load('Certifications', renderCertifications);
  load('Blogs', renderBlogs);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true }); else run();
