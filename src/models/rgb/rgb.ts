import { XYZColor, xyzToLab, xyzToLCh, xyzToOKLab } from '../xyz/xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { RGB_XYZ_MATRIX } from './constants';
import { denormalizeRGBColor, linearizeRGBColor, normalizeRGBColor } from './transform';
import { getAdaptationMatrix } from '../../adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { BradfordConeModel } from '../../adaptation/cone-response';
import { LabColor } from '../lab/lab';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { OKLChColor } from '../oklch/oklch';
import { LChColor } from '../lch/lch';

/**
 * Represents a color in the RGB color space.
 *
 * The RGB color model is an additive color model in which red, green, and blue light
 * are added together in various ways to reproduce a broad array of colors.
 *
 * @property {number} r - The red component (0-1 for normalized values, 0-255 for denormalized)
 * @property {number} g - The green component (0-1 for normalized values, 0-255 for denormalized)
 * @property {number} b - The blue component (0-1 for normalized values, 0-255 for denormalized)
 * @property {number} [a] - The alpha (opacity) component (0-1), optional
 */
export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

/**
 * Converts a hexadecimal color string to an RGB color object.
 *
 * This function supports various hex formats:
 * - 3 digits: #RGB (shorthand, each digit is repeated)
 * - 4 digits: #RGBA (shorthand with alpha)
 * - 6 digits: #RRGGBB (full hex)
 * - 8 digits: #RRGGBBAA (full hex with alpha)
 *
 * The leading '#' character is optional. The function uses character code
 * comparisons for performance and returns a normalized RGB color (values in 0-1 range).
 *
 * @param {string} hex - The hexadecimal color string to convert
 * @returns {RGBColor} The RGB color object with normalized values (0-1)
 * @throws {Error} If the hex string format is invalid
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
 * Converts an RGB color object to a hexadecimal color string.
 *
 * This function automatically determines whether to use shorthand notation
 * when possible (e.g., #abc instead of #aabbcc). It handles alpha values
 * and will include them in the hex string only if they're defined and not 255 (fully opaque).
 *
 * The function first denormalizes the RGB values (converts from 0-1 to 0-255 range),
 * then formats them as a hex string.
 *
 * @param {RGBColor} color - The RGB color object to convert
 * @returns {string} The hexadecimal color string (with leading '#')
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
 * Converts an RGB color to the CIE XYZ color space.
 *
 * This function first linearizes the RGB color values (removes gamma correction),
 * then applies the RGB to XYZ transformation matrix. Optionally, it can perform
 * chromatic adaptation to convert from the D65 white point (standard for sRGB)
 * to the D50 white point (commonly used in other color spaces).
 *
 * @param {RGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {XYZColor} The color in XYZ space, with the appropriate illuminant specified
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
 * Converts an RGB color to the CIE Lab color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {RGBColor} rgb - The RGB color to convert
 * @returns {LabColor} The color in Lab space
 */
export const rgbToLab = (rgb: RGBColor): LabColor =>
  xyzToLab(rgbToXYZ(rgb));

/**
 * Converts an RGB color to the CIE LCh color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {RGBColor} rgb - The RGB color to convert
 * @returns {LChColor} The color in LCh space
 */
export const rgbToLCH = (rgb: RGBColor): LChColor =>
  xyzToLCh(rgbToXYZ(rgb));

/**
 * Converts an RGB color to the OKLab color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {RGBColor} rgb - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLabColor} The color in OKLab space
 */
export const rgbToOKLab = (rgb: RGBColor, useChromaticAdaptation: boolean = false): OKLabColor =>
  xyzToOKLab(rgbToXYZ(rgb, useChromaticAdaptation));

/**
 * Converts an RGB color to the OKLCh color space.
 *
 * This function first converts the RGB color to OKLab, then from OKLab to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {RGBColor} rgb - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLChColor} The color in OKLCh space
 */
export const rgbToOKLCh = (rgb: RGBColor, useChromaticAdaptation: boolean = false): OKLChColor =>
  oklabToOKLCh(rgbToOKLab(rgb, useChromaticAdaptation));
