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

/**
 * Determines whether two numbers are approximately equal within specified tolerances.
 *
 * The function evaluates the closeness of two numbers `a` and `b` by checking whether the
 * difference between them is within a specified relative or absolute tolerance. Useful for
 * floating-point comparisons where exact equality may not be feasible due to precision
 * limitations.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @param [relativeTolerance=1e-9] - The relative tolerance for the comparison.
 * @param [absoluteTolerance=0.0] - The absolute tolerance for the comparison.
 * @returns {boolean} True if the numbers are considered close; otherwise, false.
 */
export const isClose = (
  a: number,
  b: number,
  relativeTolerance = 1e-9,
  absoluteTolerance = 0.0
): boolean => {
  if (a === b) {
    return true;
  }
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return false;
  }
  const diff = Math.abs(a - b);
  return (
    diff <= Math.max(relativeTolerance * Math.max(Math.abs(a), Math.abs(b)), absoluteTolerance)
  );
};

/**
 * Converts an angle from radians to degrees.
 *
 * This function takes an angle measurement in radians and converts it
 * into its equivalent measurement in degrees using the formula:
 * degrees = radians * (180 / Math.PI).
 *
 * @param {number} radians - The angle in radians to be converted to degrees.
 * @returns {number} The equivalent angle in degrees.
 */
export const radiansToDegrees = (radians: number): number => radians * (180 / Math.PI);

/**
 * Converts an angle value from degrees to radians.
 *
 * This function takes an angle measured in degrees as input
 * and converts it to an equivalent angle measured in radians.
 *
 * @param {number} degrees - The angle in degrees to be converted.
 * @returns {number} The equivalent angle in radians.
 */
export const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180);

/**
 * Converts rectangular coordinates (x, y) into polar coordinates (r, θ).
 *
 * @param {number} a - The x-coordinate in the rectangular coordinate system.
 * @param {number} b - The y-coordinate in the rectangular coordinate system.
 * @returns {[number, number]} A tuple where the first element is the radial
 * magnitude (r) and the second element is the angle θ in degrees.
 */
export const rectToPolar = (a: number, b: number): [number, number] => {
  const c = Math.sqrt(a ** 2 + b ** 2);
  const h = radiansToDegrees(Math.atan2(b, a)) % 360;
  return [c, h];
};

/**
 * Converts polar coordinates to rectangular (Cartesian) coordinates.
 *
 * @param {number} c - The radial distance from the origin (magnitude).
 * @param {number} h - The angle in degrees from the positive x-axis.
 * @returns {[number, number]} An array containing the x and y coordinates in rectangular form.
 */
export const polarToRect = (c: number, h: number): [number, number] => {
  const r = degreesToRadians(h);
  const a = c * Math.cos(r);
  const b = c * Math.sin(r);
  return [a, b];
};

/**
 * Determines the sign of a given number.
 *
 * This function calculates and returns the sign of the input number.
 * If the number is positive, it returns 1. If negative, it returns -1.
 * Returns 0 for zero or non-numeric inputs.
 *
 * The function leverages the mathematical property that dividing a number
 * by its absolute value yields either 1 or -1 for non-zero numbers.
 *
 * @param {number} x - The input number for which the sign is to be determined.
 * @returns {number} - Returns 1 if the number is positive, -1 if negative,
 * 0 if the number is zero, or unchanged if the input is NaN.
 */
export const getSign = (x: number): number => (x && x == x ? x / Math.abs(x) : x);

/**
 * Performs a linear interpolation between two values, `p0` and `p1`, based on a given interpolation factor `t`.
 *
 * @param {number} p0 - The starting value of the interpolation.
 * @param {number} p1 - The ending value of the interpolation.
 * @param {number} t - The interpolation factor, typically in the range [0, 1],
 * where 0 represents the starting value and 1 represents the ending value.
 * Values outside this range will perform extrapolation.
 * @returns {number} The interpolated value computed based on the input parameters.
 */
export const linearInterpolation = (p0: number, p1: number, t: number): number =>
  p0 + (p1 - p0) * t;

/**
 * Computes the inverse linear interpolation of a value `t` within the range defined by `p0` and `p1`.
 *
 * The formula determines the relative position of `t` between `p0` and `p1` on a normalized scale [0, 1].
 * If the difference between `p0` and `p1` is zero, the function returns 0 to avoid division by zero.
 *
 * @param {number} p0 - The start of the range.
 * @param {number} p1 - The end of the range.
 * @param {number} t - The value for which the relative position is computed.
 * @returns {number} The normalized position of `t` between `p0` and `p1`.
 */
export const inverseLinearInterpolation = (p0: number, p1: number, t: number): number => {
  const d = p1 - p0;
  return d ? (t - p0) / d : 0;
};


/**
 * Returns a number with the magnitude of the first argument and the sign of the second argument.
 *
 * If either `magnitude` or `signSource` is `NaN`, the function returns `NaN`.
 * The sign of `signSource` determines whether the resulting number is positive or negative.
 * Takes into account special cases where `signSource` is -0.
 *
 * @param {number} magnitude - The value whose magnitude is used in the result.
 * @param {number} signSource - The value whose sign is used in the result.
 * @returns {number} A number with the magnitude of `magnitude` and the sign of `signSource`.
 */
export const copySign = (magnitude: number, signSource: number): number =>
{
  if (Number.isNaN(magnitude) || Number.isNaN(signSource)) {
    return NaN;
  }

  const absMag = Math.abs(magnitude);
  const signIsNegative = signSource < 0 || Object.is(signSource, -0);

  return signIsNegative ? -absMag : absMag;
}

/**
 * Calculates the power of a number while preserving the sign of the base.
 *
 * The function raises the absolute value of the base to the power of the given exponent
 * and then applies the sign of the base to the result.
 *
 * @param {number} base - The base number. Its sign will be preserved in the result.
 * @param {number} exponent - The exponent to which the base is raised.
 * @returns {number} The result of raising the absolute value of the base to the given exponent,
 *                   with the original sign of the base.
 */
export const signedPow = (base: number, exponent: number): number =>
  copySign(Math.abs(base) ** exponent, base);
