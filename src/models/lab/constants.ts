/**
 * The threshold value used in the Lab color space conversion.
 *
 * This constant equals 6/29 and is used to determine whether to use
 * a linear or power function during the XYZ to Lab conversion process.
 * It helps handle very small values in the conversion to avoid numerical issues.
 */
/*@__NO_SIDE_EFFECTS__*/
export const δ = 0.20689655172413793;

/**
 * The cube of δ (δ³), used as a threshold in Lab color space calculations.
 *
 * This constant equals 0.008856451679035631 and is used in the piecewise
 * functions that convert between XYZ and Lab color spaces. Values below
 * this threshold use a linear approximation instead of the cube root function.
 */
/*@__NO_SIDE_EFFECTS__*/
export const ϵ = 0.008856451679035631;

/**
 * A scaling factor used in the Lab color space conversion.
 *
 * This constant equals 116/(3*δ²) or approximately 903.3. It's used
 * in the linear portion of the Lab conversion functions to ensure
 * continuity and smoothness at the transition point defined by ϵ.
 */
/*@__NO_SIDE_EFFECTS__*/
export const κ = 903.2962962962963;
