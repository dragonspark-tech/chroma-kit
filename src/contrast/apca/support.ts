import {
  APCA_INPUT_CLAMP_MAX,
  APCA_INPUT_CLAMP_MIN,
  SA98G_BLACK_CLAMP,
  SA98G_BLACK_THRESHOLD,
  SA98G_MONITOR_GAMMA,
  SA98G_SRGB_LUMINANCE
} from './constants';
import { sRGBColor } from '../../models/srgb';

/**
 * Checks if a luminance value is within the acceptable range for APCA calculations.
 *
 * @param {number} inputY - The luminance value to check
 * @returns {boolean} True if the value is within the acceptable range, false otherwise
 */
export const inputConformsToClamp = (inputY: number) =>
  inputY >= APCA_INPUT_CLAMP_MIN && inputY <= APCA_INPUT_CLAMP_MAX;

/**
 * Applies a soft clamp to very dark luminance values to prevent excessive contrast.
 *
 * This function implements a non-linear adjustment for very dark colors (below the black threshold)
 * to better match human perception of contrast in dark regions. Colors above the threshold
 * are left unchanged, while colors below it are adjusted upward using a power function.
 *
 * @param {number} inputY - The luminance value to adjust
 * @returns {number} The adjusted luminance value after soft clamping
 */
export const applyBlackSoftClamp = (inputY: number) =>
  inputY > SA98G_BLACK_THRESHOLD
    ? inputY
    : inputY + (SA98G_BLACK_THRESHOLD - inputY) ** SA98G_BLACK_CLAMP;

/**
 * Calculates the luminance (Y) value from an sRGB color.
 *
 * This function applies the standard monitor gamma correction to each RGB channel,
 * then combines them using the SRGB luminance coefficients to produce a perceptually
 * accurate luminance value for use in contrast calculations.
 *
 * @param {sRGBColor} color - The sRGB color to calculate luminance from
 * @returns {number} The calculated luminance value
 */
export const deriveYFromRGBColor = (color: sRGBColor): number => {
  const { RED_COEFFICIENT, GREEN_COEFFICIENT, BLUE_COEFFICIENT } = SA98G_SRGB_LUMINANCE;
  const { r, g, b } = color;

  return (
    RED_COEFFICIENT * r ** SA98G_MONITOR_GAMMA +
    GREEN_COEFFICIENT * g ** SA98G_MONITOR_GAMMA +
    BLUE_COEFFICIENT * b ** SA98G_MONITOR_GAMMA
  );
};
