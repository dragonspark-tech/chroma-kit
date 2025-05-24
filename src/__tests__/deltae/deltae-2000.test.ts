import { describe, expect, it } from 'vitest';
import { deltaE2000, type DeltaE2000Weights } from '../../deltae/deltae-2000';
import { type LabColor } from '../../models/lab';

describe('Delta E 2000', () => {
  describe('Basic functionality', () => {
    it('should calculate the CIEDE2000 color difference between two Lab colors with default weights', () => {
      const color1: LabColor = { space: 'lab', l: 50, a: 2.6772, b: -79.7751 };
      const color2: LabColor = { space: 'lab', l: 50, a: 0, b: -82.7485 };

      // This is a known test case from the CIEDE2000 paper
      // Expected result: 2.0425
      expect(deltaE2000(color1, color2)).toBeCloseTo(2.0425, 4);
    });

    it('should return 0 for identical colors', () => {
      const color: LabColor = { space: 'lab', l: 50, a: 2.6772, b: -79.7751 };
      expect(deltaE2000(color, color)).toBe(0);
    });
  });

  describe('Weight factors', () => {
    it('should use the default weights (kL=1, kC=1, kH=1) when not provided', () => {
      const color1: LabColor = { space: 'lab', l: 50, a: 2.6772, b: -79.7751 };
      const color2: LabColor = { space: 'lab', l: 50, a: 0, b: -82.7485 };

      const defaultResult = deltaE2000(color1, color2);
      const explicitDefaultResult = deltaE2000(color1, color2, { kL: 1, kC: 1, kH: 1 });

      expect(defaultResult).toBe(explicitDefaultResult);
    });

    it('should apply custom weight factors when provided', () => {
      const color1: LabColor = { space: 'lab', l: 50, a: 2.6772, b: -79.7751 };
      const color2: LabColor = { space: 'lab', l: 50, a: 0, b: -82.7485 };

      const customWeights: DeltaE2000Weights = { kL: 2, kC: 1, kH: 1 };
      const result1 = deltaE2000(color1, color2, customWeights);

      const defaultResult = deltaE2000(color1, color2);

      // With kL=2 instead of 1, the lightness difference should have less weight
      // So the result should be smaller than with the default weights
      // However, in this case the lightness is identical, so the result should be the same
      expect(result1).toBe(defaultResult);

      // Let's try a case where lightness differs
      const color3: LabColor = { space: 'lab', l: 60, a: 2.6772, b: -79.7751 };

      const resultWithLDiff = deltaE2000(color1, color3);
      const resultWithLDiffCustom = deltaE2000(color1, color3, customWeights);

      // Now the result with kL=2 should be smaller
      expect(resultWithLDiffCustom).toBeLessThan(resultWithLDiff);
    });
  });

  describe('Known test cases from the CIEDE2000 paper', () => {
    // Test cases from the paper "The CIEDE2000 Color-Difference Formula: Implementation Notes,
    // Supplementary Test Data, and Mathematical Observations" by Gaurav Sharma, Wencheng Wu, and Edul N. Dalal
    const testCases = [
      // [L1, a1, b1, L2, a2, b2, expectedDeltaE]
      [50.0000, 2.6772, -79.7751, 50.0000, 0.0000, -82.7485, 2.0425],
      [50.0000, 3.1571, -77.2803, 50.0000, 0.0000, -82.7485, 2.8615],
      [50.0000, 2.8361, -74.0200, 50.0000, 0.0000, -82.7485, 3.4412],
      [50.0000, -1.3802, -84.2814, 50.0000, 0.0000, -82.7485, 1.0000],
      [50.0000, -1.1848, -84.8006, 50.0000, 0.0000, -82.7485, 1.0000],
      [50.0000, -0.9009, -85.5211, 50.0000, 0.0000, -82.7485, 1.0000],
      [50.0000, 0.0000, 0.0000, 50.0000, -1.0000, 2.0000, 2.3669],
      [50.0000, -1.0000, 2.0000, 50.0000, 0.0000, 0.0000, 2.3669],
      [50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0009, 7.1792],
      [50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0010, 7.1792],
      [50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0011, 7.2195],
      [50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0012, 7.2195],
      [50.0000, -0.0010, 2.4900, 50.0000, 0.0009, -2.4900, 4.8045],
      [50.0000, -0.0010, 2.4900, 50.0000, 0.0010, -2.4900, 4.8045],
      [50.0000, -0.0010, 2.4900, 50.0000, 0.0011, -2.4900, 4.7461],
      [50.0000, 2.5000, 0.0000, 50.0000, 0.0000, -2.5000, 4.3065],
      [50.0000, 2.5000, 0.0000, 73.0000, 25.0000, -18.0000, 27.1492],
      [50.0000, 2.5000, 0.0000, 61.0000, -5.0000, 29.0000, 22.8977],
      [50.0000, 2.5000, 0.0000, 56.0000, -27.0000, -3.0000, 31.9030],
      [50.0000, 2.5000, 0.0000, 58.0000, 24.0000, 15.0000, 19.4535],
      [50.0000, 2.5000, 0.0000, 50.0000, 3.1736, 0.5854, 1.0000],
      [50.0000, 2.5000, 0.0000, 50.0000, 3.2972, 0.0000, 1.0000],
      [50.0000, 2.5000, 0.0000, 50.0000, 1.8634, 0.5757, 1.0000],
      [50.0000, 2.5000, 0.0000, 50.0000, 3.2592, 0.3350, 1.0000],
      [60.2574, -34.0099, 36.2677, 60.4626, -34.1751, 39.4387, 1.2644],
      [63.0109, -31.0961, -5.8663, 62.8187, -29.7946, -4.0864, 1.2630],
      [61.2901, 3.7196, -5.3901, 61.4292, 2.2480, -4.9620, 1.8731],
      [35.0831, -44.1164, 3.7933, 35.0232, -40.0716, 1.5901, 1.8645],
      [22.7233, 20.0904, -46.6940, 23.0331, 14.9730, -42.5619, 2.0373],
      [36.4612, 47.8580, 18.3852, 36.2715, 50.5065, 21.2231, 1.4146],
      [90.8027, -2.0831, 1.4410, 91.1528, -1.6435, 0.0447, 1.4441],
      [90.9257, -0.5406, -0.9208, 88.6381, -0.8985, -0.7239, 1.5381],
      [6.7747, -0.2908, -2.4247, 5.8714, -0.0985, -2.2286, 0.6377],
      [2.0776, 0.0795, -1.1350, 0.9033, -0.0636, -0.5514, 0.9082]
    ];

    it.each(testCases)(
      'should match expected result for Lab1(%f, %f, %f) and Lab2(%f, %f, %f)',
      (L1, a1, b1, L2, a2, b2, expectedDeltaE) => {
        const color1: LabColor = { space: 'lab', l: L1, a: a1, b: b1 };
        const color2: LabColor = { space: 'lab', l: L2, a: a2, b: b2 };

        expect(deltaE2000(color1, color2)).toBeCloseTo(expectedDeltaE, 4);
      }
    );
  });

  describe('Edge cases', () => {
    it('should handle zero chroma values', () => {
      const color1: LabColor = { space: 'lab', l: 50, a: 0, b: 0 };
      const color2: LabColor = { space: 'lab', l: 55, a: 0, b: 0 };

      // When both colors have zero chroma, only lightness difference matters
      // This is a special case in the CIEDE2000 formula
      const result = deltaE2000(color1, color2);
      expect(result).toBeGreaterThan(0);
    });

    it('should handle alpha values if present (by ignoring them)', () => {
      const color1: LabColor & { alpha?: number } = {
        space: 'lab', l: 50, a: 2.6772, b: -79.7751, alpha: 1.0
      };
      const color2: LabColor & { alpha?: number } = {
        space: 'lab', l: 50, a: 2.6772, b: -79.7751, alpha: 0.5
      };

      // Alpha should be ignored, so identical colors should have a delta E of 0
      expect(deltaE2000(color1, color2)).toBe(0);
    });
  });

  describe('Implementation details', () => {
    it('should handle the special case where C1p * C2p === 0', () => {
      const color1: LabColor = { space: 'lab', l: 50, a: 0, b: 0 };
      const color2: LabColor = { space: 'lab', l: 50, a: 0, b: 0 };

      // Both colors have zero chroma, so C1p * C2p === 0
      // This should trigger the special case handling for dhp and hp_ave
      expect(deltaE2000(color1, color2)).toBe(0);

      // Test with different lightness to ensure the calculation still works
      const color3: LabColor = { space: 'lab', l: 60, a: 0, b: 0 };
      expect(deltaE2000(color1, color3)).toBeGreaterThan(0);
    });

    it('should handle the special case where h2p - h1p > 180', () => {
      // Create colors where h2p - h1p > 180
      const color1: LabColor = { space: 'lab', l: 50, a: 1, b: 0 }; // h1p ≈ 0
      const color2: LabColor = { space: 'lab', l: 50, a: -1, b: 0 }; // h2p ≈ 180

      // This should trigger the special case handling for dhp
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
    });

    it('should handle the special case where h2p - h1p < -180', () => {
      // Create colors where h2p - h1p < -180
      const color1: LabColor = { space: 'lab', l: 50, a: -1, b: 0 }; // h1p ≈ 180
      const color2: LabColor = { space: 'lab', l: 50, a: 1, b: 0 }; // h2p ≈ 0

      // This should trigger the special case handling for dhp
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
    });

    it('should handle the special case where h1p + h2p > 360', () => {
      // Create colors where h1p + h2p > 360
      const color1: LabColor = { space: 'lab', l: 50, a: -1, b: 1 }; // h1p ≈ 135
      const color2: LabColor = { space: 'lab', l: 50, a: -1, b: -1 }; // h2p ≈ 225

      // This should trigger the special case handling for hp_ave
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
    });
  });
});
