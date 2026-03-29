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

1. Push this repo to `https://github.com/vbos-dashboards/business_plan.git` on branch `main` (or `master`).
2. In the repo: **Settings → Pages → Build and deployment**
3. Under **Source**, choose **Deploy from a branch** (not “GitHub Actions” for this workflow).
4. Set **Branch** to **`gh-pages`**, folder **`/ (root)`**, then **Save**.  
   The first time, run the workflow once (push a commit or **Actions → Deploy to GitHub Pages → Run workflow**). After it succeeds, the **`gh-pages`** branch appears—then set step 4 if it was greyed out before.
5. Open **https://vbos-dashboards.github.io/business_plan/** (wait a minute after the workflow finishes).

If you still see **404**, double-check **Settings → Pages** shows the **`gh-pages`** branch and the latest **Actions** run is green.

The app uses `base: '/business_plan/'` in `vite.config.ts` so assets load at `vbos-dashboards.github.io/business_plan/`.
