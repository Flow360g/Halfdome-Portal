import type { CSSProperties } from 'react';
import { CALENDAR_YEAR } from '../content/agencyCalendar';
import { MONTHS, dayOf, daysInMonth, fmtLong, plural, weekday, type Day } from './dates';
import { STREAM_ORDER, closureOn, covers, type Item } from './model';
import { StreamDot } from './StreamDot';
import type { Actions } from './types';

interface Props extends Pick<Actions, 'openDay'> {
  items: Item[];
  today: Day;
  onOpenMonth: (month: number) => void;
}

/** Twelve small months, like a wall planner: dots for what's on, hatching for days the office is closed. */
export function YearView({ items, today, openDay, onOpenMonth }: Props) {
  return (
    <div className="yearv">
      {MONTHS.map((name, mi) => {
        const month = mi + 1;
        const first = dayOf(CALENDAR_YEAR, month, 1);
        const len = daysInMonth(CALENDAR_YEAR, month);
        const last = first + len - 1;
        const count = items.filter((i) => i.start >= first && i.start <= last).length;
        const current = today >= first && today <= last;
        return (
          <section key={name} className="mini" data-current={current || undefined} style={{ '--i': mi } as CSSProperties}>
            <button type="button" className="mini__title" onClick={() => onOpenMonth(month)}>
              <span>{name}</span>
              <span className="mini__count">{plural(count, 'date')}</span>
            </button>
            <div className="mini__grid">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className="mini__dow" aria-hidden="true">
                  {d}
                </span>
              ))}
              {Array.from({ length: weekday(first) }, (_, i) => (
                <span key={`b${i}`} aria-hidden="true" />
              ))}
              {Array.from({ length: len }, (_, i) => {
                const day = first + i;
                const on = items.filter((it) => covers(it, day));
                const closure = closureOn(day);
                const streams = STREAM_ORDER.filter((s) => s !== 'closures' && on.some((it) => it.stream === s)).slice(0, 3);
                return (
                  <button
                    key={day}
                    type="button"
                    className="mini__day"
                    data-today={day === today || undefined}
                    data-past={day < today || undefined}
                    data-closed={closure ? true : undefined}
                    data-weekend={weekday(day) >= 5 || undefined}
                    data-busy={on.length >= 3 || undefined}
                    aria-label={`${fmtLong(day)}: ${on.length ? plural(on.length, 'date') : 'nothing listed'}${closure ? `, office closed for ${closure.title}` : ''}`}
                    onClick={(e) => openDay(day, e.currentTarget)}
                  >
                    <span className="mini__n">{i + 1}</span>
                    <span className="mini__dots" aria-hidden="true">
                      {streams.map((s) => (
                        <StreamDot key={s} stream={s} size={5} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
