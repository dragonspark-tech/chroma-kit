import type { LabColor } from '../lab';
import type { LChColor } from '../lch';
import { oklab, type OKLabColor, oklabToLab, oklabToLCh, oklabToXYZ } from '../oklab';
import { type RGBColor, rgbToHSL, rgbToHSV, rgbToHWB } from '../rgb';
import { type XYZColor, xyzToJzAzBz, xyzToJzCzHz, xyzToP3, xyzToRGB } from '../xyz';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';
import type { HSLColor } from '../hsl';
import type { HSVColor } from '../hsv';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import type { HWBColor } from '../hwb';
import type { P3Color } from '../p3/p3';
import type { ColorBase } from '../base';
import { channel, ChannelAttribute } from '../base/channel';
import type { ColorSpace, CreatedColor } from '../../foundation';

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

/**
 * Converts an OKLCh color object to a CSS-compatible string representation.
 *
 * This function formats the OKLCh color as a CSS oklch() function string,
 * with the lightness component expressed as a percentage, and appropriate
 * formatting for the chroma and hue components. Alpha values are included
 * when defined, using the slash syntax.
 *
 * @param {OKLChColor} color - The OKLCh color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const oklchToCSSString = (color: OKLChColor): string => {
  const { l, c, h, alpha } = color;

  const lFormatted = (l * 100).toFixed(2);
  const cFormatted = c.toFixed(3);
  const hFormatted = h.toFixed(3);

  return `oklch(${lFormatted}% ${cFormatted} ${hFormatted}${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

/**
 * Creates a new OKLCh color object with the specified components.
 *
 * This is the primary factory function for creating OKLCh colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} l - The lightness component (0-1)
 * @param {number} c - The chroma (saturation/colorfulness) component
 * @param {number} h - The hue angle in degrees (0-360)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {OKLChColor} A new OKLCh color object
 */
export const oklch = (l: number, c: number, h: number, alpha?: number): OKLChColor => ({
  space: 'oklch',
  isPolar: true,
  dynamicRange: 'SDR',

  l,
  c,
  h,
  alpha,

  channels: {
    l: channel('l', 'Lightness', [0, 1], [ChannelAttribute.PERCENTAGE]),
    c: channel('c', 'Chroma', [0, 0.4]),
    h: channel('h', 'Hue', [0, 360], [ChannelAttribute.ANGLE])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return oklchToCSSString(this);
  },

  to<T extends ColorSpace>(colorSpace: T): CreatedColor<T> {
    return convertColor<OKLChColor, T>(this, colorSpace);
  }
});

/**
 * Creates a new OKLCh color object from a vector of OKLCh components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the OKLCh components [l, c, h]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {OKLChColor} A new OKLCh color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
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
 * Gamut mapping is performed during the XYZ to RGB conversion to ensure the
 * resulting color is within the valid RGB gamut. This prevents unexpected
 * results when working with colors that have high chroma values or are
 * otherwise outside the RGB gamut.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const oklchToRGB = (color: OKLChColor): RGBColor => xyzToRGB(oklchToXYZ(color));

export const oklchToP3 = (color: OKLChColor): P3Color => xyzToP3(oklchToXYZ(color));

/**
 * Converts a color from OKLCh to HSL color space.
 *
 * This function first converts the OKLCh color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
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
 * saturation, and value components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const oklchToHSV = (color: OKLChColor): HSVColor => rgbToHSV(oklchToRGB(color));

/**
 * Converts a color from OKLCh to HWB color space.
 *
 * This function first converts the OKLCh color to RGB, then from RGB to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const oklchToHWB = (color: OKLChColor): HWBColor => rgbToHWB(oklchToRGB(color));

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
export const oklchToJzAzBz = (color: OKLChColor, peakLuminance = 10000): JzAzBzColor =>
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
export const oklchToJzCzHz = (color: OKLChColor, peakLuminance = 10000): JzCzHzColor =>
  xyzToJzCzHz(oklchToXYZ(color), peakLuminance);
