/*
 * Half Dome agency calendar, 2026.
 * Source: "Half Dome - Agency Calender 2026.xlsx" in the People & Culture SharePoint
 * (tabs: Agency Rhythms, Lunch & Learn, L&D, Fun Dates, Milestone descriptions).
 *
 * Dates are written "D Mon" and always fall in 2026. Week-level cells in the sheet
 * (for example "Survey sent" in the week commencing 16 Feb) use `timing: 'week'`
 * and are anchored to that Monday. Two public holidays use the official Victorian
 * dates rather than the sheet's: Australia Day (26 Jan) and AFL Grand Final Friday (25 Sep).
 */

export const CALENDAR_YEAR = 2026;
export const SOURCE = {
  name: 'Half Dome - Agency Calender 2026',
  location: 'People & Culture SharePoint',
  updated: '2026-02-25',
  url: 'https://halfdome.sharepoint.com/:x:/r/sites/People&Culture/_layouts/15/Doc.aspx?sourcedoc=%7B47AAB338-D344-4C79-98D1-AE78EF076B1C%7D&file=Half%20Dome%20-%20Agency%20Calender%202026.xlsx&action=default&mobileredirect=true',
};

export type StreamId = 'closures' | 'rhythms' | 'learning' | 'culture' | 'industry';

export type IconName =
  | 'flag'
  | 'team'
  | 'learning'
  | 'present'
  | 'award'
  | 'handshake'
  | 'teapot'
  | 'revenue'
  | 'rocket'
  | 'mental-health'
  | 'book'
  | 'rating'
  | 'building'
  | 'calendar';

export type ArtKey =
  | 'holiday'
  | 'xmas'
  | 'donut'
  | 'bulb'
  | 'chess'
  | 'calculator'
  | 'ladder'
  | 'magnify'
  | 'disco'
  | 'megaphone'
  | 'plane'
  | 'rabbit'
  | 'pencil'
  | 'cake';

export interface Stream {
  id: StreamId;
  label: string;
  description: string;
  icon: IconName;
}

export const STREAMS: Stream[] = [
  { id: 'closures', label: 'Days off', description: 'Public holidays and the Christmas close.', icon: 'flag' },
  { id: 'rhythms', label: 'Agency rhythms', description: 'Leadership, team, CS, P&C and finance cadences.', icon: 'team' },
  { id: 'learning', label: 'Learning', description: 'NGEN, MFA, Lunch & Learns and internal training.', icon: 'learning' },
  { id: 'culture', label: 'Culture', description: 'Inclusion days and our fun dates.', icon: 'present' },
  { id: 'industry', label: 'Industry', description: 'Awards, partner events and competitions.', icon: 'award' },
];

export interface Series {
  id: string;
  title: string;
  stream: StreamId;
  unit: string;
  icon: IconName;
  art: ArtKey;
  cadence?: string;
  audience?: string;
  about?: string;
  resources?: string[];
}

export interface Detail {
  label: string;
  value: string;
}

export interface CalEvent {
  id: string;
  series: string;
  title?: string;
  start: string;
  end?: string;
  note?: string;
  timing?: 'day' | 'week' | 'early-month';
  time?: string;
  art?: ArtKey;
  details?: Detail[];
  modules?: Detail[];
  projected?: boolean;
}

