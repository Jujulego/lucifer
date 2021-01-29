import React, { FC } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Tab, TabProps } from '@material-ui/core';

// Types
export interface LinkTabProps extends Omit<TabProps<RouterLink>, 'to' | 'value'> {
  routeParameter: string;
  value: string;
}

// Component
export const LinkTab: FC<LinkTabProps> = (props) => {
  const {
    routeParameter,
    children,
    ...tab
  } = props;

  // Router
  const { url } = useRouteMatch();
  const { [routeParameter]: page } = useParams<Record<string, string>>();

  // Render
  return (
    <Tab {...tab}
      component={RouterLink}
      to={page ? url.replace(page, tab.value) : `${url}/${tab.value}`}
    >
      { children }
    </Tab>
  )
}
