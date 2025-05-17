import { LabColor, labToLCH } from '../lab/lab';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { ϵ, κ } from '../lab/constants';
import { RGBColor } from '../rgb/rgb';
import { multiplyMatrixByVector } from '../../utils/linear';
import { delinearizeRGBColor } from '../rgb/transform';
import { XYZ_OKLCH_THROUGH_LMS_MATRIX, XYZ_RGB_MATRIX } from './constants';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { LChColor } from '../lch/lch';
import { OKLChColor } from '../oklch/oklch';
import { LMS_OKLAB_MATRIX } from '../oklab/constants';

/**
 * Represents a color in the CIE XYZ color space.
 *
 * The CIE XYZ color space is a device-independent color space that serves as a standard
 * reference for defining all other color spaces. It's based on direct measurements of
 * human visual perception and is often used as an intermediate space for converting
 * between other color spaces.
 *
 * @property {number} x - The X component, related to a mix of the cone response curves
 * @property {number} y - The Y component, representing luminance
 * @property {number} z - The Z component, roughly equal to blue stimulation
 * @property {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @property {Illuminant} [illuminant] - The reference white point used for this color
 */
export type XYZColor = {
  x: number;
  y: number;
  z: number;
  alpha?: number;
  illuminant?: Illuminant;
};

/**
 * Converts a color from CIE XYZ to RGB color space.
 *
 * This function applies the XYZ to RGB transformation matrix to convert the color,
 * then delinearizes the RGB values (applies gamma correction) to get standard RGB values.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const xyzToRGB = (color: XYZColor): RGBColor => {
  const lRGB = multiplyMatrixByVector(XYZ_RGB_MATRIX, [color.x, color.y, color.z]);
  return delinearizeRGBColor({ r: lRGB[0], g: lRGB[1], b: lRGB[2], a: color.alpha });
};

/**
 * Converts a color from CIE XYZ to CIE Lab color space.
 *
 * This function implements the standard XYZ to Lab conversion algorithm, which includes:
 * 1. Normalizing XYZ values by the reference white point
 * 2. Applying a non-linear transformation (cube root or linear approximation)
 * 3. Computing the L*, a*, and b* components
 *
 * The Lab color space is designed to be perceptually uniform, meaning that
 * a change of the same amount in a color value should produce a change of about
 * the same visual importance.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {LabColor} The color in Lab space
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
    alpha: color.alpha
  };
};

/**
 * Converts a color from CIE XYZ to CIE LCh color space.
 *
 * This function first converts the XYZ color to Lab, then from Lab to LCh.
 * The LCh color space is a cylindrical representation of Lab, using lightness,
 * chroma (saturation), and hue components.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {LChColor} The color in LCh space
 */
export const xyzToLCh = (color: XYZColor): LChColor =>
  labToLCH(xyzToLab(color))

/**
 * Converts a color from CIE XYZ to OKLab color space.
 *
 * This function implements the XYZ to OKLab conversion algorithm, which includes:
 * 1. Converting XYZ to LMS cone responses using a transformation matrix
 * 2. Applying a non-linear transformation (cube root) to the LMS values
 * 3. Converting the non-linear LMS values to OKLab using another matrix
 *
 * The OKLab color space is designed to be perceptually uniform with improved
 * accuracy compared to the traditional Lab space.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {OKLabColor} The color in OKLab space
 */
export const xyzToOKLab = (color: XYZColor): OKLabColor => {
  const [l, m, s] = multiplyMatrixByVector(XYZ_OKLCH_THROUGH_LMS_MATRIX, [color.x, color.y, color.z]);
  const nonLinear = [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)];

  const oklab = multiplyMatrixByVector(LMS_OKLAB_MATRIX, nonLinear);
  return { l: oklab[0], a: oklab[1], b: oklab[2], alpha: color.alpha };
};

/**
 * Converts a color from CIE XYZ to OKLCh color space.
 *
 * This function first converts the XYZ color to OKLab, then from OKLab to OKLCh.
 * The OKLCh color space is a cylindrical representation of OKLab, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {OKLChColor} The color in OKLCh space
 */
export const xyzToOKLCh = (color: XYZColor): OKLChColor =>
  oklabToOKLCh(xyzToOKLab(color));
