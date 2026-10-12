import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const query = '(prefers-color-scheme: dark)';

function read(): Theme {
  const pinned = document.documentElement.getAttribute('data-theme');
  if (pinned === 'light' || pinned === 'dark') return pinned;
  return window.matchMedia(query).matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    media.removeEventListener('change', onChange);
    observer.disconnect();
  };
}

/**
 * The theme the page is showing: a pinned data-theme on <html> wins, otherwise
 * the OS setting. Brand marks use it to pick the right colourway.
 */
export function useResolvedTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'light');
}
