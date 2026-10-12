/*
 * The People and Culture documents in SharePoint that hub pages are written
 * from. Pages link back to these so anyone can check the original wording.
 * `reviewed` is the review date printed on the document itself (YYYY-MM).
 */

export interface SourceDocument {
  label: string;
  kind: 'Policy' | 'Guide';
  reviewed: string;
  url: string;
}

const PC = 'https://halfdome.sharepoint.com/sites/People&Culture/Shared Documents/General/People & Culture';
const POLICIES = `${PC}/Policies & How To Guides/Policies - July 2025`;
const GUIDES = `${PC}/Policies & How To Guides/How To Guides - July 2025`;

export const sources = {
  leavePolicy: {
    label: 'Leave Policy',
    kind: 'Policy',
    reviewed: '2025-09',
    url: 'https://halfdome.sharepoint.com/sites/Product/Shared Documents/General/Activation/Training/Drive/HalfDome_Policy_Leave Excluding Parental Leave_2025.pdf',
  },
  remunerationPolicy: {
    label: 'Remuneration and Benefits Policy',
    kind: 'Policy',
    reviewed: '2025-01',
    url: `${POLICIES}/HalfDome_Remuneration & Benefits Policy_2025.pdf`,
  },
  codeOfConduct: {
    label: 'Code of Conduct',
    kind: 'Policy',
    reviewed: '2026-01',
    url: `${POLICIES}/HalfDome_Policy_Code of Conduct_2026 (1).pdf`,
  },
  expensesPolicy: {
    label: 'Expenses Policy',
    kind: 'Policy',
    reviewed: '2026-03',
    url: `${POLICIES}/Half Dome_Policy_Expenses_MARCH2026.pdf`,
  },
  guideToHalfDome: {
    label: 'Your guide to Half Dome',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Half Dome.pptx`,
  },
  communicationGuide: {
    label: 'Your guide to communication',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Communication.pptx`,
  },
  meetingsGuide: {
    label: 'Your guide to meetings',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Meetings.pptx`,
  },
  mentalHealthFirstAidGuide: {
    label: 'Your guide to Mental Health First Aid',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Mental Health First Aid.pptx`,
  },
  parentalLeaveGuide: {
    label: 'Your guide to parental leave',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Parental Leave.pptx`,
  },
  remoteWorkingGuide: {
    label: 'Your guide to remote working',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Remote Working.pptx`,
  },
  buddyProgramGuide: {
    label: 'Your guide to the HD Buddy Program',
    kind: 'Guide',
    reviewed: '2025-08',
    url: `${GUIDES}/HD Guide to the HD Buddy Program.pptx`,
  },
  wellbeingGuide: {
    label: 'Your guide to wellbeing',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Wellbeing.pptx`,
  },
  wholePotentialDaysGuide: {
    label: 'Your guide to Whole Potential Days',
    kind: 'Guide',
    reviewed: '2025-07',
    url: `${GUIDES}/HD Guide to Whole Potential Days.pptx`,
  },
} satisfies Record<string, SourceDocument>;

export type SourceKey = keyof typeof sources;

export function sourceUrl(key: SourceKey) {
  return encodeURI(sources[key].url);
}
