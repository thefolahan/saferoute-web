import type { ActionRowData } from '../_components/action-row';

/* Copy transcribed verbatim from Figma 907:12642 / 907:12969 / 907:13222,
   including the designer's double space in "Dr thomas  Gideon". */

const ROAD_CLOSURE: Omit<ActionRowData, 'id'> = {
  badges: [{ text: 'Road closure report', tone: 'error' }],
  lead: 'Incident reported by Dr thomas  Gideon - ',
  rest: ' Protest blocking Ahmadu Bello road',
  meta: ['INC-07182', 'Abuja', '99 reports']
};

export const DASHBOARD_ACTIONS: ActionRowData[] = [
  {
    id: 'a1',
    badges: [
      { text: 'Fire report', tone: 'error' },
      { text: 'Submitted', tone: 'gray' }
    ],
    lead: 'Incident reported by James Fabusoro -',
    rest: ' Fire Outbreak at Gbagada express road...',
    meta: ['INC-07182', 'Lagos', '1 report']
  },
  {
    id: 'a2',
    badges: [{ text: 'Pending', tone: 'warning' }],
    lead: 'New user - Dr Jeffery Edward',
    meta: ['Community Member', 'Lagos']
  },
  {
    id: 'a3',
    badges: [{ text: 'Emergency report', tone: 'error' }],
    lead: 'Incident reported by Chinedu Godswill -',
    rest: ' Collapsed fence on Military Cantonment Road',
    meta: ['INC-07182', 'Abuja', '4 reports']
  },
  { id: 'a4', ...ROAD_CLOSURE }
];

/** The full "Pendings action" list — 10 rows (907:12969). */
export const PENDING_ACTIONS: ActionRowData[] = [
  ...DASHBOARD_ACTIONS,
  ...Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, ...ROAD_CLOSURE }))
];

/** "Verified reports" — same rows with a Verified badge (907:13222). */
export const VERIFIED_ACTIONS: ActionRowData[] = [
  {
    id: 'v1',
    badges: [
      { text: 'Fire report', tone: 'error' },
      { text: 'Verified', tone: 'success' }
    ],
    lead: 'Incident reported by James Fabusoro -',
    rest: ' Fire Outbreak at Gbagada express road...',
    meta: ['INC-07182', 'Lagos', '1 report']
  },
  ...Array.from({ length: 5 }, (_, i) => ({ id: `v${i + 2}`, ...ROAD_CLOSURE }))
];

export const REJECTED_ACTIONS: ActionRowData[] = [];
