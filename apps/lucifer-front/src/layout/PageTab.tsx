import React, { FC, ReactNode, useEffect } from 'react';

import { usePageLayout } from './page-layout.context';
import { useParams } from 'react-router';

// Types
export interface PageTabProps {
  value: string;
  label: string;
  disabled?: boolean;

  children: (show: boolean) => ReactNode;
}

// Component
export const PageTab: FC<PageTabProps> = (props) => {
  const {
    value, label, disabled,
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
  return <>{ children(page === value) }</>;
}
