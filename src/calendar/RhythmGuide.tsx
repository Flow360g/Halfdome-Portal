import { useState, type CSSProperties } from 'react';
import { RHYTHMS, SERIES, type Rhythm } from '../content/agencyCalendar';
import { fmtMedium, relative, type Day } from './dates';
import { BrandIcon } from './Icon';
import { bySeries } from './model';
import type { Actions } from './types';

const GROUPS: Rhythm['group'][] = ['Everyone', 'Leadership', 'Client service', 'Teams'];

/** The "Milestone descriptions" tab: what each rhythm is, how often it runs and when it's next on. */
export function RhythmGuide({ today, openItem }: { today: Day } & Pick<Actions, 'openItem'>) {
  const [group, setGroup] = useState<Rhythm['group']>('Everyone');
  const list = RHYTHMS.filter((r) => r.group === group);

  return (
    <section className="container guide" aria-labelledby="guide-title">
      <div className="section-row">
        <div className="section-head">
          <p className="hd-eyebrow">How our year works</p>
          <h2 id="guide-title" className="hd-h2">
            The rhythms behind the dates
          </h2>
          <p className="section-sub">What each recurring moment is for, who it involves and when it next comes round.</p>
        </div>
        <div className="segmented" role="tablist" aria-label="Rhythms for">
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={group === g}
              className="segmented__btn"
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <ul className="guide__grid" key={group}>
        {list.map((r, i) => {
          const series = r.series ? SERIES[r.series] : undefined;
          const about = r.about ?? series?.about;
          const cadence = r.cadence ?? series?.cadence;
          const audience = r.audience ?? series?.audience;
          const resources = r.resources ?? series?.resources;
          const dates = r.series ? bySeries(r.series) : [];
          const next = dates.find((d) => d.end >= today);
          return (
            <li key={r.title} className="rhythm" style={{ '--i': i } as CSSProperties}>
              <div className="rhythm__head">
                <BrandIcon name={series?.icon ?? 'calendar'} size={48} />
                <div className="rhythm__titles">
                  <h3 className="rhythm__title">{r.title}</h3>
                  {cadence && <p className="rhythm__cadence">{cadence}</p>}
                </div>
              </div>
              {audience && (
                <p className="rhythm__who">
                  <span>For</span> {audience}
                </p>
              )}
              {about ? <p className="rhythm__about">{about}</p> : <p className="rhythm__about rhythm__about--muted">No description in the sheet yet.</p>}
              {resources && <p className="rhythm__files">Resources: {resources.join(', ')}</p>}
              <div className="rhythm__foot">
                {next ? (
                  <button type="button" className="rhythm__next" onClick={(e) => openItem(next.id, e.currentTarget)}>
                    <span className="rhythm__next-label">Next</span>
                    <span className="rhythm__next-date">{fmtMedium(Math.max(next.start, today))}</span>
                    <span className="rhythm__next-rel">{next.start <= today ? 'On now' : relative(next.start, today)}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </button>
                ) : dates.length ? (
                  <span className="rhythm__done">All {dates.length} dates for 2026 are done</span>
                ) : (
                  <span className="rhythm__done">Dates to be confirmed</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
