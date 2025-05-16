import type { LabColor } from '../lab/lab';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { ϵ, κ } from '../lab/constants';
import { RGBColor } from '../rgb/rgb';
import { multiplyMatrixByVector } from '../../utils/linear';
import { delinearizeRGBColor } from '../rgb/transform';
import { XYZ_RGB_MATRIX } from './constants';
import { LMSColor, lmsToOklab } from '../lms/lms';
import { LMS_XYZ_MATRIX } from '../lms/constants';
import { OklabColor, oklabToOklch } from '../oklab/oklab';
import { LchColor } from '../lch/lch';
import { OklchColor } from '../oklch/oklch';

export type XYZColor = {
  x: number;
  y: number;
  z: number;
  alpha?: number;
  illuminant?: Illuminant;
};

/**
 * Converts a color from the CIE 1931 XYZ color space to the sRGB color space.
 *
 * The conversion process involves two steps:
 * 1. Transforming XYZ values to linear RGB using a standardized transformation matrix
 * 2. Converting linear RGB to gamma-corrected RGB (sRGB) using the inverse gamma transfer function
 *
 * @param {XYZColor} color - The input color in XYZ color space, containing x, y, z components
 *                          and an optional alpha transparency value.
 * @returns {RGBColor} The resulting color in sRGB color space, containing r, g, b components
 *                     in the range [0,1] and the optional alpha value if provided.
 */
export const xyzToRGB = (color: XYZColor): RGBColor => {
  const lRGB = multiplyMatrixByVector(XYZ_RGB_MATRIX, [color.x, color.y, color.z]);
  return delinearizeRGBColor({ r: lRGB[0], g: lRGB[1], b: lRGB[2], a: color.alpha });
};

/**
 * Converts a color from the CIE 1931 XYZ color space to the LMS color space.
 *
 * The conversion process involves a linear transformation using a matrix that
 * maps the XYZ color space to the LMS color space.
 *
 * @param {XYZColor} color - The input color in XYZ color space, containing x, y, z components
 *                          and an optional alpha transparency value.
 * @returns {LMSColor} The resulting color in LMS color space, containing l, m, s components
 *                     and the optional alpha value if provided.
 */
export const xyzToLMS = (color: XYZColor): LMSColor => {
  const lms = multiplyMatrixByVector(LMS_XYZ_MATRIX, [color.x, color.y, color.z]);
  return { l: lms[0], m: lms[1], s: lms[2], alpha: color.alpha };
};

/**
 * Converts XYZ color space values to Lab color space values.
 *
 * The function takes color values in the CIE 1931 XYZ color space and converts
 * them to the CIE 1976 (L*, a*, b*) color space. It also adjusts the
 * transformation based on the reference white illuminant provided in the input,
 * defaulting to Illuminant D65 if none is provided.
 *
 * @param {XYZColor} color - An object representing a color in the XYZ color
 * space, including its x, y, z components, an optional illuminant, and an
 * optional alpha transparency value.
 * @returns {LabColor} An object representing a color in the Lab color space,
 * containing the l (lightness), a (green-red axis), b (blue-yellow axis), and
 * the optional alpha transparency value.
 */
export const xyzToLab = (color: XYZColor): LabColor => {
  const i = color.illuminant || IlluminantD65;

  const xn = color.x / i.xR,
    yn = color.y / i.yR,
    zn = color.z / i.zR;

  const fx = xn > ϵ ? Math.cbrt(xn) : (κ * xn + 16) / 116;
  const fy = yn > ϵ ? Math.cbrt(yn) : (κ * yn + 16) / 116;
  const fz = zn > ϵ ? Math.cbrt(zn) : (κ * zn + 16) / 116;

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
    alpha: color.alpha
  };
};

/**
 * Converts a color from the CIE 1931 XYZ color space to the CIE 1976 (L*, C*, h) color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from XYZ to Lab using xyzToLab()
 * 2. Converting from Lab to LCH using labToLCH()
 *
 * @param {XYZColor} color - The input color in XYZ color space, containing x, y, z components
 *                          and an optional alpha transparency value.
 * @returns {LchColor} The resulting color in LCH color space, containing l (lightness),
 */
export const xyzToLch = (color: XYZColor): LchColor => {
  const { l, a, b, alpha } = xyzToLab(color);

  const c = Math.hypot(a, b);
  const h = c === 0 ? Number.NaN : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;

  return { l, c, h, alpha };
};

/**
 * Converts a color from the XYZ color space to the Oklab color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from XYZ to LMS using xyzToLMS()
 * 2. Converting from LMS to Oklab using lmsToOklab()
 *
 * @param {XYZColor} color - The input color in XYZ color space, containing x, y, z components
 *                          and an optional alpha transparency value.
 * @returns {OklabColor} The resulting color in Oklab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const xyzToOKLab = (color: XYZColor): OklabColor => lmsToOklab(xyzToLMS(color));

/**
 * Converts a color from the XYZ color space to the Oklch color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from XYZ to Oklab using xyzToOKLab()
 * 2. Converting from Oklab to Oklch using oklabToOklch()
 */
export const xyzToOklch = (color: XYZColor): OklchColor => oklabToOklch(xyzToOKLab(color));
