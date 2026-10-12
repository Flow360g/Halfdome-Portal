import { Link } from 'react-router-dom';
import arrow from '../assets/brand/arrow-white-5.webp';
import { pagePath } from '../content/hub';

/** The welcome panel for people in their first few months. */
export function NewStarterCard() {
  return (
    <aside className="new-starter" aria-labelledby="new-starter-title">
      <p className="new-starter__eyebrow">New starters</p>
      <h2 id="new-starter-title" className="hd-statement new-starter__statement">
        Welcome aboard.
      </h2>
      <p className="new-starter__body">
        Your first 90 days, the people to meet and everything to set up in week one.
      </p>
      <div className="new-starter__cta">
        <Link to={pagePath('hiring-and-onboarding', 'your-first-90-days')} className="hd-btn new-starter__button">
          Start here
        </Link>
        <img className="hd-arrow new-starter__arrow" src={arrow} alt="" aria-hidden="true" width={56} height={78} />
      </div>
    </aside>
  );
}
