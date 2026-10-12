import { useRef, type CSSProperties } from 'react';
import { MONTHS, type Day } from './dates';
import { AgendaView } from './AgendaView';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { useMedia } from './hooks';
import type { Item } from './model';
import type { Actions, View } from './types';

interface Props extends Actions {
  items: Item[];
  today: Day;
  view: View;
  month: number;
  direction: 1 | -1;
  focusMonday: Day | null;
  showPast: boolean;
  onView: (v: View) => void;
  onMonth: (m: number, dir: 1 | -1) => void;
  onToday: () => void;
  onShowPast: () => void;
}

const VIEWS: { id: View; label: string; key: string }[] = [
  { id: 'month', label: 'Month', key: 'M' },
  { id: 'year', label: 'Year', key: 'Y' },
  { id: 'agenda', label: 'Agenda', key: 'A' },
];

export function Explorer(props: Props) {
  const { items, today, view, month, direction, onView, onMonth, onToday } = props;
  const compact = useMedia('(width <= 720px)');
  const tabs = useRef<HTMLDivElement>(null);
  const title = view === 'month' ? `${MONTHS[month - 1]} 2026` : view === 'year' ? '2026' : 'From this week';

  return (
    <section className="container explorer" id="calendar" aria-labelledby="explorer-title">
      <div className="explorer__head">
        <div className="explorer__nav">
          {view === 'month' && (
            <button
              type="button"
              className="round-btn"
              aria-label="Previous month"
              disabled={month === 1}
              onClick={() => onMonth(month - 1, -1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 6l-6 6 6 6" />
              </svg>
            </button>
          )}
          <h2 id="explorer-title" className="explorer__title" data-view={view} aria-live="polite">
            <span key={title} className="explorer__title-text" data-dir={direction}>
              {title}
            </span>
          </h2>
          {view === 'month' && (
            <button
              type="button"
              className="round-btn"
              aria-label="Next month"
              disabled={month === 12}
              onClick={() => onMonth(month + 1, 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.5 6l6 6-6 6" />
              </svg>
            </button>
          )}
          <button type="button" className="hd-btn hd-btn-secondary hd-btn-sm explorer__today" onClick={onToday}>
            Today
          </button>
        </div>

        <div
          className="segmented"
          role="tablist"
          aria-label="Calendar view"
          ref={tabs}
          style={{ '--active': VIEWS.findIndex((v) => v.id === view) } as CSSProperties}
        >
          <span className="segmented__thumb" aria-hidden="true" />
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className="segmented__btn"
              title={`${v.label} view (${v.key})`}
              onClick={() => onView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="explorer__view" key={view === 'month' ? `m${month}` : view} data-dir={direction} data-view={view}>
        {view === 'month' && (
          <MonthView
            items={items}
            month={month}
            today={today}
            compact={compact}
            focusMonday={props.focusMonday}
            openItem={props.openItem}
            openDay={props.openDay}
          />
        )}
        {view === 'year' && (
          <YearView items={items} today={today} openDay={props.openDay} onOpenMonth={(m) => onMonth(m, m >= month ? 1 : -1)} />
        )}
        {view === 'agenda' && (
          <AgendaView items={items} today={today} showPast={props.showPast} onShowPast={props.onShowPast} openItem={props.openItem} />
        )}
      </div>
    </section>
  );
}
