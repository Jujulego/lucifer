import { createContext, MutableRefObject, useContext } from 'react';

import { LinkTabProps } from '@lucifer/react/basics';

// Types
export interface PageTab {
  value: string;
  props: Omit<LinkTabProps, 'value' | 'routeParameter'>;
}

export interface PageLayoutContextProps {
  toolbarContainer: MutableRefObject<HTMLDivElement | null>;

  routeParameter: string;
  defaultTab: string;
  tabs: PageTab[];
  addTab: (value: string) => void;
  updateTab: (value: string, props: PageTab['props']) => void;
  removeTab: (value: string) => void;
}

// Defaults
const pageLayoutDefaults: PageLayoutContextProps = {
  toolbarContainer: { current: null },

  routeParameter: '',
  defaultTab: '',
  tabs: [],
  addTab: () => null,
  updateTab: () => null,
  removeTab: () => null,
};

// Context
export const PageLayoutContext = createContext(pageLayoutDefaults);

// Hook
export function usePageLayout(): PageLayoutContextProps {
  return useContext(PageLayoutContext);
}
