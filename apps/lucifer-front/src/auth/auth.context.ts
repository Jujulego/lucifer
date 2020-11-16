import { createContext, useContext, useDebugValue } from 'react';
import { PopupLoginOptions, RedirectLoginOptions, LogoutOptions, GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';

import { AuthUser } from './models/user';

// Type
export type AuthContextProps = {
  isLogged: boolean;
  popup: boolean;
  user: AuthUser | null;

  getToken: (options?: GetTokenSilentlyOptions) => Promise<string>;
  loginWithPopup: (options?: PopupLoginOptions) => Promise<void>;
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => Promise<void>;
}

// Defaults
const authDefaults: AuthContextProps = {
  isLogged: false,
  popup: false,
  user: null,

  getToken: async () => '',
  loginWithPopup: async () => {},
  loginWithRedirect: async () => {},
  logout: async () => {},
};

// Context
export const AuthContext = createContext<AuthContextProps>(authDefaults);

// Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  useDebugValue(ctx, ctx => ctx.isLogged ? `logged as ${ctx.user?.name}` : 'not logged');

  return ctx;
}
