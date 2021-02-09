import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';

import { usePageLayout } from './page-layout.context';
import { PageTabContext } from './page-tab.context';

// Types
export interface PageTabProps {
  value: string;
  label: string;
  disabled?: boolean;
  keepMounted?: boolean;
}

// Component
export const PageTab: FC<PageTabProps> =(props) => {
  const {
    value, label, disabled,
    keepMounted,
    children
  } = props;

  // Context
  const { routeParameter, defaultTab, addTab, updateTab, removeTab } = usePageLayout();

  // Router
  const { [routeParameter]: page = defaultTab } = useParams<Record<string, string>>();

  // Effects
  useEffect(() => {
    addTab(value);
    return () => removeTab(value);
  }, [value, addTab, removeTab]);

  useEffect(() => {
    updateTab(value, { label, disabled });
  }, [updateTab, value, label, disabled]);

  // Render
  const open = page === value;

  if (open || keepMounted) {
    return (
      <PageTabContext.Provider value={{ open }}>
        { children }
      </PageTabContext.Provider>
    );
  }

  return null;
}
