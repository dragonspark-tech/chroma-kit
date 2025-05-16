/**
 * A 3x3 matrix representing the transformation from the CIE 1931 XYZ color space
 * to the sRGB color space. This is the inverse of the RGB_XYZ_MATRIX and is used
 * to convert XYZ color values back to their corresponding RGB values.
 *
 * Each sub-array represents the transformation coefficients for the X, Y, and Z
 * channels, respectively. The coefficients are based on the standard defined by
 * the International Commission on Illumination (CIE).
 */
export const XYZ_RGB_MATRIX = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252]
];

/**
 * A 3x3 matrix representing the transformation from the CIE 1931 XYZ color space
 * to the LMS color space. This is the inverse of the LMS_XYZ_MATRIX and is used
 * to convert XYZ color values back to their corresponding LMS values.
 *
 * Each sub-array represents the transformation coefficients for the X, Y, and Z
 * channels, respectively. The coefficients are based on the standard defined by
 * the International Commission on Illumination (CIE).
 */
export const XYZ_LMS_MATRIX = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.633851707]
];
