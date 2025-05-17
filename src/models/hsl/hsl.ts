import { RGBColor, rgbToJzAzBz, rgbToJzCzHz, rgbToLab, rgbToLCH, rgbToOKLab, rgbToOKLCh, rgbToXYZ } from '../rgb';
import { HSVColor } from '../hsv';
import { XYZColor } from '../xyz';
import { LabColor } from '../lab';
import { LChColor } from '../lch';
import { OKLabColor } from '../oklab';
import { OKLChColor } from '../oklch';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';

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
export type HSLColor = {
  space: 'hsl';

  h: number;
  s: number;
  l: number;
  alpha?: number;
}

/**
 * Converts an HSL color to the RGB color space.
 *
 * This function implements the standard algorithm for converting from HSL to RGB.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {RGBColor} The color in RGB space
 */
/*@__NO_SIDE_EFFECTS__*/
export const hslToRGB = (color: HSLColor): RGBColor => {
  let [h, s, l] = [color.h, color.s, color.l];

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));

  return {
    space: 'rgb',
    r: f(0),
    g: f(8),
    b: f(4),
    alpha: color.alpha
  }
}

/**
 * Converts an HSL color to the HSV color space.
 *
 * This function transforms the color from HSL (Hue, Saturation, Lightness)
 * to HSV (Hue, Saturation, Value).
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {HSVColor} The color in HSV space
 */
/*@__NO_SIDE_EFFECTS__*/
export const hslToHSV = (color: HSLColor): HSVColor => {
  let [h, s, l] = [color.h, color.s, color.l];

  const v = l + s * Math.min(l, 1 - l);
  const hsvS = v === 0 ? 0 : 2 * (1 - l / v);

  return {
    space: 'hsv',
    h,
    s: hsvS,
    v: v,
    alpha: color.alpha
  }
}

/**
 * Converts an HSL color to the CIE XYZ color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to XYZ.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {XYZColor} The color in XYZ space
 */
/*@__NO_SIDE_EFFECTS__*/
export const hslToXYZ = (color: HSLColor): XYZColor =>
  rgbToXYZ(hslToRGB(color));

/**
 * Converts an HSL color to the CIE Lab color space.
 *
 * This function first converts the HSL color to RGB, then from RGB to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {LabColor} The color in Lab space
 */
/*@__NO_SIDE_EFFECTS__*/
export const hslToLab = (color: HSLColor): LabColor =>
  rgbToLab(hslToRGB(color));

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
/*@__NO_SIDE_EFFECTS__*/
export const hslToLCh = (color: HSLColor): LChColor =>
  rgbToLCH(hslToRGB(color));

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
/*@__NO_SIDE_EFFECTS__*/
export const hslToOKLab = (color: HSLColor, useChromaticAdaptation: boolean = false): OKLabColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const hslToOKLCh = (color: HSLColor, useChromaticAdaptation: boolean = false): OKLChColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const hslToJzAzBz = (color: HSLColor, peakLuminance: number = 10000): JzAzBzColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const hslToJzCzHz = (color: HSLColor, peakLuminance: number = 10000): JzCzHzColor =>
  rgbToJzCzHz(hslToRGB(color), peakLuminance);
