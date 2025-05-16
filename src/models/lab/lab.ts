import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { XYZColor, xyzToLMS, xyzToRGB } from '../xyz/xyz';
import { ϵ, κ } from './constants';
import { RGBColor } from '../rgb/rgb';
import { LChColor } from '../lch/lch';
import { LMSColor, lmsToOklab } from '../lms/lms';
import { OklabColor, oklabToOklch } from '../oklab/oklab';
import { OklchColor } from '../oklch/oklch';

export type LabColor = {
  l: number;
  a: number;
  b: number;
  alpha?: number;
};

/**
 * Converts a color from the CIE 1976 (L*, a*, b*) color space to the sRGB color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Lab to XYZ color space using labToXYZ()
 * 2. Converting from XYZ to sRGB color space using xyzToRGB()
 *
 * @param {LabColor} color - The input color in Lab color space, containing l (lightness),
 *                          a (green-red), b (blue-yellow) components and an optional alpha value.
 * @returns {RGBColor} The resulting color in sRGB color space, containing r, g, b components
 *                     in the range [0,1] and the optional alpha value if provided.
 */
export const labToRGB = (color: LabColor): RGBColor => xyzToRGB(labToXYZ(color));

/**
 * Converts Lab color space values to XYZ color space values.
 *
 * The function takes color values in the CIE 1976 (L*, a*, b*) color space and converts
 * them to the CIE 1931 XYZ color space. It also adjusts the transformation based on the
 * reference white illuminant provided in the input, defaulting to Illuminant D65 if none is provided.
 *
 * @param {LabColor} color - An object representing a color in the Lab color space,
 * including its l, a, b components, and an optional alpha transparency value.
 * @param {Illuminant} [illuminant] - Optional reference white. Defaults to D65.
 * @returns {XYZColor} An object representing a color in the XYZ color space,
 * containing the x, y, z, and the optional alpha transparency value.
 */
export const labToXYZ = (color: LabColor, illuminant?: Illuminant): XYZColor => {
  const i = illuminant || IlluminantD65;

  const fy = (color.l + 16) / 116;
  const fx = fy + color.a / 500;
  const fz = fy - color.b / 200;

  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);

  const xn = fx3 > ϵ ? fx3 : (116 * fx - 16) / κ;
  const yn = color.l > κ * ϵ ? fy3 : color.l / κ;
  const zn = fz3 > ϵ ? fz3 : (116 * fz - 16) / κ;

  return {
    x: xn * i.xR,
    y: yn * i.yR,
    z: zn * i.zR,
    alpha: color.alpha,
    illuminant: i
  };
};

/**
 * Converts a color from the CIE 1976 (L*, a*, b*) color space to the LMS color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Lab to XYZ color space using labToXYZ()
 * 2. Converting from XYZ to LMS color space using xyzToLMS()
 *
 * @param {LabColor} color - The input color in Lab color space, containing l (lightness),
 *                          a (green-red), b (blue-yellow) components and an optional alpha value.
 * @returns {LMSColor} The resulting color in LMS color space, containing l, m, s components
 *                     and the optional alpha value if provided.
 */
export const labToLMS = (color: LabColor): LMSColor => xyzToLMS(labToXYZ(color));

/**
 * Converts a color from the CIE 1976 (L*, a*, b*) color space to the CIE 1976 (L*, C*, h) color space.
 *
 * The conversion process involves calculating the chroma (C*) and hue (h) from the a and b components.
 *
 * @param {LabColor} color - The input color in Lab color space, containing l (lightness),
 *                          a (green-red), b (blue-yellow) components and an optional alpha value.
 * @returns {LChColor} The resulting color in LCH color space, containing l (lightness),
 *                     c (chroma), and h (hue) components and the optional alpha value if provided.
 */
export const labToLCH = (color: LabColor): LChColor => {
  const c = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;
  return { l: color.l, c, h };
};

/**
 * Converts a color from the CIE 1976 (L*, a*, b*) color space to the Oklab color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Lab to LMS using labToLMS()
 * 2. Converting from LMS to Oklab using lmsToOklab()
 *
 * @param {LabColor} color - The input color in Lab color space, containing l (lightness),
 *                          a (green-red), b (blue-yellow) components and an optional alpha value.
 * @returns {OklabColor} The resulting color in Oklab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const labToOklab = (color: LabColor): OklabColor => {
  return lmsToOklab(labToLMS(color));
};

/**
 * Converts a color from the CIE 1976 (L*, a*, b*) color space to the Oklch color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Lab to Oklab using labToOklab()
 * 2. Converting from Oklab to Oklch using oklabToOklch()
 *
 * @param {LabColor} color - The input color in Lab color space, containing l (lightness),
 *                          a (green-red), b (blue-yellow) components and an optional alpha value.
 * @returns {OklchColor} The resulting color in Oklch color space, containing l, c, h components
 *                     and the optional alpha value if provided.
 */
export const labToOklch = (color: LabColor): OklchColor => {
  return oklabToOklch(labToOklab(color));
};
