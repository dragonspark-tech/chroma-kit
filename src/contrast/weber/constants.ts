/**
 * Maximum clamp value for Weber contrast calculations.
 *
 * This constant is used as a fallback value when calculating Weber contrast
 * in cases where the minimum luminance is zero (to avoid division by zero).
 *
 * The darkest sRGB color above black (#000001) produces a Weber contrast of ~45647.
 * Setting this clamp value to 5000 provides a reasonable maximum that prevents
 * extreme contrast values while still indicating a very high contrast ratio.
 *
 * @see {weber} function where this constant is used
 */
export const WEBER_CLAMP = 5000;
