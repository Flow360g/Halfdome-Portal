import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { STREAMS } from '../content/agencyCalendar';
import { ThemeImg } from '../shell/ThemeImg';
import { DOME } from './assets';
import { MONTHS_SHORT, fmtMedium, fmtRange, isoWeek, parts, plural, trimester, type Day } from './dates';
import { ITEMS, STREAM_ORDER, YEAR_END, closureOn, weekBuckets, type Item, type WeekBucket } from './model';
import { StreamDot } from './StreamDot';
import { useCountUp } from './useCountUp';

interface Props {
  items: Item[];
  today: Day;
  selectedMonday: Day | null;
  onPickWeek: (monday: Day) => void;
}

/** The whole year as one strip of weekly bars, with the dome marking where we are. */
export function YearGlance({ items, today, selectedMonday, onPickWeek }: Props) {
  const buckets = useMemo(() => weekBuckets(items), [items]);
  const max = Math.max(4, ...buckets.map((b) => b.total));
  const todayIndex = buckets.findIndex((b) => today >= b.monday && today <= b.sunday);
  const [hover, setHover] = useState<{ i: number; x: number } | null>(null);
  const [arrived, setArrived] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Glide the dome from the first week to this week once the strip is on screen.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setArrived(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArrived(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // On narrow screens the strip scrolls; start it at this week.
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth || todayIndex < 0) return;
    el.scrollLeft = (todayIndex / buckets.length) * el.scrollWidth - el.clientWidth / 2;
  }, [todayIndex, buckets.length]);

  const months = useMemo(() => {
    const out: { label: string; index: number }[] = [];
    buckets.forEach((b, i) => {
      const thursday = b.monday + 3;
      const { m, y } = parts(thursday);
      if (y === 2026 && !out.find((o) => o.label === MONTHS_SHORT[m - 1])) out.push({ label: MONTHS_SHORT[m - 1], index: i });
    });
    return out;
  }, [buckets]);

  const trimesters = useMemo(() => {
    const out: { n: number; from: number; to: number }[] = [];
    buckets.forEach((b, i) => {
      const n = trimester(b.monday + 3).n;
      const last = out[out.length - 1];
      if (last && last.n === n) last.to = i;
      else out.push({ n, from: i, to: i });
    });
    return out;
  }, [buckets]);
  const currentTri = trimester(today).n;

  const tip = hover ? buckets[hover.i] : null;
  const showTip = (i: number | null, el?: HTMLElement) => {
    const wrap = scroller.current;
    if (i === null || !el || !wrap) return setHover(null);
    setHover({ i, x: el.offsetLeft + el.offsetWidth / 2 - wrap.scrollLeft });
  };

  return (
    <section className="container glance" aria-labelledby="glance-title">
      <div className="section-row">
        <div className="section-head">
          <p className="hd-eyebrow">2026 at a glance</p>
          <h2 id="glance-title" className="hd-h2">
            Every week of the year
          </h2>
          <p className="section-sub">Taller bars mean busier weeks. Select a week to open it in the calendar.</p>
        </div>
      </div>

      <Stats today={today} />

      <div className="ribbon-shell">
      <div className="ribbon-wrap" ref={scroller}>
        <div className="ribbon" data-arrived={arrived} style={{ '--weeks': buckets.length } as CSSProperties}>
          <div className="ribbon__tris" aria-hidden="true">
            {trimesters.map((t) => (
              <span
                key={`${t.n}-${t.from}`}
                className="ribbon__tri"
                data-current={t.n === currentTri && todayIndex >= t.from && todayIndex <= t.to}
                style={{ gridColumn: `${t.from + 1} / ${t.to + 2}` }}
              >
                <span>{t.to - t.from > 6 ? `Trimester ${t.n}` : `T${t.n}`}</span>
              </span>
            ))}
          </div>

          <div className="ribbon__bars" role="group" aria-label="Weeks of 2026" onMouseLeave={() => showTip(null)}>
            {buckets.map((b, i) => (
              <WeekBar
                key={b.monday}
                bucket={b}
                index={i}
                max={max}
                today={today}
                selected={selectedMonday === b.monday}
                onHover={showTip}
                onPick={onPickWeek}
              />
            ))}
            {todayIndex >= 0 && (
              <span
                className="ribbon__marker"
                aria-hidden="true"
                style={{ '--x': arrived ? todayIndex : 0 } as CSSProperties}
              >
                <span className="ribbon__here">You are here</span>
                <ThemeImg light={DOME.light} dark={DOME.dark} className="ribbon__dome" />
              </span>
            )}
          </div>

          <div className="ribbon__months" aria-hidden="true">
            {months.map((m) => (
              <span key={m.label} style={{ gridColumn: `${m.index + 1} / span 4` }}>
                {m.label}
              </span>
            ))}
          </div>

        </div>
      </div>
          {tip && (
            <div
              className="ribbon__tip"
              role="status"
              style={{ '--x': `${hover!.x}px`, '--flip': hover!.i > buckets.length * 0.7 ? 1 : 0 } as CSSProperties}
            >
              <p className="ribbon__tip-title">
                Week {tip.week} · {fmtRange(tip.monday, tip.sunday)}
              </p>
              <p className="ribbon__tip-meta">{tip.total ? plural(tip.total, 'date') : 'Nothing listed'}</p>
              <ul>
                {tip.items.slice(0, 4).map((it) => (
                  <li key={it.id}>
                    <StreamDot stream={it.stream} size={8} />
                    {it.title}
                  </li>
                ))}
                {tip.items.length > 4 && <li className="ribbon__tip-more">and {tip.items.length - 4} more</li>}
              </ul>
            </div>
          )}
      </div>

      <ul className="legend" aria-label="Key">
        {STREAMS.map((s) => (
          <li key={s.id}>
            <StreamDot stream={s.id} />
            {s.label}
          </li>
        ))}
        <li className="legend__closed">
          <span className="hatch-swatch" aria-hidden="true" />
          Office closed
        </li>
      </ul>
    </section>
  );
}

