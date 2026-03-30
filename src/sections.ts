/**
 * Eleven VBoS departments (BP 2026). Code 1604 is not used in the official list.
 * Link `dataFile` to a CSV under public/data/ (same columns as the Social export).
 */
export const VBOS_SECTION_COUNT = 11 as const
export type VbosSection = {
  id: string
  /** Short name as in org charts, e.g. CS Office, Social */
  name: string
  /** Display label for the business plan (no section codes) */
  bpLabel: string
  /** File in public/data/ or null if not uploaded yet */
  dataFile: string | null
}

export const VBOS_SECTIONS: VbosSection[] = [
  {
    id: '1601',
    name: 'CS Office',
    bpLabel: 'BP_2026 — CS Office',
    dataFile: null,
  },
  {
    id: '1602',
    name: 'DCM',
    bpLabel: 'BP_2026 — DCM',
    dataFile: null,
  },
  {
    id: '1603',
    name: 'Admin&Finance',
    bpLabel: 'BP_2026 — Admin&Finance',
    dataFile: null,
  },
  {
    id: '1605',
    name: 'SLC',
    bpLabel: 'BP_2026 — SLC',
    dataFile: null,
  },
  {
    id: '1606',
    name: 'Economics',
    bpLabel: 'BP_2026 — Economics',
    dataFile: null,
  },
  {
    id: '1607',
    name: 'Social',
    bpLabel: 'BP_2026 — Social',
    dataFile: 'VBOS-Section-BP_2026-1607-Social.csv',
  },
  {
    id: '1608',
    name: 'Torba',
    bpLabel: 'BP_2026 — Torba',
    dataFile: null,
  },
  {
    id: '1609',
    name: 'Sanma',
    bpLabel: 'BP_2026 — Sanma',
    dataFile: null,
  },
  {
    id: '1610',
    name: 'Malampa',
    bpLabel: 'BP_2026 — Malampa',
    dataFile: null,
  },
  {
    id: '1611',
    name: 'Penama',
    bpLabel: 'BP_2026 — Penama',
    dataFile: null,
  },
  {
    id: '1612',
    name: 'Tafea',
    bpLabel: 'BP_2026 — Tafea',
    dataFile: null,
  },
]

if (VBOS_SECTIONS.length !== VBOS_SECTION_COUNT) {
  throw new Error('VBOS_SECTIONS must list exactly 11 sections')
}
