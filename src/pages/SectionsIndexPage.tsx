import { Link } from 'react-router-dom'
import { DepartmentNav } from '../components/DepartmentNav'
import { PageNav } from '../components/PageNav'
import { SiteFooter } from '../components/SiteFooter'
import { BP_2026_EXCEL_FILE, VBOS_SECTIONS, type VbosSection } from '../sections'

export default function SectionsIndexPage() {
  return (
    <div className="app">
      <div className="page-header-bar">
        <PageNav />
      </div>
      <DepartmentNav />

      <section className="section-panel section-panel--spaced" aria-label="VBoS sections">
        <div className="section-panel-head">
          <h1 className="section-panel-title">VBoS sections</h1>
          <p className="section-panel-sub">
            {VBOS_SECTIONS.length} departments · one sheet each in{' '}
            <code>{BP_2026_EXCEL_FILE}</code> · matching CSV in{' '}
            <code>public/data/</code> ·{' '}
            <span className="has-data">●</span> run <code>npm run export-csv</code>{' '}
            after updating the workbook
          </p>
        </div>
        <div className="section-grid">
          {VBOS_SECTIONS.map((s: VbosSection) => (
            <Link
              key={s.id}
              to={`/section/${s.id}`}
              className={`section-card section-card--link${s.dataFile ? ' section-card--ready' : ''}`}
              aria-label={`${s.name} (${s.id})`}
            >
              <span className="section-card-name">{s.name}</span>
              <span className="section-card-bp">{s.bpLabel}</span>
              <span
                className="section-card-dot"
                aria-hidden
              >
                {s.dataFile ? '●' : '○'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
