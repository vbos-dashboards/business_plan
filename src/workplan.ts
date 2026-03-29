export type WorkItem = {
  strategyObjective: string
  code: string
  program: string
  activity: string
  budget: string
  outputTarget: string
  target: string
  dueDate: string
  comments: string
  progress: string
  actions: string[]
}

export type ProgressKind = 'completed' | 'in-progress' | 'other'

export function normalizeProgress(raw: string): ProgressKind {
  const x = raw.trim().toLowerCase()
  if (!x) return 'other'
  if (x.includes('complete')) return 'completed'
  if (x.includes('progress')) return 'in-progress'
  return 'other'
}

/** Minimal CSV parser for quoted fields (commas inside quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === '\r') {
      continue
    } else if (ch === '\n' && !inQuotes) {
      row.push(field)
      field = ''
      rows.push(row)
      row = []
    } else if (ch === ',' && !inQuotes) {
      row.push(field)
      field = ''
    } else {
      field += ch
    }
  }
  row.push(field)
  rows.push(row)
  return rows
}

function cell(r: string[], i: number): string {
  return (r[i] ?? '').trim()
}

export function buildWorkItems(rows: string[][]): WorkItem[] {
  if (rows.length < 2) return []
  const data = rows.slice(1)
  let strategyObjective = ''
  let code = ''
  let program = ''
  let activity = ''
  let budget = ''
  const items: WorkItem[] = []

  for (const r of data) {
    const s = cell(r, 0)
    const c = cell(r, 1)
    const p = cell(r, 2)
    const a = cell(r, 3)
    const b = cell(r, 4)
    const out = cell(r, 5)
    const tgt = cell(r, 6)
    const act = cell(r, 7)
    const due = cell(r, 8)
    const comm = cell(r, 9)
    const prog = cell(r, 10)

    const upperOut = out.toUpperCase()
    if (
      upperOut.includes('TOTAL BUDGET') ||
      c.toUpperCase() === 'TOTAL BUDGET' ||
      (b.toUpperCase().includes('TOTAL') && upperOut.includes('BUDGET'))
    ) {
      continue
    }

    const nonEmpty =
      s ||
      c ||
      p ||
      a ||
      b ||
      out ||
      tgt ||
      act ||
      due ||
      comm ||
      prog
    if (!nonEmpty) continue

    if (s) strategyObjective = s
    if (c) {
      code = c
      if (p) program = p
      if (a) activity = a
    } else if (p) {
      program = p
      if (a) activity = a
    } else if (a) {
      activity = a
    }
    if (b) budget = b

    if (out) {
      items.push({
        strategyObjective,
        code,
        program,
        activity,
        budget,
        outputTarget: out,
        target: tgt,
        dueDate: due,
        comments: comm,
        progress: prog,
        actions: act ? [act] : [],
      })
    } else if (items.length > 0) {
      const last = items[items.length - 1]
      if (act) last.actions.push(act)
      if (comm) {
        last.comments = last.comments ? `${last.comments}\n${comm}` : comm
      }
      if (prog) last.progress = prog
    }
  }

  return items
}

export function summarize(items: WorkItem[]) {
  let completed = 0
  let inProgress = 0
  let other = 0
  for (const it of items) {
    const k = normalizeProgress(it.progress)
    if (k === 'completed') completed++
    else if (k === 'in-progress') inProgress++
    else other++
  }
  return { completed, inProgress, other, total: items.length }
}
