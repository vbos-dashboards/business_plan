import { useEffect, useMemo, useState } from 'react'
import {
  buildWorkItems,
  normalizeProgress,
  parseCsv,
  summarize,
  type WorkItem,
} from './workplan'
import { VBOS_SECTIONS, type VbosSection } from './sections'
import './App.css'

const COVER_IMG = `${import.meta.env.BASE_URL}images/vbos-2026-business-plan-cover.png`

function progressLabel(kind: ReturnType<typeof normalizeProgress>): string {
  if (kind === 'completed') return 'Completed'
  if (kind === 'in-progress') return 'In progress'
  return 'Other / not set'
}

function App() {
  const [sectionId, setSectionId] = useState('1607')
  const section = useMemo(
    () => VBOS_SECTIONS.find((s) => s.id === sectionId) ?? VBOS_SECTIONS[6],
    [sectionId],
  )

  const [items, setItems] = useState<WorkItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [codeFilter, setCodeFilter] = useState<string>('all')

  useEffect(() => {
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

  return (
    <div className="app">
      <section className="cover" aria-label="2026 Business Plan cover">
        <div className="cover-frame">
          <img
            src={COVER_IMG}
            alt="Vanuatu Bureau of Statistics — 2026 Business Plan cover"
            className="cover-image"
            width={1200}
            height={900}
          />
        </div>
        <div className="cover-caption">
          <p className="org-name">Vanuatu Bureau of Statistics</p>
          <p className="org-name-fr">Bureau des Statistiques du Vanuatu</p>
          <p className="cover-title">2026 Business Plan — Section monitoring</p>
        </div>
      </section>

      <section className="section-panel" aria-label="VBoS sections">
        <div className="section-panel-head">
          <h2 className="section-panel-title">VBoS sections</h2>
          <p className="section-panel-sub">
            {VBOS_SECTIONS.length} departments ·{' '}
            <span className="has-data">●</span> work plan loaded ·{' '}
            <span className="no-data">○</span> CSV to be added under{' '}
            <code>public/data/</code>
          </p>
        </div>
        <div className="section-grid">
          {VBOS_SECTIONS.map((s: VbosSection) => (
            <button
              key={s.id}
              type="button"
              className={`section-card${sectionId === s.id ? ' section-card--active' : ''}${s.dataFile ? ' section-card--ready' : ''}`}
              onClick={() => {
                setSectionId(s.id)
                setFilter('')
                setCodeFilter('all')
              }}
            >
              <span className="section-card-id">{s.id}</span>
              <span className="section-card-name">{s.name}</span>
              <span className="section-card-bp">{s.bpLabel}</span>
              <span
                className="section-card-dot"
                aria-label={s.dataFile ? 'Data file linked' : 'No file yet'}
              >
                {s.dataFile ? '●' : '○'}
              </span>
            </button>
          ))}
        </div>
      </section>

      <header className="header">
        <div className="header-inner">
          <p className="eyebrow">Selected section</p>
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

      <footer className="footer">
        <p>
          Vanuatu Bureau of Statistics · Static site —{' '}
          <a
            href="https://github.com/vbos-dashboards/business_plan"
            target="_blank"
            rel="noreferrer"
          >
            vbos-dashboards/business_plan
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
