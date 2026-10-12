import { Children, isValidElement, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import dome from '../../assets/brand/dome-red.webp';
import domeGold from '../../assets/brand/dome-green.webp';
import { pagePath } from '../../content/hub';
import { sources, sourceUrl, type SourceKey } from '../../content/sources';
import { useResolvedTheme } from '../../hooks/useResolvedTheme';
import { formatMonth } from '../../lib/dates';

/*
 * The building blocks page authors use inside MDX. Each one is a plain
 * component, so a page reads like a document with a few tags in it.
 */

/** The answer most people came for, at the top of the page. */
export function ShortVersion({ title = 'The short version', children }: { title?: string; children: ReactNode }) {
  return (
    <section className="block-short" aria-label={title}>
      <p className="block-short__label">{title}</p>
      <div className="block-short__body">{children}</div>
    </section>
  );
}

/** The policy version of the short version. */
export function AtAGlance({ children }: { children: ReactNode }) {
  return <ShortVersion title="At a glance">{children}</ShortVersion>;
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'important';
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={`block-callout block-callout--${tone}`}>
      {title && <p className="block-callout__title">{title}</p>}
      <div className="block-callout__body">{children}</div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children).filter(isValidElement);
  return (
    <ol className="block-steps">
      {steps.map((step, index) => (
        <li key={index} className="block-steps__item">
          <span className="block-steps__number" aria-hidden="true">
            {index + 1}
          </span>
          <div className="block-steps__content">{step}</div>
        </li>
      ))}
    </ol>
  );
}

export function Step({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <>
      <p className="block-steps__title">{title}</p>
      {children && <div className="block-steps__body">{children}</div>}
    </>
  );
}

export function Faq({ children }: { children: ReactNode }) {
  return <div className="block-faq">{children}</div>;
}

export function Question({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="block-faq__item">
      <summary>
        <span>{q}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="block-faq__answer">{children}</div>
    </details>
  );
}

export function KeyNumbers({ children }: { children: ReactNode }) {
  return <div className="block-numbers">{children}</div>;
}

export function KeyNumber({
  value,
  label,
  note,
  emphasis = false,
}: {
  value: string;
  label: string;
  note?: string;
  emphasis?: boolean;
}) {
  return (
    <div className={emphasis ? 'hd-stat hd-stat-emphasis block-number' : 'hd-stat block-number'}>
      <p className="hd-stat-label">{label}</p>
      <p className="hd-stat-value">{value}</p>
      {note && <p className="block-number__note">{note}</p>}
    </div>
  );
}

export function Timeline({ children }: { children: ReactNode }) {
  return <ol className="block-timeline">{children}</ol>;
}

export function TimelineItem({ when, title, children }: { when: string; title: string; children?: ReactNode }) {
  return (
    <li className="block-timeline__item">
      <p className="block-timeline__when">{when}</p>
      <p className="block-timeline__title">{title}</p>
      {children && <div className="block-timeline__body">{children}</div>}
    </li>
  );
}

/** Who to talk to. Defaults to the People and Culture team. */
export function WhoToAsk({
  name = 'People and Culture',
  role = 'Here for questions big and small',
  children,
}: {
  name?: string;
  role?: string;
  children?: ReactNode;
}) {
  const theme = useResolvedTheme();
  return (
    <aside className="block-ask" aria-label="Who to ask">
      <span className="block-ask__avatar" aria-hidden="true">
        <img src={theme === 'dark' ? domeGold : dome} alt="" width={40} height={20} />
      </span>
      <div className="block-ask__text">
        <p className="block-ask__label">Who to ask</p>
        <p className="block-ask__name">{name}</p>
        <p className="block-ask__role">{children ?? role}</p>
      </div>
      <Link to={pagePath('our-team', 'who-to-ask-for-what')} className="hd-btn hd-btn-secondary hd-btn-sm">
        Get in touch
      </Link>
    </aside>
  );
}

/** A link to the original document in SharePoint. */
export function DocumentLink({ source }: { source: SourceKey }) {
  const doc = sources[source];
  const format = doc.url.endsWith('.pdf') ? 'PDF' : 'PowerPoint';
  return (
    <a className="block-doc" href={sourceUrl(source)} target="_blank" rel="noreferrer">
      <span className="block-doc__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M14 3v5h5" />
        </svg>
      </span>
      <span className="block-doc__text">
        <span className="block-doc__title">{doc.label}</span>
        <span className="block-doc__meta">
          {doc.kind} · {format} in SharePoint · reviewed {formatMonth(doc.reviewed)}
        </span>
      </span>
      <svg className="block-doc__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

export function Statement({ colour = 'red', children }: { colour?: 'red' | 'ink'; children: string }) {
  return <p className={`hd-statement block-statement hd-tone-${colour}`}>{children}</p>;
}

export function Quote({ by, children }: { by?: string; children: ReactNode }) {
  return (
    <figure className="hd-quote block-quote">
      <blockquote>{children}</blockquote>
      {by && <figcaption>{by}</figcaption>}
    </figure>
  );
}

/** One section of the full policy wording, closed until someone opens it. */
export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="block-policy">
      <summary>
        <span>{title}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="block-policy__body">{children}</div>
    </details>
  );
}
