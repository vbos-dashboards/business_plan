import type { VbosSection } from './sections'
import { BP_2026_EXCEL_FILE } from './sections'
import { parseCsv } from './workplan'

export type LoadSource = 'excel' | 'csv' | 'none'

/** Match worksheet tab to configured name (exact, case-insensitive, or substring). */
export function resolveSheetName(
  sheetNames: string[],
  preferred: string,
): string | null {
  const w = preferred.trim().toLowerCase()
  if (!w) return null
  for (const n of sheetNames) {
    if (n.trim().toLowerCase() === w) return n
  }
  for (const n of sheetNames) {
    if (n.trim().toLowerCase().includes(w)) return n
  }
  for (const n of sheetNames) {
    const nl = n.trim().toLowerCase()
    if (w.includes(nl) && nl.length >= 3) return n
  }
  return null
}

export async function loadSectionRows(
  section: VbosSection,
  baseUrl: string,
): Promise<{ rows: string[][]; source: LoadSource; detail?: string }> {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  const tryCsv = async (): Promise<string[][] | null> => {
    if (!section.dataFile) return null
    const res = await fetch(`${base}data/${section.dataFile}`)
    if (!res.ok) return null
    const text = await res.text()
    return parseCsv(text)
  }

  let excelError: string | null = null
  try {
    const res = await fetch(`${base}data/${BP_2026_EXCEL_FILE}`)
    if (res.ok) {
      const buf = await res.arrayBuffer()
      const XLSX = await import('xlsx')
      const wb = XLSX.read(buf, { type: 'array', cellDates: true })
      const resolved = resolveSheetName(wb.SheetNames, section.sheetName)
      if (!resolved) {
        excelError = `Sheet "${section.sheetName}" not found. Tabs: ${wb.SheetNames.join(', ')}`
      } else {
        const ws = wb.Sheets[resolved]
        const raw = XLSX.utils.sheet_to_json<string[]>(ws, {
          header: 1,
          defval: '',
          raw: false,
        }) as string[][]
        const rows = raw.map((r) =>
          (r ?? []).map((c) => (c == null ? '' : String(c))),
        )
        if (rows.length > 0) {
          return { rows, source: 'excel' }
        }
      }
    }
  } catch (e) {
    excelError =
      e instanceof Error ? e.message : 'Could not read Excel workbook'
  }

  const csvRows = await tryCsv()
  if (csvRows && csvRows.length > 0) {
    return {
      rows: csvRows,
      source: 'csv',
      detail: excelError ?? undefined,
    }
  }

  if (excelError) {
    return { rows: [], source: 'none', detail: excelError }
  }

  return { rows: [], source: 'none' }
}
