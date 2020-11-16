import React, { ReactNode, useEffect } from 'react';

import { AllowCallback, useNeedScope } from '../auth.hooks';

// Types
export interface ScopeGateProps {
  scope: string;
  allow?: AllowCallback;
  onForbidden?: () => void;
  children: ReactNode;
}

// Components
const ScopeGate = (props: ScopeGateProps) => {
  const {
    scope, allow,
    onForbidden,
    children
  } = props;

  // Auth
  const allowed = useNeedScope(scope, allow);

  // Effects
  useEffect(() => {
    if (allowed === false && onForbidden) onForbidden();
  }, [allowed, onForbidden]);

  // Render
  if (!allowed) return null;

  return <>{ children }</>;
};

export default ScopeGate;
