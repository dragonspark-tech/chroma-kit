import { type Illuminant, IlluminantD65 } from '../../standards/illuminants';
import {
  xyz,
  type XYZColor,
  xyzToJzAzBz,
  xyzToJzCzHz,
  xyzToOKLab,
  xyzToOKLCh, xyzToP3,
  xyzToRGB
} from '../xyz';
import { ϵ, κ } from './constants';
import { type RGBColor, rgbToHSL, rgbToHSV, rgbToHWB } from '../rgb';
import { lch, type LChColor } from '../lch';
import type { OKLabColor } from '../oklab';
import type { OKLChColor } from '../oklch';
import type { JzAzBzColor } from '../jzazbz';
import type { JzCzHzColor } from '../jzczhz';
import type { HSLColor } from '../hsl';
import type { HSVColor } from '../hsv';
import { convertColor } from '../../conversion/conversion';
import type { ColorBase } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import type { HWBColor } from '../hwb';
import { constrainAngle } from '../../utils/angles';
import type { P3Color } from '../p3/p3';

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
 * @property {Illuminant} [illuminant] - The reference white point used for this color
 */
export interface LabColor extends ColorBase {
  space: 'lab';

  l: number;
  a: number;
  b: number;

  illuminant?: Illuminant;
}

/**
 * Converts a Lab color object to a CSS-compatible string representation.
 *
 * This function formats the Lab color components according to the CSS Color Module Level 4
 * specification, which uses the format: lab(L% a b / alpha).
 *
 * @param {LabColor} color - The Lab color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const labToCSSString = (color: LabColor): string => {
  const { l, a, b, alpha } = color;

  const lFormatted = (l * 100).toFixed(2);
  const aFormatted = a.toFixed(4);
  const bFormatted = b.toFixed(4);

  return `lab(${lFormatted}% ${aFormatted} ${bFormatted}${alpha !== undefined ? ` / ${alpha.toFixed(3)}` : ''})`;
};

/**
 * Creates a new Lab color object with the specified components.
 *
 * This is the primary factory function for creating Lab colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 *
 * @param {number} l - The lightness component (0-1, will be scaled to 0-100 in CSS output)
 * @param {number} a - The green-red component (negative values are green, positive values are red)
 * @param {number} b - The blue-yellow component (negative values are blue, positive values are yellow)
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @param {Illuminant} [illuminant] - The reference white point to use, defaults to D65
 * @returns {LabColor} A new Lab color object
 */
export const lab = (
  l: number,
  a: number,
  b: number,
  alpha?: number,
  illuminant?: Illuminant
): LabColor => ({
  space: 'lab',
  l,
  a,
  b,
  alpha,
  illuminant: illuminant ?? IlluminantD65,

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

/**
 * Creates a new Lab color object from a vector of Lab components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the Lab components [l, a, b]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @param {Illuminant} [illuminant] - The reference white point to use, defaults to D65
 * @returns {LabColor} A new Lab color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
export const labFromVector = (v: number[], alpha?: number, illuminant?: Illuminant): LabColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return lab(v[0], v[1], v[2], alpha, illuminant);
};

/**
 * Converts a color from CIE Lab to RGB color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to RGB, which typically goes through XYZ. Gamut mapping is performed
 * during the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {RGBColor} The color in RGB space
 */
export const labToRGB = (color: LabColor, performGamutMapping = true): RGBColor =>
  xyzToRGB(labToXYZ(color), performGamutMapping);

export const labToP3 = (color: LabColor, performGamutMapping = true): P3Color =>
  xyzToP3(labToXYZ(color), performGamutMapping);

/**
 * Converts a color from CIE Lab to HSL color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to HSL, which typically goes through XYZ and RGB. Gamut mapping is performed
 * during the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {HSLColor} The color in HSL space
 */
export const labToHSL = (color: LabColor, performGamutMapping = true): HSLColor =>
  rgbToHSL(labToRGB(color, performGamutMapping));

/**
 * Converts a color from CIE Lab to HSV color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to HSV, which typically goes through XYZ and RGB. Gamut mapping is performed
 * during the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {HSVColor} The color in HSV space
 */
export const labToHSV = (color: LabColor, performGamutMapping = true): HSVColor =>
  rgbToHSV(labToRGB(color, performGamutMapping));

/**
 * Converts a color from CIE Lab to HWB color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to HWB, which typically goes through XYZ and RGB. Gamut mapping is performed
 * during the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {LabColor} color - The Lab color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {HWBColor} The color in HWB space
 */
export const labToHWB = (color: LabColor, performGamutMapping = true): HWBColor =>
  rgbToHWB(labToRGB(color, performGamutMapping));

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
  const { l, a, b, alpha, illuminant } = color;

  const ϵLCh = 0.0015;

  const isAchromatic = Math.abs(a) < ϵLCh && Math.abs(b) < ϵLCh;
  const h = isAchromatic ? 0 : constrainAngle((Math.atan2(b, a) * 180) / Math.PI);
  const C = isAchromatic ? 0 : Math.sqrt(a ** 2 + b ** 2);

  return lch(l, C, h, alpha, illuminant);
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
export const labToJzAzBz = (color: LabColor, peakLuminance = 10000): JzAzBzColor =>
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
export const labToJzCzHz = (color: LabColor, peakLuminance = 10000): JzCzHzColor =>
  xyzToJzCzHz(labToXYZ(color), peakLuminance);
