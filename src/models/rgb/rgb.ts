import { XYZColor, xyzToLab, xyzToLCh, xyzToLMS, xyzToOKLab } from '../xyz/xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { RGB_XYZ_MATRIX } from './constants';
import { denormalizeRGBColor, linearizeRGBColor, normalizeRGBColor } from './transform';
import { getAdaptationMatrix } from '../../adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { BradfordConeModel } from '../../adaptation/cone-response';
import { LabColor } from '../lab/lab';
import { LMSColor } from '../lms/lms';
import { OklabColor, oklabToOklch } from '../oklab/oklab';
import { OklchColor } from '../oklch/oklch';
import { LChColor } from '../lch/lch';

export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

/**
 * Converts a hexadecimal color string into an RGBColor object.
 *
 * The input string can be in the following formats:
 * - 3-digit hex (`#RGB`)
 * - 4-digit hex (`#RGBA`)
 * - 6-digit hex (`#RRGGBB`)
 * - 8-digit hex (`#RRGGBBAA`)
 *
 * The function supports both shorthand and full hex notations with or without a leading `#`.
 *
 * @param {string} hex - The hexadecimal color string to convert.
 * @returns {RGBColor} An object representing the color in RGBA format with `r`, `g`, `b` values (0-255),
 *                     and an optional `a` alpha value (0-1). If the alpha value is not provided in the input,
 *                     it will be omitted from the returned object.
 * @throws {Error} If the input string is not a valid hexadecimal color format.
 */
export const hexToRGB = (hex: string): RGBColor => {
  // Avoid allocating a new string when possible.
  let offset = 0;
  if (hex.charCodeAt(0) === 35) {
    // 35 === '#'
    offset = 1;
  }
  const len = hex.length - offset;
  let r: number, g: number, b: number, a: number | undefined;

  // For shorthand hex (3 or 4 digits) multiply each digit by 17.
  if (len === 3 || len === 4) {
    const c0 = hex.charCodeAt(offset),
      c1 = hex.charCodeAt(offset + 1),
      c2 = hex.charCodeAt(offset + 2);
    const v0 = c0 < 58 ? c0 - 48 : (c0 & 0xdf) - 55;
    const v1 = c1 < 58 ? c1 - 48 : (c1 & 0xdf) - 55;
    const v2 = c2 < 58 ? c2 - 48 : (c2 & 0xdf) - 55;
    r = v0 * 17;
    g = v1 * 17;
    b = v2 * 17;
    if (len === 4) {
      const c3 = hex.charCodeAt(offset + 3);
      const v3 = c3 < 58 ? c3 - 48 : (c3 & 0xdf) - 55;
      a = (v3 * 17) / 255;
    }
  }
  // For full hex (6 or 8 digits) convert each pair manually.
  else if (len === 6 || len === 8) {
    const c0 = hex.charCodeAt(offset),
      c1 = hex.charCodeAt(offset + 1),
      c2 = hex.charCodeAt(offset + 2),
      c3 = hex.charCodeAt(offset + 3),
      c4 = hex.charCodeAt(offset + 4),
      c5 = hex.charCodeAt(offset + 5);
    const v0 = c0 < 58 ? c0 - 48 : (c0 & 0xdf) - 55;
    const v1 = c1 < 58 ? c1 - 48 : (c1 & 0xdf) - 55;
    const v2 = c2 < 58 ? c2 - 48 : (c2 & 0xdf) - 55;
    const v3 = c3 < 58 ? c3 - 48 : (c3 & 0xdf) - 55;
    const v4 = c4 < 58 ? c4 - 48 : (c4 & 0xdf) - 55;
    const v5 = c5 < 58 ? c5 - 48 : (c5 & 0xdf) - 55;
    r = (v0 << 4) | v1;
    g = (v2 << 4) | v3;
    b = (v4 << 4) | v5;
    if (len === 8) {
      const c6 = hex.charCodeAt(offset + 6),
        c7 = hex.charCodeAt(offset + 7);
      const v6 = c6 < 58 ? c6 - 48 : (c6 & 0xdf) - 55;
      const v7 = c7 < 58 ? c7 - 48 : (c7 & 0xdf) - 55;
      a = ((v6 << 4) | v7) / 255;
    }
  } else {
    throw new Error('Invalid hex color format');
  }
  return normalizeRGBColor({ r, g, b, a });
};

/**
 * Converts an RGBColor object to a hexadecimal color string.
 *
 * The output will be the shortest valid hex string:
 * - 3-digit hex (`#RGB`) if possible
 * - 4-digit hex (`#RGBA`) if possible
 * - 6-digit hex (`#RRGGBB`) otherwise
 * - 8-digit hex (`#RRGGBBAA`) if alpha is present and not 1
 *
 * @param {RGBColor} color - The color to convert.
 * @returns {string} The hexadecimal color string.
 */
