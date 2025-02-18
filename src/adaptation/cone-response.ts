import type { Matrix3x3 } from '../utils/linear';

export type ConeResponseModel = {
  name: string;
  matrix: Matrix3x3;
  inverseMatrix: Matrix3x3;
}

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