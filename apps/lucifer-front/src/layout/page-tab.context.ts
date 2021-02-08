import { createContext, useContext } from 'react';

// Types
export interface PageTabContextProps {
  open: boolean;
}

// Defaults
const pageTabDefaults: PageTabContextProps = {
  open: true,
};

// Context
export const PageTabContext = createContext(pageTabDefaults);

// Hook
export function usePageTab(): PageTabContextProps {
  return useContext(PageTabContext);
}
