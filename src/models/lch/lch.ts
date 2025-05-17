import { LabColor, labToXYZ } from '../lab';
import { OKLabColor, oklabToOKLCh } from '../oklab';
import { OKLChColor } from '../oklch';
import { RGBColor, rgbToHSL, rgbToHSV } from '../rgb';
import { XYZColor, xyzToJzAzBz, xyzToJzCzHz, xyzToOKLab, xyzToRGB } from '../xyz';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';
import { HSLColor } from '../hsl';
import { HSVColor } from '../hsv';

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
  space: 'lch';

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
export const lchToRGB = (color: LChColor): RGBColor => xyzToRGB(lchToXYZ(color));

/**
 * Converts a color from CIE LCh to HSL color space.
 *
 * This function first converts the LCh color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components.
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
 * saturation, and value components.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const lchToHSV = (color: LChColor): HSVColor => rgbToHSV(lchToRGB(color));

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
  const hRad = (color.h * Math.PI) / 180; // deg → rad
  return {
    space: 'lab',

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
export const lchToJzAzBz = (color: LChColor, peakLuminance: number = 10000): JzAzBzColor =>
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
export const lchToJzCzHz = (color: LChColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(lchToXYZ(color), peakLuminance);
