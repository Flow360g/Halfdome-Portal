import { Link } from 'react-router-dom';
import { changelog } from '../content/changelog';
import { findPage, pagePath } from '../content/hub';
import { formatDate } from '../lib/dates';

/** The three latest changes to the hub. */
export function WhatsNew() {
  const latest = changelog.slice(0, 3);
  return (
    <section className="whats-new" aria-labelledby="whats-new-title">
      <header className="section-head">
        <p className="hd-eyebrow">Just added</p>
        <h2 id="whats-new-title" className="hd-h2">
          What’s new
        </h2>
      </header>
      <ul className="whats-new__list">
        {latest.map((entry) => {
          const match = findPage(entry.topic, entry.page);
          if (!match) return null;
          return (
            <li key={`${entry.topic}/${entry.page}`}>
              <Link to={pagePath(entry.topic, entry.page)} className="whats-new__item">
                <span className="whats-new__meta">
                  <span className="hd-pill whats-new__pill">{entry.change === 'new' ? 'New' : 'Updated'}</span>
                  <span>{formatDate(entry.date)}</span>
                </span>
                <span className="whats-new__title">{match.page.title}</span>
                <span className="whats-new__note">{entry.note}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
