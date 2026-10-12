import type { CSSProperties } from 'react';
import { fmtLong, isoWeek, parts, plural, trimester, type Day } from './dates';
import { HERO_ART } from './assets';
import { nextDayOff } from './model';
import { useCountUp } from './useCountUp';
import type { Actions } from './types';

interface Props extends Pick<Actions, 'openItem'> {
  today: Day;
  inYear: boolean;
  onJumpToday: () => void;
  onThisWeek: () => void;
}

export function Hero({ today, inYear, openItem, onJumpToday, onThisWeek }: Props) {
  const week = isoWeek(today).week;
  const tri = trimester(today);
  const triLeft = tri.end - today;
  const off = nextDayOff(today);
  const offDays = off ? Math.max(0, Math.max(off.start, today) - today) : 0;
  const [countRef, count] = useCountUp<HTMLSpanElement>(offDays, 1300);

  return (
    <section className="cal-hero" aria-labelledby="cal-title">
      <div className="container cal-hero__inner">
        <div className="cal-hero__copy">
          <p className="hd-eyebrow cal-rise" style={{ '--d': 0 } as CSSProperties}>
            Agency calendar · 2026
          </p>
          <h1 id="cal-title" className="cal-hero__title">
            <span className="cal-rise" style={{ '--d': 1 } as CSSProperties}>
              Our year,
            </span>{' '}
            <span className="cal-rise" style={{ '--d': 2 } as CSSProperties}>
              <em>week</em> by week.
            </span>
          </h1>
          <p className="hd-intro cal-hero__intro cal-rise" style={{ '--d': 3 } as CSSProperties}>
            Public holidays, agency rhythms, learning, culture and industry dates in one place. Filter to what matters to
            you and open any date to see what it is and why it matters.
          </p>

          <div className="cal-today cal-rise" style={{ '--d': 4 } as CSSProperties}>
            <div className="cal-today__block">
              <span className="cal-today__label">{inYear ? 'Today' : 'This calendar covers 2026'}</span>
              <span className="cal-today__date">{inYear ? fmtLong(today) : `Showing ${fmtLong(today)} ${parts(today).y}`}</span>
              <span className="cal-today__chips">
                <span className="cal-chip">Week {week}</span>
                <span className="cal-chip">Trimester {tri.n}</span>
                <span className="cal-chip">{plural(triLeft, 'day')} left in the trimester</span>
              </span>
            </div>
            <div className="cal-today__actions">
              <button type="button" className="hd-btn hd-btn-primary" onClick={onJumpToday}>
                Jump to today
              </button>
              <button type="button" className="hd-btn hd-btn-secondary" onClick={onThisWeek}>
                What's on this week
              </button>
            </div>
          </div>
        </div>

        <div className="cal-hero__art">
          <img className="cal-hero__img" src={HERO_ART} alt="" width={840} height={793} />
          {off && (
            <button type="button" className="dayoff" onClick={(e) => openItem(off.id, e.currentTarget)}>
              <span className="dayoff__eyebrow">{offDays === 0 ? 'Day off today' : 'Next day off'}</span>
              <span className="dayoff__title">{off.title}</span>
              <span className="dayoff__date">{fmtLong(Math.max(off.start, today))}</span>
              <span className="dayoff__count">
                <span ref={countRef} className="dayoff__num">
                  {count}
                </span>
                <span className="dayoff__unit">{offDays === 1 ? 'day to go' : offDays === 0 ? 'Enjoy it.' : 'days to go'}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
