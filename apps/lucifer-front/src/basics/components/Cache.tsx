import React, { ReactNode, useCallback, useState } from 'react';

import { CacheContext, CacheState } from '../cache.context';

// Types
interface State {
  [id: string]: CacheState
}

export interface CacheProps {
  children?: ReactNode
}

// Component
const Cache = (props: CacheProps) => {
  const { children } = props;

  // State
  const [cache, setCache] = useState<State>({});

  // Callbacks
  const set = useCallback((id: string, data: unknown) => {
    setCache(old => ({ ...old, [id]: { data } }))
  }, [setCache]);

  // Render
  return (
    <CacheContext.Provider
      value={{ cache, setCache: set }}
    >
      { children }
    </CacheContext.Provider>
  );
};

export default Cache;
