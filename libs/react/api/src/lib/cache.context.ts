import { createContext, useCallback, useContext } from 'react';

// Types
export interface CacheState<R> {
  data?: R;
}

export interface CacheContextProps {
  cache: { [id: string]: CacheState<unknown>; };
  setCache: (id: string, data: unknown) => void;
}

export interface CacheProps<R> extends CacheState<R> {
  setCache: (data: R) => void;
}

// Defaults
const cacheDefaults: CacheContextProps = {
  cache: {},
  setCache: (id) => console.warn(`Trying to use uninitialized CacheContext (id: ${id})`)
};

// Context
export const CacheContext = createContext(cacheDefaults);

// Hook
export function useCache<R = unknown>(id: string): CacheProps<R> {
  const { cache, setCache } = useContext(CacheContext);

  return {
    ...cache[id],
    setCache: useCallback((data: R) => setCache(id, data), [setCache, id]) // eslint-disable-line react-hooks/exhaustive-deps
  } as CacheProps<R>;
}
