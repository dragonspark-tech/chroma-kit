import { Matrix3x3 } from '../../utils/linear';

/**
 * Constant used in the chromatic adaptation step of JzAzBz conversions.
 *
 * This value is used to adjust the X component when converting between XYZ and JzAzBz.
 * It helps improve the perceptual uniformity of the color space.
 */
export const b = 1.15;

/**
 * Constant used in the chromatic adaptation step of JzAzBz conversions.
 *
 * This value is used to adjust the Y component when converting between XYZ and JzAzBz.
 * It helps improve the perceptual uniformity of the color space.
 */
export const g = 0.66;

/**
 * Constant used in the non-linear compression of the lightness component.
 *
 * This value is used when converting between Jz and Iz in the JzAzBz color space.
 * It controls the shape of the lightness response curve.
 */
export const d = -0.56;

/**
 * Small constant added to avoid numerical issues near zero.
 *
 * This value is added to the Jz component to prevent division by zero
 * and other numerical instabilities in the conversion process.
 */
export const d0 = 1.629549953e-11;

/**
 * Exponent used in the Perceptual Quantizer (PQ) function.
 *
 * This constant is part of the SMPTE ST 2084 PQ function used in HDR displays
 * and is used in the JzAzBz color space to handle high dynamic range content.
 */
export const m1 = 0.1593017578125;

/**
 * Exponent used in the Perceptual Quantizer (PQ) function.
 *
 * This constant is part of the SMPTE ST 2084 PQ function used in HDR displays
 * and is used in the JzAzBz color space to handle high dynamic range content.
 * The value is calculated as 1.7 * 2523 / 32, which equals approximately 134.034375.
 */
export const m2p = (1.7 * 2523) / 32; // 134.034 375

/**
 * Constant used in the Perceptual Quantizer (PQ) function.
 *
 * This constant is part of the SMPTE ST 2084 PQ function used in HDR displays
 * and is used in the JzAzBz color space to handle high dynamic range content.
 */
export const c1 = 0.8359375;

/**
 * Constant used in the Perceptual Quantizer (PQ) function.
 *
 * This constant is part of the SMPTE ST 2084 PQ function used in HDR displays
 * and is used in the JzAzBz color space to handle high dynamic range content.
 */
export const c2 = 18.8515625;

/**
 * Constant used in the Perceptual Quantizer (PQ) function.
 *
 * This constant is part of the SMPTE ST 2084 PQ function used in HDR displays
 * and is used in the JzAzBz color space to handle high dynamic range content.
 */
export const c3 = 18.6875;

/**
 * Transformation matrix for converting JzAzBz values to LMS color space.
 *
 * This matrix is used to convert from the JzAzBz color space to the LMS
 * cone response domain. It's an intermediate step when converting from
 * JzAzBz to XYZ color space.
 *
 * The matrix transforms the (Iz, az, bz) values to encoded LMS values,
 * which are then processed through the PQ function to get linear LMS values.
 */
export const JZAZBZ_XYZ_LMS_MATRIX: Matrix3x3 = [
  [1.0, 0.138605043271539, 0.058047316156119],
  [1.0, -0.138605043271539, -0.058047316156119],
  [1.0, -0.096019242026319, -0.811891896056039]
];

/**
 * Transformation matrix for converting LMS values to XYZ color space in the JzAzBz conversion.
 *
 * This matrix is used to convert from the LMS cone response domain to the
 * pre-adapted XYZ color space. It's an intermediate step when converting from
 * JzAzBz to XYZ color space.
 *
 * The matrix transforms the linear LMS values to pre-adapted XYZ values,
 * which are then further processed to get the final XYZ values by undoing
 * the chromatic adaptation.
 */
export const JZAZBZ_XYZ_LMS_IABZ: Matrix3x3 = [
  [1.924226435787607, -1.004792312595365, 0.037651404030618],
  [0.350316762094999, 0.726481193931655, -0.065384422948085],
  [-0.090982810982848, -0.312728290523074, 1.52276656130526]
];
