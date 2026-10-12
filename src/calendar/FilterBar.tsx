import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { STREAMS, type StreamId } from '../content/agencyCalendar';
import { fmtMedium, type Day } from './dates';
import { ITEMS, type Item } from './model';
import { StreamDot } from './StreamDot';
import type { Actions } from './types';

interface Props extends Pick<Actions, 'openItem'> {
  streams: Set<StreamId>;
  counts: Record<StreamId, number>;
  query: string;
  today: Day;
  onToggle: (s: StreamId) => void;
  onOnly: (s: StreamId) => void;
  onAll: () => void;
  onQuery: (q: string) => void;
}

export function FilterBar({ streams, counts, query, today, onToggle, onOnly, onAll, onQuery, openItem }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const allOn = streams.size === STREAMS.length;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/);
    const hits = ITEMS.filter((i) => words.every((w) => i.search.includes(w)));
    // Upcoming first, then the rest of the year.
    const upcoming = hits.filter((i) => i.end >= today);
    const past = hits.filter((i) => i.end < today);
    return [...upcoming, ...past].slice(0, 8);
  }, [query, today]);

  useEffect(() => setActive(0), [query]);

  // "/" jumps to search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !target.closest('input, textarea, select, [contenteditable="true"]')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pick = (item: Item) => {
    setOpen(false);
    openItem(item.id, inputRef.current);
  };

  return (
    <div className="filterbar" role="region" aria-label="Filter the calendar">
      <div className="container filterbar__inner">
        <div className="filterbar__chips" role="group" aria-label="Show these kinds of dates">
          {STREAMS.map((s) => {
            const on = streams.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                className="fchip"
                data-stream={s.id}
                aria-pressed={on}
                title={`${s.description} Double-click to show only these.`}
                onClick={() => onToggle(s.id)}
                onDoubleClick={() => onOnly(s.id)}
              >
                <StreamDot stream={s.id} />
                <span className="fchip__label">{s.label}</span>
                <span className="fchip__count">{counts[s.id]}</span>
                <svg className="fchip__tick" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
              </button>
            );
          })}
          {!allOn && (
            <button type="button" className="fchip fchip--reset" onClick={onAll}>
              Show all
            </button>
          )}
        </div>

        <div className="fsearch" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
          <svg className="fsearch__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input
            ref={inputRef}
            id="cal-search"
            type="search"
            className="fsearch__input"
            placeholder="Search dates, e.g. reflections"
            autoComplete="off"
            role="combobox"
            aria-expanded={open && results.length > 0}
            aria-controls={listId}
            aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
            aria-label="Search the calendar"
            value={query}
            onChange={(e) => {
              onQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter' && results[active]) {
                e.preventDefault();
                pick(results[active]);
              } else if (e.key === 'Escape') {
                if (query) onQuery('');
                else inputRef.current?.blur();
                setOpen(false);
              }
            }}
          />
          {!query && <kbd className="fsearch__hint">/</kbd>}
          {query && (
            <button type="button" className="fsearch__clear" aria-label="Clear search" onClick={() => onQuery('')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7l10 10M17 7L7 17" />
              </svg>
            </button>
          )}

          {open && query.trim() && (
            <div className="fsearch__panel">
              {results.length ? (
                <ul id={listId} role="listbox" className="fsearch__list" aria-label="Matching dates">
                  {results.map((item, i) => (
                    <li
                      key={item.id}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className="fsearch__option"
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(item)}
                    >
                      <StreamDot stream={item.stream} />
                      <span className="fsearch__option-text">
                        <span className="fsearch__option-title">{item.title}</span>
                        <span className="fsearch__option-meta">
                          {fmtMedium(item.start)} · {item.unit}
                          {item.end < today ? ' · Past' : ''}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="fsearch__empty">
                  Nothing matches “{query.trim()}”. Try a team, a course or a holiday.
                </p>
              )}
              {results.length > 0 && <p className="fsearch__foot">Enter opens the top match. The calendar below is filtered too.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
