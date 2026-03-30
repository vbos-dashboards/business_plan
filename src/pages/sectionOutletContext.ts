import type { WorkItem } from '../workplan'
import type { VbosSection } from '../sections'

export type SectionOutletContext = {
  section: VbosSection
  items: WorkItem[]
  filtered: WorkItem[]
  stats: {
    completed: number
    inProgress: number
    other: number
    total: number
  }
  loadError: string | null
}