const SERIES_LIST: Series[] = [
  // Days off
  {
    id: 'public-holiday',
    title: 'Public holiday',
    stream: 'closures',
    unit: 'Public holiday',
    icon: 'flag',
    art: 'holiday',
    audience: 'Everyone',
    about: 'A Victorian public holiday. The office is closed, so plan client work and deadlines around it.',
  },
  {
    id: 'xmas-close',
    title: 'Christmas close',
    stream: 'closures',
    unit: 'Whole agency',
    icon: 'flag',
    art: 'xmas',
    audience: 'Everyone',
    about: 'The agency closes for the Christmas break from the week of 21 December. Enjoy the time off.',
  },

  // Leadership
  {
    id: 'leadership-meeting',
    title: 'Leadership meeting',
    stream: 'rhythms',
    unit: 'Leadership',
    icon: 'team',
    art: 'chess',
    cadence: 'Fortnightly, Thursdays',
    audience: 'Partners and above',
    about: 'Partners and above catch up to discuss business updates and project work, with a focus on cross-functional operations.',
  },
  {
    id: 'elt-offsite',
    title: 'ELT offsite',
    stream: 'rhythms',
    unit: 'Leadership',
    icon: 'team',
    art: 'chess',
    cadence: 'Once a trimester',
    audience: 'Executive leadership team',
    about: 'Managing partners, the head of finance and the head of P&C come together on business updates, project work and progress against business OKRs and commercial targets.',
  },
  {
    id: 'leadership-offsite',
    title: 'Leadership offsite',
    stream: 'rhythms',
    unit: 'Leadership',
    icon: 'team',
    art: 'chess',
    cadence: 'February and June',
    audience: 'Partners and above',
  },

  // All team
  {
    id: 'okr-retro',
    title: 'Team OKRs and retros',
    stream: 'rhythms',
    unit: 'All team',
    icon: 'rocket',
    art: 'ladder',
    cadence: 'End of each trimester',
    audience: 'Every team',
    about: 'At the end of each trimester every team discusses what went well, what went less well, what to try next and how it tracked against its OKRs. We celebrate success, learn from failure and use it to set the next trimester\'s OKRs. OKRs are set three times a year and must be achievable and measurable.',
    resources: ['HD-Guide to OKRs_Updated.pdf'],
  },
  {
    id: 'media-i-survey',
    title: 'Media i survey',
    stream: 'rhythms',
    unit: 'All team',
    icon: 'rating',
    art: 'magnify',
    cadence: 'Twice a year',
    audience: 'Everyone',
  },

  // Client service
  {
    id: 'agency-review',
    title: 'Agency review and client pulse',
    stream: 'rhythms',
    unit: 'CS',
    icon: 'handshake',
    art: 'magnify',
    cadence: 'Three times a year',
    audience: 'Client service',
    about: 'A structured, consistent check on how we serve our clients. The agency review is 10 questions with comments and sets up a face-to-face meeting with the client. The client pulse is the light version: a single question with comments, followed by a more casual touch base to understand sentiment and tackle anything pressing.',
    resources: ['Agency Review Guide', 'Agency Review Example', 'Client Pulse Example'],
  },
  {
    id: 'csd-meeting',
    title: 'CSD meeting',
    stream: 'rhythms',
    unit: 'CS',
    icon: 'handshake',
    art: 'chess',
    cadence: 'Monthly, Thursdays',
    audience: 'Client service directors',
  },
  {
    id: 'cs-all-team',
    title: 'CS all-team meeting',
    stream: 'rhythms',
    unit: 'CS',
    icon: 'team',
    art: 'megaphone',
    cadence: 'Monthly, Mondays',
    audience: 'Client service',
    about: 'The whole CS team comes together to share project updates, discuss common challenges, share work and check in on team OKRs.',
  },

  // PT
  {
    id: 'pt-key-meeting',
    title: 'PT key meeting',
    stream: 'rhythms',
    unit: 'PT',
    icon: 'rocket',
    art: 'chess',
    cadence: 'Every 4 weeks, Thursdays',
    audience: 'PT',
  },
  {
    id: 'pt-director',
    title: 'PT director catch-up',
    stream: 'rhythms',
    unit: 'PT',
    icon: 'rocket',
    art: 'chess',
    cadence: 'Every 2 weeks, Wednesdays',
    audience: 'PT directors',
  },

  // People and Culture
  {
    id: 'reflections',
    title: 'Reflections and 360 feedback',
    stream: 'rhythms',
    unit: 'P&C',
    icon: 'mental-health',
    art: 'pencil',
    cadence: 'Three windows a year',
    audience: 'Everyone',
    about: 'A time to pause and reflect on past achievements and learnings to foster your progression. You complete a self-reflection and receive feedback from your manager, your team and other people you work with across the business.',
    resources: ['Reflections_ManagerGuide_2023.pdf', 'Development Plan - Reflection Process.pdf'],
  },
  {
    id: 'salary-review',
    title: 'Salary review and calibration',
    stream: 'rhythms',
    unit: 'P&C',
    icon: 'revenue',
    art: 'calculator',
    cadence: 'June and December',
    audience: 'Everyone',
    about: 'A review of pay to make sure it aligns with industry standards and reflects the market, so our pay structures stay fair and competitive. It may not always mean an immediate change. Salary increases and promotions can happen at any point in the year; this is the set time for salaries to be reviewed.',
  },
  {
    id: 'engagement-survey',
    title: 'Engagement survey',
    stream: 'rhythms',
    unit: 'P&C',
    icon: 'rating',
    art: 'magnify',
    cadence: 'Three times a year',
    audience: 'Everyone',
    about: 'Your chance to give Half Dome anonymous feedback across 12 areas, such as "I know what is expected of me at work" and "I have the materials and equipment to do my job well". It helps us understand your perspective so we keep improving as a business and a place to work.',
  },
  {
    id: 'kids-under-cover',
    title: 'Kids Under Cover',
    stream: 'rhythms',
    unit: 'P&C',
    icon: 'present',
    art: 'megaphone',
    audience: 'Everyone',
  },

  // Finance
  {
    id: 'forecasting-billing',
    title: 'Forecasting and billing',
    stream: 'rhythms',
    unit: 'Finance',
    icon: 'revenue',
    art: 'calculator',
    cadence: 'Monthly, Mondays',
    audience: 'Account leads and finance',
  },

  // Learning
  {
    id: 'lunch-learn',
    title: 'Lunch & Learn',
    stream: 'learning',
    unit: 'Lunch & Learn',
    icon: 'teapot',
    art: 'megaphone',
    audience: 'Listed per session',
    about: 'A publisher comes in to share what is new over lunch. They provide the catering.',
  },
  {
    id: 'ngen',
    title: 'NGEN session',
    stream: 'learning',
    unit: 'NGEN',
    icon: 'learning',
    art: 'bulb',
    audience: 'Listed per session (years in industry)',
    about: 'NGEN runs face-to-face sessions and webinars for the next generation of media talent. Each session lists the years of experience it suits.',
  },
  {
    id: 'mfa-courses',
    title: 'MFA courses',
    stream: 'learning',
    unit: 'MFA',
    icon: 'book',
    art: 'pencil',
    cadence: 'Weekly modules, two intakes',
    audience: 'Enrolled team members',
    about: 'Media Federation of Australia courses run as weekly modules with study weeks and an exam: Digital Foundations (Cert I and Cert II), Out of Home Foundations, TV Foundations and How to Buy TV.',
  },
  {
    id: 'mfa-ex',
    title: 'MFA EX',
    stream: 'learning',
    unit: 'MFA',
    icon: 'book',
    art: 'disco',
    audience: 'Everyone',
  },
  {
    id: 'hd-training',
    title: 'Internal training',
    stream: 'learning',
    unit: 'HD training',
    icon: 'learning',
    art: 'bulb',
    audience: 'Listed per session',
  },

  // Culture
  {
    id: 'dei',
    title: 'Inclusion day',
    stream: 'culture',
    unit: 'Inclusion',
    icon: 'mental-health',
    art: 'megaphone',
    audience: 'Everyone',
    about: 'A day or season we recognise as an agency. Some are marked with a small in-house celebration.',
  },
  {
    id: 'fun',
    title: 'Fun date',
    stream: 'culture',
    unit: 'Fun date',
    icon: 'present',
    art: 'donut',
    audience: 'Everyone',
    about: 'One of our fun dates. A good excuse for a treat in the office.',
  },

  // Industry
  {
    id: 'awards',
    title: 'Industry awards',
    stream: 'industry',
    unit: 'Awards',
    icon: 'award',
    art: 'disco',
  },
  {
    id: 'partner-events',
    title: 'Partner event',
    stream: 'industry',
    unit: 'Partner events',
    icon: 'handshake',
    art: 'megaphone',
  },
  {
    id: 'industry-events',
    title: 'Industry event',
    stream: 'industry',
    unit: 'Industry events',
    icon: 'building',
    art: 'disco',
  },
  {
    id: 'competitions',
    title: 'Competition',
    stream: 'industry',
    unit: 'Competitions',
    icon: 'award',
    art: 'rabbit',
  },
];

