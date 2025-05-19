import { lab, LabColor, labToLCH } from '../lab';
import { ϵ, κ } from '../lab/constants';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { delinearizeRGBColor, RGBColor, rgbFromVector, rgbToHSL, rgbToHSV } from '../rgb';
import { multiplyMatrixByVector } from '../../utils/linear';
import { XYZ_JZAZBZ_LMS_IABZ, XYZ_JZAZBZ_LMS_MATRIX, XYZ_OKLCH_THROUGH_LMS_MATRIX, XYZ_RGB_MATRIX } from './constants';
import { OKLabColor, oklabFromVector, oklabToOKLCh } from '../oklab';
import { LMS_OKLAB_MATRIX } from '../oklab/constants';
import { LChColor } from '../lch';
import { OKLChColor } from '../oklch';
import { jzazbz, JzAzBzColor, jzazbzPQInverse, jzazbzToJzCzHz } from '../jzazbz';
import { b, d, d0, g } from '../jzazbz/constants';
import { JzCzHzColor } from '../jzczhz';
import { HSLColor } from '../hsl';
import { HSVColor } from '../hsv';
import { Color, ColorBase, ColorSpace } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';

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
export interface XYZColor extends ColorBase {
  space: 'xyz';

  x: number;
  y: number;
  z: number;
  illuminant?: Illuminant;
}

export const xyzToCSSString = (color: XYZColor): string => {
  const { x, y, z, alpha, illuminant } = color;
  return `color(xyz-${illuminant?.name?.toLowerCase()} ${x} ${y} ${z}${alpha ? ` / ${alpha}` : ''})`;
};

export const xyz = (
  x: number,
  y: number,
  z: number,
  alpha?: number,
  illuminant?: Illuminant
): XYZColor => ({
  space: 'xyz',

  x,
  y,
  z,
  alpha,
  illuminant: illuminant ?? IlluminantD65,

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return xyzToCSSString(this);
  },

  to<T extends ColorBase>(colorSpace: ColorSpace) {
    return convertColor<XYZColor, T>(this, colorSpace);
  }
});

export const xyzFromVector = (v: number[], alpha?: number, illuminant?: Illuminant): XYZColor => {
  if (v.length !== 3) {
    throw new Error('Invalid vector length');
  }
  return xyz(v[0], v[1], v[2], alpha, illuminant);
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
  return delinearizeRGBColor(rgbFromVector(lRGB, color.alpha));
};

/**
 * Converts a color from CIE XYZ to HSL color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {HSLColor} The color in HSL space
 */
export const xyzToHSL = (color: XYZColor): HSLColor => rgbToHSL(xyzToRGB(color));

/**
 * Converts a color from CIE XYZ to HSV color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const xyzToHSV = (color: XYZColor): HSVColor => rgbToHSV(xyzToRGB(color));

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

  return lab(116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz), color.alpha);
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
export const xyzToLCh = (color: XYZColor): LChColor => labToLCH(xyzToLab(color));

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
  const [l, m, s] = multiplyMatrixByVector(XYZ_OKLCH_THROUGH_LMS_MATRIX, [
    color.x,
    color.y,
    color.z
  ]);

  const nonLinear = [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)];

  const oklab = multiplyMatrixByVector(LMS_OKLAB_MATRIX, nonLinear);
  return oklabFromVector(oklab, color.alpha);
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
export const xyzToOKLCh = (color: XYZColor): OKLChColor => oklabToOKLCh(xyzToOKLab(color));

/**
 * Converts a color from CIE XYZ to JzAzBz color space.
 *
 * This function implements the XYZ to JzAzBz conversion algorithm, which includes:
 * 1. Pre-adapting XYZ values using chromatic adaptation factors
 * 2. Converting to LMS cone responses using a transformation matrix
 * 3. Applying the inverse Perceptual Quantizer (PQ) function to the LMS values
 * 4. Converting to Iz, az, bz using another transformation matrix
 * 5. Applying non-linear compression to Iz to get the Jz lightness component
 *
 * The JzAzBz color space is designed to be perceptually uniform with improved
 * accuracy for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance in cd/m² that Y=1 maps to
 * @returns {JzAzBzColor} The color in JzAzBz space
 */
export const xyzToJzAzBz = (color: XYZColor, peakLuminance: number = 10000): JzAzBzColor => {
  const Xp = b * color.x - (b - 1) * color.z;
  const Yp = g * color.y - (g - 1) * color.x;
  const Zp = color.z;

  const [L, M, S] = multiplyMatrixByVector(XYZ_JZAZBZ_LMS_MATRIX, [Xp, Yp, Zp]);

  const Lp = jzazbzPQInverse(L, peakLuminance);
  const Mp = jzazbzPQInverse(M, peakLuminance);
  const Sp = jzazbzPQInverse(S, peakLuminance);

  const [Iz, az, bz] = multiplyMatrixByVector(XYZ_JZAZBZ_LMS_IABZ, [Lp, Mp, Sp]);

  const jz = ((1 + d) * Iz) / (1 + d * Iz) - d0;

  return jzazbz(jz, az, bz, color.alpha);
};

/**
 * Converts a color from CIE XYZ to JzCzHz color space.
 *
 * This function first converts the XYZ color to JzAzBz, then from JzAzBz to JzCzHz.
 * The JzCzHz color space is a cylindrical representation of JzAzBz, using lightness,
 * chroma (saturation), and hue components, with improved perceptual uniformity
 * for both low and high luminance levels, making it suitable for HDR content.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @param {number} [peakLuminance=10000] - The peak luminance in cd/m² that Y=1 maps to
 * @returns {JzCzHzColor} The color in JzCzHz space
 */
export const xyzToJzCzHz = (color: XYZColor, peakLuminance: number = 10000): JzCzHzColor =>
  jzazbzToJzCzHz(xyzToJzAzBz(color, peakLuminance));
