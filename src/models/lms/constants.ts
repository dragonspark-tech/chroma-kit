/**
 * A 3x3 matrix representing the transformation from the CIE 1931 XYZ color space
 * to the LMS color space. This is the inverse of the LMS_XYZ_MATRIX and is used
 * to convert XYZ color values back to their corresponding LMS values.
 *
 * Each sub-array represents the transformation coefficients for the X, Y, and Z
 * channels, respectively. The coefficients are based on the standard defined by
 * the International Commission on Illumination (CIE).
 */
export const LMS_XYZ_MATRIX = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.633851707]
];

/**
 * A 3x3 matrix representing the transformation from the LMS color space
 * to the Oklab color space. This is the inverse of the OKLAB_LMS_MATRIX and is used
 * to convert LMS color values back to their corresponding Oklab values.
 *
 * Each sub-array represents the transformation coefficients for the L, M, and S
 * channels, respectively. The coefficients are based on the standard defined by
 * the International Commission on Illumination (CIE).
 */
export const LMS_OKLAB_MATRIX = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766]
];