export const SERIES: Record<string, Series> = Object.fromEntries(SERIES_LIST.map((s) => [s.id, s]));

/* ---------- Helpers to keep the data readable ---------- */

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

/** "15 Oct" -> "2026-10-15" */
function d(text: string): string {
  const [day, mon] = text.trim().split(/\s+/);
  const m = MONTHS[mon];
  if (!m) throw new Error(`Bad date: ${text}`);
  return `${CALENDAR_YEAR}-${String(m).padStart(2, '0')}-${String(Number(day)).padStart(2, '0')}`;
}

let seq = 0;
const id = (series: string) => `${series}-${++seq}`;

type Extra = Omit<CalEvent, 'id' | 'series' | 'start'>;

function one(series: string, date: string, extra: Extra = {}): CalEvent {
  return { id: id(series), series, start: d(date), ...extra };
}

function span(series: string, from: string, to: string, extra: Extra = {}): CalEvent {
  return { id: id(series), series, start: d(from), end: d(to), ...extra };
}

function many(series: string, dates: string[], extra: Extra = {}): CalEvent[] {
  return dates.map((date) => one(series, date, extra));
}

/** Repeats every `stepDays` from `from` until `until`, skipping dates in `skip`. */
function every(series: string, from: string, stepDays: number, until: string, extra: Extra = {}, skip: string[] = []): CalEvent[] {
  const out: CalEvent[] = [];
  const end = new Date(`${d(until)}T12:00:00Z`).getTime();
  const skipSet = new Set(skip.map(d));
  for (let t = new Date(`${d(from)}T12:00:00Z`).getTime(); t <= end; t += stepDays * 86_400_000) {
    const iso = new Date(t).toISOString().slice(0, 10);
    if (!skipSet.has(iso)) out.push({ id: id(series), series, start: iso, ...extra });
  }
  return out;
}

/* ---------- MFA weekly schedule (L&D tab) ---------- */

type Week = { week: string; items: [course: string, module: string][] };

