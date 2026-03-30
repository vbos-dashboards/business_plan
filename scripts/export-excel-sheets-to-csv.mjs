/**
 * Export each VBoS section worksheet from public/data/VBOS-Section-BP_2026.xlsx
 * to public/data/VBOS-Section-BP_2026-{id}-{slug}.csv (same pattern as Social).
 *
 * Keep SECTION_EXPORTS in sync with src/sections.ts (sheet + output filename).
 *
 * Usage: node scripts/export-excel-sheets-to-csv.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const workbookPath = path.join(root, 'public/data/VBOS-Section-BP_2026.xlsx')
const outDir = path.join(root, 'public/data')

/** Sheet tab name in workbook → CSV filename (must match sections.ts dataFile) */
const SECTION_EXPORTS = [
  { sheet: '1601-CS Office', file: 'VBOS-Section-BP_2026-1601-CS-Office.csv' },
  { sheet: '1602-DCM', file: 'VBOS-Section-BP_2026-1602-DCM.csv' },
  { sheet: '1603-Admin&Finance', file: 'VBOS-Section-BP_2026-1603-Admin-Finance.csv' },
  { sheet: '1605-SLC', file: 'VBOS-Section-BP_2026-1605-SLC.csv' },
  { sheet: '1606-Economics', file: 'VBOS-Section-BP_2026-1606-Economics.csv' },
  { sheet: '1607-Social', file: 'VBOS-Section-BP_2026-1607-Social.csv' },
  { sheet: '1608-Torba', file: 'VBOS-Section-BP_2026-1608-Torba.csv' },
  { sheet: '1609-Sanma', file: 'VBOS-Section-BP_2026-1609-Sanma.csv' },
  { sheet: '1610-Malampa', file: 'VBOS-Section-BP_2026-1610-Malampa.csv' },
  { sheet: '1611-Penama', file: 'VBOS-Section-BP_2026-1611-Penama.csv' },
  { sheet: '1612-Tafea', file: 'VBOS-Section-BP_2026-1612-Tafea.csv' },
]

if (!fs.existsSync(workbookPath)) {
  console.error('export-excel-sheets-to-csv: workbook not found:', workbookPath)
  process.exit(1)
}

const wb = XLSX.readFile(workbookPath)
let ok = 0

for (const { sheet, file } of SECTION_EXPORTS) {
  if (!wb.SheetNames.includes(sheet)) {
    console.warn('Missing sheet (skipped):', sheet)
    continue
  }
  const ws = wb.Sheets[sheet]
  const csv = XLSX.utils.sheet_to_csv(ws)
  const dest = path.join(outDir, file)
  fs.writeFileSync(dest, csv, 'utf8')
  console.log('Wrote', file)
  ok++
}

console.log(`Done: ${ok}/${SECTION_EXPORTS.length} CSV files`)
