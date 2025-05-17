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
  [0.9999999985, 0.3963377922, 0.2158037581],
  [1.0000000089, -0.1055613423, -0.0638541748],
  [1.0000000547, -0.0894841821, -1.2914855379]
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
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766]
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
  [1.2270138511, -0.5577999807, 0.281256149],
  [-0.0405801784, 1.1122568696, -0.0716766787],
  [-0.0763812845, -0.4214819784, 1.5861632204]
];
