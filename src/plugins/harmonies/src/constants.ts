/**
 * Hue shift values for analogous color harmony.
 * Analogous colors are adjacent to each other on the color wheel.
 */
export const ANALOGOUS_HUESHIFT = [-30, 0, 30] as const;

/**
 * Hue shift values for complementary color harmony.
 * Complementary colors are opposite each other on the color wheel.
 */
export const COMPLEMENTARY_HUESHIFT = [0, 180] as const;

/**
 * Hue shift values for split complementary color harmony.
 * Split complementary uses a base color and two colors adjacent to its complement.
 */
export const SPLIT_COMPLEMENTARY_HUESHIFT = [-150, -110, -70, 70, 110] as const;

/**
 * Hue shift values for double split complementary color harmony.
 * Double split complementary uses analogous colors and their complements.
 */
export const DOUBLE_SPLIT_COMPLEMENTARY_HUESHIFT = [-30, 0, 30, 150, 210] as const;

/**
 * Hue shift values for square color harmony.
 * Square harmony uses four colors evenly spaced around the color wheel.
 */
export const SQUARE_HUESHIFT = [0, 60, 180, 240] as const;

/**
 * Hue shift values for tetradic color harmony.
 * Tetradic harmony uses four colors arranged in two complementary pairs.
 */
export const TETRADIC_HUESHIFT = [0, 90, 180, 270] as const;

/**
 * Hue shift values for triadic color harmony.
 * Triadic harmony uses three colors evenly spaced around the color wheel.
 */
export const TRIADIC_HUESHIFT = [0, 120, 240] as const;
