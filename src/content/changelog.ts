import { addDays } from '../lib/dates';

/*
 * What changed in the hub, newest first. The dashboard shows the latest
 * entries, and topic cards label pages added or updated in the last 30 days.
 */

export interface ChangeEntry {
  date: string;
  topic: string;
  page: string;
  change: 'new' | 'updated';
  note: string;
}

export const changelog: ChangeEntry[] = [
  { date: '2026-10-12', topic: 'leave-and-flexibility', page: 'whole-potential-days', change: 'new', note: 'Six extra days a year, with a tracker for this trimester.' },
  { date: '2026-10-12', topic: 'leave-and-flexibility', page: 'how-to-apply-for-leave', change: 'new', note: 'A leave planner that works out dates and deadlines for you.' },
  { date: '2026-10-12', topic: 'hiring-and-onboarding', page: 'your-first-90-days', change: 'new', note: 'A checklist for your first three months, from day one to probation.' },
  { date: '2026-10-12', topic: 'leave-and-flexibility', page: 'types-of-leave', change: 'new', note: 'Every kind of leave at a glance, with the full policy.' },
  { date: '2026-10-12', topic: 'the-big-picture', page: 'our-values', change: 'new', note: 'Our four values and where they come from.' },
  { date: '2026-10-12', topic: 'diversity-equity-and-inclusion', page: 'acknowledgement-of-country', change: 'new', note: 'Half Dome’s Acknowledgement of Country in full.' },
];

/** Pages changed in the last `days` days, keyed "topic/page". */
export function recentChanges(today: string, days = 30) {
  const since = addDays(today, -days);
  const recent = new Map<string, ChangeEntry['change']>();
  for (const entry of changelog) {
    const key = `${entry.topic}/${entry.page}`;
    if (entry.date >= since && !recent.has(key)) recent.set(key, entry.change);
  }
  return recent;
}
