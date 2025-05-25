/**
 * Constants for the APCA (Accessible Perceptual Contrast Algorithm) version 0.0.98G - 4g
 * W3 Compatible Constants for calculating accessible contrast.
 *
 * APCA is a modern contrast algorithm designed to replace WCAG 2.x contrast metrics.
 * It was developed by Andrew Somers to better predict perceived contrast for modern
 * displays and to address limitations in the WCAG 2.x contrast formula.
 *
 * The SA98G (Somers-APCA-98G) constants are specifically calibrated for the 4g
 * implementation of the APCA algorithm, which is designed to be compatible with
 * W3C accessibility standards.
 *
 * @see https://github.com/Myndex/SAPC-APCA
 * @see https://www.myndex.com/APCA/
 */

/**
 * Standard monitor gamma value used in the APCA algorithm.
 * This represents the power function applied to linearize RGB values.
 */
export const SA98G_MONITOR_GAMMA = 2.4;

/**
 * Inverse of the standard monitor gamma, used for efficiency in calculations.
 * Equal to 1/2.4 or approximately 0.4167.
 */
export const SA98G_MONITOR_GAMMA_INV = 0.4166666666666667;

/**
 * Coefficients for calculating luminance from RGB color channels.
 * These values represent the relative contribution of each color channel
 * to the perceived brightness, based on human vision sensitivity.
 */
export const SA98G_SRGB_LUMINANCE = {
  /** Coefficient for the red channel's contribution to luminance */
  RED_COEFFICIENT: 0.2126729,
  /** Coefficient for the green channel's contribution to luminance */
  GREEN_COEFFICIENT: 0.7151522,
  /** Coefficient for the blue channel's contribution to luminance */
  BLUE_COEFFICIENT: 0.072175
};

/**
 * Normalization factor for background colors in the standard (black text on light background) polarity.
 * Used to adjust the perceptual contrast calculation based on empirical research.
 */
export const SA98G_G4G_BG_NORM_FACTOR = 0.56;

/**
 * Normalization factor for text colors in the standard (black text on light background) polarity.
 * Used to adjust the perceptual contrast calculation based on empirical research.
 */
export const SA98G_G4G_TXT_NORM_FACTOR = 0.57;

/**
 * Normalization factor for background colors in the reverse (light text on dark background) polarity.
 * Used to adjust the perceptual contrast calculation based on empirical research.
 */
export const SA98G_G4G_REVERSE_BG_NORM_FACTOR = 0.65;

/**
 * Normalization factor for text colors in the reverse (light text on dark background) polarity.
 * Used to adjust the perceptual contrast calculation based on empirical research.
 */
export const SA98G_G4G_REVERSE_TXT_NORM_FACTOR = 0.62;

/**
 * Threshold for the soft black clamp.
 * Values below this threshold are adjusted to prevent excessive contrast in very dark colors.
 */
export const SA98G_BLACK_THRESHOLD = 0.022;

/**
 * Exponent used in the soft black clamp calculation.
 * Controls how aggressively the clamp is applied to very dark colors.
 */
export const SA98G_BLACK_CLAMP = 1.414;

/**
 * Minimum luminance difference required for contrast calculation.
 * Differences smaller than this are considered to have zero contrast.
 */
export const SA98G_MIN_DELTA_Y = 0.0005;

/**
 * Scaling factor for contrast in black-on-white (standard polarity) configurations.
 * Used to adjust the final contrast value based on empirical research.
 */
export const SA98G_G4G_SCALE_BLACK_ON_WHITE = 1.14;

/**
 * Scaling factor for contrast in white-on-black (reverse polarity) configurations.
 * Used to adjust the final contrast value based on empirical research.
 */
export const SA98G_G4G_SCALE_WHITE_ON_BLACK = 1.14;

/**
 * Offset applied to low contrast values in black-on-white configurations.
 * Used to adjust the final contrast value for better perceptual alignment.
 */
export const SA98G_G4G_LOW_OFFSET_BLACK_ON_WHITE = 0.027;

/**
 * Offset applied to low contrast values in white-on-black configurations.
 * Used to adjust the final contrast value for better perceptual alignment.
 */
export const SA98G_G4G_LOW_OFFSET_WHITE_ON_BLACK = 0.027;

/**
 * Threshold for clipping low contrast values to zero.
 * Contrast values below this threshold after scaling are considered imperceptible.
 */
export const SA98G_G4G_LOW_CLIP = 0.1;

/**
 * Minimum input value allowed for luminance in the APCA algorithm.
 * Values below this are clamped to ensure valid calculations.
 */
export const APCA_INPUT_CLAMP_MIN = 0.0;

/**
 * Maximum input value allowed for luminance in the APCA algorithm.
 * Values above this are clamped to ensure valid calculations.
 */
export const APCA_INPUT_CLAMP_MAX = 1.1;

/**
 * Magic numbers used in the APCA algorithm for various calculations.
 * These constants are derived from empirical research and mathematical modeling
 * to optimize the algorithm's performance across different contrast scenarios.
 */
export const SA98G_MAGIC_NUMBERS = {
  /** Factor used in unclamping calculations */
  UNCLAMP_MAGIC_FACTOR: 1.9468554433171,
  /** Inverse of the magic factor for efficiency */
  UNCLAMP_MAGIC_FACTOR_INV: 0.5136488193988227,
  /** Input offset used in unclamping calculations */
  UNCLAMP_MAGIC_OFFSET_IN: 0.0387393816571401,
  /** Exponent adjustment used in unclamping calculations */
  UNCLAMP_MAGIC_EXP_ADJ: 0.283343396420869,
  /** Exponent used in unclamping calculations */
  UNCLAMP_MAGIC_EXP: 0.20038429732734725,
  /** Output offset used in unclamping calculations */
  UNCLAMP_MAGIC_OFFSET_OUT: 0.312865795870758
};
