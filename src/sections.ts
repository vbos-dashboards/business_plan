/**
 * Eleven VBoS section slots for BP 2026. Link `dataFile` to a CSV under public/data/
 * (same columns as the Social work plan export). Only sections with a file load rows.
 */
export const VBOS_SECTION_COUNT = 11 as const
export type VbosSection = {
  id: string
  name: string
  /** Matches naming like BP_2026(1607-Social) */
  bpLabel: string
  /** File in public/data/ or null if not uploaded yet */
  dataFile: string | null
}

export const VBOS_SECTIONS: VbosSection[] = [
  {
    id: '1601',
    name: 'Corporate Services & Administration',
    bpLabel: 'BP_2026(1601-Corporate)',
    dataFile: null,
  },
  {
    id: '1602',
    name: 'National Accounts & Economic Statistics',
    bpLabel: 'BP_2026(1602-Economic)',
    dataFile: null,
  },
  {
    id: '1603',
    name: 'Population & Demographic Statistics',
    bpLabel: 'BP_2026(1603-Population)',
    dataFile: null,
  },
  {
    id: '1604',
    name: 'Environment & Agriculture Statistics',
    bpLabel: 'BP_2026(1604-Environment)',
    dataFile: null,
  },
  {
    id: '1605',
    name: 'ICT, Data Science & GIS',
    bpLabel: 'BP_2026(1605-ICT)',
    dataFile: null,
  },
  {
    id: '1606',
    name: 'Methodology & Statistical Standards',
    bpLabel: 'BP_2026(1606-Methodology)',
    dataFile: null,
  },
  {
    id: '1607',
    name: 'Social & Environment Technical',
    bpLabel: 'BP_2026(1607-Social)',
    dataFile: 'VBOS-Section-BP_2026-1607-Social.csv',
  },
  {
    id: '1608',
    name: 'Provincial Statistics & Training',
    bpLabel: 'BP_2026(1608-Provincial)',
    dataFile: null,
  },
  {
    id: '1609',
    name: 'Survey Operations (HIES & Censuses)',
    bpLabel: 'BP_2026(1609-Surveys)',
    dataFile: null,
  },
  {
    id: '1610',
    name: 'Dissemination & Client Services',
    bpLabel: 'BP_2026(1610-Dissemination)',
    dataFile: null,
  },
  {
    id: '1611',
    name: 'International Classifications & Coordination',
    bpLabel: 'BP_2026(1611-International)',
    dataFile: null,
  },
]

if (VBOS_SECTIONS.length !== VBOS_SECTION_COUNT) {
  throw new Error('VBOS_SECTIONS must list exactly 11 sections')
}
