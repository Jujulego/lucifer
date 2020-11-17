import React, { FC, useMemo } from 'react';
import { Route, Router, Switch } from 'react-router';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import history from '../app.history';
import createTheme from '../app.theme';
import authConfig from '../configs/auth';

import { Cache } from '../basics/components';
import AuthGate from '../auth/components/AuthGate';
import AutoLogin from '../auth/components/AutoLogin';
import useDarkTheme from '../layout/theme.hooks';
import CatchErrors from '../snack/components/CatchErrors';
import AppBar from '../layout/components/AppBar';
import UserRouter from '../users/components/UserRouter';
import Home from './Home';

// Component
const App: FC = () => {
  // Theme
  const { prefersDark } = useDarkTheme();
  const theme = useMemo(() => createTheme(prefersDark), [prefersDark]);

  // Rendering
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CatchErrors>
        <Router history={history}>
          <AuthGate
            domain={authConfig.domain}
            client_id={authConfig.clientId}
            audience={authConfig.audience}
            redirect_uri={window.location.origin}
            onRedirectCallback={state => history.push(state?.targetUrl || window.location.pathname)}
          >
            <AutoLogin />
            <Cache>
              <AppBar>
                <Switch>
                  <Route path='/users' component={UserRouter} />
                  <Route component={Home} />
                </Switch>
              </AppBar>
            </Cache>
          </AuthGate>
        </Router>
      </CatchErrors>
    </ThemeProvider>
  );
}

export default App;
