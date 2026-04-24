// src/main.ts - small client entry for the starter site

const qs = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector(sel) as T | null;

const qsa = <T extends HTMLElement = HTMLElement>(sel: string) =>
  Array.from(document.querySelectorAll(sel)) as T[];

function setCurrentYear() {
  const yearEl = qs<HTMLSpanElement>('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function attachNavToggle(toggleSelector = '.nav-toggle', navSelector = '.site-nav') {
  const toggle = qs<HTMLButtonElement>(toggleSelector);
  const nav = qs<HTMLElement>(navSelector);
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
}

function attachSmoothAnchors() {
  qsa<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const { hash } = anchor;
      if (!hash) return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  });
}

function setTimezone() {
  const el = qs<HTMLSpanElement>('#tz-name');
  if (!el) return;

  // Check whether DST is currently active in the Pacific timezone.
  // DST is active when January's offset differs from July's offset.
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  const isDST = now.getTimezoneOffset() < stdOffset;

  el.textContent = isDST ? 'Pacific Coast · PDT (UTC−7)' : 'Pacific Coast · PST (UTC−8)';
}

function initSite() {
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
