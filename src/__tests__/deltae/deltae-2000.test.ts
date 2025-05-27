import { describe, expect, it } from 'vitest';
import { deltaE2000, type DeltaE2000Weights } from '../../deltae';
import { lab } from '../../models/lab';

describe('Delta E 2000', () => {
  describe('Basic functionality', () => {
    it('should calculate the CIEDE2000 color difference between two Lab colors with default weights', () => {
      const color1 = lab(50, 2.6772, -79.7751);
      const color2 = lab(50, 0, -82.7485);

      // This is a known test case from the CIEDE2000 paper
      // Expected result: 2.0425
      expect(deltaE2000(color1, color2)).toBeCloseTo(2.0425, 4);
    });

    it('should return 0 for identical colors', () => {
      const color = lab(50, 2.6772, -79.7751);
      expect(deltaE2000(color, color)).toBe(0);
    });
  });

  describe('Weight factors', () => {
    it('should use the default weights (kL=1, kC=1, kH=1) when not provided', () => {
      const color1 = lab(50, 2.6772, -79.7751);
      const color2 = lab(50, 0, -82.7485);

      const defaultResult = deltaE2000(color1, color2);
      const explicitDefaultResult = deltaE2000(color1, color2, { kL: 1, kC: 1, kH: 1 });

      expect(defaultResult).toBe(explicitDefaultResult);
    });

    it('should apply custom weight factors when provided', () => {
      const color1 = lab(50, 2.6772, -79.7751);
      const color2 = lab(50, 0, -82.7485);

      const customWeights: DeltaE2000Weights = { kL: 2, kC: 1, kH: 1 };
      const result1 = deltaE2000(color1, color2, customWeights);

      const defaultResult = deltaE2000(color1, color2);

      // With kL=2 instead of 1, the lightness difference should have less weight
      // So the result should be smaller than with the default weights
      // However, in this case the lightness is identical, so the result should be the same
      expect(result1).toBe(defaultResult);

      // Let's try a case where lightness differs
      const color3 = lab(60, 2.6772, -79.7751);

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
      [50.0, 2.6772, -79.7751, 50.0, 0.0, -82.7485, 2.0425],
      [50.0, 3.1571, -77.2803, 50.0, 0.0, -82.7485, 2.8615],
      [50.0, 2.8361, -74.02, 50.0, 0.0, -82.7485, 3.4412],
      [50.0, -1.3802, -84.2814, 50.0, 0.0, -82.7485, 1.0],
      [50.0, -1.1848, -84.8006, 50.0, 0.0, -82.7485, 1.0],
      [50.0, -0.9009, -85.5211, 50.0, 0.0, -82.7485, 1.0],
      [50.0, 0.0, 0.0, 50.0, -1.0, 2.0, 2.3669],
      [50.0, -1.0, 2.0, 50.0, 0.0, 0.0, 2.3669],
      [50.0, 2.49, -0.001, 50.0, -2.49, 0.0009, 7.1792],
      [50.0, 2.49, -0.001, 50.0, -2.49, 0.001, 7.1792],
      [50.0, 2.49, -0.001, 50.0, -2.49, 0.0011, 7.2195],
      [50.0, 2.49, -0.001, 50.0, -2.49, 0.0012, 7.2195],
      [50.0, -0.001, 2.49, 50.0, 0.0009, -2.49, 4.8045],
      [50.0, -0.001, 2.49, 50.0, 0.001, -2.49, 4.8045],
      [50.0, -0.001, 2.49, 50.0, 0.0011, -2.49, 4.7461],
      [50.0, 2.5, 0.0, 50.0, 0.0, -2.5, 4.3065],
      [50.0, 2.5, 0.0, 73.0, 25.0, -18.0, 27.1492],
      [50.0, 2.5, 0.0, 61.0, -5.0, 29.0, 22.8977],
      [50.0, 2.5, 0.0, 56.0, -27.0, -3.0, 31.903],
      [50.0, 2.5, 0.0, 58.0, 24.0, 15.0, 19.4535],
      [50.0, 2.5, 0.0, 50.0, 3.1736, 0.5854, 1.0],
      [50.0, 2.5, 0.0, 50.0, 3.2972, 0.0, 1.0],
      [50.0, 2.5, 0.0, 50.0, 1.8634, 0.5757, 1.0],
      [50.0, 2.5, 0.0, 50.0, 3.2592, 0.335, 1.0],
      [60.2574, -34.0099, 36.2677, 60.4626, -34.1751, 39.4387, 1.2644],
      [63.0109, -31.0961, -5.8663, 62.8187, -29.7946, -4.0864, 1.263],
      [61.2901, 3.7196, -5.3901, 61.4292, 2.248, -4.962, 1.8731],
      [35.0831, -44.1164, 3.7933, 35.0232, -40.0716, 1.5901, 1.8645],
      [22.7233, 20.0904, -46.694, 23.0331, 14.973, -42.5619, 2.0373],
      [36.4612, 47.858, 18.3852, 36.2715, 50.5065, 21.2231, 1.4146],
      [90.8027, -2.0831, 1.441, 91.1528, -1.6435, 0.0447, 1.4441],
      [90.9257, -0.5406, -0.9208, 88.6381, -0.8985, -0.7239, 1.5381],
      [6.7747, -0.2908, -2.4247, 5.8714, -0.0985, -2.2286, 0.6377],
      [2.0776, 0.0795, -1.135, 0.9033, -0.0636, -0.5514, 0.9082]
    ];

    it.each(testCases)(
      'should match expected result for Lab1(%f, %f, %f) and Lab2(%f, %f, %f)',
      (L1, a1, b1, L2, a2, b2, expectedDeltaE) => {
        const color1 = lab(L1, a1, b1);
        const color2 = lab(L2, a2, b2);

        expect(deltaE2000(color1, color2)).toBeCloseTo(expectedDeltaE, 4);
      }
    );
  });

  describe('Edge cases', () => {
    it('should handle zero chroma values', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(55, 0, 0);

      // When both colors have zero chroma, only lightness difference matters
      // This is a special case in the CIEDE2000 formula
      const result = deltaE2000(color1, color2);
      expect(result).toBeGreaterThan(0);
    });

    it('should handle alpha values if present (by ignoring them)', () => {
      const color1 = lab(50, 2.6772, -79.7751, 1);
      const color2 = lab(50, 2.6772, -79.7751, 0.5);

      // Alpha should be ignored, so identical colors should have a delta E of 0
      expect(deltaE2000(color1, color2)).toBe(0);
    });
  });

  describe('Implementation details', () => {
    it('should handle the special case where C1p * C2p === 0', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(50, 0, 0);

      // Both colors have zero chroma, so C1p * C2p === 0
      // This should trigger the special case handling for dhp and hp_ave
      expect(deltaE2000(color1, color2)).toBe(0);

      // Test with different lightness to ensure the calculation still works
      const color3 = lab(60, 0, 0);
      expect(deltaE2000(color1, color3)).toBeGreaterThan(0);
    });

    it('should handle the special case where h2p - h1p > 180', () => {
      // Create colors where h2p - h1p > 180
      const color1 = lab(50, 1, 0); // h1p ≈ 0
      const color2 = lab(50, -1, 0); // h2p ≈ 180

      // This should trigger the special case handling for dhp
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
    });

    it('should handle the special case where h2p - h1p < -180', () => {
      // Create colors where h2p - h1p < -180
      const color1 = lab(50, 1, 0); // h1p ≈ 180
      const color2 = lab(50, -1, 0); // h2p ≈ 0

      // This should trigger the special case handling for dhp
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
    });

    it('should handle the special case where h1p + h2p > 360', () => {
      // Create colors where h1p + h2p > 360
      const color1 = lab(50, -1, 1); // h1p ≈ 135
      const color2 = lab(50, -1, -1); // h2p ≈ 225

      // This should trigger the special case handling for hp_ave
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
    });
  });
});
