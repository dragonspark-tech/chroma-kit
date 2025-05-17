import { type Matrix3x3 } from '../../utils/linear';

/**
 * Transformation matrix for converting CIE XYZ values to linear RGB color space.
 *
 * This matrix is the inverse of the RGB_XYZ_MATRIX and is used to convert from
 * XYZ color space back to linear RGB values. It's based on the standard sRGB
 * color space with D65 white point.
 *
 * The matrix represents the following transformation:
 * R = 3.2404542*X - 1.5371385*Y - 0.4985314*Z
 * G = -0.9692660*X + 1.8760108*Y + 0.0415560*Z
 * B = 0.0556434*X - 0.2040259*Y + 1.0572252*Z
 */
export const XYZ_RGB_MATRIX: Matrix3x3 = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252]
];

/**
 * Transformation matrix for converting CIE XYZ values to LMS color space.
 *
 * This matrix is used in the conversion from XYZ to OKLab/OKLCh color spaces.
 * It transforms XYZ values into the LMS cone response domain, which is an
 * intermediate step in the conversion process.
 *
 * The LMS color space represents the response of the three types of cones
 * in the human eye: Long, Medium, and Short wavelengths.
 *
 * The matrix represents the following transformation:
 * L = 0.8189330101*X + 0.3618667424*Y - 0.1288597137*Z
 * M = 0.0329845436*X + 0.9293118715*Y + 0.0361456387*Z
 * S = 0.0482003018*X + 0.2643662691*Y + 0.6338517070*Z
 */
export const XYZ_OKLCH_THROUGH_LMS_MATRIX: Matrix3x3 = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.633851707]
];
