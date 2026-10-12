import { useMemo } from 'react';
import { WEEKDAYS_SHORT, fmtRange, fmtShort, isoWeek, mondayOf, parts, MONTHS_SHORT, relative, trimester, weekday, type Day } from './dates';
import { label } from './MonthView';
import { STREAM_BY_ID, WEEK_MONDAYS, overlaps, type Item } from './model';
import { StreamDot } from './StreamDot';
import type { Actions } from './types';

interface Props extends Pick<Actions, 'openItem'> {
  items: Item[];
  today: Day;
  showPast: boolean;
  onShowPast: () => void;
}

/** Week by week from now to the end of the year, with earlier weeks one tap away. */
export function AgendaView({ items, today, showPast, onShowPast, openItem }: Props) {
  const thisMonday = mondayOf(today);
  const weeks = useMemo(
    () =>
      WEEK_MONDAYS.filter((m) => showPast || m >= thisMonday).map((monday) => {
        const sunday = monday + 6;
        const inWeek = items.filter((i) => overlaps(i, monday, sunday));
        const ongoing = inWeek.filter((i) => i.start < monday);
        const days = Array.from({ length: 7 }, (_, k) => monday + k)
          .map((day) => ({ day, list: inWeek.filter((i) => i.start === day) }))
          .filter((d) => d.list.length);
        return { monday, sunday, ongoing, days, total: inWeek.length };
      }),
    [items, showPast, thisMonday],
  );
  const pastCount = WEEK_MONDAYS.filter((m) => m < thisMonday).length;

  return (
    <div className="agenda">
      {!showPast && pastCount > 0 && (
        <button type="button" className="agenda__earlier" onClick={onShowPast}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 14.5l6-6 6 6" />
          </svg>
          Show the {pastCount} earlier weeks
        </button>
      )}
      {weeks.map((w) => {
        const current = w.monday === thisMonday;
        if (!w.total && !current) return null;
        return (
          <section key={w.monday} className="aweek" data-current={current || undefined} data-past={w.sunday < today || undefined}>
            <header className="aweek__head">
              <h3 className="aweek__title">
                Week {isoWeek(w.monday).week}
                <span className="aweek__range">{fmtRange(w.monday, w.sunday)}</span>
              </h3>
              <span className="aweek__tags">
                {current && <span className="tag tag--now">This week</span>}
                <span className="tag">Trimester {trimester(w.monday + 3).n}</span>
              </span>
            </header>

            {w.ongoing.length > 0 && (
              <div className="aweek__ongoing">
                <span className="aweek__ongoing-label">Continuing</span>
                {w.ongoing.map((item) => (
                  <button key={item.id} type="button" className="ochip" data-stream={item.stream} onClick={(e) => openItem(item.id, e.currentTarget)}>
                    <StreamDot stream={item.stream} size={8} />
                    {item.title}
                    <span className="ochip__until">until {fmtShort(item.end)}</span>
                  </button>
                ))}
              </div>
            )}

            {w.days.length === 0 && w.ongoing.length === 0 && <p className="aweek__empty">A quiet week. Nothing listed.</p>}

            {w.days.map(({ day, list }) => {
              const { d, m } = parts(day);
              return (
                <div key={day} className="aday" data-today={day === today || undefined} data-past={day < today || undefined}>
                  <div className="aday__date" aria-hidden="true">
                    <span className="aday__dow">{WEEKDAYS_SHORT[weekday(day)]}</span>
                    <span className="aday__n">{d}</span>
                    <span className="aday__mon">{MONTHS_SHORT[m - 1]}</span>
                  </div>
                  <ul className="aday__list">
                    {list.map((item) => (
                      <li key={item.id}>
                        <button type="button" className="arow" data-stream={item.stream} onClick={(e) => openItem(item.id, e.currentTarget)}>
                          <StreamDot stream={item.stream} />
                          <span className="arow__text">
                            <span className="arow__title">{label(item)}</span>
                            <span className="arow__meta">
                              {item.unit}
                              {item.multi ? ` · ${fmtRange(item.start, item.end)}` : ''}
                              {item.timing === 'week' ? ' · Sometime this week' : ''}
                              {item.timing === 'early-month' ? ' · Date to be confirmed' : ''}
                              {item.time ? ` · ${item.time}` : ''}
                              <span className="visually-hidden"> · {STREAM_BY_ID[item.stream].label}</span>
                            </span>
                          </span>
                          <span className="arow__rel">{relative(day, today)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
