import type { RGBColor } from './rgb';

const RGB_INVERSE = 1 / 255;

/**
 * Normalizes the RGB color values to ensure they fall within the range of 0 to 1.
 *
 * @param {RGBColor} color - An object representing an RGB color with properties `r`, `g`, and `b`.
 * @returns {RGBColor} A new RGBColor object with each color channel normalized.
 */
export const normalizeRGBColor = (color: RGBColor): RGBColor => ({
  r: color.r * RGB_INVERSE,
  g: color.g * RGB_INVERSE,
  b: color.b * RGB_INVERSE,
  a: color.a
});

/**
 * Denormalizes the RGB color values to ensure they fall within the range of 0 to 255.
 *
 * @param {RGBColor} color - An object representing an RGB color with properties `r`, `g`, and `b`.
 * @returns {RGBColor} A new RGBColor object with each color channel denormalized.
 */
export const denormalizeRGBColor = (color: RGBColor): RGBColor => ({
  r: color.r / RGB_INVERSE,
  g: color.g / RGB_INVERSE,
  b: color.b / RGB_INVERSE,
  a: color.a
});

/**
 * Applies gamma correction to a given color channel value.
 *
 * Applies the sRGB gamma transfer function to the input color channel value.
 * This function is used to correct for the non-linear nature of the human eye's response to light.
 *
 * @param {number} channel - The input color channel value, normalized in the range [0, 1].
 * @returns {number} The gamma-corrected color channel value.
 */
export const applyRGBGammaTransfer = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/**
 * Converts an RGB color to its linearized form by applying the RGB gamma transfer function
 * to each component of the color.
 *
 * @param {RGBColor} color - An object representing the RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a color channel value in the range [0, 1].
 * @returns {RGBColor} A new RGBColor object with each color channel linearized using the gamma transfer function.
 */
export const linearizeRGBColor = (color: RGBColor): RGBColor => {
  return {
    r: applyRGBGammaTransfer(color.r),
    g: applyRGBGammaTransfer(color.g),
    b: applyRGBGammaTransfer(color.b),
    a: color.a
  };
};

/**
 * Applies the inverse gamma correction to a given linear color channel value.
 * This is the inverse of the sRGB gamma transfer function.
 *
 * @param {number} channel - The linear color channel value in the range [0, 1].
 * @returns {number} The gamma-corrected color channel value.
 */
export const applyRGBInverseGammaTransfer = (channel: number): number =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

/**
 * Converts a linear RGB color back to its gamma-corrected form by applying the inverse
 * RGB gamma transfer function to each component of the color.
 *
 * @param {RGBColor} color - An object representing the linear RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a linear color channel value in the range [0, 1].
 * @returns {RGBColor} A new RGBColor object with each color channel converted back to gamma-corrected form.
 */
export const delinearizeRGBColor = (color: RGBColor): RGBColor => {
  return {
    r: applyRGBInverseGammaTransfer(color.r),
    g: applyRGBInverseGammaTransfer(color.g),
    b: applyRGBInverseGammaTransfer(color.b),
    a: color.a
  };
};
