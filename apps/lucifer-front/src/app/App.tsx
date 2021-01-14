import React, { FC, useMemo } from 'react';
import { Route, Router, Switch } from 'react-router';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { ApiCache } from '@lucifer/react/api';

import history from '../app.history';
import createTheme from '../app.theme';
import { env } from '../environments/environment';

import { AuthGate } from '../auth/AuthGate';
import { AutoLogin } from '../auth/AutoLogin';
import useDarkTheme from '../layout/theme.hooks';
import CatchErrors from '../snack/components/CatchErrors';
import AppBar from '../layout/components/AppBar';
import { ProjectsRouter } from '../projects/ProjectsRouter';
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
            domain={env.auth0.domain}
            client_id={env.auth0.clientId}
            audience={env.auth0.audience}
            redirect_uri={window.location.origin}
            cacheLocation={env.e2e ? 'localstorage' : undefined}
            onRedirectCallback={state => history.push(state?.targetUrl || window.location.pathname)}
          >
            { env.e2e || <AutoLogin /> }
            <ApiCache>
              <AppBar>
                <Switch>
                  <Route path='/projects' component={ProjectsRouter} />
                  <Route path='/users' component={UserRouter} />
                  <Route component={Home} />
                </Switch>
              </AppBar>
            </ApiCache>
          </AuthGate>
        </Router>
      </CatchErrors>
    </ThemeProvider>
  );
}

export default App;
