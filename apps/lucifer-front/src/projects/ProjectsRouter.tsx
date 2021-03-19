import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

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
      <Route path={[`${path}/:id/:page`, `${path}/:id`]}>
        <ProjectPage />
      </Route>
      <Route path={path} exact>
        { user && (
          <ProjectsTable adminId={user.sub} />
        ) }
      </Route>
    </Switch>
  );
};
