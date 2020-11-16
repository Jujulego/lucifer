import { useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';

import { useMediaQuery } from '@material-ui/core';

// Hooks
function useDarkTheme() {
  // Hooks
  const css = useMediaQuery('(prefers-color-scheme: dark)');
  const [cookies, setCookie] = useCookies(['prefersDark']);

  // Compute value
  let { prefersDark } = cookies;
  if (prefersDark === undefined) {
    prefersDark = css ? 'dark' : 'light';
  }

  // Handler
  const setPrefersDark = useCallback((dark: boolean) => {
    setCookie(
      'prefersDark', dark ? 'dark' : 'light',
      { path: '/', maxAge: 2592000 }
    );
  }, [setCookie]);

  return useMemo(() => ({
    prefersDark: prefersDark === 'dark',
    setPrefersDark
  }), [prefersDark, setPrefersDark]);
}

export default useDarkTheme;
