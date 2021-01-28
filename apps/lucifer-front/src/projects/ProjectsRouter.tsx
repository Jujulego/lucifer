import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { useAuth } from '../auth/auth.context';
import { RoleRoute } from '../auth/RoleRoute';

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
      <RoleRoute
        roles={['admin', 'reader']}
        allow={(user, { userId }) => userId === user?.id}
        path={[`${path}/:userId/:id/:page`, `${path}/:userId/:id`]}
      >
        <ProjectPage />
      </RoleRoute>
      <Route path={path} exact>
        { user && (
          <ProjectsTable adminId={user.sub} />
        ) }
      </Route>
    </Switch>
  );
};
