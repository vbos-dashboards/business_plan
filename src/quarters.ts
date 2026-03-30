/** Map a Due Date cell to calendar quarters Q1–Q4 for filtering and display. */

export type QuarterFilter = 'all' | '1' | '2' | '3' | '4' | 'unassigned'

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const

function monthToQuarter(month: number): number {
  if (month <= 3) return 1
  if (month <= 6) return 2
  if (month <= 9) return 3
  return 4
}

function extractMonthFromText(s: string): number | null {
  const lower = s.toLowerCase()
  for (let i = 0; i < 12; i++) {
    if (lower.includes(MONTHS[i])) return i + 1
  }
  const num = s.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/)
  if (num) {
    const a = +num[1]
    const b = +num[2]
    if (b >= 1 && b <= 12 && a <= 31) return b
    if (a >= 1 && a <= 12 && b <= 31) return a
  }
  return null
}

/**
 * Infer which quarters (1–4) apply from free-text due dates
 * (e.g. "Quarter 1", "Quarter 1-3", "Quarterly", "30-Sep-26").
 */
export function inferQuartersFromDueDate(due: string): number[] {
  const s = due.trim()
  if (!s) return []

  const lower = s.toLowerCase()

  if (/\bquarterly\b/.test(lower)) return [1, 2, 3, 4]

  const hyphen = lower.match(/quarter\s*(\d)\s*[-–]\s*(\d)/)
  if (hyphen) {
    const lo = Math.min(+hyphen[1], +hyphen[2])
    const hi = Math.max(+hyphen[1], +hyphen[2])
    const out: number[] = []
    for (let i = Math.max(1, lo); i <= Math.min(4, hi); i++) out.push(i)
    return out
  }

  if (lower.includes(' and ')) {
    const set = new Set<number>()
    for (const part of lower.split(/\s+and\s+/)) {
      const m = part.match(/quarter\s*(\d)|\bq\s*(\d)\b/)
      if (m) {
        const n = +(m[1] || m[2])
        if (n >= 1 && n <= 4) set.add(n)
      }
    }
    if (set.size) return [...set].sort((a, b) => a - b)
  }

  const single = lower.match(/\bquarter\s*(\d)\b|\bq\s*(\d)\b/)
  if (single) {
    const n = +(single[1] || single[2])
    if (n >= 1 && n <= 4) return [n]
  }

  const month = extractMonthFromText(s)
  if (month != null) return [monthToQuarter(month)]

  if (/\b12\s*months\b/.test(lower)) return []

  return []
}

export function formatQuartersLabel(quarters: number[]): string {
  if (quarters.length === 0) return 'Unassigned'
  const u = [...new Set(quarters)].sort((a, b) => a - b)
  if (u.length === 4) return 'Q1–Q4'
  if (u.length === 1) return `Q${u[0]}`
  if (u[0] === 1 && u[u.length - 1] === u.length && u.length > 1)
    return `Q1–Q${u[u.length - 1]}`
  return u.map((q) => `Q${q}`).join(', ')
}
