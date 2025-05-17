import { type Matrix3x3 } from '../../utils/linear';

/*@__NO_SIDE_EFFECTS__*/
export const RGB_INVERSE = 1 / 255;

/**
 * Transformation matrix for converting linear RGB values to CIE XYZ color space.
 *
 * This matrix is based on the standard sRGB color space with D65 white point.
 * It's used in the RGB to XYZ conversion process after linearizing the RGB values.
 *
 * The matrix represents the following transformation:
 * X = 0.4124564*R + 0.3575761*G + 0.1804375*B
 * Y = 0.2126729*R + 0.7151522*G + 0.0721750*B
 * Z = 0.0193339*R + 0.1191920*G + 0.9503041*B
 */
/*@__NO_SIDE_EFFECTS__*/
export const RGB_XYZ_MATRIX: Matrix3x3 = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041]
];
