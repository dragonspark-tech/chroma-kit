/**
 * Maximum clamp value for Michelson contrast calculations.
 *
 * This constant is used as a fallback value when calculating Michelson contrast
 * in cases where the sum of luminances is zero (to avoid division by zero).
 *
 * The Michelson contrast formula normally produces values between 0 and 1,
 * where 0 indicates no contrast and 1 indicates maximum contrast.
 * When both colors have zero luminance, we return 0 to indicate no contrast.
 *
 * @see {contrastMichelson} function where this constant is used
 */
export const MICHELSON_CLAMP = 0;