export function rgbToHex(color: RGBColor): string {
  const nC = denormalizeRGBColor(color);

  let r = Math.round(nC.r),
    g = Math.round(nC.g),
    b = Math.round(nC.b);
  let a = nC.a;
  let alpha: number | undefined = undefined;
  if (a !== undefined) {
    alpha = Math.round(a * 255);
  }

  // Check for shorthand possibility (e.g., #abc or #abcd)
  const isShort = (n: number) => (n & 0xf0) >> 4 === (n & 0x0f);
  const canShort =
    isShort(r) && isShort(g) && isShort(b) && (alpha === undefined || isShort(alpha));

  if (canShort) {
    let hex = `#${((r & 0xf0) >> 4).toString(16)}${((g & 0xf0) >> 4).toString(16)}${((b & 0xf0) >> 4).toString(16)}`;
    if (alpha !== undefined && alpha !== 255) {
      hex += ((alpha & 0xf0) >> 4).toString(16);
    }
    return hex;
  }

  // Full hex
  let hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  if (alpha !== undefined && alpha !== 255) {
    hex += alpha.toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Converts an RGB color to the CIE 1931 XYZ color space.
 *
 * @param {RGBColor} color - The input color in the RGB color space.
 * @param {boolean} [useChromaticAdaptation=true] - Determines whether chromatic adaptation
 *        is applied during the conversion. If true, the base D65 color is adapted to D50.
 * @returns {XYZColor} The resulting XYZ color, including the alpha channel if present.
 */
export const rgbToXYZ = (color: RGBColor, useChromaticAdaptation: boolean = false): XYZColor => {
  const lC = linearizeRGBColor(color);
  const xyz = multiplyMatrixByVector(RGB_XYZ_MATRIX, [lC.r, lC.g, lC.b]);

  if (useChromaticAdaptation) {
    const adaptationMatrix = getAdaptationMatrix(IlluminantD65, IlluminantD50, BradfordConeModel);
    const adaptedXYZ = multiplyMatrixByVector(adaptationMatrix, xyz);

    return {
      x: adaptedXYZ[0],
      y: adaptedXYZ[1],
      z: adaptedXYZ[2],
      alpha: color.a,
      illuminant: IlluminantD50
    };
  }

  return {
    x: xyz[0],
    y: xyz[1],
    z: xyz[2],
    alpha: color.a,
    illuminant: IlluminantD65
  };
};

/**
 * Converts an RGB color to the LMS color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from RGB to XYZ color space using rgbToXYZ()
 * 2. Converting from XYZ to LMS color space using xyzToLMS()
 *
 * @param {RGBColor} rgb - The input color in sRGB color space, containing r, g, b components
 * @returns {LMSColor} The resulting color in LMS color space, containing l, m, s components
 *                     and an optional alpha value.
 */
export const rgbToLMS = (rgb: RGBColor): LMSColor => xyzToLMS(rgbToXYZ(rgb));

/**
 * Converts an RGB color to the CIE 1976 (L*, a*, b*) color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from RGB to XYZ color space using rgbToXYZ()
 * 2. Converting from XYZ to Lab color space using xyzToLab()
 *
 * @param {RGBColor} rgb - The input color in sRGB color space, containing r, g, b components
 * @returns {LabColor} The resulting color in Lab color space, containing l (lightness),
 *                     a (green-red), b (blue-yellow) components and an optional alpha value.
 */
export const rgbToLab = (rgb: RGBColor): LabColor => xyzToLab(rgbToXYZ(rgb));

/**
 * Converts an RGB color to the CIE 1976 (L*, C*, h) color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from RGB to XYZ color space using rgbToXYZ()
 * 2. Converting from XYZ to LCH color space using xyzToLCH()
 *
 * @param {RGBColor} rgb - The input color in sRGB color space, containing r, g, b components
 * @returns {LChColor} The resulting color in LCH color space, containing l (lightness),
 *                     c (chroma), and h (hue) components and an optional alpha value.
 */
export const rgbToLCH = (rgb: RGBColor): LChColor => xyzToLCh(rgbToXYZ(rgb));

/**
 * Converts an RGB color to the Oklab color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from RGB to XYZ using rgbToXYZ()
 * 2. Converting from XYZ to Oklab using xyzToOKLab()
 *
 * @param {RGBColor} rgb - The input color in sRGB color space, containing r, g, b components
 * @returns {OklabColor} The resulting color in Oklab color space, containing l, a, b components
 *                     and an optional alpha value.
 */
export const rgbToOKLab = (rgb: RGBColor): OklabColor => xyzToOKLab(rgbToXYZ(rgb));

/**
 * Converts an RGB color to the Oklch color space.
 *
 * The conversion process involves two steps:
 * 1. Converting from RGB to Oklab using rgbToOKLab()
 * 2. Converting from Oklab to Oklch using oklabToOklch()
 *
 * @param {RGBColor} rgb - The input color in sRGB color space, containing r, g, b components
 * @returns {OklchColor} The resulting color in Oklch color space, containing l, c, h components
 *                     and an optional alpha value.
 */
export const rgbToOklch = (rgb: RGBColor): OklchColor => oklabToOklch(rgbToOKLab(rgb));
