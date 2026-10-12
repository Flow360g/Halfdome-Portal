import { useCallback, useSyncExternalStore } from 'react';

/*
 * Small, failure-tolerant wrapper around localStorage for per-person
 * conveniences (journey ticks, booked days). Storage can be missing or
 * blocked, so every read and write is guarded and the page works without it.
 */

const EVENT = 'hub-storage';

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable; the change lasts until the page reloads.
  }
  memory.set(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

const memory = new Map<string, string>();

function snapshot(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return raw;
  } catch {
    // fall through to the in-memory copy
  }
  return memory.get(key) ?? null;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** State that lives in localStorage and stays in sync across components and tabs. */
export function useStoredState<T>(key: string, fallback: T): [T, (value: T) => void] {
  const raw = useSyncExternalStore(subscribe, () => snapshot(key), () => null);
  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  const set = useCallback((next: T) => writeStored(key, next), [key]);
  return [value, set];
}
