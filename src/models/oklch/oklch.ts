import { LabColor } from '../lab';
import { LChColor } from '../lch';
import { oklab, OKLabColor, oklabToLab, oklabToLCh, oklabToXYZ } from '../oklab';
import { RGBColor, rgbToHSL, rgbToHSV } from '../rgb';
import { XYZColor, xyzToJzAzBz, xyzToJzCzHz, xyzToRGB } from '../xyz';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';
import { HSLColor } from '../hsl';
import { HSVColor } from '../hsv';
import { ColorBase, ColorSpace } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';

/**
 * Represents a color in the OKLCh color space.
 *
 * The OKLCh color space is a cylindrical representation of the OKLab color space,
 * using Lightness, Chroma, and hue components. It provides improved perceptual
 * uniformity compared to traditional LCh, making it better for color interpolation
 * and manipulation tasks.
 *
 * @property {number} l - The lightness component (0-1)
 * @property {number} c - The chroma (saturation/colorfulness) component
 * @property {number} h - The hue angle in degrees (0-360)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface OKLChColor extends ColorBase {
  space: 'oklch';

  l: number;
  c: number;
  h: number;
}

export const oklchToCSSString = (color: OKLChColor): string => {
  const { l, c, h, alpha } = color;

  const lFormatted = (l * 100).toFixed(2);
  const cFormatted = c.toFixed(3);
  const hFormatted = h.toFixed(2);

  return `oklch(${lFormatted}% ${cFormatted} ${hFormatted}${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

export const oklch = (l: number, c: number, h: number, alpha?: number): OKLChColor => ({
  space: 'oklch',
  l,
  c,
  h,
  alpha,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return oklchToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<OKLChColor, T>(this, colorSpace);
  }
});

export const oklchFromVector = (v: number[], alpha?: number): OKLChColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return oklch(v[0], v[1], v[2], alpha);
};

/**
 * Converts a color from OKLCh to RGB color space.
 *
 * This function first converts the OKLCh color to XYZ, then from XYZ to RGB.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const oklchToRGB = (color: OKLChColor): RGBColor => {
  const xyz = oklchToXYZ(color);
  return xyzToRGB(xyz);
};

/**
 * Converts a color from OKLCh to HSL color space.
 *
 * This function first converts the OKLCh color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const oklchToHSL = (color: OKLChColor): HSLColor => rgbToHSL(oklchToRGB(color));

/**
 * Converts a color from OKLCh to HSV color space.
 *
 * This function first converts the OKLCh color to RGB, then from RGB to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const oklchToHSV = (color: OKLChColor): HSVColor => rgbToHSV(oklchToRGB(color));

/**
 * Converts a color from OKLCh to CIE XYZ color space.
 *
 * This function first converts the OKLCh color to OKLab, then from OKLab to XYZ.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const oklchToXYZ = (color: OKLChColor): XYZColor => {
  const oklab = oklchToOKLab(color);
  return oklabToXYZ(oklab);
};

/**
 * Converts a color from OKLCh to CIE Lab color space.
 *
 * This function first converts the OKLCh color to OKLab, then from OKLab to Lab.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {LabColor} The color in Lab space
 */
export const oklchToLab = (color: OKLChColor): LabColor => oklabToLab(oklchToOKLab(color));

/**
 * Converts a color from OKLCh to CIE LCh color space.
 *
 * This function first converts the OKLCh color to OKLab, then from OKLab to LCh.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {LChColor} The color in LCh space
 */
export const oklchToLCh = (color: OKLChColor): LChColor => oklabToLCh(oklchToOKLab(color));

/**
 * Converts a color from OKLCh to OKLab color space.
 *
 * This function transforms the polar coordinates (C, h) of OKLCh
 * into Cartesian coordinates (a, b) to create the OKLab representation.
 * The L component remains unchanged.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const oklchToOKLab = (color: OKLChColor): OKLabColor => {
  const hRad = (color.h * Math.PI) / 180;
  return oklab(color.l, color.c * Math.cos(hRad), color.c * Math.sin(hRad), color.alpha);
};

/**
 * Converts an OKLCh color to the JzAzBz color space.
 *
 * This function first converts the OKLCh color to XYZ, then from XYZ to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const oklchToJzAzBz = (color: OKLChColor, peakLuminance: number = 10000): JzAzBzColor =>
  xyzToJzAzBz(oklchToXYZ(color), peakLuminance);

/**
 * Converts an OKLCh color to the JzCzHz color space.
 *
 * This function first converts the OKLCh color to XYZ, then from XYZ to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const oklchToJzCzHz = (color: OKLChColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(oklchToXYZ(color), peakLuminance);
