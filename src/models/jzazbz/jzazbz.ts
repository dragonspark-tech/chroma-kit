import { b, c1, c2, c3, d, d0, g, JZAZBZ_XYZ_LMS_IABZ, JZAZBZ_XYZ_LMS_MATRIX, m1, m2p } from './constants';
import { xyz, XYZColor, xyzToLab, xyzToLCh, xyzToOKLab, xyzToOKLCh, xyzToRGB } from '../xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { RGBColor, rgbToHSL, rgbToHSV } from '../rgb';
import { LabColor } from '../lab';
import { LChColor } from '../lch';
import { OKLabColor } from '../oklab';
import { OKLChColor } from '../oklch';
import { jzczhz, JzCzHzColor } from '../jzczhz';
import { IlluminantD65 } from '../../standards/illuminants';
import { HSLColor } from '../hsl';
import { HSVColor } from '../hsv';
import { Color, ColorBase } from '../../foundation';
import { convertColor } from '../../conversion/conversion';

/**
 * Represents a color in the JzAzBz color space.
 *
 * The JzAzBz color space is a perceptually uniform color space designed to address
 * the limitations of existing color spaces. It provides improved perceptual uniformity,
 * especially for saturated colors and blue hues, and handles high dynamic range (HDR)
 * content better than traditional color spaces.
 *
 * @property {number} jz - The lightness component
 * @property {number} az - The green-red component (negative values are green, positive values are red)
 * @property {number} bz - The blue-yellow component (negative values are blue, positive values are yellow)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface JzAzBzColor extends ColorBase {
  space: 'jzazbz';

  jz: number;
  az: number;
  bz: number;
}

export const toCSSString = (color: JzAzBzColor): string => jzazbzToXYZ(color).toCSSString();

export const jzazbz = (jz: number, az: number, bz: number, alpha?: number): JzAzBzColor => ({
  space: 'jzazbz',
  jz,
  az,
  bz,
  alpha,

  toString() {
    return toCSSString(this);
  },

  toCSSString() {
    return toCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: string) {
    return convertColor<JzAzBzColor, T>(this, colorSpace);
  }
});

export const jzazbzFromVector = (v: number[], alpha?: number): JzAzBzColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return jzazbz(v[0], v[1], v[2], alpha);
};

/**
 * Converts a color from JzAzBz to RGB color space.
 *
 * This function first converts the JzAzBz color to XYZ, then from XYZ to RGB.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {RGBColor} The color in RGB space
 */
export const jzazbzToRGB = (color: JzAzBzColor, peakLuminance: number = 10000): RGBColor =>
  xyzToRGB(jzazbzToXYZ(color, peakLuminance));

/**
 * Converts a color from JzAzBz to HSL color space.
 *
 * This function first converts the JzAzBz color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {HSLColor} The color in HSL space
 */
export const jzazbzToHSL = (color: JzAzBzColor, peakLuminance: number = 10000): HSLColor =>
  rgbToHSL(jzazbzToRGB(color, peakLuminance));

/**
 * Converts a color from JzAzBz to HSV color space.
 *
 * This function first converts the JzAzBz color to RGB, then from RGB to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {HSVColor} The color in HSV space
 */
export const jzazbzToHSV = (color: JzAzBzColor, peakLuminance: number = 10000): HSVColor =>
  rgbToHSV(jzazbzToRGB(color, peakLuminance));

/**
 * Converts a color from JzAzBz to CIE XYZ color space.
 *
 * This function implements the JzAzBz to XYZ conversion algorithm, which includes:
 * 1. Converting Jz to Iz by inverting the non-linear compression
 * 2. Converting (Iz, az, bz) to encoded LMS values using a transformation matrix
 * 3. Applying the forward PQ function to recover linear LMS values
 * 4. Converting LMS to pre-adapted XYZ using another transformation matrix
 * 5. Undoing the chromatic adaptation to get the final XYZ values
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {XYZColor} The color in XYZ space
 */
