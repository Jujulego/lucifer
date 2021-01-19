import React from 'react';
import { Switch, useRouteMatch } from 'react-router';

import { RoleRoute } from '../auth/RoleRoute';

import { UserPage } from './UserPage';
import { UserTable } from './UserTable';

// Components
export const UserRouter = () => {
  // Router
  const { path } = useRouteMatch();

  // Render
  return (
    <Switch>
      <RoleRoute
        roles={['admin', 'reader']}
        allow={(user, { id }) => user?.id === id}
        path={[`${path}/:id/:page`, `${path}/:id`]}
      >
        <UserPage />
      </RoleRoute>
      <RoleRoute
        roles={['admin', 'reader']}
        path={path}
        exact
      >
        <UserTable />
      </RoleRoute>
    </Switch>
  );
};
