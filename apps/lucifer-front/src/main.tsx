import React from 'react';
import ReactDOM from 'react-dom';

import { CookiesProvider } from 'react-cookie';
import { StylesProvider } from '@material-ui/core';

import App from './app/App';

// Application
ReactDOM.render((
  <React.StrictMode>
    <StylesProvider injectFirst>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </StylesProvider>
  </React.StrictMode>
), document.getElementById('root'));
