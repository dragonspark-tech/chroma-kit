import type { LabColor } from '../../models/lab';
import { φ } from './constants';

/**
 * Calculates the difference in visual contrast (ΔΦ*) between two colors in the Lab color space.
 *
 * The Delta-Phi Star (ΔΦ*) contrast metric is a perceptually-based measure that evaluates
 * the contrast between two colors based on their lightness values in the Lab color space.
 * It uses the golden ratio (φ) as an exponent to model human perception of contrast.
 *
 * Formula: (|L1^φ - L2^φ|)^(1/φ) * √2 - 40
 *
 * Key characteristics:
 * - Based on the CIE L*a*b* color space, which is designed to be perceptually uniform
 * - Uses the golden ratio (φ) to model human visual perception
 * - Includes a threshold parameter to ignore imperceptible contrast differences
 * - Returns 0 for contrast values below the perceptual threshold
 * - Accounts for the non-linear response of human vision to lightness differences
 *
 * Limitations:
 * - Only considers lightness (L*) and ignores chromatic components (a* and b*)
 * - May not accurately predict contrast perception for all viewing conditions
 * - The threshold value is empirically determined and may need adjustment for specific applications
 * - The subtraction of 40 in the formula is a calibration factor that may not be optimal for all scenarios
 *
 * @param {LabColor} color1 - The first color in Lab color space, containing its lightness (L*).
 * @param {LabColor} color2 - The second color in Lab color space, containing its lightness (L*).
 * @param {number} [threshold=7.5] - The minimum contrast threshold; contrast values below this are set to 0.0.
 * @returns {number} The calculated contrast value (ΔΦ*) or 0.0 if the contrast is below the specified threshold.
 *
 * @see {φ} - The golden ratio constant used in the calculation
 */
export const contrastDeltaPhiStar = (
  color1: LabColor,
  color2: LabColor,
  threshold = 7.5
): number => {
  // Ensure lightness values are non-negative
  const LStar1 = Math.max(0, color1.l);
  const LStar2 = Math.max(0, color2.l);

  const Δφ = Math.abs(LStar1 ** φ - LStar2 ** φ);
  const contrast = Δφ ** (1 / φ) * Math.SQRT2 - 40;

  return contrast < threshold ? 0.0 : contrast;
};
