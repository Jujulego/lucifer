import React from 'react';
import { Switch, useRouteMatch } from 'react-router';

import { ScopedRoute } from '../../auth/ScopedRoute';

import UserPage from './UserPage';
import UserTable from './UserTable';

// Components
const UserRouter = () => {
  // Router
  const { path } = useRouteMatch();

  // Render
  return (
    <Switch>
      <ScopedRoute
        scope="read:users" allow={(user, { id }) => user?.id === id}
        path={[`${path}/:id/:page`, `${path}/:id`]}
      >
        <UserPage />
      </ScopedRoute>
      <ScopedRoute scope="read:users" path={path} exact>
        <UserTable />
      </ScopedRoute>
    </Switch>
  );
};

export default UserRouter;
