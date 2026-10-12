import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CALENDAR_YEAR } from '../content/agencyCalendar';
import { WEEKDAYS_SHORT, dayOf, daysInMonth, fmtLong, isoWeek, mondayOf, parts, plural, relative, weekday, type Day } from './dates';
import { STREAM_ORDER, closureOn, covers, overlaps, type Item } from './model';
import { StreamDot } from './StreamDot';
import type { Actions } from './types';

interface Props extends Actions {
  items: Item[];
  month: number;
  today: Day;
  compact: boolean;
  focusMonday: Day | null;
}

interface Segment {
  item: Item;
  from: number;
  to: number;
  lane: number;
  contLeft: boolean;
  contRight: boolean;
}

export function label(item: Item): string {
  return !item.raw.title && item.note ? `${item.title} · ${item.note}` : item.title;
}

export function MonthView({ items, month, today, compact, focusMonday, openItem, openDay }: Props) {
  const first = dayOf(CALENDAR_YEAR, month, 1);
  const last = first + daysInMonth(CALENDAR_YEAR, month) - 1;
  const weeks = useMemo(() => {
    const out: Day[] = [];
    for (let m = mondayOf(first); m <= last; m += 7) out.push(m);
    return out;
  }, [first, last]);

  const [picked, setPicked] = useState<Day>(() => (today >= first && today <= last ? today : first));
  useEffect(() => setPicked(today >= first && today <= last ? today : first), [first, last, today]);

  return (
    <div className="month" data-compact={compact || undefined}>
      <div className="month__head" aria-hidden="true">
        <span className="month__wk">Wk</span>
        {WEEKDAYS_SHORT.map((d) => (
          <span key={d}>{compact ? d.slice(0, 1) : d}</span>
        ))}
      </div>
      <div className="month__body">
        {weeks.map((monday, wi) => (
          <WeekRow
            key={monday}
            index={wi}
            monday={monday}
            first={first}
            last={last}
            items={items}
            today={today}
            compact={compact}
            focused={focusMonday === monday}
            picked={picked}
            onPick={setPicked}
            openItem={openItem}
            openDay={openDay}
          />
        ))}
      </div>
      {compact && <DayList day={picked} items={items} today={today} openItem={openItem} />}
    </div>
  );
}

