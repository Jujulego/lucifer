import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';
import 'moment/locale/fr';

import { CssBaseline, StylesProvider, ThemeProvider } from '@material-ui/core';

import createTheme from './theme';

// Theme
const theme = createTheme(true);

// Parameters
addParameters({
  docs: {
    theme: themes.dark
  }
});

// Decorator
// - material-ui setup
addDecorator(story => (
  <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { story() }
    </ThemeProvider>
  </StylesProvider>
));
