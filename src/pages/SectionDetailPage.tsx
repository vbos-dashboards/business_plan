import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  NavLink,
  Outlet,
  Navigate,
  useParams,
} from 'react-router-dom'
import { DepartmentNav } from '../components/DepartmentNav'
import { PageNav } from '../components/PageNav'
import { SiteFooter } from '../components/SiteFooter'
import { loadSectionRows, type LoadSource } from '../excelWorkplan'
import { buildWorkItems, summarize, type WorkItem } from '../workplan'
import { BP_2026_EXCEL_FILE, VBOS_SECTIONS } from '../sections'
import type { SectionOutletContext } from './sectionOutletContext'

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

  const hasPlanData = dataSource === 'excel' || dataSource === 'csv'

  const outletContext = useMemo<SectionOutletContext | null>(() => {
    if (!section) return null
    return {
      section,
      items,
      filtered,
      stats,
      loadError,
    }
  }, [section, items, filtered, stats, loadError])

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

      {hasPlanData && outletContext && (
        <>
          <nav className="section-tabs" aria-label="Section views">
            <NavLink
              to={`/section/${sectionId}`}
              end
              className={({ isActive }) =>
                `section-tab${isActive ? ' section-tab--active' : ''}`
              }
            >
              Work plan
            </NavLink>
            <NavLink
              to={`/section/${sectionId}/dashboard`}
              className={({ isActive }) =>
                `section-tab${isActive ? ' section-tab--active' : ''}`
              }
            >
              Progress dashboard
            </NavLink>
          </nav>

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

          <Outlet context={outletContext} />
        </>
      )}

      <SiteFooter />
    </div>
  )
}
