import { Link } from 'react-router-dom'
import { DepartmentNav } from '../components/DepartmentNav'
import { PageNav } from '../components/PageNav'
import { SiteFooter } from '../components/SiteFooter'
import { VBOS_SECTIONS, type VbosSection } from '../sections'

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
            {VBOS_SECTIONS.length} departments ·{' '}
            <span className="has-data">●</span> work plan loaded ·{' '}
            <span className="no-data">○</span> CSV to be added under{' '}
            <code>public/data/</code>
          </p>
        </div>
        <div className="section-grid">
          {VBOS_SECTIONS.map((s: VbosSection) => (
            <Link
              key={s.id}
              to={`/section/${s.id}`}
              className={`section-card section-card--link${s.dataFile ? ' section-card--ready' : ''}`}
            >
              <span className="section-card-id">{s.id}</span>
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
