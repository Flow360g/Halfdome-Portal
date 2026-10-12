import { useEffect, useRef, useState } from 'react';
import { STREAM_BY_ID, bySeries, closureOn, covers, ITEM_BY_ID, type Item } from './model';
import { artSrc } from './assets';
import { MONTHS, fmtLong, fmtMedium, isoWeek, parts, plural, relative, trimester, type Day } from './dates';
import { downloadIcs } from './ics';
import { BrandIcon } from './Icon';
import { StreamDot } from './StreamDot';
import type { Selection } from './types';

const CAN_DOWNLOAD = import.meta.env.MODE !== 'artifact';

interface Props {
  stack: Selection[];
  today: Day;
  items: Item[];
  onClose: () => void;
  onPush: (s: Selection) => void;
  onBack: () => void;
  onShowInMonth: (day: Day) => void;
}

/** Side sheet (bottom sheet on phones) with everything about one date or one day. */
export function Drawer({ stack, today, items, onClose, onPush, onBack, onShowInMonth }: Props) {
  const open = stack.length > 0;
  const current = stack[stack.length - 1];
  const [rendered, setRendered] = useState<Selection | undefined>(current);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Keep the last content on screen while the sheet slides away.
  useEffect(() => {
    if (current) setRendered(current);
  }, [current]);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    panel.current?.querySelector('.drawer__scroll')?.scrollTo({ top: 0 });
  }, [current]);

  const shown = current ?? rendered;

  return (
    <div className="drawer" data-open={open || undefined} inert={!open}>
      <button type="button" className="drawer__scrim" tabIndex={-1} aria-label="Close details" onClick={onClose} />
      <div
        ref={panel}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer__bar">
          {stack.length > 1 ? (
            <button type="button" className="drawer__back" onClick={onBack}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 6l-6 6 6 6" />
              </svg>
              Back
            </button>
          ) : (
            <span className="drawer__grip" aria-hidden="true" />
          )}
          <button ref={closeBtn} type="button" className="drawer__close" onClick={onClose} aria-label="Close details">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="drawer__scroll" key={shown ? (shown.kind === 'item' ? shown.id : `d${shown.day}`) : 'none'}>
          {shown?.kind === 'item' && ITEM_BY_ID[shown.id] && (
            <ItemDetail item={ITEM_BY_ID[shown.id]} today={today} onPush={onPush} onShowInMonth={onShowInMonth} />
          )}
          {shown?.kind === 'day' && <DayDetail day={shown.day} today={today} items={items} onPush={onPush} />}
        </div>
      </div>
    </div>
  );
}

function whenText(item: Item): string {
  if (item.timing === 'early-month') return `Early ${MONTHS[parts(item.start).m - 1]}`;
  if (item.timing === 'week') return `Week of ${fmtLong(item.start)}`;
  if (item.multi) return `${fmtLong(item.start)} to ${fmtLong(item.end)}`;
  return fmtLong(item.start);
}

