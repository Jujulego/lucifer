import axios from 'axios';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions, GetTokenSilentlyOptions, LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions
} from '@auth0/auth0-spa-js';

import { AuthUser } from '../models/user';
import { AuthContext } from '../auth.context';

// Types
export interface AuthGateProps extends Auth0ClientOptions {
  children: ReactNode;
  onRedirectCallback?: (state: any) => void;
}

// Component
const AuthGate = (props: AuthGateProps) => {
  // Props
  const {
    children,
    onRedirectCallback = () => window.history.replaceState({}, document.title, window.location.pathname),
    ...options
  } = props;

  // State
  const [auth0,   setAuth0]   = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [isLogged, setLogged] = useState(false);
  const [popup,   setPopup]   = useState(false);
  const [user,    setUser]    = useState<AuthUser | null>(null);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        // Create client
        const client = await createAuth0Client(options);
        setAuth0(client);

        // Is in callback ?
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          const { appState } = await client.handleRedirectCallback();
          onRedirectCallback(appState);
        }

        // Load state
        const logged = await client.isAuthenticated();
        if (logged) {
          const user = await client.getUser<AuthUser>();

          if (user) {
            setUser({ ...user, id: user.sub });
          }
        }

        setLogged(logged);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!auth0) return;
    if (!isLogged) return;

    // Setup axios interceptor
    const id = axios.interceptors.request.use(async config => {
      const token = await auth0.getTokenSilently();
      config.headers.authorization = `Bearer ${token}`;

      return config;
    });

    return () => axios.interceptors.request.eject(id);
  }, [auth0, isLogged]);

  // Callbacks
  const getToken = useCallback(async (options: GetTokenSilentlyOptions = {}) => {
    if (!auth0) return '';

    return await auth0.getTokenSilently(options);
  }, [auth0]);

  const loginWithPopup = useCallback(async (options: PopupLoginOptions = {}) => {
    if (!auth0) return;
    setPopup(true);

    try {
      // Login
      await auth0.loginWithPopup(options);

      // Update state
      if (await auth0.isAuthenticated()) {
        const user = await auth0.getUser<AuthUser>();

        if (user) {
          setLogged(true);
          setUser({ ...user, id: user.sub });
        }
      } else {
        setLogged(false);
        setUser(null);
      }
    } finally {
      setPopup(false);
    }
  }, [auth0]);

  const loginWithRedirect = useCallback(async (options: RedirectLoginOptions = {}) => {
    if (!auth0) return;

    // Login
    await auth0.loginWithRedirect(options);
  }, [auth0]);

  const logout = useCallback(async (options: LogoutOptions = {}) => {
    if (!auth0) return;

    // Logout
    await auth0.logout(options);

    // Update state
    setLogged(false);
    setUser(null);
  }, [auth0]);

  // Render
  return (
    <AuthContext.Provider
      value={{
        isLogged, popup, user,

        getToken,
        loginWithPopup, loginWithRedirect,
        logout
      }}
    >
      { (!loading) && children }
    </AuthContext.Provider>
  );
};

export default AuthGate;
