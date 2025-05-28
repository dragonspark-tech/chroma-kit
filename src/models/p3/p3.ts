import type { ColorBase } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import { type RGBColor, rgbToHSL, rgbToHSV, rgbToHWB } from '../rgb';
import {
  type XYZColor,
  xyzFromVector,
  xyzToJzAzBz,
  xyzToJzCzHz,
  xyzToLab,
  xyzToLCh,
  xyzToOKLab,
  xyzToOKLCh,
  xyzToRGB
} from '../xyz';
import { linearizeP3Color } from './transform';
import { multiplyMatrixByVector } from '../../utils/linear';
import { P3_XYZ_MATRIX } from './constants';
import { IlluminantD65 } from '../../standards/illuminants';
import type { HSLColor } from '../hsl';
import type { HSVColor } from '../hsv';
import type { HWBColor } from '../hwb';
import type { LabColor } from '../lab';
import type { LChColor } from '../lch';
import type { OKLabColor } from '../oklab';
import type { OKLChColor } from '../oklch';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';

export interface P3Color extends ColorBase {
  space: 'p3';

  r: number;
  g: number;
  b: number;
}

/**
 * Converts a DCI-P3 color object to a CSS-compatible string representation.
 *
 * @param {P3Color} color - The P3 color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const p3ToCSSString = (color: P3Color): string => {
  const { r, g, b, alpha } = color;

  const a = alpha ?? 1;

  return `color(display-p3 ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}${a < 1 ? ' / ' + a.toFixed(3) : ''})`;
};

/**
 * Creates a new DCI-P3 color object with the specified components.
 *
 * This is the primary factory function for creating DCI-P3 compatible RGB colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} r - The red component (0-1)
 * @param {number} g - The green component (0-1)
 * @param {number} b - The blue component (0-1)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {P3Color} A new P3 color object
 */
export const p3 = (r: number, g: number, b: number, alpha?: number): P3Color => ({
  space: 'p3',
  r,
  g,
  b,
  alpha,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return p3ToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: string) {
    return convertColor<P3Color, T>(this, colorSpace);
  }
});

/**
 * Creates a new DCI-P3 RGB color object from a vector of RGB components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the RGB components [r, g, b] the P3 gamut ranges
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @returns {P3Color} A new P3 color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const p3FromVector = (v: number[], alpha?: number): P3Color => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return p3(v[0], v[1], v[2], alpha);
};

/**
 * Converts a P3 color to an RGB color. Optionally performs gamut mapping to ensure
 * the resulting RGB color lies within the displayable range.
 *
 * @param {P3Color} color - The P3 color object to be converted.
 * @param {boolean} [performGamutMapping=true] - Indicates whether gamut mapping should be applied.
 * If true, the resulting RGB color will be clamped to the valid range.
 *
 * @return {RGBColor} The converted RGB color object.
 */
export const p3ToRGB = (color: P3Color, performGamutMapping = true): RGBColor =>
  xyzToRGB(p3ToXYZ(color), performGamutMapping);

/**
 * Converts a P3 color to the HSL color space.
 *
 * This function first converts the P3 color to RGB, then from RGB to HSL.
 * The HSL color space represents colors using hue, saturation, and lightness components.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const p3ToHSL = (color: P3Color): HSLColor =>
  rgbToHSL(p3ToRGB(color, true));

/**
 * Converts a P3 color to the HSV color space.
 *
 * This function first converts the P3 color to RGB, then from RGB to HSV.
 * The HSV color space represents colors using hue, saturation, and value (brightness) components.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const p3ToHSV = (color: P3Color): HSVColor =>
  rgbToHSV(p3ToRGB(color, true));

/**
 * Converts a P3 color to the HWB color space.
 *
 * This function first converts the P3 color to RGB, then from RGB to HWB.
 * The HWB color space represents colors using hue, whiteness, and blackness components.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const p3ToHWB = (color: P3Color): HWBColor =>
  rgbToHWB(p3ToRGB(color, true));

/**
 * Converts a P3 color to the CIE Lab color space.
 *
 * This function first converts the P3 color to XYZ, then from XYZ to Lab.
 * The Lab color space is designed to be perceptually uniform and device-independent.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {LabColor} The color in Lab space
 */
export const p3ToLab = (color: P3Color): LabColor =>
  xyzToLab(p3ToXYZ(color));

/**
 * Converts a P3 color to the CIE LCh color space.
 *
 * This function first converts the P3 color to XYZ, then from XYZ to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {LChColor} The color in LCh space
 */
export const p3ToLCh = (color: P3Color): LChColor =>
  xyzToLCh(p3ToXYZ(color));

/**
 * Converts a P3 color to the OKLab color space.
 *
 * This function first converts the P3 color to XYZ, then from XYZ to OKLab.
 * OKLab is a perceptually uniform color space designed to better represent
 * how humans perceive color differences.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const p3ToOklab = (color: P3Color): OKLabColor =>
  xyzToOKLab(p3ToXYZ(color));

/**
 * Converts a P3 color to the OKLCh color space.
 *
 * This function first converts the P3 color to XYZ, then from XYZ to OKLCh.
 * OKLCh is a cylindrical representation of OKLab, using lightness, chroma (saturation),
 * and hue components, with improved perceptual uniformity over traditional LCh.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const p3ToOklch = (color: P3Color): OKLChColor =>
  xyzToOKLCh(p3ToXYZ(color));

/**
 * Converts a P3 color to the JzAzBz color space.
 *
 * This function first converts the P3 color to XYZ, then from XYZ to JzAzBz.
 * JzAzBz is a color space designed to be perceptually uniform and device-independent.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const p3ToJzAzBz = (color: P3Color): JzAzBzColor =>
  xyzToJzAzBz(p3ToXYZ(color));

/**
 * Converts a P3 color to the JzCzHz color space.
 *
 * This function first converts the P3 color to XYZ, then from XYZ to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {P3Color} color - The P3 color to convert
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const p3ToJzCzHz = (color: P3Color): JzCzHzColor =>
  xyzToJzCzHz(p3ToXYZ(color));

/**
 * Converts a color from the P3 color space to the CIE XYZ color space.
 *
 * This function takes a color in the P3 color space as input, linearizes its components,
 * and performs a matrix transformation to convert it to the CIE 1931 XYZ color space.
 *
 * The resulting color uses illuminant D65 as its white point.
 *
 * @param {P3Color} color - The color in the P3 color space, including its alpha value.
 * @returns {XYZColor} The resulting color in the CIE 1931 XYZ color space.
 */
export const p3ToXYZ = (color: P3Color): XYZColor => {
  const lC = linearizeP3Color(color);
  const xyz = multiplyMatrixByVector(P3_XYZ_MATRIX, [lC.r, lC.g, lC.b]);

  return xyzFromVector(xyz, color.alpha, IlluminantD65);
};
