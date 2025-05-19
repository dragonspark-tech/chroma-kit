import { XYZColor, xyzFromVector, xyzToJzAzBz, xyzToJzCzHz, xyzToLab, xyzToLCh, xyzToOKLab } from '../xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { SRGB_INVERSE, SRGB_XYZ_MATRIX } from './constants';
import { denormalizesRGBColor, linearizesRGBColor, normalizesRGBColor } from './transform';
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
import { hwb, HWBColor } from '../hwb';

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
export interface sRGBColor extends ColorBase {
  space: 'srgb';

  r: number;
  g: number;
  b: number;
}

/**
 * Converts an RGB color object to a CSS-compatible string representation.
 *
 * For fully opaque colors, this function returns a hex format by default as it's more compact.
 * For colors with alpha < 1 or when forceFullString is true, it returns the rgba() format.
 *
 * @param {sRGBColor} color - The RGB color object to convert
 * @param {boolean} [forceFullString=false] - Whether to force the rgba() format even for fully opaque colors
 * @returns {string} The CSS-compatible string representation
 */
export const srgbToCSSString = (color: sRGBColor, forceFullString: boolean = false): string => {
  const { r, g, b, alpha } = color;

  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);

  const a = alpha ?? 1;

  if (a < 1 || forceFullString) {
    return `rgba(${rInt}, ${gInt}, ${bInt}${a < 1 ? ', ' + a.toFixed(3) : ''})`;
  }

  return srgbToHex(color);
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
 * @returns {sRGBColor} A new RGB color object
 */
export const srgb = (r: number, g: number, b: number, alpha?: number): sRGBColor => ({
  space: 'srgb',

  r,
  g,
  b,
  alpha,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return srgbToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<sRGBColor, T>(this, colorSpace);
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
 * @returns {sRGBColor} A new RGB color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const srgbFromVector = (v: number[], alpha?: number): sRGBColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return srgb(v[0], v[1], v[2], alpha);
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
 * @returns {sRGBColor} An object representing the RGB color with properties for red, green, blue,
 *   and optionally alpha transparency (normalized between 0 and 1).
 * @throws {Error} If the provided `hex` string has an invalid format or length.
 */
export const hexTosRGB = (hex: string): sRGBColor => {
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
      a = hexDigit(c3) * 17 * SRGB_INVERSE;
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
      a = ((hexDigit(c6) << 4) | hexDigit(c7)) * SRGB_INVERSE;
    }
  } else {
    throw new Error('Invalid hex color format');
  }

  if (a) a = Math.round(a * 100) / 100;

  return normalizesRGBColor(srgb(r, g, b, a));
};

/**
 * Converts an RGB color object to a hexadecimal color string.
 *
 * This function automatically determines whether to use shorthand notation
 * when possible (e.g., #abc instead of #aabbcc). It handles alpha values
 * and will include them in the hex string only if they're defined and not 255 (fully opaque).
 *
 * The function first denormalizes the RGB values (converts from 0-1 to 0-255 range),
 * then formats them as a hex string. Values are clamped to the valid range and rounded.
 *
 * @param {sRGBColor} color - The RGB color object to convert
 * @returns {string} The hexadecimal color string (with leading '#')
 */
export const srgbToHex = (color: sRGBColor): string => {
  const nC = denormalizesRGBColor(color);

  let r = Math.max(0, Math.min(255, Math.round(nC.r))),
    g = Math.max(0, Math.min(255, Math.round(nC.g))),
    b = Math.max(0, Math.min(255, Math.round(nC.b)));
  let a = nC.alpha;
  let alpha: number | undefined = undefined;
  if (a !== undefined) {
    alpha = Math.max(0, Math.min(255, Math.round(a * 255)));
  }

  // Check if each component has the same value for both nibbles (e.g., 0xAA, 0xBB)
  // This means the hex representation can be shortened (e.g., #aabbcc -> #abc)
  const isShort = (n: number) => (n & 0xf0) >> 4 === (n & 0x0f);
  const canShort =
    isShort(r) && isShort(g) && isShort(b) && (alpha === undefined || isShort(alpha));

  if (canShort) {
    // For shorthand, we use the high nibble (or low nibble, they're the same)
    let hex = `#${(r >> 4).toString(16)}${(g >> 4).toString(16)}${(b >> 4).toString(16)}`;
    if (alpha !== undefined && alpha !== 255) {
      hex += (alpha >> 4).toString(16);
    }
    return hex;
  }

  // Full hex format
  let hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  if (alpha !== undefined && alpha !== 255) {
    hex += alpha.toString(16).padStart(2, '0');
  }
  return hex;
};

