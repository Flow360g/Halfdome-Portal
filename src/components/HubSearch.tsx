import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KIND_LABEL, pageCount, pagePath, popularSearches } from '../content/hub';
import type { SearchResult } from '../content/search';
import { askHubConfigured } from '../lib/askHub';
import { useAskHub } from './AskHub';

const MAX_SUGGESTIONS = 6;

interface HubSearchProps {
  query: string;
  results: SearchResult[];
  onQueryChange: (query: string) => void;
  /** Called when someone asks to see every result in the topic grid. */
  onShowAll: () => void;
}

/** The hero search: a combobox that suggests pages as you type. */
export function HubSearch({ query, results, onQueryChange, onShowAll }: HubSearchProps) {
  const navigate = useNavigate();
  const { open: openAsk } = useAskHub();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = results.slice(0, MAX_SUGGESTIONS);
  const hasQuery = query.trim().length > 0;
  const expanded = open && hasQuery;

  // Press "/" anywhere to jump to search.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setActive(-1), [query]);

  function go(result: SearchResult) {
    setOpen(false);
    navigate(pagePath(result.topic.slug, result.page.slug));
  }

  function showAll() {
    setOpen(false);
    onShowAll();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (active >= 0 && suggestions[active]) go(suggestions[active]);
      else if (hasQuery) showAll();
    } else if (event.key === 'Escape') {
      if (expanded) setOpen(false);
      else onQueryChange('');
    }
  }

  return (
    <div className="hub-search">
      <form className="hub-search__form" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="hub-search-input" className="visually-hidden">
          Search the people hub
        </label>
        <svg className="hub-search__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
        <input
          ref={inputRef}
          id="hub-search-input"
          className="hub-search__input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder={`Search all ${pageCount} pages`}
          value={query}
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <kbd className="hub-search__hint" aria-hidden="true">
          /
        </kbd>
      </form>

      <div className="hub-search__panel" hidden={!expanded}>
        {suggestions.length > 0 ? (
          <>
            <ul id={listId} role="listbox" aria-label="Suggested pages" className="hub-search__list">
              {suggestions.map((result, index) => (
                <li
                  key={`${result.topic.slug}/${result.page.slug}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className="hub-search__option"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(result)}
                >
                  <span className="hub-search__option-title">{result.page.title}</span>
                  <span className="hub-search__option-meta">
                    {result.topic.title}
                    {result.page.kind !== 'guide' && ` · ${KIND_LABEL[result.page.kind]}`}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="hub-search__all"
              onMouseDown={(e) => e.preventDefault()}
              onClick={showAll}
            >
              {results.length === 1 ? 'Show this result in topics' : `Show all ${results.length} results in topics`}
            </button>
          </>
        ) : (
          <p id={listId} className="hub-search__empty" role="status">
            Nothing matches “{query.trim()}” yet. Try another word{askHubConfigured ? ', or ask the hub in your own words' : ', or ask People and Culture'}.
          </p>
        )}
      </div>

      {askHubConfigured && (
        <button type="button" className="hub-search__ask" onClick={() => openAsk(query)}>
          <span>Or ask the hub a question in your own words</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </button>
      )}

      <div className="hub-search__popular">
        <span className="hub-search__popular-label">Popular</span>
        <ul>
          {popularSearches.map((term) => (
            <li key={term}>
              <button
                type="button"
                className="hub-chip"
                onClick={() => {
                  onQueryChange(term);
                  setOpen(true);
                  inputRef.current?.focus();
                }}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
