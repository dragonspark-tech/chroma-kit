import { describe, it, expect } from 'vitest';
import {
  type Matrix3x3,
  multiplyMatrixByVector,
  transposeMatrix3x3,
  multiplyMatrix3x3,
  transposeMatrix,
  multiplyMatrix,
  multiplyMatrices
} from '../../../src/utils/linear';

describe('linear', () => {
  describe('multiplyMatrixByVector', () => {
    it('should multiply a matrix by a vector correctly', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const vector = [2, 3, 4];
      const expected = [20, 47, 74]; // [1*2+2*3+3*4, 4*2+5*3+6*4, 7*2+8*3+9*4]

      expect(multiplyMatrixByVector(matrix, vector)).toEqual(expected);
    });

    it('should use the provided result array if given', () => {
      const matrix = [
        [1, 2],
        [3, 4]
      ];
      const vector = [5, 6];
      const result = [0, 0];
      const expected = [17, 39]; // [1*5+2*6, 3*5+4*6]

      expect(multiplyMatrixByVector(matrix, vector, result)).toBe(result);
      expect(result).toEqual(expected);
    });

    it('should throw an error if matrix is empty', () => {
      expect(() => multiplyMatrixByVector([], [1, 2, 3])).toThrow(
        'Matrix and vector must have valid non-empty dimensions.'
      );
    });

    it('should throw an error if vector is empty', () => {
      expect(() =>
        multiplyMatrixByVector(
          [
            [1, 2],
            [3, 4]
          ],
          []
        )
      ).toThrow('Matrix and vector must have valid non-empty dimensions.');
    });

    it('should throw an error if matrix rows do not match vector length', () => {
      expect(() =>
        multiplyMatrixByVector(
          [
            [1, 2, 3],
            [4, 5]
          ],
          [1, 2]
        )
      ).toThrow("All matrix rows must match the vector's length.");
    });
  });

  describe('transposeMatrix3x3', () => {
    it('should transpose a 3x3 matrix correctly', () => {
      const matrix: Matrix3x3 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const expected: Matrix3x3 = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ];

      expect(transposeMatrix3x3(matrix)).toEqual(expected);
    });
  });

  describe('multiplyMatrix3x3', () => {
    it('should multiply two 3x3 matrices correctly', () => {
      const a: Matrix3x3 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const b: Matrix3x3 = [
        [9, 8, 7],
        [6, 5, 4],
        [3, 2, 1]
      ];
      const expected: Matrix3x3 = [
        [30, 24, 18],
        [84, 69, 54],
        [138, 114, 90]
      ];

      expect(multiplyMatrix3x3(a, b)).toEqual(expected);
    });
  });

  describe('transposeMatrix', () => {
    it('should transpose a matrix correctly', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6]
      ];
      const expected = [
        [1, 4],
        [2, 5],
        [3, 6]
      ];

      expect(transposeMatrix(matrix)).toEqual(expected);
    });

    it('should return an empty array if the input matrix is empty', () => {
      expect(transposeMatrix([])).toEqual([]);
    });
  });

  describe('multiplyMatrix', () => {
    it('should multiply two matrices correctly', () => {
      const a = [
        [1, 2],
        [3, 4]
      ];
      const b = [
        [5, 6],
        [7, 8]
      ];
      const expected = [
        [19, 22],
        [43, 50]
      ];

      expect(multiplyMatrix(a, b)).toEqual(expected);
    });

    it('should optimize for 3x3 matrices', () => {
      const a: Matrix3x3 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const b: Matrix3x3 = [
        [9, 8, 7],
        [6, 5, 4],
        [3, 2, 1]
      ];

      // The result should be the same as calling multiplyMatrix3x3 directly
      expect(multiplyMatrix(a, b)).toEqual(multiplyMatrix3x3(a, b));
    });

    it('should handle empty matrices correctly', () => {
      // This test is to cover the branch where aRows or bRows is 0
      // These cases should throw an error because empty matrices can't be multiplied
      expect(() => multiplyMatrix([], [[1, 2]])).toThrow(
        'Matrix dimensions are incompatible for multiplication.'
      );

      expect(() => multiplyMatrix([[1, 2]], [])).toThrow(
        'Matrix dimensions are incompatible for multiplication.'
      );
    });

    it('should throw an error if matrix dimensions are incompatible', () => {
      const a = [
        [1, 2, 3],
        [4, 5, 6]
      ];
      const b = [
        [7, 8],
        [9, 10]
      ];

      expect(() => multiplyMatrix(a, b)).toThrow(
        'Matrix dimensions are incompatible for multiplication.'
      );
    });
  });

  describe('multiplyMatrices', () => {
    it('should multiply multiple matrices correctly', () => {
      const a = [
        [1, 2],
        [3, 4]
      ];
      const b = [
        [5, 6],
        [7, 8]
      ];
      const c = [
        [9, 10],
        [11, 12]
      ];

      // First multiply a and b, then multiply the result with c
      const expected = multiplyMatrix(multiplyMatrix(a, b), c);

      expect(multiplyMatrices(a, b, c)).toEqual(expected);
    });

    it('should return the input matrix if only one is provided', () => {
      const matrix = [
        [1, 2],
        [3, 4]
      ];

      expect(multiplyMatrices(matrix)).toBe(matrix);
    });

    it('should throw an error if no matrices are provided', () => {
      expect(() => multiplyMatrices()).toThrow('No matrices provided for multiplication.');
    });
  });
});
