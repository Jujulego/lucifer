import { GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
import { useState, useEffect } from 'react';

import { useAPI } from '@lucifer/react/api';
import { env } from '../environments/environment';

import { AuthUser, Role, ROLES } from './auth-user';
import { useAuth } from './auth.context';

// Types
export type AllowCallback = (user: AuthUser | null) => boolean;

// Namespace
export const useAuthAPI = {
  permissions: (load = true) => useAPI.get<string[]>(`${env.apiUrl}/api/auth/permissions`, undefined, { load })
};

// Hooks
export function useAuthToken(options?: GetTokenSilentlyOptions): string {
  // State
  const [token, setToken] = useState('');

  // Auth
  const { getToken } = useAuth();

  // Effect
  useEffect(() => {
    (async () => {
      setToken(await getToken(options));
    })();
  }, [getToken, options]);

  return token;
}

/** @deprecated */
export function useNeedScope(scope: string, allow?: AllowCallback): boolean | null {
  // Auth
  const { user, permissions } = useAuth();

  // Allow
  if (!permissions) return null;
  if (allow && allow(user)) return true;
  return permissions.includes(scope);
}

export function useNeedRole(role: Role, allow?: AllowCallback): boolean | null {
  // Auth
  const { user } = useAuth();

  // Allow
  if (!user) return null;
  if (allow && allow(user)) return true;
  return user[ROLES].includes(role);
}
