import type { OKLChColor } from '../../../models/oklch';

export interface RadixShade {
  light: OKLChColor;
  dark: OKLChColor;
  lightAlpha: OKLChColor;
  darkAlpha: OKLChColor;
}

export interface RadixPalette {
  1: RadixShade;
  2: RadixShade;
  3: RadixShade;
  4: RadixShade;
  5: RadixShade;
  6: RadixShade;
  7: RadixShade;
  8: RadixShade;
  9: RadixShade;
  10: RadixShade;
  11: RadixShade;
  12: RadixShade;
}
