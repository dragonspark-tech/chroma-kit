import { LabColor, labToXYZ } from '../lab/lab';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { OKLChColor } from '../oklch/oklch';
import { RGBColor } from '../rgb/rgb';
import { XYZColor, xyzToOKLab, xyzToRGB } from '../xyz/xyz';

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
export type LChColor = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

/**
 * Converts a color from CIE LCh to RGB color space.
 *
 * This function first converts the LCh color to XYZ, then from XYZ to RGB.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const lchToRGB = (color: LChColor): RGBColor =>
  xyzToRGB(lchToXYZ(color));

/**
 * Converts a color from CIE LCh to CIE XYZ color space.
 *
 * This function first converts the LCh color to Lab, then from Lab to XYZ.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const lchToXYZ = (color: LChColor): XYZColor =>
  labToXYZ(lchToLab(color));

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
  const hRad = (color.h * Math.PI) / 180; // deg → rad
  return {
    l: color.l,
    a: color.c * Math.cos(hRad),
    b: color.c * Math.sin(hRad),
    alpha: color.alpha
  };
};

/**
 * Converts a color from CIE LCh to OKLab color space.
 *
 * This function first converts the LCh color to XYZ, then from XYZ to OKLab.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const lchToOKLab = (color: LChColor): OKLabColor =>
  xyzToOKLab(lchToXYZ(color));

/**
 * Converts a color from CIE LCh to OKLCh color space.
 *
 * This function first converts the LCh color to OKLab, then from OKLab to OKLCh.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const lchToOKLCh = (color: LChColor): OKLChColor =>
  oklabToOKLCh(lchToOKLab(color));
