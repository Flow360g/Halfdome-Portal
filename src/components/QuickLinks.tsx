import { Link } from 'react-router-dom';
import { findPage, pagePath, quickLinks } from '../content/hub';

export function QuickLinks() {
  return (
    <section className="quick-links" id="quick-links" aria-labelledby="quick-links-title">
      <header className="section-head">
        <p className="hd-eyebrow">Most used</p>
        <h2 id="quick-links-title" className="hd-h2">
          Quick links
        </h2>
      </header>
      <ul className="quick-links__grid">
        {quickLinks.map((link) => {
          const match = findPage(link.topic, link.page);
          return (
            <li key={link.label}>
              <Link to={pagePath(link.topic, link.page)} className="quick-link">
                <span className="quick-link__label">{link.label}</span>
                <span className="quick-link__topic">{match?.topic.title}</span>
                <svg className="quick-link__arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