function WeekRow({
  index,
  monday,
  first,
  last,
  items,
  today,
  compact,
  focused,
  picked,
  onPick,
  openItem,
  openDay,
}: {
  index: number;
  monday: Day;
  first: Day;
  last: Day;
  items: Item[];
  today: Day;
  compact: boolean;
  focused: boolean;
  picked: Day;
  onPick: (d: Day) => void;
} & Actions) {
  const from = Math.max(monday, first);
  const to = Math.min(monday + 6, last);

  const segments = useMemo(() => {
    const spans = items
      .filter((i) => i.multi && overlaps(i, from, to))
      .sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
    const laneEnds: number[] = [];
    return spans.map<Segment>((item) => {
      const s = Math.max(item.start, from) - monday;
      const e = Math.min(item.end, to) - monday;
      let lane = laneEnds.findIndex((end) => end < s);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = e;
      return { item, from: s, to: e, lane, contLeft: item.start < from, contRight: item.end > to };
    });
  }, [items, from, to, monday]);

  const lanes = segments.reduce((n, s) => Math.max(n, s.lane + 1), 0);
  const maxSingles = Math.max(1, 4 - lanes);

  return (
    <div className="mweek" data-focus={focused || undefined} style={{ '--lanes': lanes, '--row': index } as CSSProperties}>
      <div className="mweek__wk" aria-hidden="true">
        {isoWeek(monday).week}
      </div>
      <div className="mweek__days">
        {Array.from({ length: 7 }, (_, col) => {
          const day = monday + col;
          const inMonth = day >= first && day <= last;
          const closure = inMonth ? closureOn(day) : undefined;
          const singles = inMonth ? items.filter((i) => !i.multi && i.start === day) : [];
          const covering = inMonth ? items.filter((i) => covers(i, day)) : [];
          const hidden = Math.max(0, singles.length - maxSingles);
          const shown = hidden ? singles.slice(0, maxSingles - 1) : singles;
          const more = singles.length - shown.length;
          const { d } = parts(day);
          const isToday = day === today;
          const dayLabel = `${fmtLong(day)}${isToday ? ', today' : ''}: ${covering.length ? plural(covering.length, 'date') : 'nothing listed'}${closure ? `, office closed for ${closure.title}` : ''}`;

          if (!inMonth) return <div key={col} className="mday" data-out aria-hidden="true" />;

          return (
            <div
              key={col}
              className="mday"
              data-weekend={weekday(day) >= 5 || undefined}
              data-closed={closure ? true : undefined}
              data-today={isToday || undefined}
              data-past={day < today || undefined}
              data-picked={compact && picked === day ? true : undefined}
            >
              <button
                type="button"
                className="mday__num"
                aria-label={dayLabel}
                onClick={(e) => (compact ? onPick(day) : openDay(day, e.currentTarget))}
              >
                {d}
              </button>

              {compact ? (
                <span className="mday__dots" aria-hidden="true">
                  {STREAM_ORDER.filter((s) => covering.some((i) => i.stream === s)).map((s) => (
                    <StreamDot key={s} stream={s} size={6} />
                  ))}
                </span>
              ) : (
                <ul className="mday__events">
                  {shown.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="pill"
                        data-stream={item.stream}
                        data-timing={item.timing}
                        title={`${label(item)}${item.timing === 'week' ? ' (sometime this week)' : ''}`}
                        onClick={(e) => openItem(item.id, e.currentTarget)}
                      >
                        <StreamDot stream={item.stream} size={8} />
                        <span className="pill__text">{label(item)}</span>
                      </button>
                    </li>
                  ))}
                  {more > 0 && (
                    <li>
                      <button type="button" className="pill pill--more" onClick={(e) => openDay(day, e.currentTarget)}>
                        +{more} more
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}

        {!compact && (
          <div className="mweek__spans">
            {segments.map((seg) => (
              <button
                key={seg.item.id}
                type="button"
                className="span"
                data-stream={seg.item.stream}
                data-cl={seg.contLeft || undefined}
                data-cr={seg.contRight || undefined}
                style={{ gridColumn: `${seg.from + 1} / ${seg.to + 2}`, gridRow: seg.lane + 1 }}
                title={label(seg.item)}
                onClick={(e) => openItem(seg.item.id, e.currentTarget)}
              >
                <span className="span__text">{label(seg.item)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DayList({ day, items, today, openItem }: { day: Day; items: Item[]; today: Day } & Pick<Actions, 'openItem'>) {
  const list = items.filter((i) => covers(i, day));
  const closure = closureOn(day);
  return (
    <div className="daylist" aria-live="polite">
      <p className="daylist__title">
        {fmtLong(day)}
        <span className="daylist__rel">{relative(day, today)}</span>
      </p>
      {closure && <p className="daylist__closed">Office closed for {closure.title}</p>}
      {list.length === 0 ? (
        <p className="daylist__empty">Nothing listed for this day.</p>
      ) : (
        <ul className="daylist__items">
          {list.map((item) => (
            <li key={item.id}>
              <button type="button" className="row-btn" onClick={(e) => openItem(item.id, e.currentTarget)}>
                <StreamDot stream={item.stream} />
                <span className="row-btn__text">
                  <span className="row-btn__title">{item.title}</span>
                  <span className="row-btn__meta">
                    {item.unit}
                    {item.note ? ` · ${item.note}` : ''}
                  </span>
                </span>
                <svg className="row-btn__chev" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.5 6l6 6-6 6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
