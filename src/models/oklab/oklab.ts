import { OKLAB_LMS_MATRIX, OKLCH_THROUGH_LMS_XYZ_MATRIX } from './constants';
import { multiplyMatrixByVector } from '../../utils/linear';
import { XYZColor, xyzToLab, xyzToLCh, xyzToRGB } from '../xyz/xyz';
import { RGBColor } from '../rgb/rgb';
import { OKLChColor } from '../oklch/oklch';
import { LabColor } from '../lab/lab';
import { LChColor } from '../lch/lch';

/**
 * Represents a color in the OKLab color space.
 *
 * The OKLab color space is a perceptually uniform color space designed to better
 * represent how humans perceive color differences. It improves upon the traditional
 * Lab color space by providing more accurate color interpolation and better hue linearity.
 *
 * @property {number} l - The lightness component (0-1)
 * @property {number} a - The green-red component (negative values are green, positive values are red)
 * @property {number} b - The blue-yellow component (negative values are blue, positive values are yellow)
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 */
export type OKLabColor = {
  l: number;
  a: number;
  b: number;
  alpha?: number;
};

/**
 * Converts a color from OKLab to RGB color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to RGB.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const oklabToRGB = (color: OKLabColor): RGBColor => xyzToRGB(oklabToXYZ(color));

/**
 * Converts a color from OKLab to CIE XYZ color space.
 *
 * This function implements the OKLab to XYZ conversion algorithm, which includes:
 * 1. Converting OKLab to LMS cone responses using a transformation matrix
 * 2. Applying a non-linear transformation (cubing) to the LMS values
 * 3. Converting the non-linear LMS values to XYZ using another matrix
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {XYZColor} The color in XYZ space
 */
export const oklabToXYZ = (color: OKLabColor): XYZColor => {
  const [l, m, s] = multiplyMatrixByVector(OKLAB_LMS_MATRIX, [color.l, color.a, color.b]);
  const linear = [l ** 3, m ** 3, s ** 3];

  const xyz = multiplyMatrixByVector(OKLCH_THROUGH_LMS_XYZ_MATRIX, linear);

  return { x: xyz[0], y: xyz[1], z: xyz[2], alpha: color.alpha };
}

/**
 * Converts a color from OKLab to CIE Lab color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to Lab.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {LabColor} The color in Lab space
 */
export const oklabToLab = (color: OKLabColor): LabColor => xyzToLab(oklabToXYZ(color));

/**
 * Converts a color from OKLab to CIE LCh color space.
 *
 * This function first converts the OKLab color to XYZ, then from XYZ to LCh.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {LChColor} The color in LCh space
 */
export const oklabToLCh = (color: OKLabColor): LChColor => xyzToLCh(oklabToXYZ(color));

/**
 * Converts a color from OKLab to OKLCh color space.
 *
 * This function transforms the Cartesian coordinates (a, b) of OKLab
 * into polar coordinates (C, h) to create the cylindrical OKLCh representation.
 * The L component remains unchanged.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const oklabToOKLCh = (color: OKLabColor): OKLChColor => {
  const C = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;

  return { l: color.l, c: C, h, alpha: color.alpha };
};
