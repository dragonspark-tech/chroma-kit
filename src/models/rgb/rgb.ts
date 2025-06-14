﻿import {
  type XYZColor,
  xyzFromVector,
  xyzToJzAzBz,
  xyzToJzCzHz,
  xyzToLab,
  xyzToLCh,
  xyzToOKLab,
  xyzToP3
} from '../xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { HEX_CHARS, RGB_INVERSE, RGB_XYZ_MATRIX } from './constants';
import { denormalizeRGBColor, linearizeRGBColor, normalizeRGBColor } from './transform';
import { getAdaptationMatrix } from '../../adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { BradfordConeModel } from '../../adaptation/cone-response';
import type { LabColor } from '../lab';
import { type OKLabColor, oklabToOKLCh } from '../oklab';
import type { OKLChColor } from '../oklch';
import type { LChColor } from '../lch';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';
import { hsl, type HSLColor } from '../hsl';
import { hsv, type HSVColor, hsvToHWB } from '../hsv';
import { serializeV1 } from '../../semantics/serialization';
import type { ColorSpace } from '../../foundation';
import { convertColor } from '../../conversion/conversion';
import type { HWBColor } from '../hwb';
import type { P3Color } from '../p3/p3';
import type { ColorBase } from '../base';
import { channel } from '../base/channel';
import { gamutMapMinDeltaE, isInGamut } from '../../gamut';

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

/**
 * Determines if a given RGBColor object is within the sRGB color space.
 *
 * The sRGB color space is defined by having red (r), green (g), and blue (b) components
 * in the range of 0 to 1, inclusive. Additionally, if an alpha component is defined,
 * it must also be within the range of 0 to 1, inclusive.
 *
 * @param {RGBColor} color - The RGBColor object containing the color components (r, g, b, and optionally alpha).
 * @returns {boolean} - Returns true if the color is within the sRGB color space; otherwise, false.
 */
export const isInSRGB = (color: RGBColor): boolean => {
  const { r, g, b } = color;
  return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
};

/**
 * Converts an RGB color object to a CSS-compatible string representation.
 *
 * For fully opaque colors, this function returns a hex format by default as it's more compact.
 * For colors with alpha < 1 or when forceFullString is true, it returns the rgb() format.
 *
 * @param {RGBColor} color - The RGB color object to convert
 * @param {boolean} [forceFullString=false] - Whether to force the rgb() format even for fully opaque colors
 * @returns {string} The CSS-compatible string representation
 */
export const rgbToCSSString = (color: RGBColor, forceFullString = false): string => {
  const { r, g, b, alpha } = isInGamut(color) ? color : gamutMapMinDeltaE(rgbToOKLCh(color), 'rgb');

  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);

  const a = alpha ?? 1;

  if (a < 1 || forceFullString) {
    return `rgb(${rInt} ${gInt} ${bInt}${a < 1 ? ' / ' + a.toFixed(3) : ''})`;
  }

  return rgbToHex(rgbFromVector([r, g, b], alpha));
};

/**
 * Creates a new RGB color object with the specified components.
 *
 * This is the primary factory function for creating RGB colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} r - The red component (0-1)
 * @param {number} g - The green component (0-1)
 * @param {number} b - The blue component (0-1)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {RGBColor} A new RGB color object
 */
export const rgb = (r: number, g: number, b: number, alpha?: number): RGBColor => ({
  space: 'rgb',
  isPolar: false,
  dynamicRange: 'SDR',

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

  channels: {
    r: channel('r', 'Red', [0, 1]),
    g: channel('g', 'Green', [0, 1]),
    b: channel('b', 'Blue', [0, 1])
  },

  to<T extends ColorSpace>(colorSpace: T) {
    return convertColor<RGBColor, T>(this, colorSpace);
  }
});

/**
 * Creates a new RGB color object from a vector of RGB components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the RGB components [r, g, b] in the 0-1 range
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {RGBColor} A new RGB color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
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
  const i = hex.charCodeAt(0) === 35 ? 1 : 0;
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

  if (a) a = Math.round(a * 100) / 100;

  return normalizeRGBColor(rgb(r, g, b, a));
};

/**
 * Converts an RGB color to its hexadecimal string representation.
 *
 * The function takes an RGB color object and converts its red, green, blue, and optional alpha components
 * into a hexadecimal color string. The output is always in 6-character format (RRGGBB) or 8-character format (RRGGBBAA)
 * if an alpha value is provided and not equal to 1.
 *
 * The RGB values are normalized to fit the 0-255 integer range and clamped to ensure they remain valid.
 * The alpha value, if present, is normalized to the 0-255 range before being included in the hexadecimal format.
 *
 * @param {RGBColor} color - An object representing the RGB color components. The object should contain `r`, `g`, and `b` properties in normalized ranges (0.0 to 1.0) and an optional `alpha` property in the same range.
 * @returns {string} The hexadecimal string representation of the RGB color.
 */
