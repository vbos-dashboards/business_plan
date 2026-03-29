# VBoS section work plan monitor

Static React (Vite) dashboard that loads a CSV from `public/data/` and shows outputs, actions, risks, and progress. Built for hosting on **GitHub Pages**.

**Live site (after you enable Pages and deploy):** [https://yjulio.github.io/business_plan/](https://yjulio.github.io/business_plan/)

## Local development

```bash
npm install
npm run dev
```

## Update data

Replace or edit `public/data/vbos-social-2026.csv` (same column layout as the VBoS business plan export).

## Deploy to GitHub Pages

1. Push this repo to `https://github.com/yjulio/business_plan.git` (default branch `main` or `master`).
2. In the GitHub repo: **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
3. Push to `main` (or `master`). The workflow **Deploy to GitHub Pages** builds with `npm run build` and publishes the `dist` folder.

The app uses `base: '/business_plan/'` in `vite.config.ts` so asset URLs match a project site at `username.github.io/business_plan/`.
