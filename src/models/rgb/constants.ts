/**
 * A 3x3 matrix representing the transformation from the sRGB color space
 * to the CIE 1931 XYZ color space. This matrix is used to convert RGB
 * color values to their corresponding XYZ values, ensuring accurate
 * representation in the CIE 1931 color specification.
 *
 * Each sub-array represents the transformation coefficients for the red,
 * green, and blue channels, respectively. The coefficients are based on
 * the standard defined by the International Commission on Illumination (CIE).
 */
export const RGB_XYZ_MATRIX = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041]
];
