import { CALENDAR_YEAR } from '../content/agencyCalendar';
import { toISO } from './dates';
import type { Item } from './model';

const stamp = (iso: string) => iso.replace(/-/g, '');
const escape = (s: string) => s.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** An all-day .ics file for one date, so it drops straight into Outlook. */
export function downloadIcs(item: Item) {
  const description = [item.note, item.series.about].filter(Boolean).join('\n\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Half Dome//Agency calendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${item.id}-${CALENDAR_YEAR}@halfdome.com.au`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${stamp(toISO(item.start))}`,
    `DTEND;VALUE=DATE:${stamp(toISO(item.end + 1))}`,
    `SUMMARY:${escape(item.title)}`,
    description ? `DESCRIPTION:${escape(description)}` : '',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
