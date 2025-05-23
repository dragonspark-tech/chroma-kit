import { type Matrix3x3 } from '../../utils/linear';

export const SRGB_INVERSE = 1 / 255;

/**
 * Transformation matrix for converting linear sRGB values to CIE XYZ color space.
 *
 * This matrix is based on the standard sRGB color space with D65 white point.
 * It's used in the RGB to XYZ conversion process after linearizing the RGB values.
 *
 * The matrix represents the following transformation:
 * X = 0.4124564*R + 0.3575761*G + 0.1804375*B
 * Y = 0.2126729*R + 0.7151522*G + 0.0721750*B
 * Z = 0.0193339*R + 0.1191920*G + 0.9503041*B
 */
export const SRGB_XYZ_MATRIX: Matrix3x3 = [
  [0.41239079926595934, 0.357584339383878, 0.1804807884018343],
  [0.21263900587151027, 0.715168678767756, 0.07219231536073371],
  [0.01933081871559182, 0.11919477979462598, 0.9505321522496607]
];
