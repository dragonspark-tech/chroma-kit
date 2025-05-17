/**
 * Checks if a given value is either `null` or `undefined`.
 *
 * This utility function determines whether the provided input
 * is considered to have no defined value. It returns `true`
 * if the input is strictly equal to `null` or `undefined`,
 * and `false` otherwise.
 *
 * @param {any} n - The value to be checked.
 * @returns {boolean} `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNone = (n: any): boolean =>
  n === null || n === undefined;
