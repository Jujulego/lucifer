import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { ProjectsTable } from './ProjectsTable';
import ScopedRoute from '../auth/components/ScopedRoute';
import { ProjectPage } from './ProjectPage';

// Component
export const ProjectsRouter: FC = () => {
  // Router
  const { path } = useRouteMatch();

  // Render
  return (
    <Switch>
      <ScopedRoute
        scope="read:projects" allow={(user, { userId }) => [userId, 'me'].includes(user?.id)}
        path={`${path}/:userId/:id`}
      >
        <ProjectPage />
      </ScopedRoute>
      <Route path={path} exact>
        <ProjectsTable adminId='me' />
      </Route>
    </Switch>
  );
};
