import React, { FC, useMemo } from 'react';

import { CssBaseline, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import createTheme from 'src/app.theme';
import useDarkTheme from 'src/layout/theme.hooks';

// Component
const App: FC = () => {
  // Theme
  const { prefersDark } = useDarkTheme();
  const theme = useMemo(() => createTheme(prefersDark), [prefersDark]);

  // Rendering
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography>Hello world !</Typography>
    </ThemeProvider>
  );
}

export default App;
