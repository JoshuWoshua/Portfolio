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

function initSite() {
  setCurrentYear();
  attachNavToggle();
  attachSmoothAnchors();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
