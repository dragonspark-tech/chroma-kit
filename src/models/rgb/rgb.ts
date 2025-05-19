import { XYZColor, xyzFromVector, xyzToJzAzBz, xyzToJzCzHz, xyzToLab, xyzToLCh, xyzToOKLab } from '../xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { RGB_INVERSE, RGB_XYZ_MATRIX } from './constants';
import { denormalizeRGBColor, linearizeRGBColor, normalizeRGBColor } from './transform';
import { getAdaptationMatrix } from '../../adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { BradfordConeModel } from '../../adaptation/cone-response';
import { LabColor } from '../lab';
import { OKLabColor, oklabToOKLCh } from '../oklab';
import { OKLChColor } from '../oklch';
import { LChColor } from '../lch';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';
import { hsl, HSLColor } from '../hsl';
import { hsv, HSVColor } from '../hsv';
import { serializeV1 } from '../../semantics/serialization';
import { ColorBase, ColorSpace } from '../../foundation';
import { convertColor } from '../../conversion/conversion';

/**
 * Represents a color in the RGB color space.
 *
 * The RGB color model is an additive color model in which red, green, and blue lights
 * are added together in various ways to reproduce a broad array of colors.
 *
 * @property {number} r - The red component (0-1 for normalized values, 0-255 for denormalized)
 * @property {number} g - The green component (0-1 for normalized values, 0-255 for denormalized)
 * @property {number} b - The blue component (0-1 for normalized values, 0-255 for denormalized)
 * @property {number} [a] - The alpha (opacity) component (0-1), optional
 */
export interface RGBColor extends ColorBase {
  space: 'rgb';

  r: number;
  g: number;
  b: number;
}

export const rgbToCSSString = (color: RGBColor, forceFullString: boolean = false): string => {
  const { r, g, b, alpha } = color;

  // Convert to 0-255 range for CSS
  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);

  if (alpha !== undefined && (alpha < 1 || forceFullString)) {
    return `rgba(${rInt}, ${gInt}, ${bInt}, ${alpha.toFixed(3)})`;
  }

  // For fully opaque colors, use hex format as it's more compact
  return rgbToHex(color);
};

export const rgb = (r: number, g: number, b: number, alpha?: number): RGBColor => ({
  space: 'rgb',

  r,
  g,
  b,
  alpha,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return rgbToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<RGBColor, T>(this, colorSpace);
  }
});

export const rgbFromVector = (v: number[], alpha?: number): RGBColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return rgb(v[0], v[1], v[2], alpha);
};

/**
 * Converts a given number into its hexadecimal digit representation.
 *
 * This function extracts the lower 4 bits of the given number and
 * computes a hexadecimal digit by applying an adjustment based
 * on the upper bits of the input. The result is a single hexadecimal
 * digit value.
 *
 * @param {number} c - The input number from which the hexadecimal digit is derived.
 * @returns {number} The calculated hexadecimal digit.
 */
const hexDigit = (c: number): number => (c & 0xf) + (c >> 6) * 9;

/**
 * Converts a hex color string representation into an RGBColor object.
 *
 * The input can be in the formats:
 * - `#RGB` or `#RGBA` where the single hex digit is expanded (e.g., `#F0A` becomes `#FF00AA`).
 * - `#RRGGBB` or `#RRGGBBAA` where each two-digit pair represents a color channel.
 *
 * The output object contains the red, green, blue color channels and optionally the alpha channel
 * (transparency) in normalized format.
 *
 * @param {string} hex - The hexadecimal color code string. This can optionally start with a `#` and
 *   must be in one of the valid formats (`#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`).
 * @returns {RGBColor} An object representing the RGB color with properties for red, green, blue,
 *   and optionally alpha transparency (normalized between 0 and 1).
 * @throws {Error} If the provided `hex` string has an invalid format or length.
 */