/**
 * Calculates the hue component of a color in HSL space based on its RGB representation.
 *
 * @param {sRGBColor} color - An object representing the RGB color with `r`, `g`, and `b` properties.
 * @param {number} max - The maximum value among the R, G, and B components of the color.
 * @param {number} min - The minimum value among the R, G, and B components of the color.
 * @returns {number} The hue of the color in degrees, ranging from 0 to 360.
 */
const calculateHSpaceHue = (color: sRGBColor, max: number, min: number): number => {
  const { r, g, b } = color;
  const Δ = max - min;
  let h = 0;

  if (Δ !== 0) {
    h = max === r ? (g - b) / Δ + (g < b ? 6 : 0) : max === g ? (b - r) / Δ + 2 : (r - g) / Δ + 4;

    h *= 60;

    if (h < 0) h += 360;
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
 * @param {sRGBColor} color - The RGB color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const srgbToHSL = (color: sRGBColor): HSLColor => {
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
 * @param {sRGBColor} color - The RGB color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const srgbToHSV = (color: sRGBColor): HSVColor => {
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
 * @param {sRGBColor} color - The RGB color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const srgbToHWB = (color: sRGBColor): HWBColor => {
  const [r, g, b] = [color.r, color.g, color.b];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const h = calculateHSpaceHue(color, max, min);

  return hwb(h, min, max, color.alpha);
};

/**
 * Converts an RGB color to the CIE XYZ color space.
 *
 * This function first linearizes the RGB color values (removes gamma correction),
 * then applies the RGB to XYZ transformation matrix. Optionally, it can perform
 * chromatic adaptation to convert from the D65 white point (standard for sRGB)
 * to the D50 white point (commonly used in other color spaces).
 *
 * @param {sRGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {XYZColor} The color in XYZ space, with the appropriate illuminant specified
 */
export const srgbToXYZ = (color: sRGBColor, useChromaticAdaptation: boolean = false): XYZColor => {
  const lC = linearizesRGBColor(color);
  const xyz = multiplyMatrixByVector(SRGB_XYZ_MATRIX, [lC.r, lC.g, lC.b]);

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
 * @param {sRGBColor} color - The RGB color to convert
 * @returns {LabColor} The color in Lab space
 */
export const srgbToLab = (color: sRGBColor): LabColor => xyzToLab(srgbToXYZ(color));

/**
 * Converts an RGB color to the CIE LCh color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {sRGBColor} color - The RGB color to convert
 * @returns {LChColor} The color in LCh space
 */
export const srgbToLCH = (color: sRGBColor): LChColor => xyzToLCh(srgbToXYZ(color));

/**
 * Converts an RGB color to the OKLab color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {sRGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLabColor} The color in OKLab space
 */
export const srgbToOKLab = (
  color: sRGBColor,
  useChromaticAdaptation: boolean = false
): OKLabColor => xyzToOKLab(srgbToXYZ(color, useChromaticAdaptation));

/**
 * Converts an RGB color to the OKLCh color space.
 *
 * This function first converts the RGB color to OKLab, then from OKLab to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {sRGBColor} color - The RGB color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLChColor} The color in OKLCh space
 */
export const srgbToOKLCh = (
  color: sRGBColor,
  useChromaticAdaptation: boolean = false
): OKLChColor => oklabToOKLCh(srgbToOKLab(color, useChromaticAdaptation));

/**
 * Converts an RGB color to the JzAzBz color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {sRGBColor} color - The RGB color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const srgbToJzAzBz = (color: sRGBColor, peakLuminance: number = 10000): JzAzBzColor =>
  xyzToJzAzBz(srgbToXYZ(color), peakLuminance);

/**
 * Converts an RGB color to the JzCzHz color space.
 *
 * This function first converts the RGB color to XYZ, then from XYZ to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {sRGBColor} color - The RGB color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const srgbToJzCzHz = (color: sRGBColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(srgbToXYZ(color), peakLuminance);
