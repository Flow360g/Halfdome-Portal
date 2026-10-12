import { useRef, type CSSProperties } from 'react';
import { MONTHS_SHORT, WEEKDAYS_SHORT, parts, relative, weekday, fmtRange, type Day } from './dates';
import { BrandIcon } from './Icon';
import { STREAM_BY_ID, type Item } from './model';
import { StreamDot } from './StreamDot';
import type { Actions } from './types';

interface Props extends Pick<Actions, 'openItem'> {
  items: Item[];
  today: Day;
}

/** The next fortnight as a swipeable rail, with anything already under way at the front. */
export function ComingUp({ items, today, openItem }: Props) {
  const rail = useRef<HTMLOListElement>(null);
  const horizon = today + 13;
  const onNow = items.filter((i) => i.start < today && i.end >= today);
  let next = items.filter((i) => i.start >= today && i.start <= horizon);
  if (next.length < 6) next = items.filter((i) => i.start >= today).slice(0, 8);
  const cards = [...onNow, ...next].slice(0, 16);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="container upcoming" aria-labelledby="upcoming-title">
      <div className="section-row">
        <div className="section-head">
          <p className="hd-eyebrow">Coming up</p>
          <h2 id="upcoming-title" className="hd-h2">
            The next two weeks
          </h2>
        </div>
        <div className="rail-controls">
          <button type="button" className="round-btn" aria-label="Scroll back" onClick={() => scroll(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="round-btn" aria-label="Scroll forward" onClick={() => scroll(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        <p className="empty-note">Nothing coming up matches your filters. Clear the search or turn a few kinds of dates back on above.</p>
      ) : (
        <ol className="upcoming__rail" ref={rail}>
          {cards.map((item, i) => {
            const day = Math.max(item.start, today);
            const { d, m } = parts(day);
            const ongoing = item.start < today;
            const when = ongoing ? 'On now' : item.timing === 'week' ? `Week of ${d} ${MONTHS_SHORT[m - 1]}` : relative(item.start, today);
            return (
              <li key={item.id} style={{ '--i': i } as CSSProperties}>
                <button
                  type="button"
                  className="upcard"
                  data-stream={item.stream}
                  data-today={item.start === today || ongoing || undefined}
                  onClick={(e) => openItem(item.id, e.currentTarget)}
                >
                  <span className="upcard__top">
                    <span className="upcard__date" aria-hidden="true">
                      <span className="upcard__dow">{WEEKDAYS_SHORT[weekday(day)]}</span>
                      <span className="upcard__day">{d}</span>
                      <span className="upcard__mon">{MONTHS_SHORT[m - 1]}</span>
                    </span>
                    <BrandIcon name={item.icon} size={48} className="upcard__icon" />
                  </span>
                  <span className="upcard__when">{when}</span>
                  <span className="upcard__title">{item.title}</span>
                  {item.note && <span className="upcard__note">{item.note}</span>}
                  <span className="upcard__meta">
                    <StreamDot stream={item.stream} />
                    {item.unit}
                    {item.multi ? ` · ${fmtRange(item.start, item.end)}` : ''}
                    <span className="visually-hidden"> · {STREAM_BY_ID[item.stream].label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
