/**
 * Normalizes an angle value to be within the range of 0 to 359 degrees.
 *
 * This function ensures that an input angle, which can be any real number,
 * is constrained to a valid angle in the degree range [0, 359].
 * It handles negative angles and angles greater than 360 by performing
 * modular arithmetic.
 *
 * @param {number} angle - The input angle in degrees to be normalized.
 * @returns {number} The normalized angle value within the range [0, 359].
 */
export const constrainAngle = (angle: number): number => ((angle % 360) + 360) % 360;
