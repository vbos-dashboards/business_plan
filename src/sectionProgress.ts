import type { VbosSection } from './sections'
import { buildWorkItems, parseCsv, summarize } from './workplan'

export type SectionProgressSnapshot = {
  percent: number
  total: number
  completed: number
}

/**
 * Loads a section’s CSV from `public/data/` and derives completion % from Progress column.
 * Used on the sections index to avoid fetching the full workbook once per card.
 */
export async function fetchSectionProgressFromCsv(
  section: VbosSection,
  baseUrl: string,
): Promise<SectionProgressSnapshot | null> {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  try {
    const res = await fetch(`${base}data/${section.dataFile}`)
    if (!res.ok) return null
    const text = await res.text()
    const rows = parseCsv(text)
    const items = buildWorkItems(rows)
    const s = summarize(items)
    const percent =
      s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0
    return { percent, total: s.total, completed: s.completed }
  } catch {
    return null
  }
}
