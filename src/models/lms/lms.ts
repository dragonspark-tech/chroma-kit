import { XYZColor, xyzToLab, xyzToLch, xyzToRGB } from '../xyz/xyz';
import { LMS_OKLAB_MATRIX, LMS_XYZ_MATRIX } from './constants';
import { multiplyMatrixByVector } from '../../utils/linear';
import { OklabColor, oklabToOklch } from '../oklab/oklab';
import { RGBColor } from '../rgb/rgb';
import { LabColor } from '../lab/lab';
import { LchColor } from '../lch/lch';
import { OklchColor } from '../oklch/oklch';

export type LMSColor = {
  l: number;
  m: number;
  s: number;
  alpha?: number;
};

/**
 * Converts a color from the LMS color space to the RGB color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from LMS to XYZ using lmsToXYZ()
 * 2. Converting from XYZ to RGB using xyzToRGB()
 *
 * @param {LMSColor} color - The input color in LMS color space, containing l, m, s components
 *                          and an optional alpha transparency value.
 * @returns {RGBColor} The resulting color in RGB color space, containing r, g, b components
 *                     and the optional alpha value if provided.
 */
export const lmsToRGB = (color: LMSColor): RGBColor => xyzToRGB(lmsToXYZ(color));

/**
 * Converts a color from the LMS color space to the CIE 1931 XYZ color space.
 *
 * The conversion process involves a linear transformation using a matrix that
 * maps the LMS color space to the XYZ color space.
 *
 * @param {LMSColor} color - The input color in LMS color space, containing l, m, s components
 *                          and an optional alpha transparency value.
 * @returns {XYZColor} The resulting color in XYZ color space, containing x, y, z components
 *                     and the optional alpha value if provided.
 */
export const lmsToXYZ = (color: LMSColor): XYZColor => {
  const xyz = multiplyMatrixByVector(LMS_XYZ_MATRIX, [color.l, color.m, color.s]);
  return { x: xyz[0], y: xyz[1], z: xyz[2], alpha: color.alpha };
};

/**
 * Converts a color from the LMS color space to the CIE 1976 (L*, a*, b*) color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from LMS to XYZ using lmsToXYZ()
 * 2. Converting from XYZ to Lab using xyzToLab()
 *
 * @param {LMSColor} color - The input color in LMS color space, containing l, m, s components
 *                          and an optional alpha transparency value.
 * @returns {LabColor} The resulting color in Lab color space, containing l (lightness),
 *                     a (green-red), b (blue-yellow) components and the optional alpha value if provided.
 */
export const lmsToLab = (color: LMSColor): LabColor => xyzToLab(lmsToXYZ(color));

/**
 * Converts a color from the LMS color space to the CIE 1976 (L*, C*, h) color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from LMS to XYZ using lmsToXYZ()
 * 2. Converting from XYZ to LCH using xyzToLch()
 *
 * @param {LMSColor} color - The input color in LMS color space, containing l, m, s components
 *                          and an optional alpha transparency value.
 * @returns {LchColor} The resulting color in LCH color space, containing l (lightness),
 *                     c (chroma), h (hue) components and the optional alpha value if provided.
 */
export const lmsToLCh = (color: LMSColor): LchColor => xyzToLch(lmsToXYZ(color));

/**
 * Converts a color from the LMS color space to the Oklab color space.
 *
 * The conversion process involves a non-linear transformation using a matrix that
 * maps the LMS color space to the Oklab color space.
 *
 * @param {LMSColor} color - The input color in LMS color space, containing l, m, s components
 *                          and an optional alpha transparency value.
 * @returns {OklabColor} The resulting color in Oklab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const lmsToOklab = (color: LMSColor): OklabColor => {
  const nonLinear = [Math.cbrt(color.l), Math.cbrt(color.m), Math.cbrt(color.s)];

  const oklab = multiplyMatrixByVector(LMS_OKLAB_MATRIX, nonLinear);
  return { l: oklab[0], a: oklab[1], b: oklab[2], alpha: color.alpha };
};

/**
 * Converts a color from the LMS color space to the Oklch color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from LMS to Oklab using lmsToOklab()
 * 2. Converting from Oklab to Oklch using oklabToOklch()
 *
 * @param {LMSColor} color - The input color in LMS color space, containing l, m, s components
 *                          and an optional alpha transparency value.
 * @returns {OklchColor} The resulting color in Oklch color space, containing l, c, h components
 *                     and the optional alpha value if provided.
 */
export const lmsToOklch = (color: LMSColor): OklchColor => oklabToOklch(lmsToOklab(color));
