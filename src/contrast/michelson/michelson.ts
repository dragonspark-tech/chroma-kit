import { XYZColor } from '../../models/xyz';
import { MICHELSON_CLAMP } from './constants';

/**
 * Calculates the Michelson contrast between two XYZ colors based on their luminance values.
 *
 * The Michelson contrast is primarily used to measure the contrast ratio between two light sources
 * or between patterns with equivalent areas of light and dark. It was originally developed for
 * measuring the contrast of interference fringes in optics experiments.
 *
 * Formula: (Lmax - Lmin) / (Lmax + Lmin)
 *
 * Key characteristics:
 * - Produces values in the range [0, 1], where 0 indicates no contrast and 1 indicates maximum contrast
 * - Symmetric with respect to the two luminance values
 * - Commonly used in vision science and display technology
 * - Most appropriate when both stimuli occupy similar areas in the visual field
 *
 * Limitations:
 * - Not ideal for stimuli with very different areas
 * - Less sensitive to small differences in high luminance values
 * - Cannot distinguish between different absolute luminance levels with the same ratio
 *
 * @param {XYZColor} color1 - The first color represented in the XYZ color space.
 * @param {XYZColor} color2 - The second color represented in the XYZ color space.
 * @returns {number} The Michelson contrast ratio, ranging from 0 to 1, where higher values indicate greater contrast.
 *
 * @see {MICHELSON_CLAMP} - Used when both colors have zero luminance
 */
export const contrastMichelson = (color1: XYZColor, color2: XYZColor): number => {
  const lum1 = Math.max(color1.y, 0);
  const lum2 = Math.max(color2.y, 0);

  const maxLum = Math.max(lum1, lum2);
  const minLum = Math.min(lum1, lum2);

  const denominator = maxLum + minLum;

  return denominator === 0 ? MICHELSON_CLAMP : (maxLum - minLum) / denominator;
}
