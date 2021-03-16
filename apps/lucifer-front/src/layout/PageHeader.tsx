import React, { FC } from 'react';
import { useParams } from 'react-router';

import { Paper, Tabs } from '@material-ui/core';
import { LinkTab } from '@lucifer/react-basics';

import { usePageLayout } from './page-layout.context';

// Component
export const PageHeader: FC = (props) => {
  const { children } = props;

  // Context
  const { routeParameter, defaultTab, tabs } = usePageLayout();

  // Router
  const { [routeParameter]: page = defaultTab } = useParams<Record<string, string>>();

  // Render
  return (
    <Paper square>
      { children }
      { (tabs.length > 0) && (
        <Tabs variant="fullWidth" value={page} onChange={() => null}>
          { tabs.map(({ value, props }) => (
            <LinkTab key={value} {...props} routeParameter={routeParameter} value={value} />
          )) }
        </Tabs>
      ) }
    </Paper>
  );
};
