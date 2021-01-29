import { createContext, MutableRefObject, useContext } from 'react';

// Types
export interface PageLayoutContextProps {
  toolbarContainer: MutableRefObject<HTMLDivElement | null>
}

// Defaults
const pageLayoutDefaults: PageLayoutContextProps = {
  toolbarContainer: { current: null }
};

// Context
export const PageLayoutContext = createContext(pageLayoutDefaults);

// Hook
export function usePageLayout(): PageLayoutContextProps {
  return useContext(PageLayoutContext);
}
