import type { OKLChColor } from '../../../models/oklch';

/**
 * Represents a Tailwind CSS color palette with predefined shade levels.
 * Each shade level is defined as an `OKLChColor` object, which provides
 * color information based on the OKLCh color space.
 *
 * The palette contains shade levels from 50 to 950, for a total of 11.
 */
export interface TailwindPalette {
  50: OKLChColor;
  100: OKLChColor;
  200: OKLChColor;
  300: OKLChColor;
  400: OKLChColor;
  500: OKLChColor;
  600: OKLChColor;
  700: OKLChColor;
  800: OKLChColor;
  900: OKLChColor;
  950: OKLChColor;
}

/**
 * Represents a Tailwind color palette collection.
 *
 * This type maps palette names (keys as strings) to their corresponding
 * TailwindPalette objects, defining color configurations for use in styling.
 */
export type TailwindPalettes = Record<string, TailwindPalette>;
