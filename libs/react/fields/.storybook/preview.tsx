import React from 'react';
import { addDecorator } from '@storybook/react';
import { CssBaseline, StylesProvider, ThemeProvider } from '@material-ui/core';
import 'moment/locale/fr';

import createTheme from '../../../../.storybook/theme';

// Theme
const theme = createTheme(true);

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

// - center stories
addDecorator(story => (
  <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
    <div style={{ margin: 'auto' }}>
      { story() }
    </div>
  </div>
));

// addDecorator(withKnobs);
