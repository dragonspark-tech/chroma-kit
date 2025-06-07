import { lab, type LabColor, labToXYZ } from '../lab';
import { type OKLabColor, oklabToOKLCh } from '../oklab';
import type { OKLChColor } from '../oklch';
import { type RGBColor, rgbToHSL, rgbToHSV, rgbToHWB } from '../rgb';
import { type XYZColor, xyzToJzAzBz, xyzToJzCzHz, xyzToOKLab, xyzToP3, xyzToRGB } from '../xyz';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';
import type { HSLColor } from '../hsl';
import type { HSVColor } from '../hsv';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import type { HWBColor } from '../hwb';
import { type Illuminant, IlluminantD65 } from '../../standards/illuminants';
import type { P3Color } from '../p3/p3';
import type { ColorBase } from '../base';
import { channel, ChannelAttribute } from '../base/channel';
import type { ColorSpace } from '../../foundation';

/**
 * Represents a color in the CIE LCh color space.
 *
 * The CIE LCh color space is a cylindrical representation of the Lab color space,
 * using Lightness, Chroma, and hue components. This makes it more intuitive for
 * color adjustments as it separates color into perceptually meaningful components.
 *
 * @property {number} l - The lightness component (0-100)
 * @property {number} c - The chroma (saturation/colorfulness) component
 * @property {number} h - The hue angle in degrees (0-360)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface LChColor extends ColorBase {
  space: 'lch';

  l: number;
  c: number;
  h: number;

  illuminant?: Illuminant;
}

/**
 * Converts an LCh color object to a CSS-compatible string representation.
 *
 * This function formats the LCh color as a CSS lch() function string according to the CSS Color Module Level 4.
 * The lightness component is formatted as a percentage, the chroma as a number, and the hue as degrees.
 *
 * @param {LChColor} color - The LCh color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const lchToCSSString = (color: LChColor): string => {
  const { l, c, h, alpha } = color;

  const lFormatted = l.toFixed(2);
  const cFormatted = c.toFixed(2);
  const hFormatted = h.toFixed(2);

  return `lch(${lFormatted}% ${cFormatted} ${hFormatted}deg${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

/**
 * Creates a new LCh color object with the specified components.
 *
 * This is the primary factory function for creating LCh colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} l - The lightness component (0-100)
 * @param {number} c - The chroma (saturation/colorfulness) component
 * @param {number} h - The hue angle in degrees (0-360)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @param {Illuminant} [illuminant] - The reference white point to use, defaults to D65
 * @returns {LChColor} A new LCh color object
 */
export const lch = (
  l: number,
  c: number,
  h: number,
  alpha?: number,
  illuminant?: Illuminant
): LChColor => ({
  space: 'lch',
  isPolar: true,
  dynamicRange: 'SDR',

  l,
  c,
  h,
  alpha,
  illuminant: illuminant ?? IlluminantD65,

  channels: {
    l: channel('l', 'Lightness', [0, 100], [ChannelAttribute.PERCENTAGE]),
    c: channel('c', 'Chroma', [0, 150]),
    h: channel('h', 'Hue', [0, 360], [ChannelAttribute.ANGLE])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return lchToCSSString(this);
  },

  to<T extends ColorSpace>(colorSpace: T) {
    return convertColor<LChColor, T>(this, colorSpace);
  }
});

/**
 * Creates a new LCh color object from a vector of LCh components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the LCh components [l, c, h]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @param {Illuminant} [illuminant] - The reference white point to use, defaults to D65
 * @returns {LChColor} A new LCh color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const lchFromVector = (v: number[], alpha?: number, illuminant?: Illuminant): LChColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return lch(v[0], v[1], v[2], alpha, illuminant);
};

/**
 * Converts a color from CIE LCh to RGB color space.
 *
 * This function first converts the LCh color to XYZ, then from XYZ to RGB.
 * Gamut mapping is performed during the conversion to ensure the resulting
 * color is within the valid RGB gamut.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const lchToRGB = (color: LChColor): RGBColor => xyzToRGB(lchToXYZ(color));

export const lchToP3 = (color: LChColor): P3Color => xyzToP3(lchToXYZ(color));

/**
 * Converts a color from CIE LCh to HSL color space.
 *
 * This function first converts the LCh color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const lchToHSL = (color: LChColor): HSLColor => rgbToHSL(lchToRGB(color));

/**
 * Converts a color from CIE LCh to HSV color space.
 *
 * This function first converts the LCh color to RGB, then from RGB to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const lchToHSV = (color: LChColor): HSVColor => rgbToHSV(lchToRGB(color));

/**
 * Converts a color from CIE LCh to HWB color space.
 *
 * This function first converts the LCh color to RGB, then from RGB to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const lchToHWB = (color: LChColor): HWBColor => rgbToHWB(lchToRGB(color));

/**
 * Converts a color from CIE LCh to CIE XYZ color space.
 *
 * This function first converts the LCh color to Lab, then from Lab to XYZ.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const lchToXYZ = (color: LChColor): XYZColor => labToXYZ(lchToLab(color));

/**
 * Converts a color from CIE LCh to CIE Lab color space.
 *
 * This function transforms the polar coordinates (C*, h°) of LCh
 * into Cartesian coordinates (a*, b*) to create the Lab representation.
 * The L* component remains unchanged.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {LabColor} The color in Lab space
 */
export const lchToLab = (color: LChColor): LabColor => {
  const hRad = (color.h * Math.PI) / 180;
  return lab(color.l, color.c * Math.cos(hRad), color.c * Math.sin(hRad), color.alpha);
};

/**
 * Converts a color from CIE LCh to OKLab color space.
 *
 * This function first converts the LCh color to XYZ, then from XYZ to OKLab.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const lchToOKLab = (color: LChColor): OKLabColor => xyzToOKLab(lchToXYZ(color));

/**
 * Converts a color from CIE LCh to OKLCh color space.
 *
 * This function first converts the LCh color to OKLab, then from OKLab to OKLCh.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const lchToOKLCh = (color: LChColor): OKLChColor => oklabToOKLCh(lchToOKLab(color));

/**
 * Converts a color from CIE LCh to the JzAzBz color space.
 *
 * This function first converts the LCh color to XYZ, then from XYZ to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {LChColor} color - The LCh color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const lchToJzAzBz = (color: LChColor, peakLuminance = 10000): JzAzBzColor =>
  xyzToJzAzBz(lchToXYZ(color), peakLuminance);

/**
 * Converts a color from CIE LCh to the JzCzHz color space.
 *
 * This function first converts the LCh color to XYZ, then from XYZ to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {LChColor} color - The LCh color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const lchToJzCzHz = (color: LChColor, peakLuminance = 10000): JzCzHzColor =>
  xyzToJzCzHz(lchToXYZ(color), peakLuminance);
