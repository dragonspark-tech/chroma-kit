import { describe, expect, it } from 'vitest';
import {
  BRADFORD_D50_TO_D65,
  BRADFORD_D65_TO_D50,
  coneMatrixes
} from '../../adaptation/_cone-matrixes';
import { multiplyMatrix3x3 } from '../../utils/linear';

describe('Cone Matrixes', () => {
  describe('BRADFORD_D50_TO_D65', () => {
    it('should be a 3x3 matrix', () => {
      expect(BRADFORD_D50_TO_D65.length).toBe(3);
      BRADFORD_D50_TO_D65.forEach(row => {
        expect(row.length).toBe(3);
      });
    });

    it('should have the correct values', () => {
      expect(BRADFORD_D50_TO_D65).toEqual([
        [
          0.9554734527042181,
          -0.023098536874261454,
          0.0632593086610217
        ],
        [
          -0.028369706963208136,
          1.0099954580058226,
          0.021041398966942994
        ],
        [
          0.012314001688319906,
          -0.020507696433477926,
          1.3303659366080753
        ]
      ]);
    });
  });

  describe('BRADFORD_D65_TO_D50', () => {
    it('should be a 3x3 matrix', () => {
      expect(BRADFORD_D65_TO_D50.length).toBe(3);
      BRADFORD_D65_TO_D50.forEach(row => {
        expect(row.length).toBe(3);
      });
    });

    it('should have the correct values', () => {
      expect(BRADFORD_D65_TO_D50).toEqual([
        [
          1.0479298208405488,
          0.02294679334101906,
          -0.05019222954313554
        ],
        [
          0.029627815688159344,
          0.9904344845732489,
          -0.017073825029385127
        ],
        [
          -0.009243058152591188,
          0.015055144896577888,
          0.7518742899580008
        ]
      ]);
    });
  });

  describe('coneMatrixes', () => {
    it('should contain the Bradford matrices', () => {
      expect(coneMatrixes['BRADFORD_D50_TO_D65']).toBe(BRADFORD_D50_TO_D65);
      expect(coneMatrixes['BRADFORD_D65_TO_D50']).toBe(BRADFORD_D65_TO_D50);
    });

    it('should have the correct number of matrices', () => {
      expect(Object.keys(coneMatrixes).length).toBe(2);
    });
  });

  describe('Matrix relationships', () => {
    it('should be inverse matrices of each other', () => {
      // Multiplying D50_TO_D65 by D65_TO_D50 should give an identity matrix (approximately)
      const product = multiplyMatrix3x3(BRADFORD_D50_TO_D65, BRADFORD_D65_TO_D50);

      // Check if the result is close to an identity matrix
      expect(product[0][0]).toBeCloseTo(1, 5);
      expect(product[0][1]).toBeCloseTo(0, 5);
      expect(product[0][2]).toBeCloseTo(0, 5);
      expect(product[1][0]).toBeCloseTo(0, 5);
      expect(product[1][1]).toBeCloseTo(1, 5);
      expect(product[1][2]).toBeCloseTo(0, 5);
      expect(product[2][0]).toBeCloseTo(0, 5);
      expect(product[2][1]).toBeCloseTo(0, 5);
      expect(product[2][2]).toBeCloseTo(1, 5);
    });

    it('should transform a vector and then transform it back', () => {
      // Create a test vector
      const vector = [0.5, 0.3, 0.2];

      // Transform from D50 to D65
      const transformedVector = [
        BRADFORD_D50_TO_D65[0][0] * vector[0] + BRADFORD_D50_TO_D65[0][1] * vector[1] + BRADFORD_D50_TO_D65[0][2] * vector[2],
        BRADFORD_D50_TO_D65[1][0] * vector[0] + BRADFORD_D50_TO_D65[1][1] * vector[1] + BRADFORD_D50_TO_D65[1][2] * vector[2],
        BRADFORD_D50_TO_D65[2][0] * vector[0] + BRADFORD_D50_TO_D65[2][1] * vector[1] + BRADFORD_D50_TO_D65[2][2] * vector[2]
      ];

      // Transform back from D65 to D50
      const restoredVector = [
        BRADFORD_D65_TO_D50[0][0] * transformedVector[0] + BRADFORD_D65_TO_D50[0][1] * transformedVector[1] + BRADFORD_D65_TO_D50[0][2] * transformedVector[2],
        BRADFORD_D65_TO_D50[1][0] * transformedVector[0] + BRADFORD_D65_TO_D50[1][1] * transformedVector[1] + BRADFORD_D65_TO_D50[1][2] * transformedVector[2],
        BRADFORD_D65_TO_D50[2][0] * transformedVector[0] + BRADFORD_D65_TO_D50[2][1] * transformedVector[1] + BRADFORD_D65_TO_D50[2][2] * transformedVector[2]
      ];

      // Check if the restored vector is close to the original
      expect(restoredVector[0]).toBeCloseTo(vector[0], 5);
      expect(restoredVector[1]).toBeCloseTo(vector[1], 5);
      expect(restoredVector[2]).toBeCloseTo(vector[2], 5);
    });
  });
});