const MFA_WEEKS: Week[] = [
  { week: '9 Mar', items: [['Digital Foundations', 'Cert I: Intro to Digital Media']] },
  { week: '16 Mar', items: [['Digital Foundations', 'Cert I: AI Foundations']] },
  {
    week: '23 Mar',
    items: [
      ['Digital Foundations', 'Cert I: Programmatic'],
      ['Out of Home Foundations', 'Landscape'],
      ['TV Foundations', 'TV Landscape'],
      ['How to Buy TV', 'Pre-buy'],
    ],
  },
  {
    week: '30 Mar',
    items: [
      ['Digital Foundations', 'Cert I: Commerce & Retail'],
      ['Out of Home Foundations', 'Measurement'],
      ['TV Foundations', 'TV Planning'],
      ['How to Buy TV', 'Buying Best Practice'],
    ],
  },
  {
    week: '6 Apr',
    items: [
      ['Digital Foundations', 'Study week'],
      ['Out of Home Foundations', 'Planning'],
      ['TV Foundations', 'Factors Influencing Cost'],
      ['How to Buy TV', 'Buying Method 1: Optimisation'],
    ],
  },
  { week: '13 Apr', items: [['Digital Foundations', 'Cert I exam'], ['TV Foundations', 'TV Buying']] },
  {
    week: '20 Apr',
    items: [
      ['Out of Home Foundations', 'Buying Process'],
      ['TV Foundations', 'Study week'],
      ['How to Buy TV', 'Buying Method 2: Briefing Networks'],
    ],
  },
  {
    week: '27 Apr',
    items: [
      ['Digital Foundations', 'Cert II: Social'],
      ['Out of Home Foundations', 'Campaign Reporting'],
      ['TV Foundations', 'BVOD'],
      ['How to Buy TV', 'Ongoing Management & Post Analysis'],
    ],
  },
  {
    week: '4 May',
    items: [
      ['Digital Foundations', 'Cert II: Search & Discovery'],
      ['Out of Home Foundations', 'Creative Consideration'],
      ['TV Foundations', 'Evaluation, Measurement & Reporting'],
      ['How to Buy TV', 'Understanding BVOD Buying'],
    ],
  },
  {
    week: '11 May',
    items: [
      ['Digital Foundations', 'Cert II: Content Marketing'],
      ['Out of Home Foundations', 'Study week'],
      ['TV Foundations', 'VOZ as a Currency'],
      ['How to Buy TV', 'Study week'],
    ],
  },
  {
    week: '18 May',
    items: [
      ['Digital Foundations', 'Cert II: Measurement that Matters'],
      ['Out of Home Foundations', 'Study week'],
      ['TV Foundations', 'Study week'],
      ['How to Buy TV', 'Study week'],
    ],
  },
  {
    week: '25 May',
    items: [
      ['Digital Foundations', 'Study week'],
      ['Out of Home Foundations', 'Exam'],
      ['TV Foundations', 'Exam'],
      ['How to Buy TV', 'Exam'],
    ],
  },
  { week: '1 Jun', items: [['Digital Foundations', 'Cert II exam']] },

  { week: '17 Aug', items: [['Digital Foundations', 'Cert I: Intro to Digital Media']] },
  { week: '24 Aug', items: [['Digital Foundations', 'Cert I: AI Overview']] },
  {
    week: '31 Aug',
    items: [
      ['Digital Foundations', 'Cert I: Programmatic'],
      ['Out of Home Foundations', 'Landscape'],
      ['TV Foundations', 'TV Landscape'],
      ['How to Buy TV', 'Pre-buy'],
    ],
  },
  {
    week: '7 Sep',
    items: [
      ['Digital Foundations', 'Cert I: Commerce & Retail'],
      ['Out of Home Foundations', 'Measurement'],
      ['TV Foundations', 'TV Planning'],
      ['How to Buy TV', 'Buying Best Practice'],
    ],
  },
  {
    week: '14 Sep',
    items: [
      ['Digital Foundations', 'Study week'],
      ['Out of Home Foundations', 'Planning'],
      ['TV Foundations', 'Factors Influencing Cost'],
      ['How to Buy TV', 'Buying Method 1: Optimisation'],
    ],
  },
  { week: '21 Sep', items: [['Digital Foundations', 'Cert I exam'], ['TV Foundations', 'TV Buying']] },
  {
    week: '28 Sep',
    items: [
      ['Out of Home Foundations', 'Buying Process'],
      ['TV Foundations', 'Study week'],
      ['How to Buy TV', 'Buying Method 2: Briefing Networks'],
    ],
  },
  {
    week: '5 Oct',
    items: [
      ['Digital Foundations', 'Cert II: Social'],
      ['Out of Home Foundations', 'Campaign Reporting'],
      ['TV Foundations', 'BVOD'],
      ['How to Buy TV', 'Ongoing Management & Post Analysis'],
    ],
  },
  {
    week: '12 Oct',
    items: [
      ['Digital Foundations', 'Cert II: Search & Discovery'],
      ['Out of Home Foundations', 'Creative Consideration'],
      ['TV Foundations', 'Evaluation, Measurement & Reporting'],
      ['How to Buy TV', 'Understanding BVOD Buying'],
    ],
  },
  {
    week: '19 Oct',
    items: [
      ['Digital Foundations', 'Cert II: Content Marketing'],
      ['Out of Home Foundations', 'Study week'],
      ['TV Foundations', 'VOZ as a Currency'],
      ['How to Buy TV', 'Study week'],
    ],
  },
  {
    week: '26 Oct',
    items: [
      ['Digital Foundations', 'Cert II: Measurement that Matters'],
      ['Out of Home Foundations', 'Study week'],
      ['TV Foundations', 'Study week'],
      ['How to Buy TV', 'Study week'],
    ],
  },
  { week: '2 Nov', items: [['Digital Foundations', 'Study week'], ['How to Buy TV', 'Exam']] },
  {
    week: '9 Nov',
    items: [
      ['Digital Foundations', 'Cert II exam'],
      ['Out of Home Foundations', 'Exam'],
      ['TV Foundations', 'Exam'],
    ],
  },
];

