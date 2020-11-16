import React from 'react';
import {
  Redirect, Route, RouteProps,
  useLocation
} from 'react-router';

import { useAuth } from '../auth.context';

// Types
export type PrivateRouteProps = RouteProps;

// Component
const PrivateRoute = (props: PrivateRouteProps) => {
  // Router
  const location = useLocation();

  // Auth
  const { isLogged } = useAuth();

  // Render
  if (!isLogged) {
    return <Redirect to={{ pathname: "/", state: { from: location }}} />;
  }

  return <Route {...props} />;
};

export default PrivateRoute;
