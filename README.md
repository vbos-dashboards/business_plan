# VBoS section work plan monitor

Static React (Vite) dashboard with **client-side routes** (React Router **`HashRouter`**, so URLs look like `.../business_plan/#/sections` and `.../business_plan/#/section/1607` — this avoids GitHub Pages 404s on refresh). The **cover** is the home route **`#/`**; **`#/sections`** lists all departments; each department has its own **`#/section/:id`** page. CSVs load from `public/data/` per `src/sections.ts`.

**Live site (after you enable Pages and deploy):** [https://vbos-dashboards.github.io/business_plan/](https://vbos-dashboards.github.io/business_plan/)

## Local development

```bash
npm install
npm run dev
```

## Update data

Replace or edit the linked file under `public/data/` (e.g. `VBOS-Section-BP_2026-1607-Social.csv` for section **1607**). Same column layout as the VBoS business plan export.

## Deploy to GitHub Pages

- **Development** uses **`src/index.html`** (Vite dev server).
- **`npm run build`** writes **`dist/`**, then **`scripts/sync-published-site.mjs`** copies the production bundle to **`docs/`** and to the **repo root** (`index.html`, `assets/`, `data/`, etc.).

**Commit and push** those generated files after you change the app so GitHub Pages can serve them.

### GitHub Pages setup

**Settings → Pages → Deploy from a branch → `main`**

You can use either:

- **`/ (root)`** — serves the production **`index.html`** and **`assets/`** at the repository root (recommended; works with the sync script), or  
- **`/docs`** — serves the same files from the **`docs/`** folder.

Then open **https://vbos-dashboards.github.io/business_plan/**

The app uses `base: '/business_plan/'` in `vite.config.ts`. See [GitHub Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
