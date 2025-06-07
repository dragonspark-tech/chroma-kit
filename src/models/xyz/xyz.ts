import { lab, type LabColor, labToLCH } from '../lab';
import { ϵ, κ } from '../lab/constants';
import { type Illuminant, IlluminantD65 } from '../../standards/illuminants';
import {
  delinearizeRGBColor,
  type RGBColor,
  rgbFromVector,
  rgbToHSL,
  rgbToHSV,
  rgbToHWB
} from '../rgb';
import { multiplyMatrixByVector } from '../../utils/linear';
import {
  XYZ_JZAZBZ_LMS_IABZ,
  XYZ_JZAZBZ_LMS_MATRIX,
  XYZ_OKLCH_THROUGH_LMS_MATRIX,
  XYZ_RGB_MATRIX
} from './constants';
import { type OKLabColor, oklabFromVector, oklabToOKLCh } from '../oklab';
import { LMS_OKLAB_MATRIX } from '../oklab/constants';
import type { LChColor } from '../lch';
import type { OKLChColor } from '../oklch';
import { jzazbz, type JzAzBzColor, jzazbzPQInverse, jzazbzToJzCzHz } from '../jzazbz';
import { b, d, d0, g } from '../jzazbz/constants';
import type { JzCzHzColor } from '../jzczhz';
import type { HSLColor } from '../hsl';
import type { HSVColor } from '../hsv';
import type { ColorSpace } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import type { HWBColor } from '../hwb';
import { type P3Color, p3FromVector } from '../p3/p3';
import { delinearizeP3Color } from '../p3/transform';
import type { ColorBase } from '../base';
import { channel } from '../base/channel';

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

/**
 * Converts an XYZ color object to a CSS-compatible string representation.
 *
 * This function formats the XYZ color as a CSS Color Module Level 4 color function,
 * including the illuminant name in the format: color(xyz-d65 X Y Z / A).
 *
 * @param {XYZColor} color - The XYZ color object to convert
 * @returns {string} The CSS-compatible string representation
 */
export const xyzToCSSString = (color: XYZColor): string => {
  const { x, y, z, alpha, illuminant } = color;
  return `color(xyz-${illuminant?.name?.toLowerCase()} ${x} ${y} ${z}${alpha ? ` / ${alpha}` : ''})`;
};

/**
 * Creates a new XYZ color object with the specified components.
 *
 * This is the primary factory function for creating XYZ colors in the library.
 * The created object includes methods for conversion to other color spaces and string representations.
 * If no illuminant is specified, the standard D65 illuminant is used as the default.
 *
 * @param {number} x - The X component, related to a mix of the cone response curves
 * @param {number} y - The Y component, representing luminance
 * @param {number} z - The Z component, roughly equal to blue stimulation
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @param {Illuminant} [illuminant] - The reference white point to use, defaults to D65
 * @returns {XYZColor} A new XYZ color object
 */
export const xyz = (
  x: number,
  y: number,
  z: number,
  alpha?: number,
  illuminant?: Illuminant
): XYZColor => ({
  space: 'xyz',
  isPolar: false,
  dynamicRange: 'SDR',

  x,
  y,
  z,
  alpha,
  illuminant: illuminant ?? IlluminantD65,

  channels: {
    x: channel('x', 'X Axis', [0, 1]),
    y: channel('y', 'Y Axis', [0, 1]),
    z: channel('z', 'Z Axis', [0, 1])
  },

  toString() {
    return serializeV1(this);
  },

  toCSSString() {
    return xyzToCSSString(this);
  },

  to<T extends ColorSpace>(colorSpace: T) {
    return convertColor<XYZColor, T>(this, colorSpace);
  }
});

/**
 * Creates a new XYZ color object from a vector of XYZ components.
 *
 * This utility function is useful when working with color calculations that produce
 * arrays of values rather than individual components.
 *
 * @param {number[]} v - A vector containing the XYZ components [x, y, z]
 * @param {number} [alpha] - The alpha (opacity) component (0-1), optional
 * @param {Illuminant} [illuminant] - The reference white point to use, defaults to D65
 * @returns {XYZColor} A new XYZ color object
 * @throws {Error} If the vector does not have exactly 3 components
 */
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
 * It also performs gamut mapping to ensure the resulting RGB values are within the valid RGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {RGBColor} The color in RGB space
 */
export const xyzToRGB = (color: XYZColor): RGBColor => {
  const lRGB = multiplyMatrixByVector(XYZ_RGB_MATRIX, [color.x, color.y, color.z]);
  return delinearizeRGBColor(rgbFromVector(lRGB, color.alpha));
};

/**
 * Converts a color from CIE XYZ to DCI-P3 RGB color space.
 *
 * This function applies the XYZ to P3 RGB transformation matrix to convert the color,
 * then delinearizes the RGB values (applies gamma correction) to get standard RGB values.
 * It also performs gamut mapping to ensure the resulting RGB values are within the valid DCI-P3 gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {P3Color} The color in DCI-P3 RGB space
 */
export const xyzToP3 = (color: XYZColor): P3Color => {
  const lRGB = multiplyMatrixByVector(XYZ_RGB_MATRIX, [color.x, color.y, color.z]);
  return delinearizeP3Color(p3FromVector(lRGB, color.alpha));
};

/**
 * Converts a color from CIE XYZ to HSL color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
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
 * saturation, and value components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {HSVColor} The color in HSV space
 */
export const xyzToHSV = (color: XYZColor): HSVColor => rgbToHSV(xyzToRGB(color));

/**
 * Converts a color from CIE XYZ to HWB color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid RGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @returns {HWBColor} The color in HWB space
 */
export const xyzToHWB = (color: XYZColor): HWBColor => rgbToHWB(xyzToRGB(color));

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

  const xn = color.x / i.xR;
  const yn = color.y / i.yR;
  const zn = color.z / i.zR;

  const fx = xn > ϵ ? Math.cbrt(xn) : (κ * xn + 16) / 116;
  const fy = yn > ϵ ? Math.cbrt(yn) : (κ * yn + 16) / 116;
  const fz = zn > ϵ ? Math.cbrt(zn) : (κ * zn + 16) / 116;

  return lab(116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz), color.alpha, color.illuminant);
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
 * 1. Pre-adapting XYZ values using chromatic adaptation factors to absolute D65 XYZ values
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
export const xyzToJzAzBz = (color: XYZColor, peakLuminance = 10000): JzAzBzColor => {
  const { x, y, z } = color;

  const illuminant = color.illuminant || IlluminantD65;
  if (illuminant.name !== 'D65') {
    throw new Error('JzAzBz is only defined for the D65 illuminant');
  }

  const Xa = x * 203;
  const Ya = y * 203;
  const Za = z * 203;

  const Xm = b * Xa - (b - 1) * Za;
  const Ym = g * Ya - (g - 1) * Xa;

  const [L, M, S] = multiplyMatrixByVector(XYZ_JZAZBZ_LMS_MATRIX, [Xm, Ym, Za]);

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
export const xyzToJzCzHz = (color: XYZColor, peakLuminance = 10000): JzCzHzColor =>
  jzazbzToJzCzHz(xyzToJzAzBz(color, peakLuminance));
