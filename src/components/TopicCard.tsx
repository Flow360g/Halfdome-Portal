import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KIND_LABEL, pagePath, topicPath, type HubPage, type HubTopic } from '../content/hub';
import { BrandIcon } from './brand/BrandIcon';

interface TopicCardProps {
  topic: HubTopic;
  /** When searching, only these pages are shown. */
  pages?: HubPage[];
}

export function TopicCard({ topic, pages = topic.pages }: TopicCardProps) {
  const [toggled, setToggled] = useState(false);
  const filtered = pages.length !== topic.pages.length;
  // Search results always show their matching pages, even on phones.
  const open = toggled || filtered;
  const count = filtered
    ? `${pages.length} of ${topic.pages.length} pages`
    : `${topic.pages.length} pages`;
  const listId = `${topic.slug}-pages`;

  return (
    <article
      className={open ? 'topic-card is-open' : 'topic-card'}
      id={topic.slug}
      aria-labelledby={`${topic.slug}-title`}
    >
      <div className="topic-card__head">
        <span className="topic-card__icon">
          <BrandIcon name={topic.icon} size={56} />
        </span>
        <span className="topic-card__count">{count}</span>
      </div>
      <h3 id={`${topic.slug}-title`} className="topic-card__title">
        <Link to={topicPath(topic.slug)}>{topic.title}</Link>
      </h3>
      <p className="topic-card__summary">{topic.summary}</p>
      <ul className="topic-card__pages" id={listId}>
        {pages.map((page) => (
          <li key={page.slug}>
            <Link to={pagePath(topic.slug, page.slug)} className="topic-card__page">
              <span className="topic-card__page-title">{page.title}</span>
              {page.kind !== 'guide' && <span className="hd-pill hd-pill-neutral">{KIND_LABEL[page.kind]}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {!filtered && (
        <button
          type="button"
          className="topic-card__toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setToggled((value) => !value)}
        >
          {open ? 'Hide pages' : `Show ${topic.pages.length} pages`}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
    </article>
  );
}
