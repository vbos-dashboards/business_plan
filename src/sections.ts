/**
 * Eleven VBoS departments (BP 2026). Code 1604 is not used in the official list.
 * Link `dataFile` to a CSV under public/data/ (same columns as the Social export).
 */
export const VBOS_SECTION_COUNT = 11 as const
export type VbosSection = {
  id: string
  /** Short name as in org charts, e.g. CS Office, Social */
  name: string
  /** Matches naming like BP_2026(1607-Social) */
  bpLabel: string
  /** File in public/data/ or null if not uploaded yet */
  dataFile: string | null
}

export const VBOS_SECTIONS: VbosSection[] = [
  {
    id: '1601',
    name: 'CS Office',
    bpLabel: 'BP_2026(1601-CS Office)',
    dataFile: null,
  },
  {
    id: '1602',
    name: 'DCM',
    bpLabel: 'BP_2026(1602-DCM)',
    dataFile: null,
  },
  {
    id: '1603',
    name: 'Admin&Finance',
    bpLabel: 'BP_2026(1603-Admin&Finance)',
    dataFile: null,
  },
  {
    id: '1605',
    name: 'SLC',
    bpLabel: 'BP_2026(1605-SLC)',
    dataFile: null,
  },
  {
    id: '1606',
    name: 'Economics',
    bpLabel: 'BP_2026(1606-Economics)',
    dataFile: null,
  },
  {
    id: '1607',
    name: 'Social',
    bpLabel: 'BP_2026(1607-Social)',
    dataFile: 'VBOS-Section-BP_2026-1607-Social.csv',
  },
  {
    id: '1608',
    name: 'Torba',
    bpLabel: 'BP_2026(1608-Torba)',
    dataFile: null,
  },
  {
    id: '1609',
    name: 'Sanma',
    bpLabel: 'BP_2026(1609-Sanma)',
    dataFile: null,
  },
  {
    id: '1610',
    name: 'Malampa',
    bpLabel: 'BP_2026(1610-Malampa)',
    dataFile: null,
  },
  {
    id: '1611',
    name: 'Penama',
    bpLabel: 'BP_2026(1611-Penama)',
    dataFile: null,
  },
  {
    id: '1612',
    name: 'Tafea',
    bpLabel: 'BP_2026(1612-Tafea)',
    dataFile: null,
  },
]

if (VBOS_SECTIONS.length !== VBOS_SECTION_COUNT) {
  throw new Error('VBOS_SECTIONS must list exactly 11 sections')
}
