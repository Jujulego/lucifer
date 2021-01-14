import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { ScopedRoute } from '../auth/ScopedRoute';
import { useAuth } from '../auth/auth.context';

import { ProjectPage } from './ProjectPage';
import { ProjectsTable } from './ProjectsTable';

// Component
export const ProjectsRouter: FC = () => {
  // Router
  const { path } = useRouteMatch();

  // Auth
  const { user } = useAuth();

  // Render
  return (
    <Switch>
      <ScopedRoute
        scope="read:projects" allow={(user, { userId }) => userId === user?.id}
        path={`${path}/:userId/:id`}
      >
        <ProjectPage />
      </ScopedRoute>
      <Route path={path} exact>
        { user && (
          <ProjectsTable adminId={user.sub} />
        ) }
      </Route>
    </Switch>
  );
};
