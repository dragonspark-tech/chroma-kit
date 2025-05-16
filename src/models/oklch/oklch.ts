import { LabColor } from '../lab/lab';
import { LchColor } from '../lch/lch';
import { LMSColor } from '../lms/lms';
import { OklabColor, oklabToLab, oklabToLCh, oklabToLMS, oklabToXYZ } from '../oklab/oklab';
import { RGBColor } from '../rgb/rgb';
import { XYZColor, xyzToRGB } from '../xyz/xyz';

export type OklchColor = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

/**
 * Converts a color from the Oklch color space to the RGB color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklch to XYZ using oklchToXYZ()
 * 2. Converting from XYZ to RGB using xyzToRGB()
 *
 * @param {OklchColor} color - The input color in Oklch color space, containing l, c, h components
 *                          and an optional alpha transparency value.
 * @returns {RGBColor} The resulting color in RGB color space, containing r, g, b components
 *                     and the optional alpha value if provided.
 */
export const oklchToRGB = (color: OklchColor): RGBColor => {
  const xyz = oklchToXYZ(color);
  return xyzToRGB(xyz);
};

/**
 * Converts a color from the Oklch color space to the XYZ color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklch to Oklab using oklchToOklab()
 * 2. Converting from Oklab to XYZ using oklabToXYZ()
 *
 * @param {OklchColor} color - The input color in Oklch color space, containing l, c, h components
 *                          and an optional alpha transparency value.
 * @returns {XYZColor} The resulting color in XYZ color space, containing x, y, z components
 *                     and the optional alpha value if provided.
 */
export const oklchToXYZ = (color: OklchColor): XYZColor => {
  const oklab = oklchToOklab(color);
  return oklabToXYZ(oklab);
};

/**
 * Converts a color from the Oklch color space to the LMS color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklch to Oklab using oklchToOklab()
 * 2. Converting from Oklab to LMS using oklabToLMS()
 *
 * @param {OklchColor} color - The input color in Oklch color space, containing l, c, h components
 *                          and an optional alpha transparency value.
 * @returns {LMSColor} The resulting color in LMS color space, containing l, m, s components
 *                     and the optional alpha value if provided.
 */
export const oklchToLMS = (color: OklchColor): LMSColor => {
  const oklab = oklchToOklab(color);
  return oklabToLMS(oklab);
};

/**
 * Converts a color from the Oklch color space to the Lab color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklch to Oklab using oklchToOklab()
 * 2. Converting from Oklab to Lab using oklabToLab()
 *
 * @param {OklchColor} color - The input color in Oklch color space, containing l, c, h components
 *                          and an optional alpha transparency value.
 * @returns {LabColor} The resulting color in Lab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const oklchToLab = (color: OklchColor): LabColor => oklabToLab(oklchToOklab(color));

/**
 * Converts a color from the Oklch color space to the Lch color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from Oklch to Oklab using oklchToOklab()
 * 2. Converting from Oklab to Lch using oklabToLCh()
 *
 * @param {OklchColor} color - The input color in Oklch color space, containing l, c, h components
 *                          and an optional alpha transparency value.
 * @returns {LchColor} The resulting color in Lch color space, containing l, c, h components
 *                     and the optional alpha value if provided.
 */
export const oklchToLCh = (color: OklchColor): LchColor => oklabToLCh(oklchToOklab(color));

/**
 * Converts a color from the Oklch color space to the Oklab color space.
 *
 * @param {OklchColor} color - The input color in Oklch color space, containing l, c, h components
 *                          and an optional alpha transparency value.
 * @returns {OklabColor} The resulting color in Oklab color space, containing l, a, b components
 *                     and the optional alpha value if provided.
 */
export const oklchToOklab = (color: OklchColor): OklabColor => {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);

  return { l: color.l, a, b, alpha: color.alpha };
};
