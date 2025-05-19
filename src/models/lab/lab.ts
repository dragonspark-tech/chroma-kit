import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { xyz, XYZColor, xyzToJzAzBz, xyzToJzCzHz, xyzToOKLab, xyzToOKLCh, xyzToRGB } from '../xyz';
import { ϵ, κ } from './constants';
import { RGBColor, rgbToHSL, rgbToHSV } from '../rgb';
import { lch, LChColor } from '../lch';
import { OKLabColor } from '../oklab';
import { OKLChColor } from '../oklch';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';
import { HSLColor } from '../hsl';
import { HSVColor } from '../hsv';
import { convertColor } from '../../conversion/conversion';
import { Color, ColorBase } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Represents a color in the CIE Lab color space.
 *
 * The CIE Lab color space is designed to be perceptually uniform, meaning that
 * a change of the same amount in a color value should produce a change of about
 * the same visual importance. It's device-independent and based on the CIE XYZ color space.
 *
 * @property {number} l - The lightness component (0-100)
 * @property {number} a - The green-red component (negative values are green, positive values are red)
 * @property {number} b - The blue-yellow component (negative values are blue, positive values are yellow)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export interface LabColor extends ColorBase {
  space: 'lab';

  l: number;
  a: number;
  b: number;
}

export const labToCSSString = (color: LabColor): string => {
  const { l, a, b, alpha } = color;

  const lFormatted = (l * 100).toFixed(4);
  const aFormatted = (a * 100).toFixed(4);
  const bFormatted = (b * 100).toFixed(4);

  return `lab(${lFormatted}% ${aFormatted} ${bFormatted}${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

export const lab = (l: number, a: number, b: number, alpha?: number): LabColor => ({
  space: 'lab',
  l,
  a,
  b,
  alpha,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return labToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: string) {
    return convertColor<LabColor, T>(this, colorSpace);
  }
});

export const labFromVector = (v: number[], alpha?: number): LabColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return lab(v[0], v[1], v[2], alpha);
};

/**
 * Converts a color from CIE Lab to RGB color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to RGB, which typically goes through XYZ.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const labToRGB = (color: LabColor): RGBColor => xyzToRGB(labToXYZ(color));

/**
 * Converts a color from CIE Lab to HSL color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to HSL, which typically goes through XYZ and RGB.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const labToHSL = (color: LabColor): HSLColor => rgbToHSL(labToRGB(color));

/**
 * Converts a color from CIE Lab to HSV color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to HSV, which typically goes through XYZ and RGB.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const labToHSV = (color: LabColor): HSVColor => rgbToHSV(labToRGB(color));

/**
 * Converts a color from CIE Lab to CIE XYZ color space.
 *
 * This function implements the standard Lab to XYZ conversion algorithm, which includes:
 * 1. Computing the f(x), f(y), and f(z) values from L*, a*, and b*
 * 2. Applying the inverse non-linear transformation to get normalized XYZ values
 * 3. Scaling by the reference white point
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {Illuminant} [illuminant] - The reference white point to use (defaults to D65)
 * @returns {XYZColor} The color in XYZ space with the specified illuminant
 */
export const labToXYZ = (color: LabColor, illuminant?: Illuminant): XYZColor => {
  const i = illuminant || IlluminantD65;

  const fy = (color.l + 16) / 116;
  const fx = fy + color.a / 500;
  const fz = fy - color.b / 200;

  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);

  const xn = fx3 > ϵ ? fx3 : (116 * fx - 16) / κ;
  const yn = color.l > κ * ϵ ? fy3 : color.l / κ;
  const zn = fz3 > ϵ ? fz3 : (116 * fz - 16) / κ;

  return xyz(xn * i.xR, yn * i.yR, zn * i.zR, color.alpha, i);
};

/**
 * Converts a color from CIE Lab to CIE LCh color space.
 *
 * This function transforms the Cartesian coordinates (a*, b*) of Lab
 * into polar coordinates (C*, h°) to create the cylindrical LCh representation.
 * The L* component remains unchanged.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {LChColor} The color in LCh space
 */
export const labToLCH = (color: LabColor): LChColor => {
  const c = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;

  return lch(color.l, c, h, color.alpha);
};

/**
 * Converts a color from CIE Lab to OKLab color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to OKLab, which typically goes through XYZ.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const labToOKLab = (color: LabColor): OKLabColor => xyzToOKLab(labToXYZ(color));

/**
 * Converts a color from CIE Lab to OKLCh color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to OKLCh, which typically goes through XYZ and OKLab.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const labToOKLCh = (color: LabColor): OKLChColor => xyzToOKLCh(labToXYZ(color));

/**
 * Converts a color from CIE Lab to the JzAzBz color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to JzAzBz, which typically goes through XYZ.
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const labToJzAzBz = (color: LabColor, peakLuminance: number = 10000): JzAzBzColor =>
  xyzToJzAzBz(labToXYZ(color), peakLuminance);

/**
 * Converts a color from CIE Lab to the JzCzHz color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to JzCzHz, which typically goes through XYZ and JzAzBz.
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance of the display, in nits
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const labToJzCzHz = (color: LabColor, peakLuminance: number = 10000): JzCzHzColor =>
  xyzToJzCzHz(labToXYZ(color), peakLuminance);
