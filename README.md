# VBoS section work plan monitor

Static React (Vite) dashboard that loads a CSV from `public/data/` and shows outputs, actions, risks, and progress. Built for hosting on **GitHub Pages**.

**Live site (after you enable Pages and deploy):** [https://vbos-dashboards.github.io/business_plan/](https://vbos-dashboards.github.io/business_plan/)

## Local development

```bash
npm install
npm run dev
```

## Update data

Replace or edit `public/data/vbos-social-2026.csv` (same column layout as the VBoS business plan export).

## Deploy to GitHub Pages

The **root `index.html` in this repo is for Vite dev** (`/src/main.tsx`). It must **not** be what GitHub Pages serves, or you get a **blank white page** (the browser cannot load `/src/main.tsx` from Pages).

The workflow **Deploy to GitHub Pages** builds with `npm run build` and pushes the **`dist/`** folder to the **`gh-pages`** branch only.

### One-time setup

1. Push `main` to [`vbos-dashboards/business_plan`](https://github.com/vbos-dashboards/business_plan).
2. Wait for **Actions → Deploy to GitHub Pages** to finish **green** (creates/updates **`gh-pages`**).
3. **Repository → Settings → Pages → Build and deployment**
4. **Source:** **Deploy from a branch**
5. **Branch:** **`gh-pages`**, folder **`/ (root)`**, **Save**
6. Open **https://vbos-dashboards.github.io/business_plan/**

**Do not** set Pages to deploy **`main`** / **(root)** — that serves the wrong `index.html` and causes a blank site.

The app uses `base: '/business_plan/'` in `vite.config.ts`. See [GitHub Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