export const rgbToHex = (color: RGBColor): string => {
  const nC = denormalizeRGBColor(color);

  // Round and clamp RGB values (denormalized)
  const r = Math.max(0, Math.min(255, Math.round(nC.r)));
  const g = Math.max(0, Math.min(255, Math.round(nC.g)));
  const b = Math.max(0, Math.min(255, Math.round(nC.b)));

  // Alpha remains in 0..1 range, convert to 0..255 for hex
  const alpha =
    color.alpha !== undefined
      ? Math.max(0, Math.min(255, Math.round(color.alpha * 255)))
      : undefined;

  // Always use full 6-char format (or 8-char with alpha)
  let result =
    '#' +
    HEX_CHARS[(r & 0xf0) >> 4] +
    HEX_CHARS[r & 0x0f] +
    HEX_CHARS[(g & 0xf0) >> 4] +
    HEX_CHARS[g & 0x0f] +
    HEX_CHARS[(b & 0xf0) >> 4] +
    HEX_CHARS[b & 0x0f];

  if (alpha !== undefined && alpha !== 255) {
    result += HEX_CHARS[(alpha & 0xf0) >> 4] + HEX_CHARS[alpha & 0x0f];
  }

  return result;
};

export const rgbToP3 = (color: RGBColor): P3Color => xyzToP3(rgbToXYZ(color));

/**
 * Calculates the hue component of a color in HSL space based on its RGB representation.
 *
 * @param {RGBColor} color - An object representing the RGB color with `r`, `g`, and `b` properties.
 * @param {number} max - The maximum value among the R, G, and B components of the color.
 * @param {number} min - The minimum value among the R, G, and B components of the color.
 * @returns {number} The hue of the color in degrees, ranging from 0 to 360.
 */
const calculateHSpaceHue = (color: RGBColor, max: number, min: number): number => {
  const { r, g, b } = color;
  const Δ = max - min;
  let h = 0;

  if (Δ !== 0) {
    h = max === r ? (g - b) / Δ + (g < b ? 6 : 0) : max === g ? (b - r) / Δ + 2 : (r - g) / Δ + 4;

    h *= 60;
  }

  return h;
};

/**
 * Converts an RGB color to the HSL color space.
 *
 * This function transforms the color from RGB (Red, Green, Blue)
 * to HSL (Hue, Saturation, Lightness). The algorithm finds the minimum and maximum
 * RGB components to determine lightness, then calculates saturation and hue based on
 * the range and relative positions of the RGB components.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const rgbToHSL = (color: RGBColor): HSLColor => {
  const [r, g, b] = [color.r, color.g, color.b];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const Δ = max - min;

  const h = calculateHSpaceHue(color, max, min);
  let s = 0;
  const l = (max + min) * 0.5;

  if (max !== min) {
    s = l > 0.5 ? Δ / (2 - max - min) : Δ / (max + min);
  }

  return hsl(h, s, l, color.alpha);
};

/**
 * Converts an RGB color to the HSV color space.
 *
 * This function transforms the color from RGB (Red, Green, Blue)
 * to HSV (Hue, Saturation, Value). The algorithm determines the value (brightness)
 * as the maximum RGB component, calculates saturation based on the range of RGB values,
 * and computes hue based on the relative positions of the RGB components.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const rgbToHSV = (color: RGBColor): HSVColor => {
  const [r, g, b] = [color.r, color.g, color.b];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const Δ = max - min;

  const h = calculateHSpaceHue(color, max, min);
  const s = max === 0 ? 0 : Δ / max;

  return hsv(h, s, max, color.alpha);
};

/**
 * Converts an RGB color to the HWB color space.
 *
 * This function transforms the color from RGB (Red, Green, Blue)
 * to HWB (Hue, Whiteness, Blackness). The algorithm determines the hue
 * in the same way as HSV/HSL, while whiteness is determined by the minimum
 * RGB component and blackness by the maximum RGB component.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const rgbToHWB = (color: RGBColor): HWBColor => hsvToHWB(rgbToHSV(color));

/**
 * Converts an RGB color to the CIE XYZ color space.
 *
 * This function first linearizes the RGB color values (removes gamma correction),
 * then applies the RGB to XYZ transformation matrix. Optionally, it can perform
 * chromatic adaptation to convert from the D65 white point (standard for RGB)
 * to the D50 white point (commonly used in other color spaces).
 *
 * @param {RGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {XYZColor} The color in XYZ space, with the appropriate illuminant specified
 */
export const rgbToXYZ = (color: RGBColor, useChromaticAdaptation = false): XYZColor => {
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
export const rgbToOKLab = (color: RGBColor, useChromaticAdaptation = false): OKLabColor =>
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
export const rgbToOKLCh = (color: RGBColor, useChromaticAdaptation = false): OKLChColor =>
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
export const rgbToJzAzBz = (color: RGBColor, peakLuminance = 10000): JzAzBzColor =>
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
export const rgbToJzCzHz = (color: RGBColor, peakLuminance = 10000): JzCzHzColor =>
  xyzToJzCzHz(rgbToXYZ(color), peakLuminance);
