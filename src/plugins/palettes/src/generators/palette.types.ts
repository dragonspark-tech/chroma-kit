import { type OKLChColor } from '../../../../models/oklch';

/**
 * Represents a single shade in a color palette, containing information about its color properties.
 *
 * @property {number} number - The numerical identifier for the shade in the palette.
 * @property {boolean} isBase - Indicates if this shade is the base color of the palette.
 * @property {OKLChColor} color - The color object represented in the OKLCh color space.
 * @property {string} rgb - The RGB representation of the color in string format.
 * @property {string} hsl - The HSL (Hue, Saturation, Lightness) representation of the color in string format.
 * @property {string} oklch - The OKLCh string representation of the color.
 * @property {string} chromakit - A string representation compatible with the Chromakit format.
 */
export interface ColorPaletteShade {
  number: number;
  isBase: boolean;

  color: OKLChColor;

  rgb: string;
  oklch: string;
  chromakit: string;
}

/**
 * Represents a color palette with predefined shades.
 *
 * Each shade is represented by a numeric key ranging from 50 to 950, where
 * higher numbers typically represent darker or more saturated colors.
 *
 * The `arrayValues` property provides an array containing all shade values
 * for the palette in a sequential order.
 */
export interface TailwindColorPalette {
  50: ColorPaletteShade;
  100: ColorPaletteShade;
  200: ColorPaletteShade;
  300: ColorPaletteShade;
  400: ColorPaletteShade;
  500: ColorPaletteShade;
  600: ColorPaletteShade;
  700: ColorPaletteShade;
  800: ColorPaletteShade;
  900: ColorPaletteShade;
  950: ColorPaletteShade;

  arrayValues: ColorPaletteShade[];
}

export interface RadixColorPalette {
  1: ColorPaletteShade;
  2: ColorPaletteShade;
  3: ColorPaletteShade;
  4: ColorPaletteShade;
  5: ColorPaletteShade;
  6: ColorPaletteShade;
  7: ColorPaletteShade;
  8: ColorPaletteShade;
  9: ColorPaletteShade;
  10: ColorPaletteShade;
  11: ColorPaletteShade;
  12: ColorPaletteShade;

  arrayValues: ColorPaletteShade[];
}

export interface RadixColorFamily {
  light: RadixColorPalette;
  dark: RadixColorPalette;
  lightAlpha: RadixColorPalette;
  darkAlpha: RadixColorPalette;
}
