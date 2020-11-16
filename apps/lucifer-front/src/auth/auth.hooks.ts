import { GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
import { useState, useEffect } from 'react';

import useAPI from 'src/basics/api.hooks';

import { AuthUser } from './models/user';
import { useAuth } from './auth.context';

// Types
export type AllowCallback = (user: AuthUser | null) => boolean;

// Namespace
export const useAuthAPI = {
  permissions: () => useAPI.get<string[]>('/api/auth/permissions')
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

export function usePermissions() {
  const { data: permissions, loading, reload } = useAuthAPI.permissions();

  return {
    permissions, loading,
    reload
  };
}

export function useNeedScope(scope: string, allow?: AllowCallback): boolean | null {
  // Auth
  const { user } = useAuth();
  const { permissions = [], loading } = usePermissions();

  // Allow
  if (loading) return null;
  if (allow && allow(user)) return true;
  return permissions.includes(scope);
}
