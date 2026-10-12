/*
 * Date helpers for the leave tools. Dates are plain "YYYY-MM-DD" strings and
 * all maths happens in UTC, so daylight saving never shifts a day.
 */

const DAY = 86_400_000;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today in Melbourne, as YYYY-MM-DD. */
export function todayInMelbourne(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Melbourne' }).format(now);
}

export function addDays(iso: string, days: number): string {
  return toISO(new Date(parseDate(iso).getTime() + days * DAY));
}

export function addMonths(iso: string, months: number): string {
  const date = parseDate(iso);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return toISO(target);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / DAY);
}

export function isWeekend(iso: string): boolean {
  const day = parseDate(iso).getUTCDay();
  return day === 0 || day === 6;
}

export interface WorkingDays {
  /** Weekdays in the range that are not public holidays. */
  workingDays: number;
  /** Public holidays that fall on weekdays inside the range. */
  holidays: string[];
}

/** Counts working days from start to end, inclusive. */
export function workingDaysBetween(start: string, end: string, holidayDates: string[]): WorkingDays {
  const holidaySet = new Set(holidayDates);
  const holidays: string[] = [];
  let workingDays = 0;
  for (let day = start; day <= end; day = addDays(day, 1)) {
    if (isWeekend(day)) continue;
    if (holidaySet.has(day)) holidays.push(day);
    else workingDays += 1;
  }
  return { workingDays, holidays };
}

export type LeaveType = 'annual' | 'whole-potential' | 'long-service';

/**
 * The latest date to have leave approved, per the Leave Policy: planned leave
 * (annual leave and Whole Potential Days) at least 4 weeks ahead, long
 * service leave at least 3 months ahead.
 */
export function requestByDate(start: string, type: LeaveType): string {
  if (type === 'long-service') return addMonths(start, -3);
  return addDays(start, -28);
}

export function nextHoliday<T extends { date: string }>(today: string, holidays: T[]): T | undefined {
  return holidays.filter((h) => h.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
}

export interface Trimester {
  number: 1 | 2 | 3;
  start: string;
  end: string;
}

/**
 * The trimester a date falls in. Assumes calendar trimesters (January to
 * April, May to August, September to December) until People and Culture
 * confirms the dates Half Dome uses.
 */
export function trimesterFor(iso: string): Trimester {
  const date = parseDate(iso);
  const year = date.getUTCFullYear();
  const index = Math.floor(date.getUTCMonth() / 4);
  const startMonth = index * 4;
  const start = toISO(new Date(Date.UTC(year, startMonth, 1)));
  const end = toISO(new Date(Date.UTC(year, startMonth + 4, 0)));
  return { number: (index + 1) as 1 | 2 | 3, start, end };
}

const longFormat = new Intl.DateTimeFormat('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const shortFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function formatLong(iso: string) {
  return longFormat.format(parseDate(iso));
}

export function formatDate(iso: string) {
  return shortFormat.format(parseDate(iso));
}

/** "September 2025" from "2025-09". */
export function formatMonth(yearMonth: string) {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Intl.DateTimeFormat('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1)));
}

/** True when a YYYY-MM or YYYY-MM-DD date is more than `months` old. */
export function isOlderThan(date: string, months: number, today: string) {
  const full = date.length === 7 ? `${date}-01` : date;
  return addMonths(full, months) < today;
}
