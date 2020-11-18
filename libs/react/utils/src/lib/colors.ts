import { lighten, darken } from '@material-ui/core/styles';
import { Palette } from '@material-ui/core/styles/createPalette';

// Constant
const COEFF = 0.09;

// Utils
export function background(palette: Palette, level: number) {
  if (palette.type === "light" && level > 0) {
    return darken(palette.background.default, level * COEFF);
  } else {
    return lighten(palette.background.default, level * COEFF);
  }
}
