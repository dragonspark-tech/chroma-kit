import type { LabColor } from '../lab/lab';
import { Illuminant, IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { κ, ϵ } from '../lab/constants';

export type XYZColor = {
  x: number;
  y: number;
  z: number;
  alpha?: number;
  illuminant?: Illuminant;
};

/**
 * Converts XYZ color space values to Lab color space values.
 *
 * The function takes color values in the CIE 1931 XYZ color space and converts
 * them to the CIE 1976 (L*, a*, b*) color space. It also adjusts the
 * transformation based on the reference white illuminant provided in the input,
 * defaulting to Illuminant D65 if none is provided.
 *
 * @param {XYZColor} color - An object representing a color in the XYZ color
 * space, including its x, y, z components, an optional illuminant, and an
 * optional alpha transparency value.
 * @returns {LabColor} An object representing a color in the Lab color space,
 * containing the l (lightness), a (green-red axis), b (blue-yellow axis), and
 * the optional alpha transparency value.
 */
export const xyzToLab = (color: XYZColor): LabColor => {
  const i = color.illuminant || IlluminantD65;

  const xn = color.x / i.xR,
    yn = color.y / i.yR,
    zn = color.z / i.zR;

  const fx = xn > ϵ ? Math.cbrt(xn) : (κ * xn + 16) / 116;
  const fy = yn > ϵ ? Math.cbrt(yn) : (κ * yn + 16) / 116;
  const fz = zn > ϵ ? Math.cbrt(zn) : (κ * zn + 16) / 116;

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
    alpha: color.alpha,
  };
};
