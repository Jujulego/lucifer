import React, { FC, ReactNode, useEffect } from 'react';

import { AllowCallback, useNeedScope } from '../auth.hooks';

// Types
export interface ScopeGateProps {
  scope: string;
  allow?: AllowCallback;
  onForbidden?: () => void;
}

// Components
/** @deprecated */
const ScopeGate: FC<ScopeGateProps> = (props) => {
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

  return <>{ children }</>; // eslint-disable-line react/jsx-no-useless-fragment
};

export default ScopeGate;
