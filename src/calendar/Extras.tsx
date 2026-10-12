import { SOURCE, TO_BE_CONFIRMED } from '../content/agencyCalendar';
import { fmtStamp, parseDay } from './dates';

export function ToBeConfirmed() {
  return (
    <section className="container tbc" aria-labelledby="tbc-title">
      <div className="tbc__card">
        <div className="section-head">
          <p className="hd-eyebrow">On the radar</p>
          <h2 id="tbc-title" className="hd-h3">
            In the plan, dates to come
          </h2>
          <p className="section-sub">These are in the agency calendar without a date yet. They'll appear above once they're locked in.</p>
        </div>
        <div className="tbc__groups">
          {TO_BE_CONFIRMED.map((g) => (
            <div key={g.group} className="tbc__group">
              <h3 className="tbc__label">{g.group}</h3>
              <ul className="tbc__list">
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SourceNote() {
  return (
    <footer className="container source">
      <p>
        Source: <strong>{SOURCE.name}</strong> in the {SOURCE.location}, last updated {fmtStamp(parseDay(SOURCE.updated))}. Public holidays
        are the official Victorian dates.
      </p>
      <p>
        Spotted something out of date?{' '}
        <a href={SOURCE.url} target="_blank" rel="noreferrer">
          Open the spreadsheet
        </a>{' '}
        or let People and Culture know.
      </p>
    </footer>
  );
}
