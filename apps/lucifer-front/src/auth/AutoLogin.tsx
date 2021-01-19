import { RedirectLoginOptions } from '@auth0/auth0-spa-js';
import { useEffect } from 'react';

import { useAuth } from './auth.context';

// Types
export type AutoLoginProps = RedirectLoginOptions;

// Component
export const AutoLogin = (props: AutoLoginProps) => {
  // Auth
  const { isLogged, loginWithRedirect } = useAuth();

  // Effects
  useEffect(() => {
    (async () => {
      if (!isLogged) {
        await loginWithRedirect(props);
      }
    })();
  }, [isLogged, loginWithRedirect]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
