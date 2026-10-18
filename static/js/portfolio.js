'use strict';

// Public read-only Apps Script deployment. Its response fields must remain
// allowlisted; never expose phone, email, birthday, or other private fields.
const API_URL = 'https://script.google.com/macros/s/AKfycbx7yh21tAcxNNoEN7nbYo-24EeJijiXi4cTn71ON200JEdsabMsZZayI-Nci7AnAq0d/exec';
const PREVIEW_MODE = new URLSearchParams(window.location.search).get('preview') === '1' || window.location.protocol === 'file:';
const CONFIG = window.PORTFOLIO_CONFIG || {};
let previewDataPromise;
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
    const allowed = ['https:', 'http:'];
    if (!(image && /^(\.\.\/|\.\/|\/)/.test(raw)) && !/^https?:\/\//i.test(raw)) return '';
    if (!allowed.includes(url.protocol)) return '';
    if ((url.protocol === 'http:') && window.location.protocol === 'https:') return '';
    return url.href;
  } catch (_) { return ''; }
};
async function fetchSheet(query) {
  if (PREVIEW_MODE) {
    previewDataPromise ||= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './static/data/preview-data.js';
      script.onload = () => resolve(window.portfolioPreviewData || {});
      script.onerror = () => reject(new Error('Local preview data could not be loaded'));
      document.head.append(script);
    });
    const previewData = await previewDataPromise;
    return previewData[query] ?? [];
  }
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
    const contentType = response.headers.get('content-type') || '';
    if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
      throw new Error(`Portfolio API returned an unexpected content type: ${contentType || 'missing'}`);
    }
    return await response.json();
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
function isVisible(item) {
  if (!item || !Object.prototype.hasOwnProperty.call(item, 'visible')) return true;
  return item.visible === true || item.visible === 1 || ['true', '1', 'yes'].includes(String(item.visible).toLowerCase());
}
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
function normalizeProjectTitle(value) { return readText(value).toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function renderProjectGroup(items, list, group) {
  list.replaceChildren();
  const visible = asArray(items).filter(isVisible);
  const personalTitles = new Set(asArray(CONFIG.presentation && CONFIG.presentation.personalProjectTitles).map(normalizeProjectTitle));
  const projects = visible.filter((item) => {
    const isPersonal = item.group === 'personal' || personalTitles.has(normalizeProjectTitle(item.header || item.title));
    return group === 'personal' ? isPersonal : !isPersonal;
  });
  if (!projects.length) {
    if (group === 'personal' && !(CONFIG.presentation && CONFIG.presentation.showPersonalProjects)) return;
    list.append(make('p', 'empty-state', group === 'personal' ? 'Side projects will show here when their rows are added to the Projects data and listed in site-config.js.' : 'Project details will appear here when the portfolio data is connected.'));
    return;
  }
  projects.forEach((item, index) => {
    const row = make('article', 'project-row');
    row.append(make('span', 'project-number', String(index + 1).padStart(2, '0')));
    const main = make('div', 'project-main');
    main.append(make('h3', '', readText(item.header) || readText(item.title) || 'Project'));
    const summary = readText(item.description) || readText(item.sub_title);
    if (summary) main.append(make('p', 'project-summary', summary));
    const tags = make('div', 'project-tags');
    const subtitle = readText(item.sub_title);
    if (subtitle && subtitle !== summary) subtitle.split(/[,|·]/).slice(0, 3).forEach((tag) => { if (tag.trim()) tags.append(make('span', 'project-tag', tag.trim())); });
    if (tags.childElementCount) main.append(tags);
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
  asArray(items).filter(isVisible).forEach((item) => {
    const row = make('article', 'timeline-item');
    row.append(make('span', 'timeline-period', readText(item.span) || readText(item.period)));
    row.append(make('h3', '', readText(item.title) || readText(item.role) || 'Engineering'));
    if (item.description) row.append(make('p', '', item.description));
    list.append(row);
  });
  if (!list.childElementCount) list.append(make('p', 'loading-text', 'Experience details are managed through the connected portfolio data source.'));
}
function renderEducation(items) {
  const list = $('#education-list');
  list.replaceChildren();
  asArray(items).filter(isVisible).forEach((item) => {
    const row = make('article', 'timeline-item');
    row.append(make('span', 'timeline-period', readText(item.span) || readText(item.period)));
    row.append(make('h3', '', readText(item.place) || readText(item.title) || 'Education'));
    if (item.description) row.append(make('p', '', item.description));
    list.append(row);
  });
  if (!list.childElementCount) list.append(make('p', 'loading-text', 'Education details are managed through the connected portfolio data source.'));
}
function renderSkills(items) {
  const list = $('#skill-list');
  list.replaceChildren();
  const names = asArray(items).filter(isVisible).map((item) => readText(item && (item.name || item.title))).filter(Boolean);
  [...new Set(names)].slice(0, 16).forEach((name) => list.append(make('span', 'skill-pill', name)));
}
function renderCertifications(items) {
  const list = $('#certification-list');
  if (!list) return;
  list.replaceChildren();
  asArray(items).filter(isVisible).forEach((item) => {
    const row = make('article', 'timeline-item');
    row.append(make('span', 'timeline-period', readText(item.span) || 'CERTIFICATION'));
    row.append(make('h3', '', readText(item.title) || 'Professional certification'));
    list.append(row);
  });
  if (!list.childElementCount) list.append(make('p', 'loading-text', 'Certifications are managed through the connected portfolio data source.'));
}
function renderBlogs(items) {
  const list = $('#blog-list');
  list.replaceChildren();
  const section = $('#writing');
  const blogs = asArray(items).filter(isVisible).slice(0, 6);
  section.hidden = blogs.length === 0 || !(CONFIG.presentation && CONFIG.presentation.showWriting !== false);
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
function renderProfile(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return;
  const name = readText(data.name);
  const identity = CONFIG.identity || {};
  const displayName = readText(identity.displayName) || name;
  if (displayName) document.querySelectorAll('.brand').forEach((brand) => { brand.firstChild.textContent = displayName; });
  const role = readText(identity.role);
  if (role) document.querySelector('.intro-role').textContent = role;
  const headline = readText(identity.headline);
  if (headline) {
    const title = $('#intro-title');
    const lines = headline.split('\n');
    title.replaceChildren(document.createTextNode(lines[0] || ''));
    if (lines.length > 1) { title.append(document.createElement('br')); const accent = make('em', '', lines.slice(1).join(' ')); title.append(accent); }
  }
  const introduction = readText(identity.introduction);
  if (introduction) $('.intro-copy').textContent = introduction;
  const location = readText(identity.location);
  if (location) $('.intro-label').lastChild.textContent = ` ${location.toLocaleUpperCase()} · CURRENTLY AT ASPIRE SYSTEMS`;
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
async function load(query, render) {
  try { render(await fetchSheet(query)); }
  catch (error) {
    console.warn(`Unable to load ${query} content:`, error.message);
    if (query === 'Projects') renderProjects([]);
    if (query === 'Blogs') renderBlogs([]);
    if (query === 'Experience') renderExperience([]);
    if (query === 'Education') renderEducation([]);
    if (query === 'Certifications') renderCertifications([]);
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
    if (event.target.closest('a')) { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); }
  });
}
function run() {
  setupNavigation();
  if (!(CONFIG.presentation && CONFIG.presentation.showPersonalProjects)) {
    $('#personal').hidden = true;
    document.querySelectorAll('a[href="#personal"]').forEach((link) => link.hidden = true);
  }
  if (PREVIEW_MODE) {
    $('#preview-banner').hidden = false;
  }
  load('Profile', renderProfile);
  load('Projects', renderProjects);
  load('Experience', renderExperience);
  load('Education', renderEducation);
  load('Skills', renderSkills);
  load('Certifications', renderCertifications);
  load('Blogs', renderBlogs);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true }); else run();
