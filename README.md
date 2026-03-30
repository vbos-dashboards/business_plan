# VBoS section work plan monitor

Static React (Vite) dashboard with **client-side routes** (React Router **`HashRouter`**, so URLs look like `.../business_plan/#/sections` and `.../business_plan/#/section/1607` — this avoids GitHub Pages 404s on refresh). The **cover** is the home route **`#/`**; **`#/sections`** lists all departments; each department has its own **`#/section/:id`** page.

**Primary data:** `public/data/VBOS-Section-BP_2026.xlsx` — one **worksheet per department** (tab names match `sheetName` in `src/sections.ts`). Optional **CSV** per section is used if the workbook is missing or as fallback.

**Live site (after you enable Pages and deploy):** [https://vbos-dashboards.github.io/business_plan/](https://vbos-dashboards.github.io/business_plan/)

## Local development

```bash
npm install
npm run dev
```

## Excel workbook (`VBOS-Section-BP_2026.xlsx`)

1. Save your Excel file as **`public/data/VBOS-Section-BP_2026.xlsx`** (web-safe name; spaces removed).
2. Create **one sheet per department** with tab names **exactly** (or closely) matching `sheetName` in `src/sections.ts`: `CS Office`, `DCM`, `Admin&Finance`, `SLC`, `Economics`, `Social`, `Torba`, `Sanma`, `Malampa`, `Penama`, `Tafea`.
3. Use the **same columns** as the CSV export (Strategy Objective, Code, Program, Activity, Budget, Output/Service Target, Target, Action, Due Date, Comments/Risks, Progress).

If the workbook is absent, the app falls back to **CSV** when `dataFile` is set for a section (e.g. Social uses `VBOS-Section-BP_2026-1607-Social.csv`).

## Update data

Edit the workbook or the optional CSVs under `public/data/`, then run `npm run build` and commit the synced site files.

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
