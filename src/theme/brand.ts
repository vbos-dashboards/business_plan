/**
 * Logo / banner palette (navy + gold + forest green) — keep in sync with :root in index.css.
 * Used where JS needs explicit colors (e.g. Recharts).
 */
export const BRAND = {
  navy: '#0a1628',
  navySoft: '#0d1f2d',
  gold: '#c9a227',
  goldLight: '#f0d78c',
  green: '#0f6b4d',
  greenMid: '#1a5c45',
  greenDeep: '#0f3d2e',
} as const

/** Chart series — completed (green), in progress (gold), other (navy-gray) */
export const BRAND_CHART = {
  completed: BRAND.greenMid,
  inProgress: BRAND.gold,
  other: '#5a6578',
} as const
