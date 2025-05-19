import {
  SA98G_G4G_BG_NORM_FACTOR,
  SA98G_G4G_LOW_CLIP,
  SA98G_G4G_LOW_OFFSET_BLACK_ON_WHITE,
  SA98G_G4G_LOW_OFFSET_WHITE_ON_BLACK,
  SA98G_G4G_REVERSE_BG_NORM_FACTOR,
  SA98G_G4G_REVERSE_TXT_NORM_FACTOR,
  SA98G_G4G_SCALE_BLACK_ON_WHITE,
  SA98G_G4G_SCALE_WHITE_ON_BLACK,
  SA98G_G4G_TXT_NORM_FACTOR,
  SA98G_MIN_DELTA_Y
} from './constants';

import { applyBlackSoftClamp, deriveYFromRGBColor, inputConformsToClamp } from './support';
import { alphaBlendsRGBColor, sRGBColor } from '../../models/srgb';

/**
 * Calculates the contrast between two colors using the APCA (Accessible Perceptual Contrast Algorithm).
 *
 * APCA is a modern contrast algorithm designed to replace WCAG 2.x contrast metrics.
 * It was developed by Andrew Somers to better predict perceived contrast for modern
 * displays and to address limitations in the WCAG 2.x contrast formula.
 *
 * The algorithm uses different calculations based on the polarity (whether text is darker
 * or lighter than the background), applies non-linear transformations to account for human
 * perception, and includes special handling for very dark colors.
 *
 * Key characteristics:
 * - Produces values from approximately -108% to 106% (negative values indicate light text on dark background)
 * - Accounts for the non-linear perception of contrast in human vision
 * - Uses different calculations based on polarity (dark-on-light vs. light-on-dark)
 * - Applies soft clamping to very dark colors to prevent excessive contrast
 * - Designed specifically for predicting readability of text
 * - Recommended minimum values vary by font size and weight:
 *   - Large, bold text: 45%
 *   - Normal body text: 60%
 *   - Small or thin text: 75%
 *
 * Limitations:
 * - More complex than simpler contrast metrics
 * - Still evolving and may change in future versions
 * - Not yet officially adopted in accessibility standards
 * - Requires conversion to specific color spaces for accurate results
 *
 * @param {sRGBColor} foreground - The foreground (typically text) color in sRGB color space
 * @param {sRGBColor} background - The background color in sRGB color space
 * @returns {number} The APCA contrast value, with positive values for dark-on-light and negative values for light-on-dark
 *
 * @see https://github.com/Myndex/SAPC-APCA
 * @see https://www.myndex.com/APCA/
 */
export const contrastAPCA = (foreground: sRGBColor, background: sRGBColor): number => {
  // Handle alpha blending for foreground colors with transparency
  if ((foreground.alpha ?? 1) < 1) {
    foreground = alphaBlendsRGBColor(foreground, background);
  }

  // Calculate luminance values for both colors
  let bgY = deriveYFromRGBColor(background);
  let txtY = deriveYFromRGBColor(foreground);

  // Validate input values are within acceptable range
  if (!inputConformsToClamp(bgY) || !inputConformsToClamp(txtY)) return 0.0;

  let predictiveColorContrast = 0.0;
  let outputContrast = 0.0;

  // Apply soft clamping to very dark colors
  bgY = applyBlackSoftClamp(bgY);
  txtY = applyBlackSoftClamp(txtY);

  // Check if the difference is below the minimum threshold
  const ΔY = Math.abs(bgY - txtY);
  if (ΔY < SA98G_MIN_DELTA_Y) return 0.0;

  // Determine the polarity (dark-on-light or light-on-dark)
  const polarity = bgY > txtY ? 'BoW' : 'WoB';

  // Calculate contrast based on polarity
  if (polarity === 'BoW') {
    // Black text on white background (positive contrast)
    predictiveColorContrast =
      (bgY ** SA98G_G4G_BG_NORM_FACTOR - txtY ** SA98G_G4G_TXT_NORM_FACTOR) *
      SA98G_G4G_SCALE_BLACK_ON_WHITE;

    // Apply low contrast clipping and offset
    outputContrast =
      predictiveColorContrast < SA98G_G4G_LOW_CLIP
        ? 0.0
        : predictiveColorContrast - SA98G_G4G_LOW_OFFSET_BLACK_ON_WHITE;
  } else {
    // White text on black background (negative contrast)
    predictiveColorContrast =
      (bgY ** SA98G_G4G_REVERSE_BG_NORM_FACTOR - txtY ** SA98G_G4G_REVERSE_TXT_NORM_FACTOR) *
      SA98G_G4G_SCALE_WHITE_ON_BLACK;

    // Apply low contrast clipping and offset
    outputContrast =
      predictiveColorContrast > -SA98G_G4G_LOW_CLIP
        ? 0.0
        : predictiveColorContrast + SA98G_G4G_LOW_OFFSET_WHITE_ON_BLACK;
  }

  return outputContrast;
};
