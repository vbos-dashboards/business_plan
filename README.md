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

The **`index.html` at the repo root** is only for Vite dev (`/src/main.tsx`). If GitHub Pages serves **`main` / (root)**, the site is **blank** because `/src/main.tsx` does not exist on Pages.

**Production files live in the `docs/` folder** (built output: same as `dist/`). GitHub Pages must use **`/docs`**, not the repository root.

### One-time setup (required)

1. Push `main` to [`vbos-dashboards/business_plan`](https://github.com/vbos-dashboards/business_plan) (this repo includes a built **`docs/`** folder).
2. **Settings → Pages → Build and deployment**
3. **Source:** **Deploy from a branch**
4. **Branch:** **`main`**, folder **`/docs`** — **Save**  
   **Not** `/ (root)` — that causes a blank page.
5. Open **https://vbos-dashboards.github.io/business_plan/**

After you change app code, **Actions → Deploy to GitHub Pages** rebuilds and updates **`docs/`** on `main` (pushes with `[skip ci]` so it does not loop).

The app uses `base: '/business_plan/'` in `vite.config.ts`. See [Publishing from the docs folder](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch).
