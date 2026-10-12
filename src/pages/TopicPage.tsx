import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DocumentLink } from '../components/blocks/Blocks';
import { BrandIcon } from '../components/brand/BrandIcon';
import { findPage, findTopic, KIND_LABEL, pagePath, type HubPage, type HubTopic } from '../content/hub';
import { hasContent, loadPage, templateFor, type PageModule } from '../content/pages';
import { Breadcrumbs } from '../templates/PageParts';
import { GuideTemplate, JourneyTemplate, PolicyTemplate, StoryTemplate } from '../templates/Templates';

const templates = {
  guide: GuideTemplate,
  policy: PolicyTemplate,
  story: StoryTemplate,
  journey: JourneyTemplate,
};

export function TopicPage() {
  const { topicSlug, pageSlug } = useParams();
  const topic = findTopic(topicSlug);
  const match = pageSlug ? findPage(topicSlug, pageSlug) : undefined;

  if (!topic || (pageSlug && !match)) return <NotFound />;
  if (!match) return <TopicOverview topic={topic} />;
  if (hasContent(topic.slug, match.page.slug)) {
    return <ContentPage key={`${topic.slug}/${match.page.slug}`} topic={topic} page={match.page} />;
  }
  return <HoldingPage topic={topic} page={match.page} />;
}

function ContentPage({ topic, page }: { topic: HubTopic; page: HubPage }) {
  const [module, setModule] = useState<PageModule | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPage(topic.slug, page.slug)
      ?.then((loaded) => !cancelled && setModule(loaded))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [topic.slug, page.slug]);

  if (failed) return <HoldingPage topic={topic} page={page} note="This page didn’t load. Refresh to try again." />;
  if (!module) {
    return (
      <main id="main" className="container holding" aria-busy="true">
        <Breadcrumbs topic={topic} page={page} />
        <h1 className="holding__title">{page.title}</h1>
      </main>
    );
  }

  const Template = templates[templateFor(page.kind, module.frontmatter)];
  return <Template context={{ topic, page, frontmatter: module.frontmatter }} Content={module.default} />;
}

function PageList({ topic, pages }: { topic: HubTopic; pages: HubPage[] }) {
  return (
    <ul className="topic-card__pages">
      {pages.map((p) => (
        <li key={p.slug}>
          <Link to={pagePath(topic.slug, p.slug)} className="topic-card__page">
            <span className="topic-card__page-title">{p.title}</span>
            {p.kind !== 'guide' && <span className="hd-pill hd-pill-neutral">{KIND_LABEL[p.kind]}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function TopicOverview({ topic }: { topic: HubTopic }) {
  return (
    <main id="main" className="container holding">
      <Breadcrumbs topic={topic} />
      <header className="holding__head">
        <span className="topic-card__icon">
          <BrandIcon name={topic.icon} size={56} />
        </span>
        <div>
          <p className="hd-eyebrow">{topic.pages.length} pages</p>
          <h1 className="holding__title">{topic.title}</h1>
          <p className="hd-intro">{topic.summary}</p>
        </div>
      </header>
      <section aria-labelledby="holding-list-title" className="holding__list">
        <h2 id="holding-list-title" className="hd-h3">
          Pages in this topic
        </h2>
        <PageList topic={topic} pages={topic.pages} />
      </section>
      <Link to={{ pathname: '/', hash: `#${topic.slug}` }} className="hd-btn hd-btn-secondary">
        Back to all topics
      </Link>
    </main>
  );
}

/** Shown for pages whose content isn't written yet. Points to the original document when there is one. */
function HoldingPage({ topic, page, note }: { topic: HubTopic; page: HubPage; note?: string }) {
  return (
    <main id="main" className="container holding">
      <Breadcrumbs topic={topic} page={page} />
      <header className="holding__head">
        <span className="topic-card__icon">
          <BrandIcon name={topic.icon} size={56} />
        </span>
        <div>
          <p className="hd-eyebrow">{topic.title}</p>
          <h1 className="holding__title">{page.title}</h1>
          {page.kind !== 'guide' && <span className="hd-pill hd-pill-neutral">{KIND_LABEL[page.kind]}</span>}
        </div>
      </header>

      <p className="holding__note">
        {note ??
          (page.source
            ? 'We’re turning this into a proper hub page. Until then, the original document has everything you need.'
            : 'This page is being written. People and Culture will publish it here soon.')}
      </p>
      {page.source && (
        <div className="holding__source">
          <DocumentLink source={page.source} />
        </div>
      )}

      <section aria-labelledby="holding-list-title" className="holding__list">
        <h2 id="holding-list-title" className="hd-h3">
          More in {topic.title.toLowerCase()}
        </h2>
        <PageList topic={topic} pages={topic.pages.filter((p) => p !== page)} />
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
