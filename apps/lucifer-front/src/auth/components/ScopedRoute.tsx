import React, { ReactNode, useCallback } from 'react';
import { Route, RouteProps, useHistory } from 'react-router';

import { AuthUser } from '../auth-user';
import ScopeGate from './ScopeGate';

// Types
export type AllowRouteCallback = (user: AuthUser | null, params?: any) => boolean;

export type ScopedRouteProps = Omit<RouteProps, 'render' | 'component' | 'children'> & {
  scope: string;
  allow?: AllowRouteCallback;
  children: ReactNode
}

// Component
/** @deprecated */
const ScopedRoute = (props: ScopedRouteProps) => {
  const { scope, allow, children, ...route } = props;

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
        <ScopeGate
          scope={scope}
          allow={allow && (user => allow(user, match?.params))}
          onForbidden={handleForbidden}
        >
          { children }
        </ScopeGate>
      ) }
    </Route>
  );
};

export default ScopedRoute;
