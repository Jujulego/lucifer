import { GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
import { useState, useEffect } from 'react';

import { RoleName } from '@lucifer/types';
import { AuthUser, ROLES_KEY } from './auth-user';
import { useAuth } from './auth.context';

// Types
/**
 * @param user Current user
 * @returns true to allow user, false in other cases
 */
export type AllowCallback = (user: AuthUser | null) => boolean;

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

/**
 * Test if current user as the needed roles to access resources
 * @param roles Needed roles
 * @param allow Overload roles. If it returns true, the user will be allowed even if it doesn't have the needed roles
 */
export function useNeedRole(roles: RoleName | RoleName[], allow?: AllowCallback): boolean | null {
  // Auth
  const { user } = useAuth();

  // Allow
  if (!user) return null;
  if (allow && allow(user)) return true;

  if (typeof roles === 'string') roles = [roles];
  return roles.some(role => user[ROLES_KEY].includes(role));
}
