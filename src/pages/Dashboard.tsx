import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import hero from '../assets/brand/hero-watering-can.webp';
import { HubSearch } from '../components/HubSearch';
import { NewStarterCard } from '../components/NewStarterCard';
import { QuickLinks } from '../components/QuickLinks';
import { TopicCard } from '../components/TopicCard';
import { pageCount, topics } from '../content/hub';
import { searchPages } from '../content/search';

export function Dashboard() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const topicsRef = useRef<HTMLElement>(null);

  const results = useMemo(() => searchPages(query), [query]);
  const searching = query.trim().length > 0;

  // While searching, each topic shows only its matching pages.
  const visible = useMemo(() => {
    if (!searching) return topics.map((topic) => ({ topic, pages: topic.pages }));
    return topics
      .map((topic) => ({
        topic,
        pages: topic.pages.filter((page) => results.some((r) => r.page === page)),
      }))
      .filter((entry) => entry.pages.length > 0);
  }, [searching, results]);

  function setQuery(next: string) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (next) updated.set('q', next);
        else updated.delete('q');
        return updated;
      },
      { replace: true },
    );
  }

  return (
    <main id="main">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hd-eyebrow">People and Culture</p>
            <h1 className="hero__title">
              How we work, <em>grow</em> and look after each other.
            </h1>
            <p className="hd-intro hero__intro">
              Policies, pay, leave, learning and the way we do things, all in one place. Search for what you need or
              browse every topic below.
            </p>
            <HubSearch
              query={query}
              results={results}
              onQueryChange={setQuery}
              onShowAll={() => topicsRef.current?.scrollIntoView({ block: 'start' })}
            />
          </div>
          <div className="hero__art">
            <img src={hero} alt="" aria-hidden="true" width={440} height={501} />
          </div>
        </div>
      </section>

      <div className="container shortcuts">
        <QuickLinks />
        <NewStarterCard />
      </div>

      <section className="container topics" id="topics" ref={topicsRef} aria-labelledby="topics-title">
        <header className="topics__head">
          <div className="section-head">
            <p className="hd-eyebrow">Browse</p>
            <h2 id="topics-title" className="hd-h2">
              {searching ? 'Search results' : 'Every topic, in one place'}
            </h2>
          </div>
          <p className="topics__summary" role="status">
            {searching ? (
              <>
                {results.length === 0
                  ? 'No pages match '
                  : `${results.length} ${results.length === 1 ? 'page matches' : 'pages match'} `}
                <strong>“{query.trim()}”</strong>
                <button type="button" className="hd-btn hd-btn-quiet topics__clear" onClick={() => setQuery('')}>
                  Clear search
                </button>
              </>
            ) : (
              `${topics.length} topics and ${pageCount} pages, from your first day to your next promotion.`
            )}
          </p>
        </header>

        {visible.length > 0 ? (
          <div className="topics__grid">
            {visible.map(({ topic, pages }) => (
              <TopicCard key={topic.slug} topic={topic} pages={pages} />
            ))}
          </div>
        ) : (
          <div className="topics__empty">
            <p className="hd-h3">Nothing here yet.</p>
            <p>
              Try a shorter word, check the spelling or browse all topics. If it should be here, let People and Culture
              know.
            </p>
            <button type="button" className="hd-btn hd-btn-secondary" onClick={() => setQuery('')}>
              Show all topics
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
