/**
 * Eleven VBoS departments (BP 2026). Code 1604 is not used in the official list.
 *
 * Primary data: `public/data/VBOS-Section-BP_2026.xlsx` — worksheet tabs match `sheetName`
 * (e.g. `1601-CS Office` in the workbook).
 * CSV per section (`dataFile`) — exported from the same workbook; used if Excel is missing
 * or as fallback. Regenerate: `npm run export-csv` (requires `public/data/VBOS-Section-BP_2026.xlsx`).
 */
export const VBOS_SECTION_COUNT = 11 as const

/** Single workbook containing all section sheets (web-safe filename). */
export const BP_2026_EXCEL_FILE = 'VBOS-Section-BP_2026.xlsx'

export type VbosSection = {
  id: string
  name: string
  bpLabel: string
  /** Worksheet tab name inside VBOS-Section-BP_2026.xlsx */
  sheetName: string
  /** CSV in public/data/ (fallback; same structure as Social sheet export) */
  dataFile: string
}

export const VBOS_SECTIONS: VbosSection[] = [
  {
    id: '1601',
    name: 'CS Office',
    bpLabel: 'BP_2026 — CS Office',
    sheetName: '1601-CS Office',
    dataFile: 'VBOS-Section-BP_2026-1601-CS-Office.csv',
  },
  {
    id: '1602',
    name: 'DCM BP',
    bpLabel: 'BP_2026 — Data Collection and Management (DCM)',
    sheetName: '1602-DCM',
    dataFile: 'VBOS-Section-BP_2026-1602-DCM.csv',
  },
  {
    id: '1603',
    name: 'Admin&Finance',
    bpLabel: 'BP_2026 — Admin&Finance',
    sheetName: '1603-Admin&Finance',
    dataFile: 'VBOS-Section-BP_2026-1603-Admin-Finance.csv',
  },
  {
    id: '1605',
    name: 'SLC',
    bpLabel: 'BP_2026 — SLC',
    sheetName: '1605-SLC',
    dataFile: 'VBOS-Section-BP_2026-1605-SLC.csv',
  },
  {
    id: '1606',
    name: 'Economics',
    bpLabel: 'BP_2026 — Economics',
    sheetName: '1606-Economics',
    dataFile: 'VBOS-Section-BP_2026-1606-Economics.csv',
  },
  {
    id: '1607',
    name: 'Social',
    bpLabel: 'BP_2026 — Social',
    sheetName: '1607-Social',
    dataFile: 'VBOS-Section-BP_2026-1607-Social.csv',
  },
  {
    id: '1608',
    name: 'Torba',
    bpLabel: 'BP_2026 — Torba',
    sheetName: '1608-Torba',
    dataFile: 'VBOS-Section-BP_2026-1608-Torba.csv',
  },
  {
    id: '1609',
    name: 'Sanma',
    bpLabel: 'BP_2026 — Sanma',
    sheetName: '1609-Sanma',
    dataFile: 'VBOS-Section-BP_2026-1609-Sanma.csv',
  },
  {
    id: '1610',
    name: 'Malampa',
    bpLabel: 'BP_2026 — Malampa',
    sheetName: '1610-Malampa',
    dataFile: 'VBOS-Section-BP_2026-1610-Malampa.csv',
  },
  {
    id: '1611',
    name: 'Penama',
    bpLabel: 'BP_2026 — Penama',
    sheetName: '1611-Penama',
    dataFile: 'VBOS-Section-BP_2026-1611-Penama.csv',
  },
  {
    id: '1612',
    name: 'Tafea',
    bpLabel: 'BP_2026 — Tafea',
    sheetName: '1612-Tafea',
    dataFile: 'VBOS-Section-BP_2026-1612-Tafea.csv',
  },
]

if (VBOS_SECTIONS.length !== VBOS_SECTION_COUNT) {
  throw new Error('VBOS_SECTIONS must list exactly 11 sections')
}
