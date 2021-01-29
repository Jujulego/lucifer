import React, { FC } from 'react';

import { Portal } from '@material-ui/core';

import { usePageLayout } from './page-layout.context';

// Component
export const PageActions: FC = (props) => {
  const { children } = props;

  // Context
  const { toolbarContainer } = usePageLayout();

  // Render
  return (
    <Portal container={toolbarContainer.current}>
      <span>{ children }</span>
    </Portal>
  );
};
