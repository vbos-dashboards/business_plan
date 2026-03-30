import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  progressByProgram,
  summarize,
  topProgramsForChart,
  type WorkItem,
} from '../workplan'

const CHART = {
  completed: '#1e6f4a',
  inProgress: '#c27f00',
  other: '#6b7280',
} as const

type Props = {
  /** Same filtered list as the work plan table */
  items: WorkItem[]
}

export function SectionProgressDashboard({ items }: Props) {
  const stats = summarize(items)
  const programRows = topProgramsForChart(progressByProgram(items), 8)

  const pieData = [
    { name: 'Completed', value: stats.completed, fill: CHART.completed },
    { name: 'In progress', value: stats.inProgress, fill: CHART.inProgress },
    { name: 'Other / not set', value: stats.other, fill: CHART.other },
  ].filter((d) => d.value > 0)

  const barData = programRows.map((r) => ({
    name: r.label,
    Completed: r.completed,
    'In progress': r.inProgress,
    'Other / not set': r.other,
  }))

  /* Taller chart: more px per program row + higher cap so bars read larger */
  const barHeight = Math.min(
    900,
    Math.max(320, programRows.length * 56 + 120),
  )

  if (stats.total === 0) {
    return (
      <section className="section-dashboard" aria-label="Progress dashboard">
        <h2 className="section-dashboard-title">Progress dashboard</h2>
        <p className="section-dashboard-empty">
          No outputs to chart with the current filters.
        </p>
      </section>
    )
  }

  return (
    <section className="section-dashboard" aria-label="Progress dashboard">
      <h2 className="section-dashboard-title">Progress dashboard</h2>
      <p className="section-dashboard-hint">
        Charts use the same program code and search filters as the table.
      </p>

      <div className="section-dashboard-grid">
        <div className="chart-card">
          <h3 className="chart-card-title">Status overview</h3>
          <p className="chart-card-meta">
            {stats.total} output{stats.total === 1 ? '' : 's'}
          </p>
          <div className="chart-card-body chart-card-body--pie">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value ?? 0, 'Outputs']}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card chart-card--wide">
          <h3 className="chart-card-title">Progress by program</h3>
          <p className="chart-card-meta">
            Stacked bar per program ({programRows.length} row
            {programRows.length === 1 ? '' : 's'})
          </p>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={barHeight}>
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 12, right: 24, left: 8, bottom: 12 }}
                barCategoryGap="12%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" allowDecimals={false} height={36} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={152}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <Tooltip
                  formatter={(value) => [value ?? 0, '']}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}
                />
                <Legend />
                <Bar dataKey="Completed" stackId="p" fill={CHART.completed} />
                <Bar dataKey="In progress" stackId="p" fill={CHART.inProgress} />
                <Bar
                  dataKey="Other / not set"
                  stackId="p"
                  fill={CHART.other}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
