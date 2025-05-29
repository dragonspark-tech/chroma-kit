import {
  rgb,
  type RGBColor,
  rgbToHWB,
  rgbToJzAzBz,
  rgbToJzCzHz,
  rgbToLab,
  rgbToLCH,
  rgbToOKLab,
  rgbToOKLCh,
  rgbToXYZ
} from '../rgb';
import { hsv, type HSVColor } from '../hsv';
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
import type { HWBColor } from '../hwb';
import type { P3Color } from '../p3/p3';
import type { ColorBase } from '../base';
import { channel, ChannelAttribute } from '../base/channel';

/**
 * Represents a color in the HSL color space.
 *
 * HSL (Hue, Saturation, Lightness) is a cylindrical color model that rearranges
 * the RGB color model to be more intuitive and perceptually relevant.
 *
 * @property {number} h - The hue component (0-360 degrees)
 * @property {number} s - The saturation component (0-1)
 * @property {number} l - The lightness component (0-1)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface HSLColor extends ColorBase {
  space: 'hsl';

  h: number;
  s: number;
  l: number;

  shiftHue(degrees: number): HSLColor;
}

export const hslToCSSString = (color: HSLColor): string => {
  const { h, s, l, alpha } = color;

  const hFormatted = h.toFixed(2);
  const sFormatted = (s * 100).toFixed(2);
  const lFormatted = (l * 100).toFixed(2);

  return `hsl(${hFormatted}, ${sFormatted}%, ${lFormatted}%${alpha ? ` / ${alpha.toFixed(3)}` : ''})`;
};

export const hsl = (h: number, s: number, l: number, alpha?: number): HSLColor => ({
  space: 'hsl',
  h,
  s,
  l,
  alpha,

  channels: {
    h: channel('h', 'Hue', [0, 360], [ChannelAttribute.ANGLE]),
    s: channel('s', 'Saturation', [0, 1]),
    l: channel('l', 'Lightness', [0, 1])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return hslToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<HSLColor, T>(this, colorSpace);
  },

  shiftHue(degrees: number): HSLColor {
    const shift = (this.h + degrees) % 360;
    return hsl(shift < 0 ? shift + 360 : shift, this.s, this.l, this.alpha);
  }
});

export const hslFromVector = (v: number[], alpha?: number) => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return hsl(v[0], v[1], v[2], alpha);
};

/**
 * Converts an HSL color to the RGB color space.
 *
 * This function implements the standard algorithm for converting from HSL to RGB.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const hslToRGB = (color: HSLColor): RGBColor => {
  const [h, s, l] = [color.h, color.s, color.l];

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));

  return rgb(f(0), f(8), f(4), color.alpha);
};

export const hslToP3 = (color: HSLColor): P3Color => xyzToP3(hslToXYZ(color));

/**
 * Converts an HSL color to the HSV color space.
 *
 * This function transforms the color from HSL (Hue, Saturation, Lightness)
 * to HSV (Hue, Saturation, Value).
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const hslToHSV = (color: HSLColor): HSVColor => {
  const [h, s, l] = [color.h, color.s, color.l];

  const v = l + s * Math.min(l, 1 - l);
  const hsvS = v === 0 ? 0 : 2 * (1 - l / v);

  return hsv(h, hsvS, v, color.alpha);
};

/**
 * Converts a color from HSL to HWB color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const hslToHWB = (color: HSLColor): HWBColor => rgbToHWB(hslToRGB(color));

/**
 * Converts an HSL color to the CIE XYZ color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to XYZ.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const hslToXYZ = (color: HSLColor): XYZColor => rgbToXYZ(hslToRGB(color));

/**
 * Converts an HSL color to the CIE Lab color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {LabColor} The color in Lab space
 */
export const hslToLab = (color: HSLColor): LabColor => rgbToLab(hslToRGB(color));

/**
 * Converts an HSL color to the CIE LCh color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {LChColor} The color in LCh space
 */
export const hslToLCh = (color: HSLColor): LChColor => rgbToLCH(hslToRGB(color));

/**
 * Converts an HSL color to the OKLab color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLabColor} The color in OKLab space
 */
export const hslToOKLab = (color: HSLColor, useChromaticAdaptation = false): OKLabColor =>
  rgbToOKLab(hslToRGB(color), useChromaticAdaptation);

/**
 * Converts an HSL color to the OKLCh color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @param {boolean} [useChromaticAdaptation=false] - Whether to adapt from D65 to D50 white point
 * @returns {OKLChColor} The color in OKLCh space
 */
export const hslToOKLCh = (color: HSLColor, useChromaticAdaptation = false): OKLChColor =>
  rgbToOKLCh(hslToRGB(color), useChromaticAdaptation);

/**
 * Converts an HSL color to the JzAzBz color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const hslToJzAzBz = (color: HSLColor, peakLuminance = 10000): JzAzBzColor =>
  rgbToJzAzBz(hslToRGB(color), peakLuminance);

/**
 * Converts an HSL color to the JzCzHz color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const hslToJzCzHz = (color: HSLColor, peakLuminance = 10000): JzCzHzColor =>
  rgbToJzCzHz(hslToRGB(color), peakLuminance);
