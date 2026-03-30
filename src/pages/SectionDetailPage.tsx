import { useEffect, useMemo, useState } from 'react'
import {
  formatQuartersLabel,
  inferQuartersFromDueDate,
  type QuarterFilter,
} from '../quarters'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DepartmentNav } from '../components/DepartmentNav'
import { PageNav } from '../components/PageNav'
import { SiteFooter } from '../components/SiteFooter'
import { loadSectionRows, type LoadSource } from '../excelWorkplan'
import {
  buildWorkItems,
  normalizeProgress,
  summarize,
  type WorkItem,
} from '../workplan'
import { BP_2026_EXCEL_FILE, VBOS_SECTIONS } from '../sections'

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
  const [loadDetail, setLoadDetail] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<LoadSource | null>(null)
  const [filter, setFilter] = useState('')
  const [codeFilter, setCodeFilter] = useState<string>('all')
  const [quarterFilter, setQuarterFilter] = useState<QuarterFilter>('all')

  useEffect(() => {
    setQuarterFilter('all')
  }, [sectionId])

  useEffect(() => {
    if (!section) return
    let cancelled = false
    setLoadError(null)
    setLoadDetail(null)
    setDataSource(null)
    ;(async () => {
      try {
        const { rows, source, detail } = await loadSectionRows(
          section,
          import.meta.env.BASE_URL,
        )
        if (cancelled) return
        setDataSource(source)
        setLoadDetail(detail ?? null)
        setItems(buildWorkItems(rows))
        if (source === 'none') {
          setLoadError(
            detail ??
              `Add public/data/${BP_2026_EXCEL_FILE} with a worksheet named "${section.sheetName}" (same columns as the CSV export), or add a CSV under dataFile in sections.ts.`,
          )
        } else {
          setLoadError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setItems([])
          setDataSource('none')
          setLoadError(e instanceof Error ? e.message : 'Failed to load data')
        }
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

  const baseFiltered = useMemo(() => {
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

  const filtered = useMemo(() => {
    if (quarterFilter === 'all') return baseFiltered
    if (quarterFilter === 'unassigned') {
      return baseFiltered.filter(
        (it) => inferQuartersFromDueDate(it.dueDate).length === 0,
      )
    }
    const qn = Number(quarterFilter) as 1 | 2 | 3 | 4
    return baseFiltered.filter((it) =>
      inferQuartersFromDueDate(it.dueDate).includes(qn),
    )
  }, [baseFiltered, quarterFilter])

  const stats = useMemo(() => summarize(filtered), [filtered])

  const quarterStats = useMemo(() => {
    return ([1, 2, 3, 4] as const).map((q) => {
      const sub = baseFiltered.filter((it) =>
        inferQuartersFromDueDate(it.dueDate).includes(q),
      )
      return summarize(sub)
    })
  }, [baseFiltered])

  const unassignedCount = useMemo(
    () =>
      baseFiltered.filter(
        (it) => inferQuartersFromDueDate(it.dueDate).length === 0,
      ).length,
    [baseFiltered],
  )

  const hasPlanData = dataSource === 'excel' || dataSource === 'csv'

  if (!sectionId || !section) {
    return <Navigate to="/sections" replace />
  }

  return (
    <div className="app">
      <div className="page-header-bar">
        <PageNav />
      </div>
      <DepartmentNav />

      <p className="breadcrumb">
        <Link to="/">Cover</Link>
        <span aria-hidden> / </span>
        <Link to="/sections">Sections</Link>
        <span aria-hidden> / </span>
        <span className="breadcrumb-current">{section.name}</span>
      </p>

      <header className="header">
        <div className="header-inner">
          <p className="eyebrow">Section work plan</p>
          <h1>{section.name}</h1>
          <p className="sub">
            <strong>{section.bpLabel}</strong>
            {' — '}
            Workbook <code>{BP_2026_EXCEL_FILE}</code>, sheet{' '}
            <code>{section.sheetName}</code>
            {section.dataFile && (
              <>
                {' '}
                · CSV fallback <code>{section.dataFile}</code>
              </>
            )}
            {hasPlanData && dataSource && (
              <>
                {' '}
                · Source:{' '}
                <strong>{dataSource === 'excel' ? 'Excel' : 'CSV'}</strong>
              </>
            )}
          </p>
        </div>
      </header>

      {loadDetail && dataSource === 'csv' && (
        <div className="banner muted" role="status">
          {loadDetail}
        </div>
      )}

      {loadError && (
        <div className="banner error" role="alert">
          {loadError}
        </div>
      )}

      {hasPlanData && (
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

          <section className="quarter-strip" aria-label="Quarters">
            <p className="quarter-strip-title">
              2026 quarters — click to filter (uses program &amp; search above)
            </p>
            <div className="quarter-strip-row">
              {([1, 2, 3, 4] as const).map((q) => {
                const st = quarterStats[q - 1]
                const active = quarterFilter === String(q)
                return (
                  <button
                    key={q}
                    type="button"
                    className={`quarter-chip${active ? ' quarter-chip--active' : ''}`}
                    onClick={() =>
                      setQuarterFilter(
                        active ? 'all' : (String(q) as QuarterFilter),
                      )
                    }
                  >
                    <span className="quarter-chip-label">Q{q}</span>
                    <span className="quarter-chip-stat">
                      {st.completed} done · {st.total} outputs
                    </span>
                  </button>
                )
              })}
              <button
                type="button"
                className={`quarter-chip${quarterFilter === 'unassigned' ? ' quarter-chip--active' : ''}`}
                onClick={() =>
                  setQuarterFilter(
                    quarterFilter === 'unassigned' ? 'all' : 'unassigned',
                  )
                }
              >
                <span className="quarter-chip-label">Unassigned</span>
                <span className="quarter-chip-stat">{unassignedCount} outputs</span>
              </button>
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
            <label className="field">
              <span>Quarter</span>
              <select
                value={quarterFilter}
                onChange={(e) =>
                  setQuarterFilter(e.target.value as QuarterFilter)
                }
              >
                <option value="all">All quarters</option>
                <option value="1">Q1</option>
                <option value="2">Q2</option>
                <option value="3">Q3</option>
                <option value="4">Q4</option>
                <option value="unassigned">Unassigned due date</option>
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
                  <th className="col-quarter">Quarter</th>
                  <th className="col-st">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it, idx) => {
                  const pk = normalizeProgress(it.progress)
                  const qs = inferQuartersFromDueDate(it.dueDate)
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
                      <td className="col-quarter mono">
                        {formatQuartersLabel(qs)}
                      </td>
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
              <p className="empty">
                {items.length === 0
                  ? 'No rows in this sheet (check headers match the export).'
                  : 'No rows match your filters.'}
              </p>
            )}
          </section>
        </>
      )}

      <SiteFooter />
    </div>
  )
}
