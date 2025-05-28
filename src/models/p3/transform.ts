import { p3, type P3Color } from './p3';
import { applyRGBGammaTransfer, applyRGBInverseGammaTransfer } from '../rgb';

/**
 * Converts a DCI-P3 RGB color to its linearized form by applying the RGB gamma transfer function
 * to each component of the color.
 *
 * @param {P3Color} color - An object representing the P3 color with properties `r`, `g`, and `b`.
 *                           Each property represents a color channel within the P3 range.
 * @returns {P3Color} A new P3Color object with each color channel linearized using the gamma transfer function.
 */
export const linearizeP3Color = (color: P3Color): P3Color =>
  p3(
    applyRGBGammaTransfer(color.r),
    applyRGBGammaTransfer(color.g),
    applyRGBGammaTransfer(color.b),
    color.alpha
  );

/**
 * Converts a linear P3-based RGB color back to its gamma-corrected form by applying the inverse
 * RGB gamma transfer function to each component of the color.
 *
 * @param {P3Color} color - An object representing the linear P3 RGB color with properties `r`, `g`, and `b`.
 *                           Each property represents a linear color channel value in the range [0, 1].
 * @returns {P3Color} A new P3Color object with each color channel converted back to gamma-corrected form.
 */
export const delinearizeP3Color = (color: P3Color): P3Color =>
  p3(
    applyRGBInverseGammaTransfer(color.r),
    applyRGBInverseGammaTransfer(color.g),
    applyRGBInverseGammaTransfer(color.b),
    color.alpha
  );
