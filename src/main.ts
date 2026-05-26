// src/main.ts - small client entry for the starter site

const qs = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector(sel) as T | null;

const qsa = <T extends HTMLElement = HTMLElement>(sel: string) =>
  Array.from(document.querySelectorAll(sel)) as T[];

const THEME_KEY = 'portfolio-theme';
type ThemeName = 'light' | 'dark';

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

function detectInitialTheme(): ThemeName {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore localStorage access issues and fall back to the default theme.
  }

  return 'light';
}

function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
}

function getToggleLabel(theme: ThemeName) {
  return theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function attachThemeToggle() {
  const navList = qs<HTMLUListElement>('.site-nav ul');
  if (!navList) return;

  const existing = navList.querySelector<HTMLButtonElement>('.theme-toggle');
  if (existing) return;

  const themeButton = document.createElement('button');
  themeButton.type = 'button';
  themeButton.className = 'theme-toggle';

  const currentTheme = (document.documentElement.getAttribute('data-theme') as ThemeName) || 'light';
  themeButton.textContent = getToggleLabel(currentTheme);
  themeButton.setAttribute('aria-label', 'Toggle light and dark color theme');

  themeButton.addEventListener('click', () => {
    const activeTheme = (document.documentElement.getAttribute('data-theme') as ThemeName) || 'light';
    const nextTheme: ThemeName = activeTheme === 'light' ? 'dark' : 'light';

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

function parsePipeList(value: string | null) {
  if (!value) return [];
  return value
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function attachFeaturedCarousels() {
  qsa<HTMLElement>('[data-featured-carousel]').forEach((carousel) => {
    const imageEl = carousel.querySelector<HTMLImageElement>('[data-carousel-image]');
    const prevBtn = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const nextBtn = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const dotsWrap = carousel.querySelector<HTMLElement>('[data-carousel-dots]');
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
    const dots: HTMLButtonElement[] = [];

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

    const shift = (delta: number) => {
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

    let touchStartX: number | null = null;
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
