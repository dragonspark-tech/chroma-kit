import type { ColorSpace } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import {
  rgb,
  type RGBColor,
  rgbToHSL,
  rgbToHSV,
  rgbToJzAzBz,
  rgbToJzCzHz,
  rgbToLab,
  rgbToLCH,
  rgbToOKLab,
  rgbToOKLCh,
  rgbToXYZ
} from '../rgb';
import { hsl, type HSLColor, hslToRGB } from '../hsl';
import type { HSVColor } from '../hsv';
import { type XYZColor, xyzToP3 } from '../xyz';
import type { LabColor } from '../lab';
import type { LChColor } from '../lch';
import type { OKLabColor } from '../oklab';
import type { OKLChColor } from '../oklch';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';
import type { P3Color } from '../p3/p3';
import type { ColorBase } from '../base';
import { channel, ChannelAttribute } from '../base/channel';

/**
 * Represents a color in the HWB color space.
 *
 * HWB (Hue, Whiteness, Blackness) is a cylindrical color model that rearranges
 * the RGB color model to be more intuitive for humans to work with.
 * It was designed to be more user-friendly than HSL or HSV.
 *
 * @property {number} h - The hue component (0-360 degrees)
 * @property {number} w - The whiteness component (0-1)
 * @property {number} b - The blackness component (0-1)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface HWBColor extends ColorBase {
  space: 'hwb';

  h: number;
  w: number;
  b: number;
}

/**
 * Converts an HWB color to a CSS color string.
 *
 * This function formats the HWB color as a CSS string according to the CSS Color Level 4 specification.
 * The format is: hwb(hue whiteness% blackness%[ / alpha])
 *
 * @param {HWBColor} color - The HWB color to convert to a CSS string
 * @returns {string} The CSS string representation of the color
 */
export const hwbToCSSString = (color: HWBColor): string => {
  const { h, w, b, alpha } = color;

  const hFormatted = h.toFixed(2);
  const wFormatted = (w * 100).toFixed(2);
  const bFormatted = (b * 100).toFixed(2);

  return `hwb(${hFormatted} ${wFormatted}% ${bFormatted}%${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

/**
 * Creates a new HWB color object with the specified components.
 *
 * This is the primary factory function for creating HWB colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} h - The hue component (0-360 degrees)
 * @param {number} w - The whiteness component (0-1)
 * @param {number} b - The blackness component (0-1)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {HWBColor} A new HWB color object
 */
export const hwb = (h: number, w: number, b: number, alpha?: number): HWBColor => ({
  space: 'hwb',
  isPolar: true,
  dynamicRange: 'SDR',

  h,
  w,
  b,
  alpha,

  channels: {
    h: channel('h', 'Hue', [0, 360], [ChannelAttribute.ANGLE]),
    w: channel('w', 'Whiteness', [0, 1], [ChannelAttribute.PERCENTAGE]),
    b: channel('b', 'Blackness', [0, 1], [ChannelAttribute.PERCENTAGE])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return hwbToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<HWBColor, T>(this, colorSpace);
  }
});

/**
 * Creates an HWB color from a vector of component values.
 *
 * This utility function creates an HWB color from an array of numeric values.
 *
 * @param {number[]} v - The vector containing HWB components [h, w, b]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {HWBColor} A new HWB color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const hwbFromVector = (v: number[], alpha?: number): HWBColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return hwb(v[0], v[1], v[2], alpha);
};

/**
 * Converts an HWB color to the RGB color space.
 *
 * This function implements the standard algorithm for converting from HWB to RGB.
 * When whiteness + blackness >= 1, the color becomes a shade of gray.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const hwbToRGB = (color: HWBColor): RGBColor => {
  const { h, w, b, alpha } = color;

  if (w + b >= 1) {
    const gray = w / (w + b);
    return rgb(gray, gray, gray, alpha);
  }

  const baseHSL = hsl(h, 1, 0.5);
  const baseRGB = hslToRGB(baseHSL);

  const aR = baseRGB.r * (1 - w - b) + w;
  const aG = baseRGB.g * (1 - w - b) + w;
  const aB = baseRGB.b * (1 - w - b) + w;

  return rgb(aR, aG, aB, alpha);
};

export const hwbToP3 = (color: HWBColor): P3Color =>
  xyzToP3(hwbToXYZ(color));

/**
 * Converts an HWB color to the HSL color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to HSL.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const hwbToHSL = (color: HWBColor): HSLColor => rgbToHSL(hwbToRGB(color));

/**
 * Converts an HWB color to the HSV color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to HSV.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const hwbToHSV = (color: HWBColor): HSVColor => rgbToHSV(hwbToRGB(color));

/**
 * Converts an HWB color to the CIE XYZ color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to XYZ.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const hwbToXYZ = (color: HWBColor): XYZColor => rgbToXYZ(hwbToRGB(color));

/**
 * Converts an HWB color to the CIE Lab color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {LabColor} The color in Lab space
 */
export const hwbToLab = (color: HWBColor): LabColor => rgbToLab(hwbToRGB(color));

/**
 * Converts an HWB color to the CIE LCH color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to LCH.
 * The LCH color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {LChColor} The color in LCH space
 */
export const hwbToLCH = (color: HWBColor): LChColor => rgbToLCH(hwbToRGB(color));

/**
 * Converts an HWB color to the OKLab color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const hwbToOKLab = (color: HWBColor): OKLabColor => rgbToOKLab(hwbToRGB(color));

/**
 * Converts an HWB color to the OKLCh color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const hwbToOKLCh = (color: HWBColor): OKLChColor => rgbToOKLCh(hwbToRGB(color));

/**
 * Converts an HWB color to the JzAzBz color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const hwbToJzAzBz = (color: HWBColor, peakLuminance = 10000): JzAzBzColor =>
  rgbToJzAzBz(hwbToRGB(color), peakLuminance);

/**
 * Converts an HWB color to the JzCzHz color space.
 *
 * This function first converts the HWB color to RGB, then from RGB to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {HWBColor} color - The HWB color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const hwbToJzCzHz = (color: HWBColor, peakLuminance = 10000): JzCzHzColor =>
  rgbToJzCzHz(hwbToRGB(color), peakLuminance);
