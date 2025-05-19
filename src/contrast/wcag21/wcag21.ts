import { XYZColor } from '../../models/xyz';
import { WCAG21_LUMINANCE_OFFSET } from './constants';

/**
 * Calculates the WCAG 2.1 contrast ratio between two XYZ colors based on their luminance values.
 *
 * The WCAG (Web Content Accessibility Guidelines) contrast ratio is the standard method
 * for measuring text readability and visual contrast for web accessibility compliance.
 * It was developed by the W3C to ensure content is perceivable by users with visual impairments.
 *
 * Formula: (L1 + 0.05) / (L2 + 0.05), where L1 is the higher luminance and L2 is the lower luminance
 *
 * Key characteristics:
 * - Produces values from 1:1 (no contrast) to 21:1 (maximum contrast, white on black)
 * - Accounts for ambient light reflection with a fixed 5% viewing flare contribution
 * - Used as the primary metric for accessibility compliance in web and application design
 * - WCAG 2.1 guidelines specify minimum contrast ratios for different levels of compliance:
 *   - AA level: 4.5:1 for normal text, 3:1 for large text
 *   - AAA level: 7:1 for normal text, 4.5:1 for large text
 *
 * Limitations:
 * - Does not account for color differences (only luminance)
 * - May not accurately predict readability for certain color combinations
 * - Uses a simplified model of human vision
 * - Does not account for font characteristics beyond size
 *
 * @param {XYZColor} color1 - The first color, represented in the XYZ color space.
 * @param {XYZColor} color2 - The second color, represented in the XYZ color space.
 * @returns {number} The WCAG 2.1 contrast ratio between the two colors.
 *
 * @see {WCAG21_LUMINANCE_OFFSET} - The 5% viewing flare contribution constant
 * @see https://www.w3.org/TR/WCAG20-TECHS/G18.html - WCAG 2.0 technical specification
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum - WCAG 2.1 contrast guidelines
 */
export const contrastWCAG21 = (color1: XYZColor, color2: XYZColor): number => {
  const lum1 = Math.max(color1.y, 0);
  const lum2 = Math.max(color2.y, 0);

  const maxLum = Math.max(lum1, lum2);
  const minLum = Math.min(lum1, lum2);

  return (maxLum + WCAG21_LUMINANCE_OFFSET) / (minLum + WCAG21_LUMINANCE_OFFSET);
}
