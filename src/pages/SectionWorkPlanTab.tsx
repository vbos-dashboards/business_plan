import { useOutletContext } from 'react-router-dom'
import { formatQuartersLabel, inferQuartersFromDueDate } from '../quarters'
import {
  normalizeProgress,
  type WorkItem,
} from '../workplan'
import type { SectionOutletContext } from './sectionOutletContext'

function progressLabel(kind: ReturnType<typeof normalizeProgress>): string {
  if (kind === 'completed') return 'Completed'
  if (kind === 'in-progress') return 'In progress'
  return 'Other / not set'
}

export default function SectionWorkPlanTab() {
  const { filtered, stats, items, loadError } =
    useOutletContext<SectionOutletContext>()

  return (
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
            {filtered.map((it: WorkItem, idx: number) => {
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
                    {formatQuartersLabel(qs, it.dueDate)}
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
  )
}
