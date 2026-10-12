/*
 * Dates as whole day numbers (days since 1970-01-01, UTC), so there are no time zones
 * or daylight-saving surprises. "Today" comes from the viewer's local clock.
 */

export type Day = number;

const MS_DAY = 86_400_000;

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dayOf(y: number, m: number, d: number): Day {
  return Math.floor(Date.UTC(y, m - 1, d) / MS_DAY);
}

export function parseDay(iso: string): Day {
  const [y, m, d] = iso.split('-').map(Number);
  return dayOf(y, m, d);
}

export function toISO(day: Day): string {
  return new Date(day * MS_DAY).toISOString().slice(0, 10);
}

export function parts(day: Day): { y: number; m: number; d: number } {
  const dt = new Date(day * MS_DAY);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function localToday(): Day {
  const now = new Date();
  return dayOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** 0 = Monday ... 6 = Sunday */
export function weekday(day: Day): number {
  // 1970-01-01 was a Thursday (index 3).
  return (((day + 3) % 7) + 7) % 7;
}

export function mondayOf(day: Day): Day {
  return day - weekday(day);
}

export function isWeekend(day: Day): boolean {
  return weekday(day) >= 5;
}

export function isoWeek(day: Day): { year: number; week: number } {
  const thursday = day - weekday(day) + 3;
  const { y } = parts(thursday);
  const firstThursday = dayOf(y, 1, 1);
  const week = 1 + Math.floor((thursday - firstThursday) / 7);
  return { year: y, week };
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Half Dome trimesters: T1 Jul to Oct, T2 Nov to Feb, T3 Mar to Jun. */
export function trimester(day: Day): { n: 1 | 2 | 3; start: Day; end: Day } {
  const { y, m } = parts(day);
  if (m >= 7 && m <= 10) return { n: 1, start: dayOf(y, 7, 1), end: dayOf(y, 10, 31) };
  if (m >= 3 && m <= 6) return { n: 3, start: dayOf(y, 3, 1), end: dayOf(y, 6, 30) };
  if (m >= 11) return { n: 2, start: dayOf(y, 11, 1), end: dayOf(y + 1, 3, 1) - 1 };
  return { n: 2, start: dayOf(y - 1, 11, 1), end: dayOf(y, 3, 1) - 1 };
}

/* ---------- Formatting (Australian English) ---------- */

export function fmtLong(day: Day): string {
  const { m, d } = parts(day);
  return `${WEEKDAYS[weekday(day)]} ${d} ${MONTHS[m - 1]}`;
}

export function fmtMedium(day: Day): string {
  const { m, d } = parts(day);
  return `${WEEKDAYS_SHORT[weekday(day)]} ${d} ${MONTHS_SHORT[m - 1]}`;
}

export function fmtShort(day: Day): string {
  const { m, d } = parts(day);
  return `${d} ${MONTHS_SHORT[m - 1]}`;
}

/** Brand date stamp, DD.MM.YY */
export function fmtStamp(day: Day): string {
  const { y, m, d } = parts(day);
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${String(y).slice(2)}`;
}

export function fmtRange(start: Day, end: Day): string {
  if (start === end) return fmtShort(start);
  const a = parts(start);
  const b = parts(end);
  if (a.m === b.m) return `${a.d} to ${b.d} ${MONTHS_SHORT[a.m - 1]}`;
  return `${fmtShort(start)} to ${fmtShort(end)}`;
}

export function relative(day: Day, today: Day): string {
  const diff = day - today;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff < 14) return `In ${diff} days`;
  if (diff >= 14 && diff < 60) return `In ${Math.round(diff / 7)} weeks`;
  if (diff >= 60) return `In ${Math.round(diff / 30.4)} months`;
  if (diff < -1 && diff > -14) return `${-diff} days ago`;
  if (diff <= -14 && diff > -60) return `${Math.round(-diff / 7)} weeks ago`;
  return `${Math.round(-diff / 30.4)} months ago`;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
