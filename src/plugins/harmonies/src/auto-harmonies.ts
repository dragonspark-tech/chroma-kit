import type { Color, ColorSpace, CreatedColor } from '../../../foundation';
import { parseColor } from '../../../index';
import {
  getAnalogous,
  getComplementaries,
  getDoubleSplitComplementaries,
  getMonochromatics,
  getSplitComplementaries,
  getSquares,
  getTetradics,
  getTriadics
} from './harmonies';
import type { HSLColor } from '../../../models/hsl';

/**
 * Represents the different types of color harmonies available.
 * Each harmony type creates a different arrangement of colors based on color theory principles.
 */
export type HarmonyType =
  | 'Analogous' // Colors adjacent on the color wheel
  | 'Complementary' // Colors opposite on the color wheel
  | 'SplitComplementary' // Base color and colors adjacent to its complement
  | 'DoubleSplitComplementary' // Analogous colors and their complements
  | 'Square' // Four colors evenly spaced around the color wheel
  | 'Tetradic' // Four colors arranged in two complementary pairs
  | 'Triadic' // Three colors evenly spaced around the color wheel
  | 'Monochromatic'; // Same hue with different lightness values

/**
 * Generates a color harmony based on the specified type.
 *
 * @param color - The base color to generate the harmony from, as a string or Color object
 * @param type - The type of harmony to generate
 * @param outputSpace - The color space to convert the resulting colors to
 * @returns An array of colors in the specified output color space that form the requested harmony
 */
export const harmony = <T extends ColorSpace>(
  color: string | Color,
  type: HarmonyType,
  outputSpace: T
): CreatedColor<T>[] => {
  // Parse the input color to HSL for harmony calculations
  const parsedColor = parseColor(color, 'hsl');

  let hslComplements: HSLColor[];

  // Generate the appropriate harmony based on the requested type
  switch (type) {
    case 'Analogous':
      hslComplements = getAnalogous(parsedColor);
      break;
    case 'Complementary':
      hslComplements = getComplementaries(parsedColor);
      break;
    case 'SplitComplementary':
      hslComplements = getSplitComplementaries(parsedColor);
      break;
    case 'DoubleSplitComplementary':
      hslComplements = getDoubleSplitComplementaries(parsedColor);
      break;
    case 'Square':
      hslComplements = getSquares(parsedColor);
      break;
    case 'Tetradic':
      hslComplements = getTetradics(parsedColor);
      break;
    case 'Triadic':
      hslComplements = getTriadics(parsedColor);
      break;
    case 'Monochromatic':
      hslComplements = getMonochromatics(parsedColor);
      break;
    default:
      throw new Error(`Unknown harmony: ${type}`);
  }

  // Convert all colors to the requested output color space
  return hslComplements.map((c) => c.to(outputSpace));
};