export const jzazbzToXYZ = (color: JzAzBzColor, peakLuminance: number = 10000): XYZColor => {
  const JzPrime = color.jz + d0;
  const Iz = JzPrime / (1 + d - d * JzPrime);

  const [Lp, Mp, Sp] = multiplyMatrixByVector(JZAZBZ_XYZ_LMS_MATRIX, [Iz, color.az, color.bz]);

  const L = jzazbzPQForward(Lp, peakLuminance);
  const M = jzazbzPQForward(Mp, peakLuminance);
  const S = jzazbzPQForward(Sp, peakLuminance);

  const [Xp, Yp, Zp] = multiplyMatrixByVector(JZAZBZ_XYZ_LMS_IABZ, [L, M, S]);

  const Z = Zp;
  const X = (Xp + (b - 1) * Z) / b;
  const Y = (Yp + (g - 1) * X) / g;

  return xyz(X, Y, Z, color.alpha, IlluminantD65);
};

/**
 * Converts a color from JzAzBz to CIE Lab color space.
 *
 * This function first converts the JzAzBz color to XYZ, then from XYZ to Lab.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {LabColor} The color in Lab space
 */
export const jzazbzToLab = (color: JzAzBzColor, peakLuminance: number = 10000): LabColor =>
  xyzToLab(jzazbzToXYZ(color, peakLuminance));

/**
 * Converts a color from JzAzBz to CIE LCh color space.
 *
 * This function first converts the JzAzBz color to XYZ, then from XYZ to LCh.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {LChColor} The color in LCh space
 */
export const jzazbzToLCh = (color: JzAzBzColor, peakLuminance: number = 10000): LChColor =>
  xyzToLCh(jzazbzToXYZ(color, peakLuminance));

/**
 * Converts a color from JzAzBz to OKLab color space.
 *
 * This function first converts the JzAzBz color to XYZ, then from XYZ to OKLab.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {OKLabColor} The color in OKLab space
 */
export const jzazbzToOKLab = (color: JzAzBzColor, peakLuminance: number = 10000): OKLabColor =>
  xyzToOKLab(jzazbzToXYZ(color, peakLuminance));

/**
 * Converts a color from JzAzBz to OKLCh color space.
 *
 * This function first converts the JzAzBz color to XYZ, then from XYZ to OKLCh.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {OKLChColor} The color in OKLCh space
 */
export const jzazbzToOKLCh = (color: JzAzBzColor, peakLuminance: number = 10000): OKLChColor =>
  xyzToOKLCh(jzazbzToXYZ(color, peakLuminance));

/**
 * Converts a color from JzAzBz to JzCzHz color space.
 *
 * This function transforms the Cartesian coordinates (az, bz) of JzAzBz
 * into polar coordinates (Cz, Hz) to create the cylindrical JzCzHz representation.
 * The Jz component remains unchanged.
 *
 * @param {JzAzBzColor} color - The JzAzBz color to convert
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const jzazbzToJzCzHz = (color: JzAzBzColor): JzCzHzColor => {
  const cz = Math.hypot(color.az, color.bz);
  const hz = ((Math.atan2(color.bz, color.az) * 180) / Math.PI + 360) % 360;

  return jzczhz(color.jz, cz, hz, color.alpha);
};

/**
 * Applies the inverse Perceptual Quantizer (PQ) function used in the JzAzBz color space.
 *
 * This function converts from the encoded non-linear domain to the linear light domain.
 * It is used as part of the conversion from XYZ to JzAzBz color space.
 *
 * @param {number} E - The encoded value to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {number} The linear light value
 */
export const jzazbzPQInverse = (E: number, peakLuminance: number = 10000): number => {
  const x = (E / peakLuminance) ** m1;
  const num = c1 + c2 * x;
  const den = 1 + c3 * x;
  return (num / den) ** m2p;
};

/**
 * Applies the Perceptual Quantizer (PQ) function used in the JzAzBz color space.
 *
 * This function converts from the linear light domain to the encoded non-linear domain.
 * It is used as part of the conversion from JzAzBz to XYZ color space.
 *
 * @param {number} Ep - The linear light value to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {number} The encoded non-linear value
 */
export const jzazbzPQForward = (Ep: number, peakLuminance: number = 10000): number => {
  const y = Math.pow(Ep, 1 / m2p);
  const num = c1 - y;
  const den = c3 * y - c2;
  const x = num / den; // (C / peakLuminance) ^ m1
  return peakLuminance * Math.pow(x, 1 / m1);
};
