import { srgb, sRGBColor } from './srgb';
import { SRGB_INVERSE } from './constants';

/**
 * Normalizes the RGB color values to ensure they fall within the range of 0 to 1.
 *
 * @param {sRGBColor} color - An object representing an RGB color with properties `r`, `g`, and `b`.
 * @returns {sRGBColor} A new RGBColor object with each color channel normalized.
 */
export const normalizesRGBColor = (color: sRGBColor): sRGBColor =>
  srgb(color.r * SRGB_INVERSE, color.g * SRGB_INVERSE, color.b * SRGB_INVERSE, color.alpha);

/**
 * Denormalizes the RGB color values to ensure they fall within the range of 0 to 255.
 *
 * @param {sRGBColor} color - An object representing an RGB color with properties `r`, `g`, and `b`.
 * @returns {sRGBColor} A new RGBColor object with each color channel denormalized.
 */
export const denormalizesRGBColor = (color: sRGBColor): sRGBColor =>
  srgb(color.r * 255, color.g * 255, color.b * 255, color.alpha);

/**
 * Applies gamma correction to a given color channel value.
 *
 * Applies the sRGB gamma transfer function to the input color channel value.
 * This function is used to correct for the non-linear nature of the human eye's response to light.
 *
 * @param {number} channel - The input color channel value, normalized in the range [0, 1].
 * @returns {number} The gamma-corrected color channel value.
 */
export const applysRGBGammaTransfer = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/**
 * Converts an RGB color to its linearized form by applying the RGB gamma transfer function
 * to each component of the color.
 *
 * @param {sRGBColor} color - An object representing the RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a color channel value in the range [0, 1].
 * @returns {sRGBColor} A new RGBColor object with each color channel linearized using the gamma transfer function.
 */
export const linearizesRGBColor = (color: sRGBColor): sRGBColor =>
  srgb(
    applysRGBGammaTransfer(color.r),
    applysRGBGammaTransfer(color.g),
    applysRGBGammaTransfer(color.b),
    color.alpha
  );

/**
 * Applies the inverse gamma correction to a given linear color channel value.
 * This is the inverse of the sRGB gamma transfer function.
 *
 * @param {number} channel - The linear color channel value in the range [0, 1].
 * @returns {number} The gamma-corrected color channel value.
 */
export const applysRGBInverseGammaTransfer = (channel: number): number =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

/**
 * Converts a linear RGB color back to its gamma-corrected form by applying the inverse
 * RGB gamma transfer function to each component of the color.
 *
 * @param {sRGBColor} color - An object representing the linear RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a linear color channel value in the range [0, 1].
 * @returns {sRGBColor} A new RGBColor object with each color channel converted back to gamma-corrected form.
 */
export const delinearizesRGBColor = (color: sRGBColor): sRGBColor =>
  srgb(
    applysRGBInverseGammaTransfer(color.r),
    applysRGBInverseGammaTransfer(color.g),
    applysRGBInverseGammaTransfer(color.b),
    color.alpha
  );

/**
 * Performs alpha blending of two sRGB colors and returns the resulting blended color.
 *
 * This function calculates the blended color by factoring in the alpha value of the foreground color
 * and compositing it over the background color.
 *
 * @param {sRGBColor} foreground - The foreground color, which may include an alpha channel to determine its opacity.
 * @param {sRGBColor} background - The background color over which the foreground color is blended.
 * @param {boolean} [round=true] - Determines whether the resulting RGB values should be rounded to
 *                                 the nearest integer.
 * @returns {sRGBColor} The resulting blended color as an RGBColor object.
 */
export const alphaBlendsRGBColor = (
  foreground: sRGBColor,
  background: sRGBColor
): sRGBColor => {
  const fgAlpha = Math.max(Math.min(foreground.alpha ?? 1.0, 1.0), 0.0);
  const compositionBlend = 1 - fgAlpha;

  const clamp = (value: number) => Math.max(Math.min(value, 1.0), 0.0);

  const newR = clamp(background.r * compositionBlend + foreground.r * fgAlpha);
  const newG = clamp(background.g * compositionBlend + foreground.g * fgAlpha);
  const newB = clamp(background.b * compositionBlend + foreground.b * fgAlpha);

  return srgb(newR, newG, newB, 1);
};
