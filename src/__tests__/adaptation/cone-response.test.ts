import { describe, expect, it } from 'vitest';
import {
  XYZScalingConeModel,
  BradfordConeModel,
  VonKriesConeModel,
  type ConeResponseModel
} from '../../adaptation/cone-response';
import { multiplyMatrixByVector } from '../../utils/linear';

describe('Cone Response Models', () => {
  describe('ConeResponseModel type', () => {
    it('should have the required properties', () => {
      const testModel: ConeResponseModel = {
        name: 'TEST',
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

      expect(testModel).toHaveProperty('name');
      expect(testModel).toHaveProperty('matrix');
      expect(testModel).toHaveProperty('inverseMatrix');
    });
  });

  describe('XYZScalingConeModel', () => {
    it('should have the correct name', () => {
      expect(XYZScalingConeModel.name).toBe('XYZ_SCALING');
    });

    it('should have identity matrices for both matrix and inverseMatrix', () => {
      const identityMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];
      expect(XYZScalingConeModel.matrix).toEqual(identityMatrix);
      expect(XYZScalingConeModel.inverseMatrix).toEqual(identityMatrix);
    });

    it('should produce the same vector when multiplied by its matrix and inverse', () => {
      const vector = [0.5, 0.3, 0.2];
      const result = multiplyMatrixByVector(XYZScalingConeModel.matrix, vector);

      expect(result[0]).toBeCloseTo(vector[0]);
      expect(result[1]).toBeCloseTo(vector[1]);
      expect(result[2]).toBeCloseTo(vector[2]);
    });
  });

  describe('BradfordConeModel', () => {
    it('should have the correct name', () => {
      expect(BradfordConeModel.name).toBe('BRADFORD');
    });

    it('should have the correct matrix values', () => {
      expect(BradfordConeModel.matrix).toEqual([
        [0.8951, 0.2664, -0.1614],
        [-0.7502, 1.7135, 0.0367],
        [0.0389, -0.0685, 1.0296]
      ]);
    });

    it('should have the correct inverse matrix values', () => {
      expect(BradfordConeModel.inverseMatrix).toEqual([
        [0.9869929, -0.1470543, 0.1599627],
        [0.4323053, 0.5183603, 0.0492912],
        [-0.0085287, 0.0400428, 0.9684867]
      ]);
    });

    it('should produce the original vector when multiplied by its matrix and then inverse', () => {
      const vector = [0.5, 0.3, 0.2];

      // Convert to cone space
      const coneVector = multiplyMatrixByVector(BradfordConeModel.matrix, vector);

      // Convert back to original space
      const reconstructedVector = multiplyMatrixByVector(
        BradfordConeModel.inverseMatrix,
        coneVector
      );

      // Check if the reconstructed vector is close to the original
      expect(reconstructedVector[0]).toBeCloseTo(vector[0], 5);
      expect(reconstructedVector[1]).toBeCloseTo(vector[1], 5);
      expect(reconstructedVector[2]).toBeCloseTo(vector[2], 5);
    });
  });

  describe('VonKriesConeModel', () => {
    it('should have the correct name', () => {
      expect(VonKriesConeModel.name).toBe('VONKRIES');
    });

    it('should have the correct matrix values', () => {
      expect(VonKriesConeModel.matrix).toEqual([
        [0.40024, 0.7076, -0.08081],
        [-0.2263, 1.16532, 0.0457],
        [0.0, 0.0, 0.91822]
      ]);
    });

    it('should have the correct inverse matrix values', () => {
      expect(VonKriesConeModel.inverseMatrix).toEqual([
        [1.8599364, -1.1293816, 0.2198974],
        [0.3611914, 0.6388125, -0.0000064],
        [0.0, 0.0, 1.0890636]
      ]);
    });

    it('should produce the original vector when multiplied by its matrix and then inverse', () => {
      const vector = [0.5, 0.3, 0.2];

      // Convert to cone space
      const coneVector = multiplyMatrixByVector(VonKriesConeModel.matrix, vector);

      // Convert back to original space
      const reconstructedVector = multiplyMatrixByVector(
        VonKriesConeModel.inverseMatrix,
        coneVector
      );

      // Check if the reconstructed vector is close to the original
      expect(reconstructedVector[0]).toBeCloseTo(vector[0], 5);
      expect(reconstructedVector[1]).toBeCloseTo(vector[1], 5);
      expect(reconstructedVector[2]).toBeCloseTo(vector[2], 5);
    });
  });
});
