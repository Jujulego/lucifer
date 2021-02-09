import React, { FC, useCallback, useRef, useState } from 'react';

import { PageLayoutContext, PageTab } from './page-layout.context';

// Properties
export interface PageLayoutProps {
  defaultTab: string;
  routeParameter: string;
}

// Component
export const PageLayout: FC<PageLayoutProps> = (props) => {
  const { defaultTab, routeParameter, children } = props;

  // State
  const [tabs, setTabs] = useState<PageTab[]>([]);

  // Callbacks
  const addTab = useCallback(
    (value: string) => setTabs(old => [...old, { value, props: {} }]),
    [setTabs]
  );

  const updateTab = useCallback(
    (value: string, props: PageTab['props']) => setTabs(
      old => old.map(tab => tab.value === value ? { ...tab, props } : tab)
    ),
    [setTabs]
  );

  const removeTab = useCallback(
    (value: string) => setTabs(old => old.filter(tab => tab.value === value)),
    [setTabs]
  );

  // Refs
  const toolbarContainer = useRef<HTMLDivElement>(null);

  // Render
  return (
    <PageLayoutContext.Provider
      value={{
        toolbarContainer,

        defaultTab, routeParameter,
        tabs, addTab, updateTab, removeTab
      }}
    >
      { children }
    </PageLayoutContext.Provider>
  );
};