function mfaWeek(w: Week): CalEvent {
  const exams = w.items.filter(([, m]) => /exam/i.test(m)).map(([c]) => c);
  const modules = w.items.filter(([, m]) => !/exam|study week/i.test(m)).length;
  const note = exams.length
    ? `Exam week: ${exams.join(', ')}`
    : modules
      ? `${modules} ${modules === 1 ? 'module' : 'modules'} this week`
      : 'Study week';
  return {
    id: id('mfa-courses'),
    series: 'mfa-courses',
    title: exams.length ? 'MFA exams' : 'MFA courses',
    start: d(w.week),
    timing: 'week',
    note,
    modules: w.items.map(([course, module]) => ({ label: course, value: module })),
  };
}

/* ---------- Events ---------- */

export const EVENTS: CalEvent[] = [
  // Days off: Victorian public holidays
  one('public-holiday', '1 Jan', { title: "New Year's Day" }),
  one('public-holiday', '26 Jan', { title: 'Australia Day' }),
  one('public-holiday', '9 Mar', { title: 'Labour Day' }),
  span('public-holiday', '3 Apr', '6 Apr', { title: 'Easter long weekend', note: 'Good Friday to Easter Monday' }),
  one('public-holiday', '25 Apr', { title: 'ANZAC Day' }),
  one('public-holiday', '8 Jun', { title: "King's Birthday" }),
  one('public-holiday', '25 Sep', { title: 'AFL Grand Final Friday' }),
  one('public-holiday', '3 Nov', { title: 'Melbourne Cup Day' }),
  one('public-holiday', '25 Dec', { title: 'Christmas Day', art: 'xmas' }),
  one('public-holiday', '26 Dec', { title: 'Boxing Day', art: 'xmas' }),
  one('public-holiday', '28 Dec', { title: 'Boxing Day (additional day)', art: 'xmas' }),
  span('xmas-close', '21 Dec', '31 Dec', { note: 'From the week of 21 December' }),

  // Leadership
  ...many('leadership-meeting', [
    '15 Jan', '29 Jan', '12 Feb', '12 Mar', '26 Mar', '9 Apr', '23 Apr', '7 May', '21 May', '4 Jun', '18 Jun', '2 Jul',
    '16 Jul', '30 Jul', '13 Aug', '27 Aug', '10 Sep', '24 Sep', '8 Oct', '22 Oct', '5 Nov', '19 Nov', '3 Dec', '17 Dec',
  ]),
  ...many('elt-offsite', ['19 Feb', '18 Jun', '15 Oct']),
  ...many('leadership-offsite', ['26 Feb', '25 Jun']),

  // All team
  one('media-i-survey', '1 Apr', { note: 'Survey due' }),
  one('media-i-survey', '1 Jun', { note: 'Results out' }),
  one('media-i-survey', '1 Oct', { note: 'Survey due' }),
  one('media-i-survey', '1 Dec', { note: 'Results out' }),
  ...many('okr-retro', ['5 Mar', '2 Jul', '29 Oct']),

  // Client service
  one('agency-review', '9 Feb', { timing: 'week', note: 'Surveys go out' }),
  one('agency-review', '2 Mar', { timing: 'week', note: 'Results in' }),
  one('agency-review', '8 Jun', { note: 'Surveys go out' }),
  one('agency-review', '29 Jun', { timing: 'week', note: 'Results in' }),
  one('agency-review', '5 Oct', { note: 'Surveys go out' }),
  one('agency-review', '26 Oct', { timing: 'week', note: 'Results in' }),
  ...many('csd-meeting', [
    '29 Jan', '26 Feb', '26 Mar', '30 Apr', '28 May', '25 Jun', '30 Jul', '27 Aug', '1 Oct', '29 Oct', '26 Nov', '17 Dec',
  ]),
  ...many('cs-all-team', [
    '19 Jan', '16 Feb', '16 Mar', '20 Apr', '18 May', '15 Jun', '20 Jul', '17 Aug', '21 Sep', '19 Oct', '16 Nov', '14 Dec',
  ]),

  // PT: the sheet gives the first dates and the cadence; later dates follow that cadence.
  ...many('pt-key-meeting', ['22 Jan', '19 Feb']),
  ...every('pt-key-meeting', '19 Mar', 28, '26 Nov', { projected: true }),
  one('pt-director', '4 Feb'),
  ...every('pt-director', '18 Feb', 14, '9 Dec', { projected: true }),

  // People and Culture
  one('kids-under-cover', '12 Feb'),
  span('reflections', '9 Mar', '27 Mar'),
  span('reflections', '11 May', '29 May'),
  span('reflections', '14 Sep', '2 Oct'),
  one('salary-review', '1 Jun'),
  one('salary-review', '1 Dec'),
  one('engagement-survey', '16 Feb', { timing: 'week', note: 'Survey sent' }),
  one('engagement-survey', '23 Feb', { timing: 'week', note: 'Results shared' }),
  one('engagement-survey', '22 Jun', { timing: 'week', note: 'Survey sent' }),
  one('engagement-survey', '29 Jun', { timing: 'week', note: 'Results shared' }),
  one('engagement-survey', '19 Oct', { timing: 'week', note: 'Survey sent' }),
  one('engagement-survey', '26 Oct', { timing: 'week', note: 'Results shared' }),

  // Finance
  ...many('forecasting-billing', [
    '12 Jan', '9 Feb', '9 Mar', '6 Apr', '11 May', '8 Jun', '6 Jul', '10 Aug', '7 Sep', '12 Oct', '9 Nov', '7 Dec',
  ]),

  // Lunch & Learn
  one('lunch-learn', '28 Jan', {
    title: 'Lunch & Learn: The Guardian',
    time: '11am',
    details: [
      { label: 'Publisher', value: 'The Guardian' },
      { label: 'Contact', value: 'Lexi Merton' },
      { label: 'Who should attend', value: 'CSM' },
    ],
  }),
  one('lunch-learn', '3 Feb', {
    title: 'Lunch & Learn: Jolt',
    time: '12pm',
    details: [
      { label: 'Publisher', value: 'Jolt' },
      { label: 'Contact', value: 'Alicia Proebstl' },
      { label: 'Who should attend', value: 'CS, Programmatic, Offline' },
    ],
  }),
  one('lunch-learn', '17 Feb', {
    title: 'Lunch & Learn: Vinyl Media',
    time: '12pm',
    details: [
      { label: 'Publisher', value: 'Vinyl Media' },
      { label: 'Contact', value: 'Charlotte Travers' },
      { label: 'Who should attend', value: 'Strategy, CS, Programmatic' },
    ],
  }),
  one('lunch-learn', '3 Mar', {
    title: 'Lunch & Learn: Nine',
    time: '12pm',
    details: [
      { label: 'Publisher', value: 'Nine' },
      { label: 'Contact', value: 'Carmel Morganti' },
      { label: 'Who should attend', value: 'CS and Digital' },
    ],
  }),
  one('lunch-learn', '10 Mar', {
    title: 'Lunch & Learn: Reddit',
    time: '12pm',
    details: [
      { label: 'Publisher', value: 'Reddit' },
      { label: 'Contact', value: 'Georgia Wetzell' },
      { label: 'Who should attend', value: 'Performance and CS' },
    ],
  }),

  // NGEN face to face
  ...(
    [
      ['17 Feb', 'Creating Confidence: Advance', '0 to 5 years'],
      ['11 Mar', 'NGEN Charity Cup', '0 to 5 years'],
      ['18 Mar', 'Critical Thinking', '0 to 5 years'],
      ['16 Apr', 'Building a Future Ready You', '0 to 5 years'],
      ['5 May', 'Building Trust', '0 to 5 years'],
      ['10 Jun', 'Creative: Award Winning Ideas Fast', '0 to 5 years'],
      ['22 Jun', 'NGEN Awards: call for entries', ''],
      ['2 Jul', 'Strategy: Agency', '0 to 5 years'],
      ['30 Jul', 'NGEN Media Bootcamp', '0 to 2 years'],
      ['19 Aug', 'NGEN Award Day', ''],
      ['15 Sep', 'Design & Deliver Powerful Presentations', '0 to 5 years'],
      ['13 Oct', 'Negotiation Skills & Techniques', '3 to 5 years'],
    ] as const
  ).map(([date, title, years]) =>
    one('ngen', date, {
      title,
      note: years ? `NGEN face to face, ${years}` : 'NGEN',
      details: [{ label: 'Format', value: 'Face to face' }, ...(years ? [{ label: 'Suits', value: years }] : [])],
    }),
  ),
  // NGEN webinars
  ...(
    [
      ['10 Feb', 'Vision & Goal Setting: Advance', '3 to 5 years'],
      ['4 Mar', 'Future Media Spotlight', '0 to 2 years'],
      ['31 Mar', 'Boomtown Masterclass', '0 to 2 years'],
      ['23 Apr', 'Management Collective Essentials', 'Invite only'],
      ['7 May', 'Management Collective Essentials', 'Invite only'],
      ['21 May', 'Management Collective Essentials', 'Invite only'],
      ['4 Jun', 'Management Collective Essentials', 'Invite only'],
      ['24 Jun', 'NGEN Awards briefing', ''],
      ['22 Jul', 'Stress Management', '0 to 5 years'],
      ['26 Aug', 'Boomtown Masterclass', '0 to 2 years'],
      ['29 Sep', 'Navigating Uncertainty', '0 to 5 years'],
      ['15 Oct', 'Future Media Spotlight', '0 to 2 years'],
    ] as const
  ).map(([date, title, years]) =>
    one('ngen', date, {
      title,
      note: years ? `NGEN webinar, ${years}` : 'NGEN webinar',
      details: [{ label: 'Format', value: 'Webinar' }, ...(years ? [{ label: 'Suits', value: years }] : [])],
    }),
  ),

  // MFA
  one('mfa-ex', '9 Sep', { note: 'Open to everyone' }),
  ...MFA_WEEKS.map(mfaWeek),

  // Internal training
  span('hd-training', '10 Mar', '12 Mar', { title: 'ChatGPT Masterclass with Harry', art: 'bulb' }),
  one('hd-training', '12 Mar', { title: 'Cybersecurity training', art: 'magnify' }),
  one('hd-training', '10 Feb', { title: 'Executive cohort', art: 'ladder' }),

  // Culture: inclusion days
  span('dei', '17 Feb', '3 Mar', { title: 'Lunar New Year' }),
  span('dei', '13 Feb', '1 Mar', { title: 'Sydney Gay and Lesbian Mardi Gras' }),
  span('dei', '16 Feb', '18 Mar', { title: 'Ramadan to Eid al-Fitr' }),
  one('dei', '4 Mar', { title: "International Women's Day" }),
  one('dei', '14 Mar', { title: 'Holi' }),
  span('dei', '16 Mar', '22 Mar', { title: 'Neurodiversity Celebration Week' }),
  one('dei', '10 May', { title: "Mother's Day", art: 'cake' }),
  one('dei', '17 May', { title: 'IDAHOBIT', note: 'International Day Against Homophobia, Biphobia and Transphobia' }),
  span('dei', '27 May', '3 Jun', { title: 'National Reconciliation Week' }),
  span('dei', '1 Jun', '30 Jun', { title: 'Pride Month' }),
  span('dei', '5 Jul', '12 Jul', { title: 'NAIDOC Week', note: '50th year' }),
  one('dei', '6 Sep', { title: "Father's Day", art: 'cake' }),
  one('dei', '10 Sep', { title: 'R U OK? Day' }),
  span('dei', '11 Sep', '13 Sep', { title: 'Rosh Hashanah' }),
  one('dei', '8 Nov', { title: 'Diwali' }),
  one('dei', '3 Dec', { title: 'International Day of People with Disability' }),

  // Culture: fun dates
  ...(
    [
      ['5 Feb', 'World Nutella Day'],
      ['9 Feb', 'Pizza Day'],
      ['17 Feb', 'Pancake Tuesday'],
      ['24 Feb', 'Nacho Day'],
      ['20 Mar', 'Harmony Day'],
      ['1 Apr', "April Fools' Day"],
      ['12 Apr', 'Toasted Cheese Day'],
      ['16 Apr', 'PJs to Work Day'],
      ['4 May', 'Star Wars Day'],
      ['28 May', 'Burger Day'],
      ['1 Jun', 'Wear It Yellow Day'],
      ['6 Jun', 'Donut Day'],
      ['18 Jun', 'Picnic Day'],
      ['20 Jul', 'Ice Cream Day'],
      ['10 Aug', 'Watermelon Day'],
      ['13 Aug', 'Left Handers Day'],
      ['16 Sep', 'Guacamole Day'],
      ['1 Oct', 'Coffee Day'],
      ['4 Oct', 'Taco Day'],
      ['6 Oct', 'Mad Hatter Day'],
      ['16 Nov', 'Fast Food Day'],
    ] as const
  ).map(([date, title]) =>
    one('fun', date, {
      title,
      art: title === "April Fools' Day" || title === 'PJs to Work Day' ? 'rabbit' : title === 'Harmony Day' ? 'megaphone' : 'donut',
    }),
  ),

  // Industry: awards
  one('awards', '1 May', { title: 'Great Place to Work', note: 'We are entering' }),
  one('awards', '23 Jul', { title: 'Mumbrella Awards' }),

  // Industry: partner events
  one('partner-events', '12 Feb', { title: 'UnLtd: The Big Clash', note: 'Melbourne' }),
  one('partner-events', '4 Mar', { title: 'IAB Audio Summit' }),
  one('partner-events', '17 Mar', { title: 'MFA Leadership Series', note: 'Melbourne face to face and national key dates' }),
  one('partner-events', '23 Apr', { title: 'UnLtd: Hoops for Good', note: 'Melbourne' }),
  one('partner-events', '2 Jun', { title: 'IAB Adtech & Ops Summit' }),
  one('partner-events', '4 Jun', { title: 'MFA Leadership Series', note: 'Melbourne face to face and national key dates' }),
  one('partner-events', '9 Jul', { title: 'IAB Commerce & Retail Media Summit' }),
  one('partner-events', '16 Jul', { title: 'UnLtd Cup', note: 'Melbourne' }),

  // Industry: events
  span('industry-events', '12 May', '14 May', { title: 'Cannes in Cairns', art: 'plane' }),
  one('industry-events', '30 Sep', { title: 'Google Performance Honors' }),
  one('industry-events', '12 Nov', { title: 'UnLtd Ball' }),

  // Industry: competitions (the sheet gives the month only)
  one('competitions', '2 Feb', { title: 'Young Lions', timing: 'early-month', note: 'Early February' }),
  one('competitions', '1 Jun', { title: 'Pitch-Chella', timing: 'early-month', note: 'Early June' }),
  one('competitions', '1 Sep', { title: 'NGEN Pitch Comp', timing: 'early-month', note: 'Early September' }),
  one('competitions', '1 Dec', { title: 'Hatchings', timing: 'early-month', note: 'Early December' }),
];

