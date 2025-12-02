// src/main.ts - small client entry for the starter site

// Minimal DOM helpers and site behavior that you can extend in TypeScript
const qs = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector(sel) as T | null;
const qsa = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(document.querySelectorAll(sel)) as T[];

function setCurrentYear() {
  const yearEl = qs<HTMLSpanElement>('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

// Simple nav toggle helper (useful if you add a mobile menu later)
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

// Small helper to smoothly scroll to anchors when clicking internal links
function attachSmoothAnchors() {
  qsa<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const { hash } = a;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  });
}

// Example: hook for