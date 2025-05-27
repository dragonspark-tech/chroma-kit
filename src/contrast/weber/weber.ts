import type { XYZColor } from '../../models/xyz';
import { WEBER_CLAMP } from './constants';

/**
 * Calculates the Weber contrast between two XYZ colors based on their luminance values.
 *
 * The Weber contrast is commonly used in vision science to measure the contrast between
 * a stimulus and its background. It was developed by Ernst Weber in the 19th century
 * as part of his work on just-noticeable differences in perception.
 *
 * Formula: (Lmax - Lmin) / Lmin
 *
 * Key characteristics:
 * - Produces values from 0 to potentially infinity, where 0 indicates no contrast
 * - Asymmetric with respect to the two luminance values
 * - Particularly useful for measuring contrast of small features against a uniform background
 * - Commonly used in psychophysics and visual perception research
 *
 * Limitations:
 * - Not bounded on the upper end (can approach infinity as Lmin approaches zero)
 * - Not symmetric (swapping the two colors can produce different results)
 * - Less suitable for patterns with equal light and dark areas
 * - Becomes unstable when the reference luminance is very low
 *
 * @param {XYZColor} color1 - The first color, represented in the XYZ color space.
 * @param {XYZColor} color2 - The second color, represented in the XYZ color space.
 * @returns {number} The Weber contrast value for the two input colors.
 *
 * @see {WEBER_CLAMP} - Used when the darker color has zero luminance
 */
export const contrastWeber = (color1: XYZColor, color2: XYZColor): number => {
  const lum1 = Math.max(color1.y, 0);
  const lum2 = Math.max(color2.y, 0);

  const maxLum = Math.max(lum1, lum2);
  const minLum = Math.min(lum1, lum2);

  return minLum === 0 ? WEBER_CLAMP : (maxLum - minLum) / minLum;
};
