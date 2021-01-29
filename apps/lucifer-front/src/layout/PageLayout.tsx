import React, { FC, useRef } from 'react';

import { PageLayoutContext } from './page-layout.context';

// Component
export const PageLayout: FC = (props) => {
  const { children } = props;

  // Refs
  const toolbarContainer = useRef<HTMLDivElement>(null);

  // Render
  return (
    <PageLayoutContext.Provider
      value={{ toolbarContainer }}
    >
      { children }
    </PageLayoutContext.Provider>
  );
};
