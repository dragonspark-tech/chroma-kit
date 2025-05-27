import type { LabColor } from '../../models/lab';

/**
 * Calculates the difference in CIE Lightness (L*) between two colors in the Lab color space.
 *
 * The Delta-L* contrast metric is a simple measure that evaluates the contrast between
 * two colors based solely on their lightness values in the Lab color space. This approach
 * is used by Google Material Design, where HCT Tone is equivalent to CIE Lightness.
 *
 * Formula: |L1 - L2|
 *
 * Key characteristics:
 * - Based on the CIE L*a*b* color space, which is designed to be perceptually uniform
 * - Simple and computationally efficient
 * - Focuses exclusively on lightness differences, ignoring chromatic components
 * - Directly corresponds to perceived lightness differences in human vision
 * - Used in Google's Material Design system for ensuring accessible contrast
 *
 * Limitations:
 * - Ignores chromatic components (a* and b*), which can contribute to perceived contrast
 * - May not accurately predict contrast for colors with similar lightness but different hues
 * - Does not account for the non-linear response of human vision at extreme lightness values
 * - Simplistic compared to more comprehensive contrast metrics
 *
 * @param {LabColor} color1 - The first color in Lab color space, containing its lightness (L*).
 * @param {LabColor} color2 - The second color in Lab color space, containing its lightness (L*).
 * @returns {number} The absolute difference between the lightness values of the two colors.
 *
 * @see https://m3.material.io/blog/science-of-color-design
 */
export const contrastDeltaLStar = (color1: LabColor, color2: LabColor): number => {
  return Math.abs(color1.l - color2.l);
};
