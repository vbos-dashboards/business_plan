/** Map a Due Date cell to calendar quarters Q1–Q4 for display in the work plan table. */

function monthToQuarter(month: number): number {
  if (month <= 3) return 1
  if (month <= 6) return 2
  if (month <= 9) return 3
  return 4
}

/**
 * Word-boundary month names (CS Office sheet uses Dec, Sept, June, Feb, July, March, etc.).
 * Avoids substring false positives (e.g. "dec" inside "decision").
 */
const MONTH_PATTERNS: ReadonlyArray<{ re: RegExp; month: number }> = [
  { re: /\b(?:january|jan\.?)\b/i, month: 1 },
  { re: /\b(?:february|feb\.?)\b/i, month: 2 },
  { re: /\b(?:march|mar\.?)\b/i, month: 3 },
  { re: /\b(?:april|apr\.?)\b/i, month: 4 },
  { re: /\bmay\b/i, month: 5 },
  { re: /\b(?:june|jun\.?)\b/i, month: 6 },
  { re: /\b(?:july|jul\.?)\b/i, month: 7 },
  { re: /\b(?:august|aug\.?)\b/i, month: 8 },
  { re: /\b(?:september|sept\.?|sep\.?)\b/i, month: 9 },
  { re: /\b(?:october|oct\.?)\b/i, month: 10 },
  { re: /\b(?:november|nov\.?)\b/i, month: 11 },
  { re: /\b(?:december|dec\.?)\b/i, month: 12 },
]

function extractMonthFromText(s: string): number | null {
  for (const { re, month } of MONTH_PATTERNS) {
    if (re.test(s)) return month
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

  /** Year-round / continuous work — include in every quarter for filtering */
  if (/\bongoing\b/.test(lower)) return [1, 2, 3, 4]

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

export function formatQuartersLabel(quarters: number[], rawDue?: string): string {
  const raw = rawDue?.trim() ?? ''
  if (raw && /\bongoing\b/i.test(raw)) return 'Ongoing'
  if (quarters.length === 0) return 'Unassigned'
  const u = [...new Set(quarters)].sort((a, b) => a - b)
  if (u.length === 4) return 'Q1–Q4'
  if (u.length === 1) return `Q${u[0]}`
  if (u[0] === 1 && u[u.length - 1] === u.length && u.length > 1)
    return `Q1–Q${u[u.length - 1]}`
  return u.map((q) => `Q${q}`).join(', ')
}
