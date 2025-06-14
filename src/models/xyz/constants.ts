import { type Matrix3x3 } from '../../utils/linear';

/**
 * Transformation matrix for converting CIE XYZ values to linear RGB color space.
 *
 * This matrix is the inverse of the RGB_XYZ_MATRIX and is used to convert from
 * XYZ color space back to linear RGB values. It's based on the standard RGB
 * color space with D65 white point.
 *
 * The matrix represents the following transformation:
 * R = 3.2404542*X - 1.5371385*Y - 0.4985314*Z
 * G = -0.9692660*X + 1.8760108*Y + 0.0415560*Z
 * B = 0.0556434*X - 0.2040259*Y + 1.0572252*Z
 */
export const XYZ_RGB_MATRIX: Matrix3x3 = [
  [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
  [0.05563007969699366, -0.20397695888897652, 1.0569715142428786]
];

/**
 * Transformation matrix for converting CIE XYZ values to linear DCI-P3 RGB values.
 *
 * This matrix is the inverse of the P3_XYZ_MATRIX and is used to convert from
 * XYZ color space back to linear P3 RGB values. It's based on the DCI-P3 RGB
 * color space with a D65 white point.
 */
export const XYZ_P3_MATRIX: Matrix3x3 = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872]
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
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
];

/**
 * Transformation matrix for converting CIE XYZ values to LMS color space for JzAzBz.
 *
 * This matrix is used in the conversion from XYZ to JzAzBz color space.
 * It transforms pre-adapted XYZ values into the LMS cone response domain,
 * which is an intermediate step in the JzAzBz conversion process.
 *
 * The LMS color space represents the response of the three types of cones
 * in the human eye: Long, Medium, and Short wavelengths.
 *
 * The matrix represents the following transformation:
 * L = 0.41478972*X + 0.579999*Y + 0.014648*Z
 * M = -0.20151*X + 1.120649*Y + 0.0531008*Z
 * S = -0.0166008*X + 0.2648*Y + 0.6684799*Z
 */
export const XYZ_JZAZBZ_LMS_MATRIX: Matrix3x3 = [
  [0.41478972, 0.579999, 0.014648],
  [-0.20151, 1.120649, 0.0531008],
  [-0.0166008, 0.2648, 0.6684799]
];

/**
 * Transformation matrix for converting LMS values to Iz, az, bz components in JzAzBz color space.
 *
 * This matrix is used in the conversion from XYZ to JzAzBz color space.
 * It transforms the non-linear LMS values (after applying the inverse Perceptual Quantizer)
 * into the Iz, az, bz components of the JzAzBz color space.
 *
 * The Iz component is related to lightness, while az and bz represent the
 * chromatic dimensions of the JzAzBz color space.
 *
 * The matrix represents the following transformation:
 * Iz = 0.5*L + 0.5*M + 0*S
 * az = 3.524*L - 4.066708*M + 0.542708*S
 * bz = 0.199076*L + 1.096799*M - 1.295875*S
 */
export const XYZ_JZAZBZ_LMS_IABZ: Matrix3x3 = [
  [0.5, 0.5, 0],
  [3.524, -4.066708, 0.542708],
  [0.199076, 1.096799, -1.295875]
];
