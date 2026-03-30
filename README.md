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
