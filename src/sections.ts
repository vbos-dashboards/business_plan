/**
 * Eleven VBoS departments (BP 2026). Code 1604 is not used in the official list.
 *
 * Primary data: `public/data/VBOS-Section-BP_2026.xlsx` — one worksheet per department (`sheetName`).
 * Optional CSV per section (`dataFile`) used if the workbook is missing or as fallback.
 */
export const VBOS_SECTION_COUNT = 11 as const

/** Single workbook containing all section sheets (web-safe filename). */
export const BP_2026_EXCEL_FILE = 'VBOS-Section-BP_2026.xlsx'

export type VbosSection = {
  id: string
  name: string
  bpLabel: string
  /** Worksheet tab name inside BP_2026_EXCEL_FILE */
  sheetName: string
  /** Optional CSV in public/data/ (fallback or legacy) */
  dataFile: string | null
}

export const VBOS_SECTIONS: VbosSection[] = [
  {
    id: '1601',
    name: 'CS Office',
    bpLabel: 'BP_2026 — CS Office',
    sheetName: 'CS Office',
    dataFile: null,
  },
  {
    id: '1602',
    name: 'DCM',
    bpLabel: 'BP_2026 — DCM',
    sheetName: 'DCM',
    dataFile: null,
  },
  {
    id: '1603',
    name: 'Admin&Finance',
    bpLabel: 'BP_2026 — Admin&Finance',
    sheetName: 'Admin&Finance',
    dataFile: null,
  },
  {
    id: '1605',
    name: 'SLC',
    bpLabel: 'BP_2026 — SLC',
    sheetName: 'SLC',
    dataFile: null,
  },
  {
    id: '1606',
    name: 'Economics',
    bpLabel: 'BP_2026 — Economics',
    sheetName: 'Economics',
    dataFile: null,
  },
  {
    id: '1607',
    name: 'Social',
    bpLabel: 'BP_2026 — Social',
    sheetName: 'Social',
    dataFile: 'VBOS-Section-BP_2026-1607-Social.csv',
  },
  {
    id: '1608',
    name: 'Torba',
    bpLabel: 'BP_2026 — Torba',
    sheetName: 'Torba',
    dataFile: null,
  },
  {
    id: '1609',
    name: 'Sanma',
    bpLabel: 'BP_2026 — Sanma',
    sheetName: 'Sanma',
    dataFile: null,
  },
  {
    id: '1610',
    name: 'Malampa',
    bpLabel: 'BP_2026 — Malampa',
    sheetName: 'Malampa',
    dataFile: null,
  },
  {
    id: '1611',
    name: 'Penama',
    bpLabel: 'BP_2026 — Penama',
    sheetName: 'Penama',
    dataFile: null,
  },
  {
    id: '1612',
    name: 'Tafea',
    bpLabel: 'BP_2026 — Tafea',
    sheetName: 'Tafea',
    dataFile: null,
  },
]

if (VBOS_SECTIONS.length !== VBOS_SECTION_COUNT) {
  throw new Error('VBOS_SECTIONS must list exactly 11 sections')
}
