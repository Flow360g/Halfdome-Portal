import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { pagePath } from '../../content/hub';
import { publicHolidaysVic } from '../../content/public-holidays-vic';
import {
  addDays,
  daysBetween,
  formatDate,
  formatLong,
  nextHoliday,
  parseDate,
  requestByDate,
  todayInMelbourne,
  trimesterFor,
  workingDaysBetween,
  type LeaveType,
} from '../../lib/dates';
import { useStoredState } from '../../lib/storage';

const holidayDates = publicHolidaysVic.map((h) => h.date);

function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

/** Countdown to the next Victorian public holiday, with the swap rule. */
export function NextPublicHoliday() {
  const today = todayInMelbourne();
  const next = nextHoliday(today, publicHolidaysVic);
  const [showAll, setShowAll] = useState(false);
  const listId = useId();
  if (!next) return null;

  const days = daysBetween(today, next.date);
  const upcoming = publicHolidaysVic.filter((h) => h.date >= today).slice(0, 8);

  return (
    <section className="tool tool-holiday" aria-label="Next public holiday">
      <div className="tool-holiday__main">
        <p className="tool__label">Next public holiday in Victoria</p>
        <p className="tool-holiday__count">
          <span className="tool-holiday__number">{days === 0 ? 'Today' : days}</span>
          {days > 0 && <span className="tool-holiday__unit">{days === 1 ? 'day to go' : 'days to go'}</span>}
        </p>
        <p className="tool-holiday__name">
          {next.name}, {formatLong(next.date)}
          {next.tbc && ' (date to be confirmed)'}
        </p>
      </div>
      <p className="tool__note">
        Want to work it and take another day off instead? Ask your manager first. You get a day off in lieu, ideally
        within two weeks.
      </p>
      <button
        type="button"
        className="hd-btn hd-btn-quiet tool__toggle"
        aria-expanded={showAll}
        aria-controls={listId}
        onClick={() => setShowAll((v) => !v)}
      >
        {showAll ? 'Hide the list' : 'See the next eight'}
      </button>
      <ul id={listId} className="tool-holiday__list" hidden={!showAll}>
        {upcoming.map((h) => (
          <li key={h.date}>
            <span>{h.name}</span>
            <span className="tool-holiday__date">
              {formatLong(h.date)}
              {h.tbc && ' (TBC)'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const leaveLabels: Record<LeaveType, string> = {
  annual: 'Annual leave',
  'whole-potential': 'Whole Potential Day',
  'long-service': 'Long service leave',
};

function defaultRange(today: string) {
  // A realistic example: a Monday to Friday week, five weeks from now.
  let start = addDays(today, 35);
  while (parseDate(start).getUTCDay() !== 1) start = addDays(start, 1);
  return { start, end: addDays(start, 4) };
}

/** Works out working days and the date to get leave approved by. */
export function LeavePlanner() {
  const today = todayInMelbourne();
  const initial = useMemo(() => defaultRange(today), [today]);
  const [type, setType] = useState<LeaveType>('annual');
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);

  const validRange = start && end && end >= start;
  const result = validRange ? workingDaysBetween(start, end, holidayDates) : undefined;
  const requestBy = start ? requestByDate(start, type) : undefined;
  const late = requestBy !== undefined && requestBy < today;
  const holidayNames = result?.holidays.map((d) => publicHolidaysVic.find((h) => h.date === d)?.name ?? d) ?? [];

  return (
    <section className="tool tool-planner" aria-labelledby="planner-title">
      <p className="tool__label" id="planner-title">
        Leave planner
      </p>
      <form className="tool-planner__form" onSubmit={(e) => e.preventDefault()}>
        <div className="tool-field">
          <label htmlFor="planner-type">Type of leave</label>
          <select id="planner-type" value={type} onChange={(e) => setType(e.target.value as LeaveType)}>
            {Object.entries(leaveLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="tool-field">
          <label htmlFor="planner-start">First day off</label>
          <input
            id="planner-start"
            type="date"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              if (type === 'whole-potential' || e.target.value > end) setEnd(e.target.value);
            }}
          />
        </div>
        <div className="tool-field">
          <label htmlFor="planner-end">Last day off</label>
          <input id="planner-end" type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </form>

      {result ? (
        <div className="tool-planner__result" role="status">
          <div className="tool-planner__figure">
            <span className="tool-planner__number">{result.workingDays}</span>
            <span>
              working {result.workingDays === 1 ? 'day' : 'days'} of {leaveLabels[type].toLowerCase()}
              {holidayNames.length > 0 && (
                <span className="tool-planner__holidays">
                  {' '}
                  ({holidayNames.join(' and ')} {holidayNames.length === 1 ? 'is' : 'are'} a public holiday, so{' '}
                  {holidayNames.length === 1 ? "it doesn't" : "they don't"} count)
                </span>
              )}
            </span>
          </div>

          {type === 'whole-potential' && result.workingDays > 1 && (
            <p className="tool-planner__warning">
              Whole Potential Days are taken one at a time and can’t be joined to each other or to other leave. Pick
              a single day.
            </p>
          )}

          {requestBy && (
            <p className={late ? 'tool-planner__warning' : 'tool-planner__deadline'}>
              {late
                ? `That’s less notice than the policy asks for (${type === 'long-service' ? 'three months' : 'four weeks'}). Talk to your manager today.`
                : `Get it approved by ${formatLong(requestBy)}.`}
            </p>
          )}

          <ol className="tool-planner__steps">
            <li>Talk it through with your manager{type === 'whole-potential' && ', and check it doesn’t clash with your team'}.</li>
            {type === 'annual' && <li>Your manager gets sign-off from your Partner or Head of department.</li>}
            {type === 'long-service' && <li>The Head of People and Culture approves it.</li>}
            <li>
              Request it in HiBob as {type === 'whole-potential' ? '“Whole Potential Days”' : leaveLabels[type].toLowerCase()}.
            </li>
            {type === 'whole-potential' && <li>Add it to your calendar and invite anyone it affects.</li>}
          </ol>
        </div>
      ) : (
        <p className="tool__note" role="status">
          Pick a last day that’s on or after your first day.
        </p>
      )}
    </section>
  );
}

/** This trimester's Whole Potential Days, with a private tracker for which ones are booked. */
export function WholePotentialDays() {
  const today = todayInMelbourne();
  const trimester = trimesterFor(today);
  const nextStart = addDays(trimester.end, 1);
  const daysLeft = daysBetween(today, trimester.end) + 1;
  const totalDays = daysBetween(trimester.start, trimester.end) + 1;
  const elapsed = Math.min(100, Math.max(0, Math.round(((totalDays - daysLeft) / totalDays) * 100)));
  const [booked, setBooked] = useStoredState<boolean[]>(`hub:wpd:${trimester.start}`, [false, false]);
  const used = booked.filter(Boolean).length;

  return (
    <section className="tool tool-wpd" aria-labelledby="wpd-title">
      <p className="tool__label" id="wpd-title">
        Your Whole Potential Days this trimester
      </p>
      <div className="tool-wpd__row">
        <div className="tool-wpd__days" role="group" aria-label="Mark your Whole Potential Days as booked">
          {booked.map((isBooked, index) => (
            <button
              key={index}
              type="button"
              className={isBooked ? 'tool-wpd__day is-booked' : 'tool-wpd__day'}
              aria-pressed={isBooked}
              onClick={() => setBooked(booked.map((b, i) => (i === index ? !b : b)))}
            >
              <span className="tool-wpd__dome" aria-hidden="true" />
              <span className="tool-wpd__day-label">Day {index + 1}</span>
              <span className="tool-wpd__day-state">{isBooked ? 'Booked' : 'Available'}</span>
            </button>
          ))}
        </div>
        <div className="tool-wpd__summary">
          <p className="tool-wpd__headline">
            {used === 2 ? 'Both days booked. Enjoy them.' : `${plural(2 - used, 'day')} left to use by ${formatDate(trimester.end)}.`}
          </p>
          <p className="tool__note">
            Trimester {trimester.number} runs {formatDate(trimester.start)} to {formatDate(trimester.end)}.{' '}
            {plural(daysLeft, 'day')} to go. Days don’t roll over; two new ones arrive on {formatDate(nextStart)}.
          </p>
          <div className="tool-wpd__bar" role="img" aria-label={`${elapsed}% of the trimester has passed`}>
            <span style={{ width: `${elapsed}%` }} />
          </div>
        </div>
      </div>
      <p className="tool__fineprint">
        Tap a day to mark it booked. This is just for you and stays on this device; HiBob is the official record.
        Trimester dates are assumed to be January to April, May to August and September to December until People and
        Culture confirms them. <Link to={pagePath('leave-and-flexibility', 'how-to-apply-for-leave')}>How to request one</Link>.
      </p>
    </section>
  );
}