function WeekBar({
  bucket,
  index,
  max,
  today,
  selected,
  onHover,
  onPick,
}: {
  bucket: WeekBucket;
  index: number;
  max: number;
  today: Day;
  selected: boolean;
  onHover: (i: number | null, el?: HTMLElement) => void;
  onPick: (monday: Day) => void;
}) {
  const past = bucket.sunday < today;
  const current = today >= bucket.monday && today <= bucket.sunday;
  let closedDays = 0;
  for (let d = bucket.monday; d <= bucket.monday + 4; d++) if (closureOn(d)) closedDays++;
  return (
    <button
      type="button"
      className="wbar"
      data-past={past || undefined}
      data-current={current || undefined}
      data-selected={selected || undefined}
      style={{ '--i': index } as CSSProperties}
      aria-label={`Week ${bucket.week}, ${fmtMedium(bucket.monday)}: ${plural(bucket.total, 'date')}${closedDays ? `, office closed ${plural(closedDays, 'day')}` : ''}`}
      onMouseEnter={(e) => onHover(index, e.currentTarget)}
      onFocus={(e) => onHover(index, e.currentTarget)}
      onBlur={() => onHover(null)}
      onClick={() => onPick(bucket.monday)}
    >
      <span className="wbar__stack" style={{ height: `${(bucket.total / max) * 100}%` }}>
        {STREAM_ORDER.map((s) =>
          bucket.counts[s] ? (
            <span key={s} className="wbar__seg" data-stream={s} style={{ flexGrow: bucket.counts[s] }} />
          ) : null,
        )}
      </span>
      <span className="wbar__num">{bucket.week}</span>
    </button>
  );
}

function Stats({ today }: { today: Day }) {
  const tri = trimester(today);
  const triLeft = Math.max(0, tri.end - today);
  const xmasStart = ITEMS.find((i) => i.series.id === 'xmas-close')?.start ?? YEAR_END;
  const xmas = Math.max(0, xmasStart - today);
  const [weekRef, weekValue] = useCountUp<HTMLSpanElement>(isoWeek(today).week);
  const [triRef, triValue] = useCountUp<HTMLSpanElement>(triLeft);
  const [xRef, xValue] = useCountUp<HTMLSpanElement>(xmas);
  return (
    <div className="stats">
      <div className="stat">
        <p className="stat__label">This week</p>
        <p className="stat__value">
          <span className="stat__prefix">Week </span>
          <span ref={weekRef}>{weekValue}</span>
        </p>
        <p className="stat__sub">of the 53 ISO weeks in 2026</p>
      </div>
      <div className="stat">
        <p className="stat__label">Trimester {tri.n}</p>
        <p className="stat__value">
          <span ref={triRef}>{triValue}</span>
          <span className="stat__suffix"> {triLeft === 1 ? 'day' : 'days'} left</span>
        </p>
        <p className="stat__sub">Ends {fmtMedium(tri.end)}</p>
      </div>
      <div className="stat stat--emphasis">
        <p className="stat__label">Christmas close</p>
        <p className="stat__value">
          <span ref={xRef}>{xValue}</span>
          <span className="stat__suffix"> {xmas === 1 ? 'day' : 'days'} to go</span>
        </p>
        <p className="stat__sub">The agency closes from {fmtMedium(xmasStart)}</p>
      </div>
    </div>
  );
}
