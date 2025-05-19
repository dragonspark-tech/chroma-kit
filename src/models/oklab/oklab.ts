import { OKLAB_LMS_MATRIX, OKLCH_THROUGH_LMS_XYZ_MATRIX } from './constants';
import { multiplyMatrixByVector } from '../../utils/linear';
import { XYZColor, xyzFromVector, xyzToJzAzBz, xyzToJzCzHz, xyzToLab, xyzToLCh, xyzToRGB } from '../xyz';
import { sRGBColor, srgbToHSL, srgbToHSV, srgbToHWB } from '../srgb';
import { LabColor } from '../lab';
import { LChColor } from '../lch';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';
import { oklch, OKLChColor } from '../oklch';
import { HSLColor } from '../hsl';
import { HSVColor } from '../hsv';
import { IlluminantD65 } from '../../standards/illuminants';
import { ColorBase } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import { HWBColor } from '../hwb';

/**
 * Represents a color in the OKLab color space.
 *
 * The OKLab color space is a perceptually uniform color space designed to better
 * represent how humans perceive color differences. It improves upon the traditional
 * Lab color space by providing more accurate color interpolation and better hue linearity.
 *
 * @property {number} l - The lightness component (0-1)
 * @property {number} a - The green-red component (negative values are green, positive values are red)
 * @property {number} b - The blue-yellow component (negative values are blue, positive values are yellow)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface OKLabColor extends ColorBase {
  space: 'oklab';

  l: number;
  a: number;
  b: number;
}

/**
 * Converts an OKLab color object to a CSS-compatible string representation.
 *
 * This function formats the OKLab color as a CSS string using the modern space-separated
 * syntax with the lightness component expressed as a percentage.
 *
 * @param {OKLabColor} color - The OKLab color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const oklabToCSSString = (color: OKLabColor): string => {
  const { l, a, b, alpha } = color;

  const lFormatted = (l * 100).toFixed(2);
  const aFormatted = a.toFixed(4);
  const bFormatted = b.toFixed(4);

  return `oklab(${lFormatted}% ${aFormatted} ${bFormatted}${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

/**
 * Creates a new OKLab color object with the specified components.
 *
 * This is the primary factory function for creating OKLab colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} l - The lightness component (0-1)
 * @param {number} a - The green-red component (negative values are green, positive values are red)
 * @param {number} b - The blue-yellow component (negative values are blue, positive values are yellow)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {OKLabColor} A new OKLab color object
 */
export const oklab = (l: number, a: number, b: number, alpha?: number): OKLabColor => ({
  space: 'oklab',
  l,
  a,
  b,
  alpha,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return oklabToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: string) {
    return convertColor<OKLabColor, T>(this, colorSpace);
  }
});

/**
 * Creates a new OKLab color object from a vector of OKLab components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the OKLab components [l, a, b]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {OKLabColor} A new OKLab color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const oklabFromVector = (v: number[], alpha?: number): OKLabColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return oklab(v[0], v[1], v[2], alpha);
};

/**
 * Converts a color from OKLab to RGB color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to RGB.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {sRGBColor} The color in RGB space
 */
export const oklabToRGB = (color: OKLabColor): sRGBColor => xyzToRGB(oklabToXYZ(color));

/**
 * Converts a color from OKLab to HSL color space.
 *
 * This function first converts the OKLab color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const oklabToHSL = (color: OKLabColor): HSLColor => srgbToHSL(oklabToRGB(color));

/**
 * Converts a color from OKLab to HSV color space.
 *
 * This function first converts the OKLab color to RGB, then from RGB to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const oklabToHSV = (color: OKLabColor): HSVColor => srgbToHSV(oklabToRGB(color));

/**
 * Converts a color from OKLab to HWB color space.
 *
 * This function first converts the OKLab color to RGB, then from RGB to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const oklabToHWB = (color: OKLabColor): HWBColor => srgbToHWB(oklabToRGB(color));

/**
 * Converts a color from OKLab to CIE XYZ color space.
 *
 * This function implements the OKLab to XYZ conversion algorithm, which includes:
 * 1. Converting OKLab to LMS cone responses using a transformation matrix
 * 2. Applying a non-linear transformation (cubing) to the LMS values
 * 3. Converting the non-linear LMS values to XYZ using another matrix
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const oklabToXYZ = (color: OKLabColor): XYZColor => {
  const [l, m, s] = multiplyMatrixByVector(OKLAB_LMS_MATRIX, [color.l, color.a, color.b]);
  const linear = [l ** 3, m ** 3, s ** 3];

  const xyz = multiplyMatrixByVector(OKLCH_THROUGH_LMS_XYZ_MATRIX, linear);

  return xyzFromVector(xyz, color.alpha, IlluminantD65);
};

/**
 * Converts a color from OKLab to CIE Lab color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to Lab.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {LabColor} The color in Lab space
 */
export const oklabToLab = (color: OKLabColor): LabColor => xyzToLab(oklabToXYZ(color));

/**
 * Converts a color from OKLab to CIE LCh color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to LCh.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {LChColor} The color in LCh space
 */
export const oklabToLCh = (color: OKLabColor): LChColor => xyzToLCh(oklabToXYZ(color));

/**
 * Converts a color from OKLab to OKLCh color space.
 *
 * This function transforms the Cartesian coordinates (a, b) of OKLab
 * into polar coordinates (C, h) to create the cylindrical OKLCh representation.
 * The L component remains unchanged.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const oklabToOKLCh = (color: OKLabColor): OKLChColor => {
  const C = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;

  return oklch(color.l, C, h, color.alpha);
};

/**
 * Converts an OKLab color to the JzAzBz color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const oklabToJzAzBz = (color: OKLabColor, peakLuminance: number = 10000): JzAzBzColor =>
  xyzToJzAzBz(oklabToXYZ(color), peakLuminance);

/**
 * Converts an OKLab color to the JzCzHz color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const oklabToJzCzHz = (color: OKLabColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(oklabToXYZ(color), peakLuminance);
