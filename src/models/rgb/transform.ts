import type { RGBColor } from './rgb';
import { normalize } from '../../utils/math';

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
  channel <= 0.04045 ? channel / 12.92 :
    ((channel + 0.055) / 1.055) ** 2.4;

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
