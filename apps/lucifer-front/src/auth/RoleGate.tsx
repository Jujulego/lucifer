import React, { FC, useEffect } from 'react';

import { Role } from './auth-user';
import { AllowCallback, useNeedRole } from './auth.hooks';

// Types
export interface RoleGateProps {
  /** Required roles */
  roles: Role | Role[];

  /**
   * Overload required roles
   */
  allow?: AllowCallback;

  /**
   * Called when access is refused to the user
   */
  onForbidden?: () => void;
}

// Components
/**
 * Mount children only if user has the required roles.
 */
export const RoleGate: FC<RoleGateProps> = (props) => {
  const {
    roles, allow,
    onForbidden,
    children
  } = props;

  // Auth
  const allowed = useNeedRole(roles, allow);

  // Effects
  useEffect(() => {
    if (allowed === false && onForbidden) onForbidden();
  }, [allowed, onForbidden]);

  // Render
  if (!allowed) return null;

  return <>{ children }</>; // eslint-disable-line react/jsx-no-useless-fragment
};
