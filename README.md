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

This repo uses the **official GitHub Actions → Pages** integration (`upload-pages-artifact` + `deploy-pages`). A **404** almost always means Pages is not set to use that integration, or the workflow has not completed.

### One-time setup (required)

1. Push `main` to [`vbos-dashboards/business_plan`](https://github.com/vbos-dashboards/business_plan).
2. **Repository → Settings → Pages → Build and deployment**
3. Under **Source**, select **GitHub Actions** (not “Deploy from a branch”, not “None”).
4. **Organization:** ensure **Actions** is allowed: *Organization settings → Actions → General → Actions permissions* (allow actions to run). If workflows never appear under the **Actions** tab, this is the cause.
5. Open **Actions**, confirm **Deploy to GitHub Pages** runs and finishes **green** after your push (or use **Run workflow**).
6. Wait 1–2 minutes, then open **https://vbos-dashboards.github.io/business_plan/**

If the **deploy** job waits for approval, check **Settings → Environments → `github-pages`** and remove unnecessary protection rules blocking deployment.

The app uses `base: '/business_plan/'` in `vite.config.ts` so assets load under `vbos-dashboards.github.io/business_plan/`. See [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
