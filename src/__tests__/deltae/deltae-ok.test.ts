import { describe, expect, it } from 'vitest';
import { deltaEOK } from '../../deltae/deltae-ok';
import { oklab, type OKLabColor } from '../../models/oklab';

describe('Delta E OK', () => {
  describe('Basic functionality', () => {
    it('should calculate the Euclidean distance between two OKLab colors', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.6, 0.2, 0.2);

      // Calculate expected result: sqrt((0.5-0.6)^2 + (0.1-0.2)^2 + (0.1-0.2)^2)
      // = sqrt(0.01 + 0.01 + 0.01) = sqrt(0.03) ≈ 0.1732
      const expected = Math.sqrt(0.03);

      expect(deltaEOK(color1, color2)).toBeCloseTo(expected);
    });

    it('should return 0 for identical colors', () => {
      const color = oklab(0.5, 0.1, 0.1);
      expect(deltaEOK(color, color)).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle extreme values', () => {
      const black = oklab(0, 0, 0);
      const white = oklab(1, 0, 0);

      // Distance between black and white in OKLab is 1 (only L changes)
      expect(deltaEOK(black, white)).toBe(1);
    });

    it('should handle negative values', () => {
      const color1 = oklab(0.5, -0.1, -0.1);
      const color2 = oklab(0.5, 0.1, 0.1);

      // Calculate expected result: sqrt((0.5-0.5)^2 + (-0.1-0.1)^2 + (-0.1-0.1)^2)
      // = sqrt(0 + 0.04 + 0.04) = sqrt(0.08) ≈ 0.2828
      const expected = Math.sqrt(0.08);

      expect(deltaEOK(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Alpha handling', () => {
    it('should ignore alpha values if present', () => {
      const color1 = oklab(0.5, 0.1, 0.1, 1.0);
      const color2 = oklab(0.6, 0.2, 0.2, 0.5);

      // Calculate expected result: sqrt((0.5-0.6)^2 + (0.1-0.2)^2 + (0.1-0.2)^2)
      // = sqrt(0.01 + 0.01 + 0.01) = sqrt(0.03) ≈ 0.1732
      const expected = Math.sqrt(0.03);

      expect(deltaEOK(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Implementation details', () => {
    it('should use the correct formula', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.6, 0.2, 0.2);

      // Manual calculation
      const dL = color1.l - color2.l;
      const da = color1.a - color2.a;
      const db = color1.b - color2.b;
      const expected = Math.sqrt(dL * dL + da * da + db * db);

      expect(deltaEOK(color1, color2)).toBe(expected);
    });
  });
});