/* ---------- Rhythms with no dates in the sheet yet ---------- */

export interface Rhythm {
  title: string;
  group: 'Everyone' | 'Leadership' | 'Client service' | 'Teams';
  cadence?: string;
  audience?: string;
  about?: string;
  series?: string;
  resources?: string[];
}

export const RHYTHMS: Rhythm[] = [
  {
    title: 'Whole team meeting',
    group: 'Everyone',
    cadence: 'Fortnightly, face to face',
    audience: 'Everyone',
    about: 'The whole Half Dome business comes together face to face to share business updates and have some fun.',
    resources: ['All Team Meeting - Updated 2023'],
  },
  { title: 'Team OKRs and retros', group: 'Everyone', series: 'okr-retro' },
  { title: 'Engagement survey', group: 'Everyone', series: 'engagement-survey' },
  {
    title: 'Team pulse',
    group: 'Everyone',
    audience: 'Everyone',
    about: 'Asks how happy you are working at Half Dome and how likely you are to recommend it as a place to work. Your answers drive business improvement and culture initiatives.',
  },
  { title: 'Reflections and 360 feedback', group: 'Everyone', series: 'reflections' },
  {
    title: '1:1 conversations',
    group: 'Everyone',
    cadence: 'Monthly',
    audience: 'You and your manager',
    about: 'A formal monthly catch-up with your manager, alongside ongoing informal conversation. It is the space to check in on learning, enjoyment and workload.',
    resources: ['HD_Objective Meetings2023.pdf'],
  },
  { title: 'Salary review and calibration', group: 'Everyone', series: 'salary-review' },
  {
    title: 'Board meeting',
    group: 'Leadership',
    cadence: 'Once a trimester',
    audience: 'The Half Dome board',
    about: 'The board evaluates the previous period and discusses the strategic direction of the business. These discussions feed the business OKRs, which cascade into team objectives.',
  },
  {
    title: 'ELT meeting',
    group: 'Leadership',
    audience: 'Executive leadership team',
    about: 'Managing partners, the head of finance and the head of P&C catch up on business updates, project work and progress against business OKRs and commercial targets.',
  },
  { title: 'ELT offsite', group: 'Leadership', series: 'elt-offsite' },
  { title: 'Leadership meeting', group: 'Leadership', series: 'leadership-meeting' },
  { title: 'Agency review and client pulse', group: 'Client service', series: 'agency-review' },
  {
    title: 'Client mapping and CPP',
    group: 'Client service',
    cadence: 'Each trimester',
    audience: 'Leadership team',
    about: 'Leadership maps the client portfolio into a 9-box matrix, weighing commercials, working relationship and long-term strategic fit. The result sets how we prioritise and service clients next trimester.',
  },
  { title: 'CS all-team meeting', group: 'Client service', series: 'cs-all-team' },
  { title: 'CSD meeting', group: 'Client service', series: 'csd-meeting' },
  {
    title: 'AD catch-up',
    group: 'Teams',
    cadence: 'Every 3 weeks',
    audience: 'AT directors and up',
    about: 'Directors and up come together to share project updates, discuss common challenges, share work and check in on team OKRs.',
  },
  {
    title: 'AT catch-up',
    group: 'Teams',
    cadence: 'Every 3 weeks',
    audience: 'The whole AT team',
    about: 'The whole AT team comes together to share project updates, discuss common challenges, share work and check in on team OKRs.',
  },
  { title: 'PT key meeting', group: 'Teams', series: 'pt-key-meeting' },
  { title: 'Forecasting and billing', group: 'Teams', series: 'forecasting-billing' },
];

/* ---------- Listed in the sheet without dates ---------- */

export const TO_BE_CONFIRMED: { group: string; items: string[] }[] = [
  { group: 'Industry awards', items: ['B&T Best of the Best', 'AFR BOSS Awards', 'Media Week', 'Women in Media', 'AdNews'] },
  { group: 'Partner events', items: ['IMAA'] },
  { group: 'Whole agency', items: ['External HD venue hire', 'Meta & Measure days'] },
  { group: 'Internal training', items: ['Manager cohort', 'Director cohort'] },
];
