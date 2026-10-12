import { Link } from 'react-router-dom';
import { askHubConfigured } from '../lib/askHub';
import { AskHubButton } from './AskHub';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        {/* The portal side nav carries the Half Dome logo, so the hub's bar just names the hub. */}
        <Link to="/" className="site-header__brand" aria-label="People hub home">
          <span className="site-header__name">People hub</span>
        </Link>
        <nav className="site-header__nav" aria-label="Main">
          <Link to={{ pathname: '/', hash: '#topics' }}>All topics</Link>
          <Link to={{ pathname: '/', hash: '#quick-links' }}>Quick links</Link>
          <Link to="/topics/hiring-and-onboarding/your-first-90-days">New starters</Link>
        </nav>
        {askHubConfigured ? (
          <AskHubButton className="site-header__cta site-header__ask" />
        ) : (
          <Link to="/topics/our-team/who-to-ask-for-what" className="hd-btn hd-btn-secondary hd-btn-sm site-header__cta">
            Ask People and Culture
          </Link>
        )}
      </div>
    </header>
  );
}
