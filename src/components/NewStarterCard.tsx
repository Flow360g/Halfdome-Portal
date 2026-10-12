import { Link } from 'react-router-dom';
import arrow from '../assets/brand/arrow-white-5.webp';
import { pagePath } from '../content/hub';
import { useJourneyProgress } from '../lib/journey';

/** The welcome panel for people in their first few months. */
export function NewStarterCard() {
  const progress = useJourneyProgress();
  return (
    <aside className="new-starter" aria-labelledby="new-starter-title">
      <p className="new-starter__eyebrow">New starters</p>
      <h2 id="new-starter-title" className="hd-statement new-starter__statement">
        Welcome aboard.
      </h2>
      <p className="new-starter__body">
        Your first 90 days, the people to meet and everything to set up in week one.
      </p>
      {progress.started && (
        <div className="new-starter__progress">
          <span>
            {progress.complete ? 'All done. Nice work.' : `${progress.count} of ${progress.total} steps done`}
          </span>
          <span className="new-starter__bar" aria-hidden="true">
            <span style={{ width: `${Math.round((progress.count / progress.total) * 100)}%` }} />
          </span>
        </div>
      )}
      <div className="new-starter__cta">
        <Link to={pagePath('hiring-and-onboarding', 'your-first-90-days')} className="hd-btn new-starter__button">
          {progress.started ? 'Keep going' : 'Start here'}
        </Link>
        <img className="hd-arrow new-starter__arrow" src={arrow} alt="" aria-hidden="true" width={56} height={78} />
      </div>
    </aside>
  );
}
