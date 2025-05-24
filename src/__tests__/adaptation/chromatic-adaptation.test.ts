import { describe, expect, it } from 'vitest';
import {
  computeAdaptationMatrix,
  getAdaptationMatrix
} from '../../adaptation/chromatic-adaptation';
import {
  BradfordConeModel,
  VonKriesConeModel,
  XYZScalingConeModel
} from '../../adaptation/cone-response';
import {
  IlluminantA,
  IlluminantD50,
  IlluminantD65
} from '../../standards/illuminants';
import { coneMatrixes } from '../../adaptation/_cone-matrixes';
import { multiplyMatrixByVector } from '../../utils/linear';

describe('Chromatic Adaptation', () => {
  describe('computeAdaptationMatrix', () => {
    it('should compute a valid adaptation matrix', () => {
      const matrix = computeAdaptationMatrix(IlluminantD50, IlluminantD65, BradfordConeModel);

      // Check that the matrix is a 3x3 matrix
      expect(matrix.length).toBe(3);
      matrix.forEach(row => {
        expect(row.length).toBe(3);
      });

      // Check that all values are numbers
      matrix.forEach(row => {
        row.forEach(value => {
          expect(typeof value).toBe('number');
          expect(isNaN(value)).toBe(false);
        });
      });
    });

    it('should correctly adapt a color from D50 to D65', () => {
      // This test will pass after fixing the bug in computeAdaptationMatrix
      // where source and target illuminants were swapped
      const matrix = computeAdaptationMatrix(IlluminantD50, IlluminantD65, BradfordConeModel);

      // Test vector representing a color in D50 space
      const colorInD50 = [0.96, 1.0, 0.82];

      // Transform to D65 space
      const colorInD65 = multiplyMatrixByVector(matrix, colorInD50);

      // Expected values for this transformation
      // These values are approximate and based on the correct transformation
      expect(colorInD65[0]).toBeCloseTo(0.95, 1);
      expect(colorInD65[1]).toBeCloseTo(1.0, 1);
      expect(colorInD65[2]).toBeCloseTo(0.62, 1);
    });

    it('should work with different cone models', () => {
      // Test with XYZ Scaling model
      const matrixXYZ = computeAdaptationMatrix(IlluminantD50, IlluminantD65, XYZScalingConeModel);
      expect(matrixXYZ.length).toBe(3);

      // Test with Von Kries model
      const matrixVonKries = computeAdaptationMatrix(IlluminantD50, IlluminantD65, VonKriesConeModel);
      expect(matrixVonKries.length).toBe(3);

      // The matrices should be different
      expect(matrixXYZ).not.toEqual(matrixVonKries);
    });

    it('should handle different illuminant pairs', () => {
      // D50 to A
      const matrixD50ToA = computeAdaptationMatrix(IlluminantD50, IlluminantA, BradfordConeModel);
      expect(matrixD50ToA.length).toBe(3);

      // D65 to A
      const matrixD65ToA = computeAdaptationMatrix(IlluminantD65, IlluminantA, BradfordConeModel);
      expect(matrixD65ToA.length).toBe(3);

      // The matrices should be different
      expect(matrixD50ToA).not.toEqual(matrixD65ToA);
    });
  });

  describe('getAdaptationMatrix', () => {
    it('should return a precomputed matrix if available', () => {
      // Add a mock precomputed matrix to coneMatrixes
      const mockMatrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      // Create a temporary key for testing
      const tempKey = `${BradfordConeModel.name}_${IlluminantD50.name}_TO_${IlluminantD65.name}`;
      const originalMatrix = coneMatrixes[tempKey];

      // Set the mock matrix
      coneMatrixes[tempKey] = mockMatrix;

      // Get the adaptation matrix
      const result = getAdaptationMatrix(IlluminantD50, IlluminantD65, BradfordConeModel);

      // Restore the original matrix
      if (originalMatrix) {
        coneMatrixes[tempKey] = originalMatrix;
      } else {
        delete coneMatrixes[tempKey];
      }

      // Check that the mock matrix was returned
      expect(result).toBe(mockMatrix);
    });

    it('should compute a matrix if no precomputed matrix is available', () => {
      // Use a key that doesn't exist in coneMatrixes
      const nonExistentKey = `${VonKriesConeModel.name}_${IlluminantA.name}_TO_${IlluminantD65.name}`;

      // Make sure the key doesn't exist
      expect(coneMatrixes[nonExistentKey]).toBeUndefined();

      // Get the adaptation matrix
      const result = getAdaptationMatrix(IlluminantA, IlluminantD65, VonKriesConeModel);

      // Check that a valid matrix was returned
      expect(result.length).toBe(3);
      result.forEach(row => {
        expect(row.length).toBe(3);
      });
    });

    it('should return the same matrix as computeAdaptationMatrix when no precomputed matrix exists', () => {
      // Use parameters that don't have a precomputed matrix
      const sourceIlluminant = IlluminantA;
      const targetIlluminant = IlluminantD65;
      const coneModel = VonKriesConeModel;

      // Compute the matrix directly
      const computedMatrix = computeAdaptationMatrix(sourceIlluminant, targetIlluminant, coneModel);

      // Get the matrix using getAdaptationMatrix
      const retrievedMatrix = getAdaptationMatrix(sourceIlluminant, targetIlluminant, coneModel);

      // The matrices should be the same
      expect(retrievedMatrix).toEqual(computedMatrix);
    });
  });

  describe('Bug fixes', () => {
    it('should correctly handle source and target illuminants in computeAdaptationMatrix', () => {
      // This test verifies that the bug is fixed

      // The bug was in computeAdaptationMatrix where the source and target illuminants were swapped:
      // const xyzTarget = [sourceIlluminant.xR, sourceIlluminant.yR, sourceIlluminant.zR];
      // const xyzSource = [targetIlluminant.xR, targetIlluminant.yR, targetIlluminant.zR];

      // After fixing, the code is now:
      // const xyzSource = [sourceIlluminant.xR, sourceIlluminant.yR, sourceIlluminant.zR];
      // const xyzTarget = [targetIlluminant.xR, targetIlluminant.yR, targetIlluminant.zR];

      // Test with D50 to D65 transformation
      const matrix = computeAdaptationMatrix(IlluminantD50, IlluminantD65, BradfordConeModel);

      // Test vector representing a color in D50 space
      const colorInD50 = [0.96, 1.0, 0.82];

      // Transform to D65 space
      const colorInD65 = multiplyMatrixByVector(matrix, colorInD50);

      // Expected values for this transformation
      // These values are approximate and based on the correct transformation
      expect(colorInD65[0]).toBeCloseTo(0.95, 1);
      expect(colorInD65[1]).toBeCloseTo(1.0, 1);
      expect(colorInD65[2]).toBeCloseTo(0.62, 1);
    });
  });
});
