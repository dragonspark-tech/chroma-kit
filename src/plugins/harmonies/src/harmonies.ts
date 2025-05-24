import { hsl, HSLColor } from '../../../models/hsl';
import {
  ANALOGOUS_HUESHIFT,
  COMPLEMENTARY_HUESHIFT,
  DOUBLE_SPLIT_COMPLEMENTARY_HUESHIFT,
  SPLIT_COMPLEMENTARY_HUESHIFT,
  SQUARE_HUESHIFT,
  TETRADIC_HUESHIFT,
  TRIADIC_HUESHIFT
} from './constants';

/**
 * Builds a color harmony by applying a series of hue shifts to a base color.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @param shiftMap - An array of hue shift values to apply to the base color
 * @returns An array of HSL colors representing the harmony
 */
export const buildHarmony = <T extends readonly number[]>(
  baseColor: HSLColor,
  shiftMap: T
): HSLColor[] => shiftMap.map((shift) => baseColor.shiftHue(shift));

/**
 * Generates an analogous color harmony from a base color.
 * Analogous colors are adjacent to each other on the color wheel.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in an analogous relationship
 */
export const getAnalogous = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, ANALOGOUS_HUESHIFT);

/**
 * Generates a complementary color harmony from a base color.
 * Complementary colors are opposite each other on the color wheel.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in a complementary relationship
 */
export const getComplementaries = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, COMPLEMENTARY_HUESHIFT);

/**
 * Generates a split complementary color harmony from a base color.
 * Split complementary uses a base color and colors adjacent to its complement.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in a split complementary relationship
 */
export const getSplitComplementaries = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, SPLIT_COMPLEMENTARY_HUESHIFT);

/**
 * Generates a double split complementary color harmony from a base color.
 * Double split complementary uses analogous colors and their complements.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in a double split complementary relationship
 */
export const getDoubleSplitComplementaries = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, DOUBLE_SPLIT_COMPLEMENTARY_HUESHIFT);

/**
 * Generates a square color harmony from a base color.
 * Square harmony uses four colors evenly spaced around the color wheel.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in a square relationship
 */
export const getSquares = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, SQUARE_HUESHIFT);

/**
 * Generates a tetradic color harmony from a base color.
 * Tetradic harmony uses four colors arranged in two complementary pairs.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in a tetradic relationship
 */
export const getTetradics = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, TETRADIC_HUESHIFT);

/**
 * Generates a triadic color harmony from a base color.
 * Triadic harmony uses three colors evenly spaced around the color wheel.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors in a triadic relationship
 */
export const getTriadics = (baseColor: HSLColor): HSLColor[] =>
  buildHarmony(baseColor, TRIADIC_HUESHIFT);

/**
 * Generates a monochromatic color harmony from a base color.
 * Monochromatic harmonies use the same hue but vary in lightness.
 *
 * @param baseColor - The HSL color to use as the base for the harmony
 * @returns An array of HSL colors with the same hue and saturation but different lightness values
 */
export const getMonochromatics = (baseColor: HSLColor): HSLColor[] => {
  const { h, s, l } = baseColor;

  /**
   * Clamps a value between a minimum and maximum value.
   *
   * @param val - The value to clamp
   * @param min - The minimum allowed value
   * @param max - The maximum allowed value
   * @returns The clamped value
   */
  const clamp = (val: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, val));

  // Calculate step size based on current lightness to avoid exceeding 0-1 range
  const maxStep = Math.min(l, 1 - l) * 0.6;
  const step = maxStep / 3;

  // Generate four lightness levels: two darker and two lighter than the base
  const lightnessLevels = [
    clamp(l - step * 1.5, 0, 1),
    clamp(l - step * 0.5, 0, 1),
    clamp(l + step * 0.5, 0, 1),
    clamp(l + step * 1.5, 0, 1)
  ];

  // Create new HSL colors with the same hue and saturation but different lightness
  return lightnessLevels.map((lightness) => hsl(h, s, lightness));
};
