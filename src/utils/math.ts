/**
 * Clamps a number within the inclusive range specified by two boundary values.
 *
 * @param {number} value - The number to be clamped.
 * @param {number} a - The first boundary value.
 * @param {number} b - The second boundary value.
 * @return {number} The clamped value constrained within the range defined by a and b.
 */
export const clamp = (value: number, a: number, b: number): number => {
  return a < b ? (value < a ? a : value > b ? b : value) : value < b ? b : value > a ? a : value;
};

/**
 * Rounds a given number to a specified number of decimal places.
 *
 * @param {number} num The number to be rounded.
 * @param {number} [digits=0] The number of decimal places to round to. Defaults to 0 if not specified.
 * @return {number} The rounded number.
 */
export const round = (num: number, digits = 0): number => {
  if (digits === 0) {
    return Math.round(num);
  }
  const factor = 10 ** digits; // Same as Math.pow(10, digits)
  return Math.round(num * factor) / factor;
};

/**
 * Rounds a number down to the nearest integer or a specified number of decimal places.
 *
 * @param {number} num - The number to be rounded down.
 * @param {number} [digits=0] - The number of decimal places to round down to. Defaults to 0.
 * @return {number} The rounded down value.
 */
export const floor = (num: number, digits = 0): number => {
  if (digits === 0) {
    return Math.floor(num);
  }
  const factor = 10 ** digits;
  return Math.floor(num * factor) / factor;
};

/**
 * Normalizes a given value within a specified range. The function scales the value to a range
 * between 0 and 1 by default, but can work with any custom minimum and maximum range.
 *
 * @param {number} value - The value to normalize.
 * @param {number} [min=0] - The minimum value of the range.
 * @param {number} [max=1] - The maximum value of the range.
 * @returns {number} - The normalized value within the specified range.
 */
export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

/**
 * Calculates the seventh power of a given number.
 *
 * This function computes the input number raised to the power of 7
 * by optimizing the operation using intermediate results. It avoids
 * directly calling repeated multiplication or using built-in power
 * functions, instead performing step-by-step multiplication to achieve
 * higher performance for this specific case.
 *
 * @param {number} x - The base number to be raised to the power of 7.
 * @returns {number} - The result of x raised to the power of 7.
 */
export const pow7 = (x: number): number => {
  const x2 = x * x;
  return x2 * x2 * x2 * x;
};
