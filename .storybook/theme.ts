import { createMuiTheme } from '@material-ui/core';
import { amber, blue } from '@material-ui/core/colors';
import { frFR } from '@material-ui/core/locale';

// Themes
function createTheme(dark = false) {
  return createMuiTheme({
    palette: {
      primary: amber,
      secondary: blue,
      type: dark ? 'dark' : 'light',
    },
    props: {
      MuiCardHeader: {
        titleTypographyProps: { variant: "h6" }
      },
      MuiDialog: {
        maxWidth: "xs",
        fullWidth: true
      }
    }
  }, frFR);
}

export default createTheme;
