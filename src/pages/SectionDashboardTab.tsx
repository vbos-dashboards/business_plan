import { lazy, Suspense } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { SectionOutletContext } from './sectionOutletContext'

const SectionProgressDashboard = lazy(() =>
  import('../components/SectionProgressDashboard').then((m) => ({
    default: m.SectionProgressDashboard,
  })),
)

export default function SectionDashboardTab() {
  const { filtered } = useOutletContext<SectionOutletContext>()

  return (
    <Suspense
      fallback={
        <div className="section-dashboard section-dashboard--loading">
          Loading charts…
        </div>
      }
    >
      <SectionProgressDashboard items={filtered} />
    </Suspense>
  )
}