export const hexToRGB = (hex: string): RGBColor => {
  let i = hex.charCodeAt(0) === 35 ? 1 : 0;
  const n = hex.length - i;

  let r: number, g: number, b: number, a: number | undefined;

  if (n === 3 || n === 4) {
    const c0 = hex.charCodeAt(i);
    const c1 = hex.charCodeAt(i + 1);
    const c2 = hex.charCodeAt(i + 2);

    r = hexDigit(c0) * 17;
    g = hexDigit(c1) * 17;
    b = hexDigit(c2) * 17;

    if (n === 4) {
      const c3 = hex.charCodeAt(i + 3);
      a = hexDigit(c3) * 17 * RGB_INVERSE;
    }
  } else if (n === 6 || n === 8) {
    const c0 = hex.charCodeAt(i);
    const c1 = hex.charCodeAt(i + 1);
    const c2 = hex.charCodeAt(i + 2);
    const c3 = hex.charCodeAt(i + 3);
    const c4 = hex.charCodeAt(i + 4);
    const c5 = hex.charCodeAt(i + 5);

    r = (hexDigit(c0) << 4) | hexDigit(c1);
    g = (hexDigit(c2) << 4) | hexDigit(c3);
    b = (hexDigit(c4) << 4) | hexDigit(c5);

    if (n === 8) {
      const c6 = hex.charCodeAt(i + 6);
      const c7 = hex.charCodeAt(i + 7);
      a = ((hexDigit(c6) << 4) | hexDigit(c7)) * RGB_INVERSE;
    }
  } else {
    throw new Error('Invalid hex color format');
  }

  return normalizeRGBColor(rgb(r, g, b, a));
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
export const rgbToHex = (color: RGBColor): string => {
  const nC = denormalizeRGBColor(color);

  // Clamp values to valid range (0-255) and round
  let r = Math.max(0, Math.min(255, Math.round(nC.r))),
    g = Math.max(0, Math.min(255, Math.round(nC.g))),
    b = Math.max(0, Math.min(255, Math.round(nC.b)));
  let a = nC.alpha;
  let alpha: number | undefined = undefined;
  if (a !== undefined) {
    alpha = Math.max(0, Math.min(255, Math.round(a * 255)));
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
};

export const rgbToHSL = (color: RGBColor): HSLColor => {
  const [r, g, b] = [color.r, color.g, color.b];

  let max = r,
    min = r;

  if (g > max) max = g;
  if (b > max) max = b;
  if (g < min) min = g;
  if (b < min) min = b;
  const l = (max + min) * 0.5;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h >= 360) h -= 360;
  }

  return hsl(h, s, l, color.alpha);
};

export const rgbToHSV = (color: RGBColor): HSVColor => {
  const [r, g, b] = [color.r, color.g, color.b];

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  let h = 0;
  if (d !== 0) {
    if (max === r) {
      h = ((g - b) / d) % 6;
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return hsv(h, s, v, color.alpha);
};

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

    return xyzFromVector(adaptedXYZ, color.alpha, IlluminantD50);
  }

  return xyzFromVector(xyz, color.alpha, IlluminantD65);
};

/**
 * Converts an RGB color to the CIE Lab color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @returns {LabColor} The color in Lab space
 */
export const rgbToLab = (color: RGBColor): LabColor => xyzToLab(rgbToXYZ(color));

/**
 * Converts an RGB color to the CIE LCh color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @returns {LChColor} The color in LCh space
 */
export const rgbToLCH = (color: RGBColor): LChColor => xyzToLCh(rgbToXYZ(color));

/**
 * Converts an RGB color to the OKLab color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLabColor} The color in OKLab space
 */
export const rgbToOKLab = (color: RGBColor, useChromaticAdaptation: boolean = false): OKLabColor =>
  xyzToOKLab(rgbToXYZ(color, useChromaticAdaptation));

/**
 * Converts an RGB color to the OKLCh color space.
 *
 * This function first converts the RGB color to OKLab, then from OKLab to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLChColor} The color in OKLCh space
 */
export const rgbToOKLCh = (color: RGBColor, useChromaticAdaptation: boolean = false): OKLChColor =>
  oklabToOKLCh(rgbToOKLab(color, useChromaticAdaptation));

/**
 * Converts an RGB color to the JzAzBz color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const rgbToJzAzBz = (color: RGBColor, peakLuminance: number = 10000): JzAzBzColor =>
  xyzToJzAzBz(rgbToXYZ(color), peakLuminance);

/**
 * Converts an RGB color to the JzCzHz color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const rgbToJzCzHz = (color: RGBColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(rgbToXYZ(color), peakLuminance);
