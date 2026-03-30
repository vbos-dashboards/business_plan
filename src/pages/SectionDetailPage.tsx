import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageNav } from '../components/PageNav'
import { SiteFooter } from '../components/SiteFooter'
import {
  buildWorkItems,
  normalizeProgress,
  parseCsv,
  summarize,
  type WorkItem,
} from '../workplan'
import { VBOS_SECTIONS } from '../sections'

function progressLabel(kind: ReturnType<typeof normalizeProgress>): string {
  if (kind === 'completed') return 'Completed'
  if (kind === 'in-progress') return 'In progress'
  return 'Other / not set'
}

export default function SectionDetailPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const section = useMemo(
    () => VBOS_SECTIONS.find((s) => s.id === sectionId),
    [sectionId],
  )

  const [items, setItems] = useState<WorkItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [codeFilter, setCodeFilter] = useState<string>('all')

  useEffect(() => {
    if (!section) return
    const file = section.dataFile
    if (!file) {
      setItems([])
      setLoadError(null)
      return
    }
    let cancelled = false
    const url = `${import.meta.env.BASE_URL}data/${file}`
    ;(async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Could not load work plan (${res.status})`)
        const text = await res.text()
        if (cancelled) return
        const rows = parseCsv(text)
        setItems(buildWorkItems(rows))
        setLoadError(null)
      } catch (e) {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : 'Failed to load data')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [section])

  const codes = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) {
      if (it.code) set.add(it.code)
    }
    return Array.from(set).sort()
  }, [items])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return items.filter((it) => {
      if (codeFilter !== 'all' && it.code !== codeFilter) return false
      if (!q) return true
      const blob = [
        it.code,
        it.program,
        it.outputTarget,
        it.comments,
        it.progress,
        ...it.actions,
      ]
        .join(' ')
        .toLowerCase()
      return blob.includes(q)
    })
  }, [items, filter, codeFilter])

  const stats = useMemo(() => summarize(filtered), [filtered])

  if (!sectionId || !section) {
    return <Navigate to="/sections" replace />
  }

  return (
    <div className="app">
      <div className="page-header-bar">
        <PageNav />
      </div>

      <p className="breadcrumb">
        <Link to="/">Cover</Link>
        <span aria-hidden> / </span>
        <Link to="/sections">Sections</Link>
        <span aria-hidden> / </span>
        <span className="breadcrumb-current">{section.id}</span>
      </p>

      <header className="header">
        <div className="header-inner">
          <p className="eyebrow">Section work plan</p>
          <h1>{section.name}</h1>
          <p className="sub">
            <strong>{section.bpLabel}</strong>
            {section.dataFile ? (
              <>
                {' '}
                — data: <code>{section.dataFile}</code>
              </>
            ) : (
              <>
                {' '}
                — add a CSV export with the same columns as the Social work plan
                to <code>public/data/</code> and link it in{' '}
                <code>src/sections.ts</code>.
              </>
            )}
          </p>
        </div>
      </header>

      {!section.dataFile && (
        <div className="banner muted" role="status">
          No spreadsheet is linked for this section yet. Upload a CSV and set{' '}
          <code>dataFile</code> in <code>sections.ts</code>.
        </div>
      )}

      {section.dataFile && loadError && (
        <div className="banner error" role="alert">
          {loadError}
        </div>
      )}

      {section.dataFile && (
        <>
          <section className="kpis" aria-label="Summary">
            <div className="kpi">
              <span className="kpi-value">{stats.total}</span>
              <span className="kpi-label">Outputs tracked</span>
            </div>
            <div className="kpi ok">
              <span className="kpi-value">{stats.completed}</span>
              <span className="kpi-label">Completed</span>
            </div>
            <div className="kpi warn">
              <span className="kpi-value">{stats.inProgress}</span>
              <span className="kpi-label">In progress</span>
            </div>
            <div className="kpi muted">
              <span className="kpi-value">{stats.other}</span>
              <span className="kpi-label">Other / not set</span>
            </div>
          </section>

          <section className="toolbar">
            <label className="field">
              <span>Program code</span>
              <select
                value={codeFilter}
                onChange={(e) => setCodeFilter(e.target.value)}
              >
                <option value="all">All</option>
                {codes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="field grow">
              <span>Search</span>
              <input
                type="search"
                placeholder="Output, action, risk…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                autoComplete="off"
              />
            </label>
          </section>

          <section className="table-wrap" aria-label="Work plan outputs">
            <table className="grid">
              <thead>
                <tr>
                  <th className="col-code">Code</th>
                  <th className="col-prog">Program</th>
                  <th className="col-budget">Budget</th>
                  <th className="col-out">Output / service target</th>
                  <th className="col-due">Due</th>
                  <th className="col-st">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it, idx) => {
                  const pk = normalizeProgress(it.progress)
                  return (
                    <tr key={`${it.outputTarget}-${idx}`}>
                      <td className="mono">{it.code}</td>
                      <td>{it.program}</td>
                      <td className="nowrap">{it.budget}</td>
                      <td>
                        <div className="output-title">{it.outputTarget}</div>
                        {it.actions.length > 0 && (
                          <ul className="actions">
                            {it.actions.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        )}
                        {it.comments && (
                          <p className="risk">
                            <strong>Risks / comments:</strong> {it.comments}
                          </p>
                        )}
                      </td>
                      <td className="nowrap">{it.dueDate || '—'}</td>
                      <td>
                        <span className={`pill pill-${pk}`}>
                          {progressLabel(pk)}
                        </span>
                        {it.progress && pk === 'other' && (
                          <span className="raw-progress">{it.progress}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && !loadError && (
              <p className="empty">No rows match your filters.</p>
            )}
          </section>
        </>
      )}

      <SiteFooter />
    </div>
  )
}
