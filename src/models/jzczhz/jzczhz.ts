import {
  jzazbz,
  type JzAzBzColor,
  jzazbzToHSL,
  jzazbzToHSV,
  jzazbzToHWB,
  jzazbzToLab,
  jzazbzToLCh,
  jzazbzToOKLab,
  jzazbzToOKLCh,
  jzazbzToRGB,
  jzazbzToXYZ
} from '../jzazbz';
import { type XYZColor, xyzToP3 } from '../xyz';
import type { RGBColor } from '../rgb';
import type { LabColor } from '../lab';
import type { LChColor } from '../lch';
import type { OKLabColor } from '../oklab';
import type { OKLChColor } from '../oklch';
import type { HSLColor } from '../hsl';
import type { HSVColor } from '../hsv';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';
import type { HWBColor } from '../hwb';
import type { P3Color } from '../p3/p3';
import type { ColorBase } from '../base';
import { channel, ChannelAttribute } from '../base/channel';
import type { ColorSpace } from '../../foundation';

/**
 * Represents a color in the JzCzHz color space.
 *
 * The JzCzHz color space is a cylindrical representation of the JzAzBz color space,
 * using lightness (Jz), chroma (Cz), and hue (Hz) components. This makes it more intuitive
 * for color adjustments as it separates color into perceptually meaningful components.
 *
 * @property {number} jz - The lightness component
 * @property {number} cz - The chroma (saturation/colorfulness) component
 * @property {number} hz - The hue angle in degrees (0-360)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface JzCzHzColor extends ColorBase {
  space: 'jzczhz';

  jz: number;
  cz: number;
  hz: number;
}

/**
 * Converts a JzCzHz color object to a CSS-compatible string representation.
 *
 * Since CSS doesn't have native support for the JzCzHz color space, this function
 * formats the color as a custom jzczhz() function string, similar to other
 * cylindrical color spaces in CSS.
 *
 * @param {JzCzHzColor} color - The JzCzHz color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const jzczhzToCSSString = (color: JzCzHzColor): string => {
  const { jz, cz, hz, alpha } = color;
  return `color(jzczhz ${jz} ${cz} ${hz}${alpha !== undefined ? ` / ${alpha}` : ''})`;
};

/**
 * Creates a new JzCzHz color object with the specified components.
 *
 * This is the primary factory function for creating JzCzHz colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} jz - The lightness component
 * @param {number} cz - The chroma (saturation/colorfulness) component
 * @param {number} hz - The hue angle in degrees (0-360)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {JzCzHzColor} A new JzCzHz color object
 */
export const jzczhz = (jz: number, cz: number, hz: number, alpha?: number): JzCzHzColor => ({
  space: 'jzczhz',
  isPolar: true,
  dynamicRange: 'HDR',

  jz,
  cz,
  hz,
  alpha,

  channels: {
    jz: channel('jz', 'Lightness', [0, 1]),
    cz: channel('cz', 'Chroma', [0, 1]),
    hz: channel('hz', 'Hue', [0, 360], [ChannelAttribute.ANGLE])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return jzczhzToCSSString(this);
  },

  to<T extends ColorSpace>(colorSpace: T) {
    return convertColor<JzCzHzColor, T>(this, colorSpace);
  }
});

/**
 * Creates a new JzCzHz color object from a vector of JzCzHz components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the JzCzHz components [jz, cz, hz]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {JzCzHzColor} A new JzCzHz color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const jzczhzFromVector = (v: number[], alpha?: number): JzCzHzColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return jzczhz(v[0], v[1], v[2], alpha);
};

/**
 * Converts a color from JzCzHz to RGB color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to RGB.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {RGBColor} The color in RGB space
 */
export const jzczhzToRGB = (color: JzCzHzColor, peakLuminance = 10000): RGBColor =>
  jzazbzToRGB(jzczhzToJzAzBz(color), peakLuminance);

export const jzczhzToP3 = (color: JzCzHzColor, peakLuminance = 10000): P3Color =>
  xyzToP3(jzczhzToXYZ(color, peakLuminance));

/**
 * Converts a color from JzCzHz to HSL color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {HSLColor} The color in HSL space
 */
export const jzczhzToHSL = (color: JzCzHzColor, peakLuminance = 10000): HSLColor =>
  jzazbzToHSL(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to HSV color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {HSVColor} The color in HSV space
 */
export const jzczhzToHSV = (color: JzCzHzColor, peakLuminance = 10000): HSVColor =>
  jzazbzToHSV(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to HWB color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components.
 *
 * @param {JzCzHzColor} color - The JzCzHzColor color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {HWBColor} The color in HWB space
 */
export const jzczhzToHWB = (color: JzCzHzColor, peakLuminance = 10000): HWBColor =>
  jzazbzToHWB(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to CIE XYZ color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to XYZ.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {XYZColor} The color in XYZ space
 */
export const jzczhzToXYZ = (color: JzCzHzColor, peakLuminance = 10000): XYZColor =>
  jzazbzToXYZ(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to CIE Lab color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to Lab.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {LabColor} The color in Lab space
 */
export const jzczhzToLab = (color: JzCzHzColor, peakLuminance = 10000): LabColor =>
  jzazbzToLab(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to CIE LCh color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to LCh.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {LChColor} The color in LCh space
 */
export const jzczhzToLCh = (color: JzCzHzColor, peakLuminance = 10000): LChColor =>
  jzazbzToLCh(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to OKLab color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to OKLab.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {OKLabColor} The color in OKLab space
 */
export const jzczhzToOKLab = (color: JzCzHzColor, peakLuminance = 10000): OKLabColor =>
  jzazbzToOKLab(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to OKLCh color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to OKLCh.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {OKLChColor} The color in OKLCh space
 */
export const jzczhzToOKLCh = (color: JzCzHzColor, peakLuminance = 10000): OKLChColor =>
  jzazbzToOKLCh(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to JzAzBz color space.
 *
 * This function transforms the polar coordinates (Cz, Hz) of JzCzHz
 * into Cartesian coordinates (az, bz) to create the JzAzBz representation.
 * The Jz component remains unchanged.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const jzczhzToJzAzBz = (color: JzCzHzColor): JzAzBzColor => {
  const hzRad = (color.hz * Math.PI) / 180;
  return jzazbz(color.jz, color.cz * Math.cos(hzRad), color.cz * Math.sin(hzRad), color.alpha);
};
