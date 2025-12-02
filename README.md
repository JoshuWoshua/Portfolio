# Minimal Portfolio Starter

A small, plain HTML + CSS starter site you can extend for a portfolio or personal site.

What's included
- `index.html` — semantic, accessible starter page with sections for hero, about, work and contact
- `style.css` — lightweight, responsive stylesheet built with variables and easy-to-tweak tokens

Get started
1. Open `index.html` in your browser (double-click the file) OR run a tiny static server from the project root:

```bash
# Python 3 built-in server (recommended for quick preview)
python -m http.server 8000

# then open http://localhost:8000
```

2. Edit `index.html` to add your content and update `style.css` to change colors, spacing, fonts, etc.

Tips
- Change `--accent` in `style.css` to update the primary brand color.
- Add project links and images inside the `#work` section. Use `.projects` grid to add more items.
- Consider switching to a small build tool or using a template engine when you want multiple pages.

Using TypeScript
----------------

This starter already includes a small TypeScript entry at `src/main.ts` and build configuration so you can use TypeScript for buttons, interactivity, and more.

Local build
1. Install dependencies locally (installs TypeScript for `tsc`):

```bash
npm ci
```

2. Build once:

```bash
npm run build
```

3. Build & watch during development (rebuilds to `dist/` automatically):

```bash
npm run watch
```

The compiled files will be written to `dist/` and `index.html` loads `dist/main.js` automatically.

CI / GitHub Actions
-------------------
The workflow `.github/workflows/deploy.yml` runs `npm ci` and `npm run build` before publishing `dist/*` (and other site files) to the `gh-pages` branch. This means you don't need to commit compiled files — the Action builds them for you.

Note about lockfiles
-------------------
If you plan to use the included workflow as-is it prefers `npm ci` (which requires a committed `package-lock.json`) for consistent installs/reproducible builds. The workflow now falls back to `npm install` if a lockfile is not present, but it's recommended to commit `package-lock.json` for reliable, repeatable CI installs.

Want more?
- I can add a build tool (Vite/parcel), sample components, or a small form handler if you want to accept messages. Tell me what you need next.

Automatic deployments with GitHub Actions
---------------------------------------

This repository includes a workflow (/.github/workflows/deploy.yml) that automatically publishes the files in the project root to a `gh-pages` branch when you push to `main` (and you can run it manually via the Actions tab).

How it works
- When the workflow runs it copies `index.html`, `style.css`, `README.md`, and any files under `public/` into a temporary `out/` folder and publishes that folder to `gh-pages` using the `peaceiris/actions-gh-pages` action.

One-time setup
1. Go to your repository Settings → Pages and ensure the source is set to the `gh-pages` branch (the workflow will create it automatically the first time it runs).
2. (Optional) If you'd rather publish from the `main` branch `/docs` folder, update the workflow to copy files into `./docs` instead.

Security note
- The workflow uses the built-in `GITHUB_TOKEN` so you don't need to add a Personal Access Token. That token can write the `gh-pages` branch when the workflow runs.

If you'd like, I can update the workflow to add a simple build step (for example if you add a bundler) or to publish from a different branch/folder — tell me how you'd like to publish and I can update it.
