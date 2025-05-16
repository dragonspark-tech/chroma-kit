import { LabColor, labToXYZ } from '../lab/lab';
import { LMSColor, lmsToOklab } from '../lms/lms';
import { OklabColor, oklabToOklch } from '../oklab/oklab';
import { OklchColor } from '../oklch/oklch';
import { RGBColor } from '../rgb/rgb';
import { XYZColor, xyzToLMS, xyzToRGB } from '../xyz/xyz';

export type LchColor = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

/**
 *
 * The conversion process involves two steps:
 * 1. Converting from LCH to XYZ using lchToXYZ()
 * 2. Converting from XYZ to RGB using xyzToRGB()
 *
 * @param {LchColor} color - The input color in LCH color space, containing l (lightness),
 *                          c (chroma), and h (hue) components and an optional alpha value.
 * @returns {RGBColor} The resulting color in RGB color space, containing r, g, b components
 *                     and the optional alpha value if provided.
 */
export const lchToRGB = (color: LchColor): RGBColor => xyzToRGB(lchToXYZ(color));

/**
 * Converts a color from the CIE 1976 (L*, C*, h) color space to the CIE 1931 XYZ color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from LCH to Lab using lchToLab()
 * 2. Converting from Lab to XYZ using labToXYZ()
 *
 * @param {LchColor} color - The input color in LCH color space, containing l (lightness),
 *                          c (chroma), and h (hue) components and an optional alpha value.
 * @returns {XYZColor} The resulting color in XYZ color space, containing x, y, z components
 *                     and the optional alpha value if provided.
 */
export const lchToXYZ = (color: LchColor): XYZColor => labToXYZ(lchToLab(color));

/**
 *
 * The conversion process involves two steps:
 * 1. Converting from LCH to XYZ using lchToXYZ()
 * 2. Converting from XYZ to LMS using xyzToLMS()
 *
 * @param {LchColor} color - The input color in LCH color space, containing l (lightness),
 *                          c (chroma), and h (hue) components and an optional alpha value.
 * @returns {LMSColor} The resulting color in LMS color space, containing l, m, s components
 *                     and the optional alpha value if provided.
 */
export const lchToLMS = (color: LchColor): LMSColor => xyzToLMS(lchToXYZ(color));

/**
 * Converts a color from the CIE 1976 (L*, C*, h) color space to the CIE 1976 (L*, a*, b*) color space.
 *
 * The conversion process involves calculating the a and b components from the chroma (C*) and hue (h).
 *
 * @param {LchColor} color - The input color in LCH color space, containing l (lightness),
 *                          c (chroma), and h (hue) components and an optional alpha value.
 * @returns {LabColor} The resulting color in Lab color space, containing l (lightness),
 *                     a (green-red), b (blue-yellow) components and the optional alpha value if provided.
 */
export const lchToLab = (color: LchColor): LabColor => {
  const hRad = (color.h * Math.PI) / 180; // deg → rad
  return {
    l: color.l,
    a: color.c * Math.cos(hRad),
    b: color.c * Math.sin(hRad),
    alpha: color.alpha
  };
};

/**
 *
 * The conversion process involves two steps:
 * 1. Converting from LCH to LMS using lchToLMS()
 * 2. Converting from LMS to Oklab using lmsToOklab()
 *
 * @param {LchColor} color - The input color in LCH color space, containing l (lightness),
 *                          c (chroma), and h (hue) components and an optional alpha value.
 * @returns {OklabColor} The resulting color in Oklab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const lchToOKLab = (color: LchColor): OklabColor => lmsToOklab(lchToLMS(color));

/**
 *
 * The conversion process involves two steps:
 * 1. Converting from LCH to Oklab using lchToOKLab()
 * 2. Converting from Oklab to Oklch using oklabToOklch()
 *
 * @param {LchColor} color - The input color in LCH color space, containing l (lightness),
 *                          c (chroma), and h (hue) components and an optional alpha value.
 * @returns {OklchColor} The resulting color in Oklch color space, containing l, c, h components
 *                     and the optional alpha value if provided.
 */
export const lchToOklch = (color: LchColor): OklchColor => oklabToOklch(lchToOKLab(color));
