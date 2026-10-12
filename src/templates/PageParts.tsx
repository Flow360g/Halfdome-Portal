import { useEffect, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { BrandIcon } from '../components/brand/BrandIcon';
import { findPage, KIND_LABEL, pagePath, topicPath, type HubPage, type HubTopic } from '../content/hub';
import type { PageFrontmatter } from '../content/pages';
import { sources, sourceUrl, type SourceKey } from '../content/sources';
import { formatDate, formatMonth, isOlderThan, todayInMelbourne } from '../lib/dates';
import { sendFeedback } from '../lib/feedback';

export interface PageContext {
  topic: HubTopic;
  page: HubPage;
  frontmatter: PageFrontmatter;
}

export function sourceFor({ page, frontmatter }: PageContext): SourceKey | undefined {
  return frontmatter.source ?? page.source;
}

export function Breadcrumbs({ topic, page }: { topic: HubTopic; page?: HubPage }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">People hub</Link>
        </li>
        <li>{page ? <Link to={topicPath(topic.slug)}>{topic.title}</Link> : <span aria-current="page">{topic.title}</span>}</li>
        {page && <li aria-current="page">{page.title}</li>}
      </ol>
    </nav>
  );
}

/** Headings and reading time, measured from the rendered article. */
export function useArticleOutline(ref: RefObject<HTMLElement | null>, ready: boolean) {
  const [outline, setOutline] = useState<{ headings: { id: string; text: string }[]; minutes: number }>({
    headings: [],
    minutes: 0,
  });

  useEffect(() => {
    const article = ref.current;
    if (!article || !ready) return;
    const headings = [...article.querySelectorAll<HTMLHeadingElement>(':scope > h2[id]')].map((h) => ({
      id: h.id,
      text: h.textContent ?? '',
    }));
    const words = (article.textContent ?? '').trim().split(/\s+/).length;
    setOutline({ headings, minutes: Math.max(1, Math.round(words / 220)) });
  }, [ref, ready]);

  return outline;
}

export function PageMeta({ context, minutes }: { context: PageContext; minutes: number }) {
  const { page, frontmatter } = context;
  const source = sourceFor(context);
  const doc = source ? sources[source] : undefined;
  const today = todayInMelbourne();
  const reviewDue = doc && isOlderThan(doc.reviewed, 12, today);

  return (
    <ul className="page-meta">
      {page.kind !== 'guide' && (
        <li>
          <span className="hd-pill hd-pill-neutral">{KIND_LABEL[page.kind]}</span>
        </li>
      )}
      <li>Owned by {frontmatter.owner ?? 'People and Culture'}</li>
      <li>Updated {formatDate(frontmatter.updated)}</li>
      {minutes > 0 && <li>{minutes} min read</li>}
      {doc && source && (
        <li>
          Based on the{' '}
          <a href={sourceUrl(source)} target="_blank" rel="noreferrer">
            {doc.label}
          </a>
          , reviewed {formatMonth(doc.reviewed)}
          {reviewDue && <span className="page-meta__due">Review due</span>}
        </li>
      )}
    </ul>
  );
}

export function PageHeader({ context, minutes }: { context: PageContext; minutes: number }) {
  const { topic, page, frontmatter } = context;
  return (
    <header className="page-head">
      <div className="container">
        <Breadcrumbs topic={topic} page={page} />
        <div className="page-head__main">
          <span className="topic-card__icon page-head__icon">
            <BrandIcon name={topic.icon} size={56} />
          </span>
          <div className="page-head__text">
            <p className="hd-eyebrow">
              <Link to={topicPath(topic.slug)}>{topic.title}</Link>
            </p>
            <h1 className="page-head__title">{page.title}</h1>
            <p className="hd-intro page-head__summary">{frontmatter.summary}</p>
            <PageMeta context={context} minutes={minutes} />
          </div>
        </div>
      </div>
    </header>
  );
}

/** A sticky list of the page's sections, highlighting the one in view. */
export function OnThisPage({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState<string | undefined>(headings[0]?.id);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -60% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="on-this-page" aria-label="On this page">
      <p className="on-this-page__label">On this page</p>
      <ol>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={active === h.id ? 'location' : undefined} onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ block: 'start' });
              setActive(h.id);
            }}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function RelatedPages({ context }: { context: PageContext }) {
  const { topic, page, frontmatter } = context;
  const fromFrontmatter = (frontmatter.related ?? [])
    .map((ref) => {
      const [t, p] = ref.split('/');
      return findPage(t, p);
    })
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const related =
    fromFrontmatter.length > 0
      ? fromFrontmatter
      : topic.pages
          .filter((p) => p !== page)
          .slice(0, 4)
          .map((p) => ({ topic, page: p }));

  return (
    <section className="related" aria-labelledby="related-title">
      <h2 id="related-title" className="related__title">
        Related
      </h2>
      <ul className="topic-card__pages">
        {related.map(({ topic: t, page: p }) => (
          <li key={`${t.slug}/${p.slug}`}>
            <Link to={pagePath(t.slug, p.slug)} className="topic-card__page">
              <span className="topic-card__page-title">{p.title}</span>
              <span className="related__topic">{t.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

type FeedbackState = 'idle' | 'comment' | 'sending' | 'sent' | 'error';

export function PageFeedback({ pageKey }: { pageKey: string }) {
  const [state, setState] = useState<FeedbackState>('idle');
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');

  async function submit(withComment: boolean) {
    if (helpful === null) return;
    setState('sending');
    try {
      await sendFeedback({ page: pageKey, helpful, comment: withComment ? comment : undefined });
      setState('sent');
    } catch {
      setState('error');
    }
  }

  return (
    <section className="feedback" aria-labelledby="feedback-title">
      {state === 'sent' ? (
        <p className="feedback__thanks" role="status">
          Thanks. People and Culture reads every response.
        </p>
      ) : (
        <>
          <h2 id="feedback-title" className="feedback__title">
            Was this page helpful?
          </h2>
          <div className="feedback__choices">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                type="button"
                className={helpful === value ? 'hub-chip is-selected' : 'hub-chip'}
                aria-pressed={helpful === value}
                onClick={() => {
                  setHelpful(value);
                  setState('comment');
                }}
              >
                {value ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
          {(state === 'comment' || state === 'sending' || state === 'error') && (
            <form
              className="feedback__form"
              onSubmit={(e) => {
                e.preventDefault();
                void submit(true);
              }}
            >
              <label htmlFor="feedback-comment">
                {helpful ? 'Anything we could make even clearer? (optional)' : 'What were you looking for? (optional)'}
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                maxLength={2000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="feedback__actions">
                <button type="submit" className="hd-btn hd-btn-primary hd-btn-sm" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Sending' : 'Send'}
                </button>
                <button type="button" className="hd-btn hd-btn-quiet hd-btn-sm" onClick={() => void submit(false)}>
                  Skip
                </button>
              </div>
              {state === 'error' && (
                <p className="feedback__error" role="alert">
                  That didn’t send. Check your connection and try again.
                </p>
              )}
            </form>
          )}
        </>
      )}
    </section>
  );
}
