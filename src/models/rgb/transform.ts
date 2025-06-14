﻿import { rgb, type RGBColor } from './rgb';
import { RGB_INVERSE } from './constants';

/**
 * Normalizes the RGB color values to ensure they fall within the range of 0 to 1.
 *
 * @param {RGBColor} color - An object representing an RGB color with properties `r`, `g`, and `b`.
 * @returns {RGBColor} A new RGBColor object with each color channel normalized.
 */
export const normalizeRGBColor = (color: RGBColor): RGBColor =>
  rgb(color.r * RGB_INVERSE, color.g * RGB_INVERSE, color.b * RGB_INVERSE, color.alpha);

/**
 * Denormalizes the RGB color values to ensure they fall within the range of 0 to 255.
 *
 * @param {RGBColor} color - An object representing an RGB color with properties `r`, `g`, and `b`.
 * @returns {RGBColor} A new RGBColor object with each color channel denormalized.
 */
export const denormalizeRGBColor = (color: RGBColor): RGBColor =>
  rgb(color.r * 255, color.g * 255, color.b * 255, color.alpha);

/**
 * Applies gamma correction to a given color channel value.
 *
 * Applies the RGB gamma transfer function to the input color channel value.
 * This function is used to correct for the non-linear nature of the human eye's response to light.
 *
 * @param {number} channel - The input color channel value, normalized in the range [0, 1].
 * @returns {number} The gamma-corrected color channel value.
 */
export const applyRGBGammaTransfer = (channel: number): number => {
  const sign = channel < 0 ? -1 : 1;
  const abs = sign * channel;

  return abs <= 0.04045 ? channel / 12.92 : sign * ((abs + 0.055) / 1.055) ** 2.4;
};

/**
 * Converts an RGB color to its linearized form by applying the RGB gamma transfer function
 * to each component of the color.
 *
 * @param {RGBColor} color - An object representing the RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a color channel value in the range [0, 1].
 * @returns {RGBColor} A new RGBColor object with each color channel linearized using the gamma transfer function.
 */
export const linearizeRGBColor = (color: RGBColor): RGBColor =>
  rgb(
    applyRGBGammaTransfer(color.r),
    applyRGBGammaTransfer(color.g),
    applyRGBGammaTransfer(color.b),
    color.alpha
  );

/**
 * Applies the inverse gamma correction to a given linear color channel value.
 * This is the inverse of the RGB gamma transfer function.
 *
 * @param {number} channel - The linear color channel value in the range [0, 1].
 * @returns {number} The gamma-corrected color channel value.
 */
export const applyRGBInverseGammaTransfer = (channel: number): number => {
  const sign = channel < 0 ? -1 : 1;
  const abs = sign * channel;

  return abs > 0.0031308 ? sign * (1.055 * abs ** (1 / 2.4) - 0.055) : 12.92 * channel;
};

/**
 * Converts a linear RGB color back to its gamma-corrected form by applying the inverse
 * RGB gamma transfer function to each component of the color.
 *
 * @param {RGBColor} color - An object representing the linear RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a linear color channel value in the range [0, 1].
 * @returns {RGBColor} A new RGBColor object with each color channel converted back to gamma-corrected form.
 */
export const delinearizeRGBColor = (color: RGBColor): RGBColor =>
  rgb(
    applyRGBInverseGammaTransfer(color.r),
    applyRGBInverseGammaTransfer(color.g),
    applyRGBInverseGammaTransfer(color.b),
    color.alpha
  );
