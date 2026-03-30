const BANNER_IMG = `${import.meta.env.BASE_URL}images/vbos-2026-dashboard-banner.png`

/** Wide top banner — Vanuatu Bureau of Statistics · Business Plan 2026 */
export function SiteBanner() {
  return (
    <header className="site-banner" role="banner">
      <img
        src={BANNER_IMG}
        alt="Vanuatu Bureau of Statistics — Business Plan 2026"
        className="site-banner-img"
        width={1600}
        height={320}
        decoding="async"
      />
    </header>
  )
}
