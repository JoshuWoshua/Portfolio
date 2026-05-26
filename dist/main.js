// dist/main.js - compiled output (edit src/main.ts instead)

const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));
const THEME_KEY = 'portfolio-theme';

function setCurrentYear() {
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setTimezone() {
  const el = qs('#tz-name');
  if (!el) return;

  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  const isDST = now.getTimezoneOffset() < stdOffset;

  el.textContent = isDST ? 'Pacific Coast \u00b7 PDT (UTC\u22127)' : 'Pacific Coast \u00b7 PST (UTC\u22128)';
}

function detectInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore localStorage access issues and fall back to the default theme.
  }

  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function getToggleLabel(theme) {
  return theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function attachThemeToggle() {
  const navList = qs('.site-nav ul');
  if (!navList) return;

  const existing = navList.querySelector('.theme-toggle');
  if (existing) return;

  const themeButton = document.createElement('button');
  themeButton.type = 'button';
  themeButton.className = 'theme-toggle';

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  themeButton.textContent = getToggleLabel(currentTheme);
  themeButton.setAttribute('aria-label', 'Toggle light and dark color theme');

  themeButton.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = activeTheme === 'light' ? 'dark' : 'light';

    applyTheme(nextTheme);
    themeButton.textContent = getToggleLabel(nextTheme);

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Ignore localStorage access issues.
    }
  });

  const item = document.createElement('li');
  item.appendChild(themeButton);
  navList.appendChild(item);
}

function attachNavToggle(toggleSelector = '.nav-toggle', navSelector = '.site-nav') {
  const toggle = qs(toggleSelector);
  const nav = qs(navSelector);
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
}

function attachSmoothAnchors() {
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  });
}

function initSite() {
  applyTheme(detectInitialTheme());
  attachThemeToggle();
  setCurrentYear();
  setTimezone();
  attachNavToggle();
  attachSmoothAnchors();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
