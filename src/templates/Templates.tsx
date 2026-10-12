import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { DocumentLink, WhoToAsk } from '../components/blocks/Blocks';
import { mdxComponents } from '../components/blocks/mdxComponents';
import { topicPath } from '../content/hub';
import type { PageModule } from '../content/pages';
import {
  Breadcrumbs,
  OnThisPage,
  PageFeedback,
  PageHeader,
  PageMeta,
  RelatedPages,
  sourceFor,
  useArticleOutline,
  type PageContext,
} from './PageParts';

interface TemplateProps {
  context: PageContext;
  Content: PageModule['default'];
}

function pageKey({ topic, page }: PageContext) {
  return `${topic.slug}/${page.slug}`;
}

/** What follows every guide and policy: who to ask, the source, related pages, feedback. */
function PageFooter({ context }: { context: PageContext }) {
  const source = sourceFor(context);
  return (
    <div className="page-after">
      <WhoToAsk />
      {source && (
        <div className="page-after__source">
          <p className="page-after__label">The original document</p>
          <DocumentLink source={source} />
        </div>
      )}
      <RelatedPages context={context} />
      <PageFeedback pageKey={pageKey(context)} />
    </div>
  );
}

/** Guides and policies: answer first, then detail, with a contents list alongside. */
function ArticleTemplate({ context, Content, variant }: TemplateProps & { variant: 'guide' | 'policy' }) {
  const articleRef = useRef<HTMLElement>(null);
  const outline = useArticleOutline(articleRef, true);

  return (
    <main id="main" className={`content-page content-page--${variant}`}>
      <PageHeader context={context} minutes={outline.minutes} />
      <div className="container content-layout">
        <div className="content-layout__main">
          <article ref={articleRef} className="prose">
            <Content components={mdxComponents} />
          </article>
          <PageFooter context={context} />
        </div>
        <aside className="content-layout__aside">
          <OnThisPage headings={outline.headings} />
        </aside>
      </div>
    </main>
  );
}

export function GuideTemplate(props: TemplateProps) {
  return <ArticleTemplate {...props} variant="guide" />;
}

export function PolicyTemplate(props: TemplateProps) {
  return <ArticleTemplate {...props} variant="policy" />;
}

/** Story pages: an editorial opener and wide, image-led sections. */
export function StoryTemplate({ context, Content }: TemplateProps) {
  const articleRef = useRef<HTMLElement>(null);
  const outline = useArticleOutline(articleRef, true);
  const { topic, page, frontmatter } = context;

  return (
    <main id="main" className="content-page content-page--story">
      <header className="story-head">
        <div className="container">
          <Breadcrumbs topic={topic} page={page} />
          <p className="hd-eyebrow story-head__eyebrow">
            <Link to={topicPath(topic.slug)}>{topic.title}</Link>
          </p>
          <h1 className="story-head__title">{page.title}</h1>
          <p className="story-head__summary">{frontmatter.summary}</p>
          <PageMeta context={context} minutes={outline.minutes} />
        </div>
      </header>
      <div className="container">
        <article ref={articleRef} className="prose prose--story">
          <Content components={mdxComponents} />
        </article>
        <div className="page-after page-after--story">
          <RelatedPages context={context} />
          <PageFeedback pageKey={pageKey(context)} />
        </div>
      </div>
    </main>
  );
}

/** The new starter journey: the checklist is the page. */
export function JourneyTemplate({ context, Content }: TemplateProps) {
  const articleRef = useRef<HTMLElement>(null);
  const outline = useArticleOutline(articleRef, true);

  return (
    <main id="main" className="content-page content-page--journey">
      <PageHeader context={context} minutes={outline.minutes} />
      <div className="container content-layout content-layout--single">
        <div className="content-layout__main">
          <article ref={articleRef} className="prose prose--journey">
            <Content components={mdxComponents} />
          </article>
          <PageFooter context={context} />
        </div>
      </div>
    </main>
  );
}
