import {
  CALENDAR_YEAR,
  EVENTS,
  SERIES,
  STREAMS,
  type ArtKey,
  type CalEvent,
  type IconName,
  type Series,
  type StreamId,
} from '../content/agencyCalendar';
import { dayOf, isoWeek, mondayOf, parseDay, weekday, type Day } from './dates';

export interface Item {
  id: string;
  title: string;
  note?: string;
  start: Day;
  end: Day;
  multi: boolean;
  timing: 'day' | 'week' | 'early-month';
  time?: string;
  stream: StreamId;
  unit: string;
  icon: IconName;
  art: ArtKey;
  series: Series;
  raw: CalEvent;
  search: string;
}

export const STREAM_ORDER: StreamId[] = STREAMS.map((s) => s.id);
export const STREAM_BY_ID = Object.fromEntries(STREAMS.map((s) => [s.id, s])) as Record<
  StreamId,
  (typeof STREAMS)[number]
>;

export const YEAR_START = dayOf(CALENDAR_YEAR, 1, 1);
export const YEAR_END = dayOf(CALENDAR_YEAR, 12, 31);

function build(e: CalEvent): Item {
  const series = SERIES[e.series];
  if (!series) throw new Error(`Unknown series ${e.series}`);
  const start = parseDay(e.start);
  const end = e.end ? parseDay(e.end) : start;
  const title = e.title ?? series.title;
  return {
    id: e.id,
    title,
    note: e.note,
    start,
    end,
    multi: end > start,
    timing: e.timing ?? 'day',
    time: e.time,
    stream: series.stream,
    unit: series.unit,
    icon: series.icon,
    art: e.art ?? series.art,
    series,
    raw: e,
    search: [title, e.note, series.title, series.unit, series.cadence, ...(e.details ?? []).map((x) => x.value), ...(e.modules ?? []).map((x) => `${x.label} ${x.value}`)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  };
}

export const ITEMS: Item[] = EVENTS.map(build).sort(
  (a, b) => a.start - b.start || STREAM_ORDER.indexOf(a.stream) - STREAM_ORDER.indexOf(b.stream) || a.title.localeCompare(b.title),
);

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function bySeries(seriesId: string): Item[] {
  return ITEMS.filter((i) => i.series.id === seriesId);
}

export interface Filters {
  streams: Set<StreamId>;
  query: string;
}

export function matches(item: Item, f: Filters): boolean {
  if (!f.streams.has(item.stream)) return false;
  const q = f.query.trim().toLowerCase();
  if (!q) return true;
  return q.split(/\s+/).every((word) => item.search.includes(word));
}

export function covers(item: Item, day: Day): boolean {
  return item.start <= day && item.end >= day;
}

export function overlaps(item: Item, from: Day, to: Day): boolean {
  return item.start <= to && item.end >= from;
}

/** Office closed: a public holiday or the Christmas close. */
export function closureOn(day: Day): Item | undefined {
  return ITEMS.find((i) => i.stream === 'closures' && covers(i, day));
}

/* ---------- ISO weeks across the year, for the ribbon ---------- */

export interface WeekBucket {
  week: number;
  monday: Day;
  sunday: Day;
  counts: Record<StreamId, number>;
  total: number;
  items: Item[];
}

const FIRST_MONDAY = mondayOf(YEAR_START);
const LAST_MONDAY = mondayOf(YEAR_END);
export const WEEK_MONDAYS: Day[] = [];
for (let m = FIRST_MONDAY; m <= LAST_MONDAY; m += 7) WEEK_MONDAYS.push(m);

export function weekBuckets(items: Item[]): WeekBucket[] {
  return WEEK_MONDAYS.map((monday) => {
    const sunday = monday + 6;
    const inWeek = items.filter((i) => overlaps(i, monday, sunday));
    const counts = Object.fromEntries(STREAM_ORDER.map((s) => [s, 0])) as Record<StreamId, number>;
    inWeek.forEach((i) => counts[i.stream]++);
    return { week: isoWeek(monday).week, monday, sunday, counts, total: inWeek.length, items: inWeek };
  });
}

/** The next closure that lands on a working day (a Saturday public holiday is not a day off). */
export function nextDayOff(today: Day): Item | undefined {
  return ITEMS.find((i) => {
    if (i.stream !== 'closures' || i.end < today) return false;
    for (let d = Math.max(i.start, today); d <= i.end; d++) if (weekday(d) < 5) return true;
    return false;
  });
}
