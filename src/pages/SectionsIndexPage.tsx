import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DepartmentNav } from '../components/DepartmentNav'
import { PageNav } from '../components/PageNav'
import { SiteFooter } from '../components/SiteFooter'
import {
  fetchSectionProgressFromCsv,
  type SectionProgressSnapshot,
} from '../sectionProgress'
import { BP_2026_EXCEL_FILE, VBOS_SECTIONS, type VbosSection } from '../sections'

export default function SectionsIndexPage() {
  const [progressById, setProgressById] = useState<
    Record<string, SectionProgressSnapshot | null | undefined>
  >({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const base = import.meta.env.BASE_URL
    ;(async () => {
      const entries = await Promise.all(
        VBOS_SECTIONS.map(async (s) => {
          const p = await fetchSectionProgressFromCsv(s, base)
          return [s.id, p] as const
        }),
      )
      if (cancelled) return
      setProgressById(Object.fromEntries(entries))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

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
          {VBOS_SECTIONS.map((s: VbosSection) => {
            const snap = progressById[s.id]
            const labelPct =
              loading || snap === undefined
                ? 'Loading progress'
                : snap
                  ? `${snap.percent}% complete (${snap.completed} of ${snap.total} outputs)`
                  : 'Progress unavailable'
            return (
              <Link
                key={s.id}
                to={`/section/${s.id}`}
                className="section-card section-card--link"
                aria-label={`${s.name} (${s.id}). ${labelPct}`}
              >
                <div className="section-card-main">
                  <span className="section-card-name">{s.name}</span>
                  <span className="section-card-bp">{s.bpLabel}</span>
                </div>
                <div className="section-card-progress">
                  {loading || snap === undefined ? (
                    <span className="section-card-progress-loading">…</span>
                  ) : snap ? (
                    <>
                      <span className="section-card-pct">{snap.percent}%</span>
                      <div className="section-card-bar-wrap" aria-hidden>
                        <div
                          className="section-card-bar-fill"
                          style={{ width: `${snap.percent}%` }}
                        />
                      </div>
                      <span className="section-card-progress-meta">
                        {snap.completed}/{snap.total} done
                      </span>
                    </>
                  ) : (
                    <span className="section-card-progress-mute">—</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
