import React, { ReactNode, useCallback } from 'react';
import { Route, RouteProps, useHistory } from 'react-router';

import { AuthUser, Role } from './auth-user';
import { RoleGate } from './RoleGate';

// Types
export type AllowRouteCallback = (user: AuthUser | null, params?: any) => boolean;

export type RoleRouteProps = Omit<RouteProps, 'render' | 'component' | 'children'> & {
  roles: Role | Role[];
  allow?: AllowRouteCallback;
  children: ReactNode
}

// Component
/**
 * When navigated to it, this route test if user has needed roles, else redirect to home
 */
export const RoleRoute = (props: RoleRouteProps) => {
  const { roles, allow, children, ...route } = props;

  // Router
  const history = useHistory();

  // Callbacks
  const handleForbidden = useCallback(() => {
    history.replace('/');
  }, [history]);

  // Render
  return (
    <Route {...route}>
      { ({ match }) => (
        <RoleGate
          roles={roles}
          allow={allow && (user => allow(user, match?.params))}
          onForbidden={handleForbidden}
        >
          { children }
        </RoleGate>
      ) }
    </Route>
  );
};