function ItemDetail({
  item,
  today,
  onPush,
  onShowInMonth,
}: {
  item: Item;
  today: Day;
  onPush: (s: Selection) => void;
  onShowInMonth: (day: Day) => void;
}) {
  const stream = STREAM_BY_ID[item.stream];
  const siblings = bySeries(item.series.id);
  const showSeries = siblings.length > 1 && siblings.length <= 40;
  const nextSibling = siblings.find((s) => s.end >= today);
  const ongoing = item.start < today && item.end >= today;
  const rel = ongoing ? 'On now' : relative(item.start, today);
  const days = item.end - item.start + 1;
  const details = [
    ...(item.raw.details ?? []),
    ...(item.series.cadence ? [{ label: 'How often', value: item.series.cadence }] : []),
    ...(item.series.audience && !(item.raw.details ?? []).some((d) => d.label === 'Who should attend')
      ? [{ label: 'Who it is for', value: item.series.audience }]
      : []),
  ];

  return (
    <article className="detail" data-stream={item.stream}>
      <div className="detail__art">
        <img src={artSrc(item.art)} alt="" width={720} height={480} />
      </div>

      <p className="detail__eyebrow">
        <StreamDot stream={item.stream} />
        {stream.label} · {item.unit}
      </p>
      <h2 id="drawer-title" className="detail__title">
        {item.title}
      </h2>
      <p className="detail__when">{whenText(item)}</p>

      <div className="detail__chips">
        <span className="cal-chip cal-chip--strong" data-past={item.end < today || undefined}>
          {rel}
        </span>
        <span className="cal-chip">Week {isoWeek(item.start).week}</span>
        <span className="cal-chip">Trimester {trimester(item.start).n}</span>
        {item.multi && <span className="cal-chip">{plural(days, 'day')}</span>}
        {item.time && <span className="cal-chip">{item.time}</span>}
        {item.stream === 'closures' && <span className="cal-chip">Office closed</span>}
      </div>

      {item.note && item.note !== item.title && <p className="detail__note">{item.note}</p>}

      {item.series.about && <p className="detail__about">{item.series.about}</p>}

      {item.raw.modules && (
        <div className="detail__block">
          <h3 className="detail__h">This week's modules</h3>
          <dl className="detail__dl">
            {item.raw.modules.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd data-exam={/exam/i.test(m.value) || undefined}>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {details.length > 0 && (
        <dl className="detail__dl detail__dl--facts">
          {details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {item.raw.projected && (
        <p className="detail__hint">
          The sheet lists the first dates and the cadence. This date follows that cadence, so check your invite.
        </p>
      )}

      {item.series.resources && (
        <div className="detail__block">
          <h3 className="detail__h">Helpful resources</h3>
          <ul className="detail__files">
            {item.series.resources.map((r) => (
              <li key={r}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3h7l5 5v13H7z" />
                  <path d="M14 3v5h5" />
                </svg>
                {r}
              </li>
            ))}
          </ul>
          <p className="detail__hint">Find these in SharePoint, or ask People and Culture.</p>
        </div>
      )}

      <div className="detail__actions">
        {/* The single-file preview can't hand out files, so the .ics button lives in the real app only. */}
        {CAN_DOWNLOAD && (
          <button type="button" className="hd-btn hd-btn-primary" onClick={() => downloadIcs(item)}>
            <svg className="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M4 10h16M9 3v4M15 3v4M12 13v5M9.5 15.5h5" />
            </svg>
            Add to my calendar
          </button>
        )}
        <button
          type="button"
          className={`hd-btn ${CAN_DOWNLOAD ? 'hd-btn-secondary' : 'hd-btn-primary'}`}
          onClick={() => onShowInMonth(item.start)}
        >
          Show in month
        </button>
      </div>

      {showSeries && (
        <div className="detail__block">
          <h3 className="detail__h">
            {siblings.length} dates in 2026
            {item.series.cadence && <span className="detail__h-sub"> · {item.series.cadence}</span>}
          </h3>
          <ol className="series">
            {siblings.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="series__item"
                  data-current={s.id === item.id || undefined}
                  data-past={s.end < today || undefined}
                  data-next={s.id === nextSibling?.id || undefined}
                  onClick={() => s.id !== item.id && onPush({ kind: 'item', id: s.id })}
                  aria-current={s.id === item.id ? 'true' : undefined}
                >
                  <span className="series__date">{fmtMedium(s.start)}</span>
                  {(s.raw.title && s.raw.title !== item.title ? s.raw.title : s.note) && (
                    <span className="series__label">{s.raw.title && s.raw.title !== item.title ? s.raw.title : s.note}</span>
                  )}
                  {s.id === nextSibling?.id && s.id !== item.id && <span className="series__next">Next</span>}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

function DayDetail({ day, today, items, onPush }: { day: Day; today: Day; items: Item[]; onPush: (s: Selection) => void }) {
  const list = items.filter((i) => covers(i, day));
  const closure = closureOn(day);
  return (
    <article className="detail detail--day">
      <p className="detail__eyebrow">
        Week {isoWeek(day).week} · Trimester {trimester(day).n}
      </p>
      <h2 id="drawer-title" className="detail__title">
        {fmtLong(day)}
      </h2>
      <p className="detail__when">{relative(day, today)}</p>
      {closure && (
        <p className="detail__closed">
          <span className="hatch-swatch" aria-hidden="true" />
          Office closed for {closure.title}
        </p>
      )}
      {list.length === 0 ? (
        <p className="detail__about">Nothing listed for this day with the current filters.</p>
      ) : (
        <ul className="daycards">
          {list.map((item) => (
            <li key={item.id}>
              <button type="button" className="daycard" data-stream={item.stream} onClick={() => onPush({ kind: 'item', id: item.id })}>
                <BrandIcon name={item.icon} size={48} />
                <span className="daycard__text">
                  <span className="daycard__title">{item.title}</span>
                  <span className="daycard__meta">
                    <StreamDot stream={item.stream} size={8} />
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
    </article>
  );
}
