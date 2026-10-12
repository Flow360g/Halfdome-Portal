import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { STREAMS, type StreamId } from '../content/agencyCalendar';
import { ComingUp } from '../calendar/ComingUp';
import { burstFrom } from '../calendar/confetti';
import { localToday, mondayOf, parts, type Day } from '../calendar/dates';
import { Drawer } from '../calendar/Drawer';
import { Explorer } from '../calendar/Explorer';
import { SourceNote, ToBeConfirmed } from '../calendar/Extras';
import { FilterBar } from '../calendar/FilterBar';
import { Hero } from '../calendar/Hero';
import { ITEMS, ITEM_BY_ID, STREAM_ORDER, YEAR_END, YEAR_START, matches } from '../calendar/model';
import { RhythmGuide } from '../calendar/RhythmGuide';
import type { Selection, View } from '../calendar/types';
import { YearGlance } from '../calendar/YearGlance';
import { usePersistentState } from '../shell/usePersistentState';

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && !!el.closest('input, textarea, select, [contenteditable="true"]');

export function CalendarPage() {
  // The calendar covers 2026; outside it, anchor "today" to the nearest end of the year.
  const realToday = useMemo(() => localToday(), []);
  const today = Math.min(Math.max(realToday, YEAR_START), YEAR_END);
  const inYear = realToday === today;

  const [streamList, setStreamList] = usePersistentState<StreamId[]>('hd-calendar.streams', STREAM_ORDER);
  const streams = useMemo(() => new Set(streamList.filter((s) => STREAM_ORDER.includes(s))), [streamList]);
  const [query, setQuery] = useState('');
  const [view, setView] = usePersistentState<View>('hd-calendar.view', 'month');
  const [month, setMonth] = useState(parts(today).m);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [focusMonday, setFocusMonday] = useState<Day | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [stack, setStack] = useState<Selection[]>([]);
  const opener = useRef<Element | null>(null);
  const location = useLocation();

  const items = useMemo(() => ITEMS.filter((i) => matches(i, { streams, query })), [streams, query]);
  const counts = useMemo(() => {
    const c = Object.fromEntries(STREAM_ORDER.map((s) => [s, 0])) as Record<StreamId, number>;
    ITEMS.filter((i) => matches(i, { streams: new Set(STREAM_ORDER), query })).forEach((i) => c[i.stream]++);
    return c;
  }, [query]);

  const scrollToCalendar = useCallback(() => {
    document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goMonth = useCallback(
    (m: number, dir: 1 | -1) => {
      setDirection(dir);
      setMonth(Math.min(12, Math.max(1, m)));
      setView('month');
    },
    [setView],
  );

  const jumpToday = useCallback(
    (from?: Element | null) => {
      const m = parts(today).m;
      setDirection(m >= month ? 1 : -1);
      setMonth(m);
      setView('month');
      setFocusMonday(mondayOf(today));
      scrollToCalendar();
      if (from) burstFrom(from);
    },
    [today, month, setView, scrollToCalendar],
  );

  const openItem = useCallback((id: string, from?: Element | null) => {
    opener.current = from ?? document.activeElement;
    setStack([{ kind: 'item', id }]);
    const item = ITEM_BY_ID[id];
    // A little celebration for days off and fun dates.
    if (from && item && (item.stream === 'closures' || item.series.id === 'fun')) burstFrom(from);
  }, []);

  const openDay = useCallback((day: Day, from?: Element | null) => {
    opener.current = from ?? document.activeElement;
    setStack([{ kind: 'day', day }]);
  }, []);

  const closeDrawer = useCallback(() => {
    setStack([]);
    const el = opener.current as HTMLElement | null;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
  }, []);

  const showInMonth = useCallback(
    (day: Day) => {
      setStack([]);
      goMonth(parts(day).m, parts(day).m >= month ? 1 : -1);
      setFocusMonday(mondayOf(day));
      setTimeout(scrollToCalendar, 60);
    },
    [goMonth, month, scrollToCalendar],
  );

  // Arriving from the nav's "Today" card.
  useEffect(() => {
    if ((location.state as { jump?: string } | null)?.jump === 'today') jumpToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Keyboard: arrows page months, T for today, M / Y / A switch views.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey || stack.length) return;
      const k = e.key.toLowerCase();
      if (k === 't') jumpToday();
      else if (k === 'm') setView('month');
      else if (k === 'y') setView('year');
      else if (k === 'a') setView('agenda');
      else if (e.key === 'ArrowLeft' && view === 'month' && month > 1) goMonth(month - 1, -1);
      else if (e.key === 'ArrowRight' && view === 'month' && month < 12) goMonth(month + 1, 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jumpToday, goMonth, month, view, setView, stack.length]);

  // Clear the week highlight after it has done its job.
  useEffect(() => {
    if (focusMonday === null) return;
    const t = setTimeout(() => setFocusMonday(null), 2400);
    return () => clearTimeout(t);
  }, [focusMonday]);

  const toggle = (s: StreamId) =>
    setStreamList((list) => {
      const set = new Set(list);
      if (set.has(s)) set.delete(s);
      else set.add(s);
      return STREAM_ORDER.filter((x) => set.has(x));
    });

  return (
    <div className="cal">
      <Hero
        today={today}
        inYear={inYear}
        openItem={openItem}
        onJumpToday={() => jumpToday(document.activeElement)}
        onThisWeek={() => {
          setView('agenda');
          setShowPast(false);
          scrollToCalendar();
        }}
      />

      <FilterBar
        streams={streams}
        counts={counts}
        query={query}
        today={today}
        onToggle={toggle}
        onOnly={(s) => setStreamList([s])}
        onAll={() => setStreamList(STREAMS.map((s) => s.id))}
        onQuery={setQuery}
        openItem={openItem}
      />

      <ComingUp items={items} today={today} openItem={openItem} />

      <YearGlance
        items={items}
        today={today}
        selectedMonday={focusMonday}
        onPickWeek={(monday) => {
          const m = parts(monday + 3).y === 2026 ? parts(monday + 3).m : parts(monday).m;
          goMonth(m, m >= month ? 1 : -1);
          setFocusMonday(monday);
          scrollToCalendar();
        }}
      />

      <Explorer
        items={items}
        today={today}
        view={view}
        month={month}
        direction={direction}
        focusMonday={focusMonday}
        showPast={showPast}
        onView={setView}
        onMonth={goMonth}
        onToday={() => jumpToday()}
        onShowPast={() => setShowPast(true)}
        openItem={openItem}
        openDay={openDay}
      />

      <RhythmGuide today={today} openItem={openItem} />
      <ToBeConfirmed />
      <SourceNote />

      <Drawer
        stack={stack}
        today={today}
        items={items}
        onClose={closeDrawer}
        onPush={(s) => setStack((st) => [...st, s])}
        onBack={() => setStack((st) => st.slice(0, -1))}
        onShowInMonth={showInMonth}
      />
    </div>
  );
}
