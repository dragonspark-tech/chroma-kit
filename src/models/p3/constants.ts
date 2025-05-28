import { type Matrix3x3 } from '../../utils/linear';

/**
 * P3_XYZ_MATRIX is a 3x3 transformation matrix that represents the conversion
 * from the ProPhoto RGB color space (commonly referred to as P3) to the CIE 1931
 * XYZ color space. It is used in color science workflows to map RGB color values
 * from the P3 gamut into the XYZ color space, which is a device-independent representation
 * of color.
 *
 * The matrix consists of three nested arrays, each containing three numerical coefficients,
 * corresponding to the transformation along the X, Y, and Z dimensions.
 */
export const P3_XYZ_MATRIX: Matrix3x3 = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0.0, 0.04511338185890264, 1.043944368900976]
];
