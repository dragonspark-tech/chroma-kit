import {
  rgb,
  type RGBColor,
  rgbToJzAzBz,
  rgbToJzCzHz,
  rgbToLab,
  rgbToLCH,
  rgbToOKLab,
  rgbToOKLCh,
  rgbToXYZ
} from '../rgb';
import { hsl, type HSLColor } from '../hsl';
import { type XYZColor, xyzToP3 } from '../xyz';
import type { LabColor } from '../lab';
import type { LChColor } from '../lch';
import type { OKLabColor } from '../oklab';
import type { OKLChColor } from '../oklch';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';
import type { ColorSpace } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import { hwb, type HWBColor } from '../hwb';
import type { P3Color } from '../p3/p3';
import { channel, ChannelAttribute } from '../base/channel';
import type { ColorBase } from '../base';

/**
 * Represents a color in the HSV color space.
 *
 * HSV (Hue, Saturation, Value) is a cylindrical color model that rearranges
 * the RGB color model to be more intuitive for color selection.
 *
 * @property {number} h - The hue component (0-360 degrees)
 * @property {number} s - The saturation component (0-1)
 * @property {number} v - The value component (0-1)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface HSVColor extends ColorBase {
  space: 'hsv';

  h: number;
  s: number;
  v: number;
}

export const hsvToCSSString = (color: HSVColor): string => hsvToHSL(color).toCSSString();

export const hsv = (h: number, s: number, v: number, alpha?: number): HSVColor => ({
  space: 'hsv',
  h,
  s,
  v,
  alpha,

  channels: {
    h: channel('h', 'Hue', [0, 360], [ChannelAttribute.ANGLE]),
    s: channel('s', 'Saturation', [0, 1], [ChannelAttribute.PERCENTAGE]),
    v: channel('v', 'Value', [0, 1], [ChannelAttribute.PERCENTAGE])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return hsvToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<HSVColor, T>(this, colorSpace);
  }
});

export const hsvFromVector = (v: number[], alpha?: number) => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return hsv(v[0], v[1], v[2], alpha);
};

/**
 * Converts an HSV color to the RGB color space.
 *
 * This function implements the standard algorithm for converting from HSV to RGB.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const hsvToRGB = (color: HSVColor): RGBColor => {
  // Normalize hue to [0, 360) range
  const h = ((color.h % 360) + 360) % 360;
  const [s, v] = [color.s, color.v];

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return rgb(r + m, g + m, b + m, color.alpha);
};

export const hsvToP3 = (color: HSVColor): P3Color =>
  xyzToP3(hsvToXYZ(color));

/**
 * Converts an HSV color to the HSL color space.
 *
 * This function transforms the color from HSV (Hue, Saturation, Value)
 * to HSL (Hue, Saturation, Lightness).
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const hsvToHSL = (color: HSVColor): HSLColor => {
  const [h, s, v] = [color.h, color.s, color.v];

  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

  return hsl(h, sl, l, color.alpha);
};

/**
 * Converts a color from HSV to HWB color space.
 *
 * This function leverages the ease of conversion from HSV to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const hsvToHWB = (color: HSVColor): HWBColor => {
  const { h, s, v } = color;

  return hwb(h, (1 - s) * v, 1 - v, color.alpha);
};

/**
 * Converts an HSV color to the CIE XYZ color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to XYZ.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const hsvToXYZ = (color: HSVColor): XYZColor => rgbToXYZ(hsvToRGB(color));

/**
 * Converts an HSV color to the CIE Lab color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {LabColor} The color in Lab space
 */
export const hsvToLab = (color: HSVColor): LabColor => rgbToLab(hsvToRGB(color));

/**
 * Converts an HSV color to the CIE LCh color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {LChColor} The color in LCh space
 */
export const hsvToLCh = (color: HSVColor): LChColor => rgbToLCH(hsvToRGB(color));

/**
 * Converts an HSV color to the OKLab color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLabColor} The color in OKLab space
 */
export const hsvToOKLab = (color: HSVColor, useChromaticAdaptation = false): OKLabColor =>
  rgbToOKLab(hsvToRGB(color), useChromaticAdaptation);

/**
 * Converts an HSV color to the OKLCh color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLChColor} The color in OKLCh space
 */
export const hsvToOKLCh = (color: HSVColor, useChromaticAdaptation = false): OKLChColor =>
  rgbToOKLCh(hsvToRGB(color), useChromaticAdaptation);

/**
 * Converts an HSV color to the JzAzBz color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const hsvToJzAzBz = (color: HSVColor, peakLuminance = 10000): JzAzBzColor =>
  rgbToJzAzBz(hsvToRGB(color), peakLuminance);

/**
 * Converts an HSV color to the JzCzHz color space.
 *
 * This function first converts the HSV color to RGB, then from RGB to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const hsvToJzCzHz = (color: HSVColor, peakLuminance = 10000): JzCzHzColor =>
  rgbToJzCzHz(hsvToRGB(color), peakLuminance);
