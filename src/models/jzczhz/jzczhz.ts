import {
  JzAzBzColor,
  jzazbzToLab,
  jzazbzToLCh,
  jzazbzToOKLab,
  jzazbzToOKLCh,
  jzazbzToRGB,
  jzazbzToXYZ
} from '../jzazbz';
import { XYZColor } from '../xyz';
import { RGBColor } from '../rgb';
import { LabColor } from '../lab';
import { LChColor } from '../lch';
import { OKLabColor } from '../oklab';
import { OKLChColor } from '../oklch';

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
export type JzCzHzColor = {
  space: 'jzczhz';

  jz: number;
  cz: number;
  hz: number;
  alpha?: number;
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
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToRGB = (color: JzCzHzColor, peakLuminance: number = 10000): RGBColor =>
  jzazbzToRGB(jzczhzToJzAzBz(color), peakLuminance);

/**
 * Converts a color from JzCzHz to CIE XYZ color space.
 *
 * This function first converts the JzCzHz color to JzAzBz, then from JzAzBz to XYZ.
 *
 * @param {JzCzHzColor} color - The JzCzHz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {XYZColor} The color in XYZ space
 */
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToXYZ = (color: JzCzHzColor, peakLuminance: number = 10000): XYZColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToLab = (color: JzCzHzColor, peakLuminance: number = 10000): LabColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToLCh = (color: JzCzHzColor, peakLuminance: number = 10000): LChColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToOKLab = (color: JzCzHzColor, peakLuminance: number = 10000): OKLabColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToOKLCh = (color: JzCzHzColor, peakLuminance: number = 10000): OKLChColor =>
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
/*@__NO_SIDE_EFFECTS__*/
export const jzczhzToJzAzBz = (color: JzCzHzColor): JzAzBzColor => {
  const hzRad = (color.hz * Math.PI) / 180; // deg → rad
  return {
    space: 'jzazbz',

    jz: color.jz,
    az: color.cz * Math.cos(hzRad),
    bz: color.cz * Math.sin(hzRad),
    alpha: color.alpha
  };
};
