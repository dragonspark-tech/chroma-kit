import { LabColor } from '../lab';
import { LChColor } from '../lch';
import { OKLabColor, oklabToLab, oklabToLCh, oklabToXYZ } from '../oklab';
import { RGBColor } from '../rgb';
import { XYZColor, xyzToJzAzBz, xyzToJzCzHz, xyzToRGB } from '../xyz';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';

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
export type OKLChColor = {
  space: 'oklch';

  l: number;
  c: number;
  h: number;
  alpha?: number;
};

/**
 * Converts a color from OKLCh to RGB color space.
 *
 * This function first converts the OKLCh color to XYZ, then from XYZ to RGB.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {RGBColor} The color in RGB space
 */
/*@__NO_SIDE_EFFECTS__*/
export const oklchToRGB = (color: OKLChColor): RGBColor => {
  const xyz = oklchToXYZ(color);
  return xyzToRGB(xyz);
};

/**
 * Converts a color from OKLCh to CIE XYZ color space.
 *
 * This function first converts the OKLCh color to OKLab, then from OKLab to XYZ.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {XYZColor} The color in XYZ space
 */
/*@__NO_SIDE_EFFECTS__*/
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
/*@__NO_SIDE_EFFECTS__*/
export const oklchToLab = (color: OKLChColor): LabColor => oklabToLab(oklchToOKLab(color));

/**
 * Converts a color from OKLCh to CIE LCh color space.
 *
 * This function first converts the OKLCh color to OKLab, then from OKLab to LCh.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {LChColor} The color in LCh space
 */
/*@__NO_SIDE_EFFECTS__*/
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
/*@__NO_SIDE_EFFECTS__*/
export const oklchToOKLab = (color: OKLChColor): OKLabColor => {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);

  return { space: 'oklab', l: color.l, a, b, alpha: color.alpha };
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
/*@__NO_SIDE_EFFECTS__*/
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
/*@__NO_SIDE_EFFECTS__*/
export const oklchToJzCzHz = (color: OKLChColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(oklchToXYZ(color), peakLuminance);
