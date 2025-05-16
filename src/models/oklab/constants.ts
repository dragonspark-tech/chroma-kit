/**
 * A 3x3 matrix representing the transformation from the Oklab color space
 * to the LMS color space. This matrix is used to convert Oklab color values
 * back to their corresponding LMS values.
 *
 * Each sub-array represents the transformation coefficients for the L, M, and S
 * channels, respectively. The coefficients are based on the standard defined by
 * the International Commission on Illumination (CIE).
 */
export const OKLAB_LMS_MATRIX = [
  [0.9999999985, 0.3963377922, 0.2158037581],
  [1.0000000089, -0.1055613423, -0.0638541748],
  [1.0000000547, -0.0894841821, -1.2914855379]
];
