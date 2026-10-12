import { Link, useParams } from 'react-router-dom';
import { BrandIcon } from '../components/brand/BrandIcon';
import { findPage, findTopic, KIND_LABEL, pagePath, topicPath } from '../content/hub';

/*
 * Holding pages for topics and their pages. They keep every link on the
 * dashboard working until the content pages are designed and written.
 */
export function TopicPage() {
  const { topicSlug, pageSlug } = useParams();
  const topic = findTopic(topicSlug);
  const match = pageSlug ? findPage(topicSlug, pageSlug) : undefined;

  if (!topic || (pageSlug && !match)) return <NotFound />;

  const page = match?.page;

  return (
    <main id="main" className="container holding">
      <nav className="holding__crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">People hub</Link>
          </li>
          {page ? (
            <li>
              <Link to={topicPath(topic.slug)}>{topic.title}</Link>
            </li>
          ) : null}
          <li aria-current="page">{page ? page.title : topic.title}</li>
        </ol>
      </nav>

      <header className="holding__head">
        <span className="topic-card__icon">
          <BrandIcon name={topic.icon} size={56} />
        </span>
        <div>
          <p className="hd-eyebrow">{page ? topic.title : `${topic.pages.length} pages`}</p>
          <h1 className="holding__title">{page ? page.title : topic.title}</h1>
          {page && page.kind !== 'guide' ? (
            <span className="hd-pill hd-pill-neutral">{KIND_LABEL[page.kind]}</span>
          ) : (
            <p className="hd-intro">{topic.summary}</p>
          )}
        </div>
      </header>

      {page && (
        <p className="holding__note">
          This page is being written. People and Culture will publish it here soon.
        </p>
      )}

      <section aria-labelledby="holding-list-title" className="holding__list">
        <h2 id="holding-list-title" className="hd-h3">
          {page ? `More in ${topic.title.toLowerCase()}` : 'Pages in this topic'}
        </h2>
        <ul className="topic-card__pages">
          {topic.pages
            .filter((p) => p !== page)
            .map((p) => (
              <li key={p.slug}>
                <Link to={pagePath(topic.slug, p.slug)} className="topic-card__page">
                  <span className="topic-card__page-title">{p.title}</span>
                  {p.kind !== 'guide' && <span className="hd-pill hd-pill-neutral">{KIND_LABEL[p.kind]}</span>}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <Link to={{ pathname: '/', hash: `#${topic.slug}` }} className="hd-btn hd-btn-secondary">
        Back to all topics
      </Link>
    </main>
  );
}

function NotFound() {
  return (
    <main id="main" className="container holding">
      <header className="holding__head holding__head--plain">
        <div>
          <p className="hd-eyebrow">Page not found</p>
          <h1 className="holding__title">We couldn’t find that page.</h1>
          <p className="hd-intro">It may have moved or been renamed. Search or browse from the people hub.</p>
        </div>
      </header>
      <Link to="/" className="hd-btn hd-btn-primary">
        Go to the people hub
      </Link>
    </main>
  );
}
