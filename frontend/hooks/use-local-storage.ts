'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const LOCAL_STORAGE_CHANGE_EVENT = 'flowbase:local-storage-change';

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener('storage', onStoreChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, onStoreChange);

    return () => {
      window.removeEventListener('storage', onStoreChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);
  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const value = useMemo(() => {
    if (storedValue === null) return initial;

    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return initial;
    }
  }, [storedValue, initial]);

  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      let current = initial;

      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) current = JSON.parse(item) as T;
      } catch {
        // Use the initial value if localStorage cannot be read.
      }

      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(current)
          : next;

      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Ignore storage quota and access errors.
      }

      window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGE_EVENT));
    },
    [key, initial],
  );

  return [value, update, hydrated];
}
