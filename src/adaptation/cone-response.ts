import type { Matrix3x3 } from '../utils/linear';

/**
 * Represents a cone response model with properties for its name, transformation matrix, and the inverse of the transformation matrix.
 *
 * @property {string} name - The name associated with the cone response model.
 * @property {Matrix3x3} matrix - A 3x3 matrix representing the transformation associated with the cone response model.
 * @property {Matrix3x3} inverseMatrix - A 3x3 matrix representing the inverse transformation of the cone response model.
 */
export type ConeResponseModel = {
  name: string;
  matrix: Matrix3x3;
  inverseMatrix: Matrix3x3;
};

/**
 * Represents the XYZ scaling cone response model.
 *
 * This model defines a response with a scaling transform applied to the XYZ color space.
 * This specific model uses identity matrices for both `matrix` and `inverseMatrix`.
 *
 * Consider using {@linkcode BradfordConeModel} instead for better precision.
 */
export const XYZScalingConeModel: ConeResponseModel = {
  name: 'XYZ_SCALING',
  matrix: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],
  inverseMatrix: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]
};

/**
 * Represents the Bradford cone response model used in color science for chromatic adaptation.
 *
 * This model includes transformation matrices to convert cone responses
 * between different color viewing conditions.
 */
export const BradfordConeModel: ConeResponseModel = {
  name: 'BRADFORD',
  matrix: [
    [0.8951, 0.2664, -0.1614],
    [-0.7502, 1.7135, 0.0367],
    [0.0389, -0.0685, 1.0296]
  ],
  inverseMatrix: [
    [0.9869929, -0.1470543, 0.1599627],
    [0.4323053, 0.5183603, 0.0492912],
    [-0.0085287, 0.0400428, 0.9684867]
  ]
};

/**
 * Represents the Von Kries cone response model used in color science for chromatic adaptation.
 *
 * This model includes transformation matrices to convert cone responses
 * between different color viewing conditions.
 *
 * Consider using {@linkcode BradfordConeModel} instead for better precision.
 */
export const VonKriesConeModel: ConeResponseModel = {
  name: 'VONKRIES',
  matrix: [
    [0.40024, 0.7076, -0.08081],
    [-0.2263, 1.16532, 0.0457],
    [0.0, 0.0, 0.91822]
  ],
  inverseMatrix: [
    [1.8599364, -1.1293816, 0.2198974],
    [0.3611914, 0.6388125, -0.0000064],
    [0.0, 0.0, 1.0890636]
  ]
};
