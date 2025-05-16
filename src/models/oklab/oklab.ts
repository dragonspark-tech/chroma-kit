import { LMSColor, lmsToLab, lmsToLCh, lmsToXYZ } from '../lms/lms';
import { OKLAB_LMS_MATRIX } from './constants';
import { multiplyMatrixByVector } from '../../utils/linear';
import { XYZColor, xyzToRGB } from '../xyz/xyz';
import { RGBColor } from '../rgb/rgb';
import { OklchColor } from '../oklch/oklch';
import { LabColor } from '../lab/lab';
import { LChColor } from '../lch/lch';

export type OklabColor = {
  l: number;
  a: number;
  b: number;
  alpha?: number;
};

/**
 * Converts a color from the Oklab color space to the RGB color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklab to XYZ using oklabToXYZ()
 * 2. Converting from XYZ to RGB using xyzToRGB()
 *
 * @param {OklabColor} color - The input color in Oklab color space, containing l, a, b components
 *                          and an optional alpha transparency value.
 * @returns {RGBColor} The resulting color in RGB color space, containing r, g, b components
 *                     and the optional alpha value if provided.
 */
export const oklabToRGB = (color: OklabColor): RGBColor => xyzToRGB(oklabToXYZ(color));

/**
 * Converts a color from the Oklab color space to the XYZ color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklab to LMS using oklabToLMS()
 * 2. Converting from LMS to XYZ using lmsToXYZ()
 *
 * @param {OklabColor} color - The input color in Oklab color space, containing l, a, b components
 *                          and an optional alpha transparency value.
 * @returns {XYZColor} The resulting color in XYZ color space, containing x, y, z components
 *                     and the optional alpha value if provided.
 */
export const oklabToXYZ = (color: OklabColor): XYZColor => lmsToXYZ(oklabToLMS(color));

/**
 * Converts a color from the Oklab color space to the LMS color space.
 *
 * The conversion process involves a linear transformation using a matrix that
 * maps the Oklab color space to the LMS color space.
 *
 * @param {OklabColor} color - The input color in Oklab color space, containing l, a, b components
 *                          and an optional alpha transparency value.
 * @returns {LMSColor} The resulting color in LMS color space, containing l, m, s components
 *                     and the optional alpha value if provided.
 */
export const oklabToLMS = (color: OklabColor): LMSColor => {
  const lms = multiplyMatrixByVector(OKLAB_LMS_MATRIX, [color.l, color.a, color.b]);
  return { l: lms[0], m: lms[1], s: lms[2], alpha: color.alpha };
};

/**
 * Converts a color from the Oklab color space to the Lab color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklab to LMS using oklabToLMS()
 * 2. Converting from LMS to Lab using lmsToLab()
 *
 * @param {OklabColor} color - The input color in Oklab color space, containing l, a, b components
 *                          and an optional alpha transparency value.
 * @returns {LabColor} The resulting color in Lab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const oklabToLab = (color: OklabColor): LabColor => lmsToLab(oklabToLMS(color));

/**
 * Converts a color from the Oklab color space to the LCh color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklab to LMS using oklabToLMS()
 * 2. Converting from LMS to LCh using lmsToLCh()
 *
 * @param {OklabColor} color - The input color in Oklab color space, containing l, a, b components
 *                          and an optional alpha transparency value.
 * @returns {LChColor} The resulting color in LCh color space, containing l, c, h components
 *                     and the optional alpha value if provided.
 */
export const oklabToLCh = (color: OklabColor): LChColor => lmsToLCh(oklabToLMS(color));

/**
 * Converts a color from the Oklab color space to the Oklch color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklab to LMS using oklabToLMS()
 * 2. Converting from LMS to Oklch using lmsToOklch()
 *
 * @param {OklabColor} color - The input color in Oklab color space, containing l, a, b components
 *                          and an optional alpha transparency value.
 * @returns {OklchColor} The resulting color in Oklch color space, containing l, c, h components
 *                     and the optional alpha value if provided.
 */
export const oklabToOklch = (color: OklabColor): OklchColor => {
  const C = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;

  return { l: color.l, c: C, h, alpha: color.alpha };
};
