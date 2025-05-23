import { lab, LabColor, labToLCH } from '../lab';
import { ϵ, κ } from '../lab/constants';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { delinearizesRGBColor, sRGBColor, srgbFromVector, srgbToHSL, srgbToHSV, srgbToHWB } from '../srgb';
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
import { ColorBase, ColorSpace } from '../../foundation';
import { serializeV1 } from '../../semantics/serialization';
import { convertColor } from '../../conversion/conversion';
import { HWBColor } from '../hwb';

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
 * It also performs gamut mapping to ensure the resulting RGB values are within the valid sRGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {sRGBColor} The color in RGB space
 */
export const xyzToRGB = (color: XYZColor, performGamutMapping: boolean = true): sRGBColor => {
  const lRGB = multiplyMatrixByVector(XYZ_RGB_MATRIX, [color.x, color.y, color.z]);

  // Check if the color is within the sRGB gamut
  const isInGamut = lRGB.every((value) => value >= 0 && value <= 1);

  // If the color is already in gamut or gamut mapping is disabled, return it directly
  if (isInGamut || !performGamutMapping) {
    return delinearizesRGBColor(srgbFromVector(lRGB, color.alpha));
  }

  // Perform gamut mapping by scaling the color to fit within the gamut

  if (Math.min(lRGB[0], lRGB[1], lRGB[2]) < 0) {
    const minValue = Math.min(lRGB[0], lRGB[1], lRGB[2]);
    lRGB[0] -= minValue;
    lRGB[1] -= minValue;
    lRGB[2] -= minValue;
  }

  // Then, handle values > 1 by scaling down if needed
  const maxValue = Math.max(lRGB[0], lRGB[1], lRGB[2]);
  if (maxValue > 1) {
    lRGB[0] /= maxValue;
    lRGB[1] /= maxValue;
    lRGB[2] /= maxValue;
  }

  return delinearizesRGBColor(srgbFromVector(lRGB, color.alpha));
};

/**
 * Converts a color from CIE XYZ to HSL color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HSL.
 * The HSL color space is a cylindrical representation of RGB, using hue,
 * saturation, and lightness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid sRGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {HSLColor} The color in HSL space
 */
export const xyzToHSL = (color: XYZColor, performGamutMapping: boolean = true): HSLColor =>
  srgbToHSL(xyzToRGB(color, performGamutMapping));

/**
 * Converts a color from CIE XYZ to HSV color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HSV.
 * The HSV color space is a cylindrical representation of RGB, using hue,
 * saturation, and value components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid sRGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {HSVColor} The color in HSV space
 */
export const xyzToHSV = (color: XYZColor, performGamutMapping: boolean = true): HSVColor =>
  srgbToHSV(xyzToRGB(color, performGamutMapping));

/**
 * Converts a color from CIE XYZ to HWB color space.
 *
 * This function first converts the XYZ color to RGB, then from RGB to HWB.
 * The HWB color space is a cylindrical representation of RGB, using hue,
 * whiteness, and blackness components. Gamut mapping is performed during
 * the conversion to ensure the resulting color is within the valid sRGB gamut.
 *
 * @param {XYZColor} color - The XYZ color to convert
 * @param {boolean} [performGamutMapping=true] - Whether to perform gamut mapping
 * @returns {HWBColor} The color in HWB space
 */
export const xyzToHWB = (color: XYZColor, performGamutMapping: boolean = true): HWBColor =>
  srgbToHWB(xyzToRGB(color, performGamutMapping));

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
export const xyzToJzAzBz = (color: XYZColor, peakLuminance: number = 10000): JzAzBzColor => {
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
export const xyzToJzCzHz = (color: XYZColor, peakLuminance: number = 10000): JzCzHzColor =>
  jzazbzToJzCzHz(xyzToJzAzBz(color, peakLuminance));
