import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { XYZColor } from '../xyz';
import { ϵ, κ } from './constants';
import { RGBColor } from '../rgb';
import { LChColor } from '../lch';
import { OKLabColor } from '../oklab';
import { OKLChColor } from '../oklch';
import { JzAzBzColor } from '../jzazbz';
import { JzCzHzColor } from '../jzczhz';
import { convertColor } from '../../conversion/conversion';

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
export type LabColor = {
  space: 'lab';

  l: number;
  a: number;
  b: number;
  alpha?: number;
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
/*@__NO_SIDE_EFFECTS__*/
export const labToRGB = (color: LabColor): RGBColor => {
  const result = convertColor<LabColor, RGBColor>(color, 'rgb');
  if (!result) {
    throw new Error('Could not convert from Lab to RGB');
  }
  return result;
};

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
/*@__NO_SIDE_EFFECTS__*/
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

  return {
    space: 'xyz',

    x: xn * i.xR,
    y: yn * i.yR,
    z: zn * i.zR,
    alpha: color.alpha,
    illuminant: i
  };
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
/*@__NO_SIDE_EFFECTS__*/
export const labToLCH = (color: LabColor): LChColor => {
  const c = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;
  return { space: 'lch', l: color.l, c, h, alpha: color.alpha };
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
/*@__NO_SIDE_EFFECTS__*/
export const labToOKLab = (color: LabColor): OKLabColor => {
  const result = convertColor<LabColor, OKLabColor>(color, 'oklab');
  if (!result) {
    throw new Error('Could not convert from Lab to OKLab');
  }
  return result;
};

/**
 * Converts a color from CIE Lab to OKLCh color space.
 *
 * This function uses the automatic conversion system to find the optimal path
 * from Lab to OKLCh, which typically goes through XYZ and OKLab.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
/*@__NO_SIDE_EFFECTS__*/
export const labToOKLCh = (color: LabColor): OKLChColor => {
  const result = convertColor<LabColor, OKLChColor>(color, 'oklch');
  if (!result) {
    throw new Error('Could not convert from Lab to OKLCh');
  }
  return result;
};

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
/*@__NO_SIDE_EFFECTS__*/
export const labToJzAzBz = (color: LabColor, peakLuminance: number = 10000): JzAzBzColor => {
  // First convert to XYZ
  const xyz = labToXYZ(color);

  // Then use the automatic conversion system with the peak luminance parameter
  const result = convertColor<XYZColor, JzAzBzColor>(xyz, 'jzazbz', peakLuminance);
  if (!result) {
    throw new Error('Could not convert from XYZ to JzAzBz');
  }
  return result;
};

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
/*@__NO_SIDE_EFFECTS__*/
export const labToJzCzHz = (color: LabColor, peakLuminance: number = 10000): JzCzHzColor => {
  // First convert to XYZ
  const xyz = labToXYZ(color);

  // Then use the automatic conversion system with the peak luminance parameter
  const result = convertColor<XYZColor, JzCzHzColor>(xyz, 'jzczhz', peakLuminance);
  if (!result) {
    throw new Error('Could not convert from XYZ to JzCzHz');
  }
  return result;
};
