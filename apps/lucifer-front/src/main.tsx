import React from 'react';
import ReactDOM from 'react-dom';
import 'dayjs/locale/fr';

import { CookiesProvider } from 'react-cookie';
import { StylesProvider } from '@material-ui/core';

import App from './app/App';

// Application
ReactDOM.render((
  <StylesProvider injectFirst>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </StylesProvider>
), document.getElementById('root'));
