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

function parsePipeList(value) {
  if (!value) return [];
  return value
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function attachFeaturedCarousels() {
  qsa('[data-featured-carousel]').forEach((carousel) => {
    const imageEl = carousel.querySelector('[data-carousel-image]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    if (!imageEl || !prevBtn || !nextBtn || !dotsWrap) return;

    const sources = parsePipeList(carousel.getAttribute('data-images'));
    const alts = parsePipeList(carousel.getAttribute('data-alts'));
    const fallbackSrc = imageEl.getAttribute('src') || '';

    const slides = (sources.length ? sources : [fallbackSrc]).map((src, index) => ({
      src,
      alt: alts[index] || alts[0] || imageEl.alt || 'Project screenshot',
    }));

    if (!slides.length) return;

    let index = 0;
    const dots = [];

    const render = () => {
      const current = slides[index];
      imageEl.src = current.src;
      imageEl.alt = current.alt;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
    };

    slides.forEach((_, dotIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to image ${dotIndex + 1}`);
      dot.addEventListener('click', () => {
        index = dotIndex;
        render();
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    const shift = (delta) => {
      index = (index + delta + slides.length) % slides.length;
      render();
    };

    prevBtn.addEventListener('click', () => shift(-1));
    nextBtn.addEventListener('click', () => shift(1));

    carousel.tabIndex = 0;
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        shift(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        shift(1);
      }
    });

    let touchStartX = null;
    carousel.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
      },
      { passive: true },
    );
    carousel.addEventListener(
      'touchend',
      (event) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const delta = touchEndX - touchStartX;
        touchStartX = null;
        if (Math.abs(delta) < 40) return;
        shift(delta > 0 ? -1 : 1);
      },
      { passive: true },
    );

    if (slides.length <= 1) {
      carousel.classList.add('is-single');
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }

    render();
  });
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
  attachFeaturedCarousels();
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
