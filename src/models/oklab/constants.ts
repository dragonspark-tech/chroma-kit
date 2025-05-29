import { type Matrix3x3 } from '../../utils/linear';

/**
 * Transformation matrix for converting OKLab values to LMS color space.
 *
 * This matrix is used to convert from OKLab color space back to the LMS
 * cone response domain. It's the inverse of the LMS_OKLAB_MATRIX and is
 * an intermediate step when converting from OKLab to other color spaces.
 *
 * The matrix represents the following transformation:
 * L = 0.9999999985*l + 0.3963377922*a + 0.2158037581*b
 * M = 1.0000000089*l - 0.1055613423*a - 0.0638541748*b
 * S = 1.0000000547*l - 0.0894841821*a - 1.2914855379*b
 */
export const OKLAB_LMS_MATRIX: Matrix3x3 = [
  [1.0, 0.3963377773761749, 0.2158037573099136],
  [1.0, -0.1055613458156586, -0.0638541728258133],
  [1.0, -0.0894841775298119, -1.2914855480194092]
];

/**
 * Transformation matrix for converting LMS values to OKLab color space.
 *
 * This matrix is used to convert from the LMS cone response domain to the
 * OKLab color space. It's applied after the non-linear (cube root) transformation
 * of the LMS values and is a key component in creating a perceptually uniform
 * color space.
 *
 * The matrix represents the following transformation:
 * L = 0.2104542553*l + 0.7936177850*m - 0.0040720468*s
 * a = 1.9779984951*l - 2.4285922050*m + 0.4505937099*s
 * b = 0.0259040371*l + 0.7827717662*m - 0.8086757660*s
 */
export const LMS_OKLAB_MATRIX: Matrix3x3 = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
];

/**
 * Transformation matrix for converting LMS values to XYZ color space.
 *
 * This matrix is used to convert from the LMS cone response domain back to
 * the XYZ color space. It's the inverse of the XYZ_OKLCH_THROUGH_LMS_MATRIX
 * and is used when converting from OKLab/OKLCh back to XYZ.
 *
 * The matrix represents the following transformation:
 * X = 1.2270138511*L - 0.5577999807*M + 0.2812561490*S
 * Y = -0.0405801784*L + 1.1122568696*M - 0.0716766787*S
 * Z = -0.0763812845*L - 0.4214819784*M + 1.5861632204*S
 */
export const OKLCH_THROUGH_LMS_XYZ_MATRIX: Matrix3x3 = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
];
