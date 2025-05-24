import { describe, expect, it } from 'vitest';
import { contrastMichelson } from '../../contrast/michelson';
import { xyz } from '../../models/xyz';
import { MICHELSON_CLAMP } from '../../contrast/michelson/constants';

describe('Michelson Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate contrast using the Michelson formula', () => {
      const color1 = xyz(0.2, 0.2, 0.2);
      const color2 = xyz(0.8, 0.8, 0.8);

      // Manual calculation: (0.8 - 0.2) / (0.8 + 0.2) = 0.6 / 1.0 = 0.6
      const expected = 0.6;

      expect(contrastMichelson(color1, color2)).toBeCloseTo(expected);
    });

    it('should return the same result regardless of order', () => {
      const color1 = xyz(0.2, 0.2, 0.2);
      const color2 = xyz(0.8, 0.8, 0.8);

      const result1 = contrastMichelson(color1, color2);
      const result2 = contrastMichelson(color2, color1);

      expect(result1).toBeCloseTo(result2);
    });

    it('should only use the Y component (luminance)', () => {
      const color1 = xyz(0.1, 0.2, 0.3);
      const color2 = xyz(0.4, 0.8, 0.5);

      // Manual calculation using only Y values: (0.8 - 0.2) / (0.8 + 0.2) = 0.6 / 1.0 = 0.6
      const expected = 0.6;

      expect(contrastMichelson(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Range behavior', () => {
    it('should return values between 0 and 1', () => {
      const testCases = [
        { color1: xyz(0.1, 0.1, 0.1), color2: xyz(0.9, 0.9, 0.9) },
        { color1: xyz(0.3, 0.3, 0.3), color2: xyz(0.7, 0.7, 0.7) },
        { color1: xyz(0.4, 0.4, 0.4), color2: xyz(0.6, 0.6, 0.6) },
        { color1: xyz(0.49, 0.49, 0.49), color2: xyz(0.51, 0.51, 0.51) }
      ];

      for (const { color1, color2 } of testCases) {
        const result = contrastMichelson(color1, color2);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });

    it('should return 1 for maximum contrast (black vs white)', () => {
      const black = xyz(0, 0, 0);
      const white = xyz(1, 1, 1);

      expect(contrastMichelson(black, white)).toBe(1);
    });

    it('should return 0 for identical colors', () => {
      const color = xyz(0.5, 0.5, 0.5);
      expect(contrastMichelson(color, color)).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero luminance values', () => {
      const black1 = xyz(0, 0, 0);
      const black2 = xyz(0, 0, 0);

      // When both colors have zero luminance, should return MICHELSON_CLAMP
      expect(contrastMichelson(black1, black2)).toBe(MICHELSON_CLAMP);
    });

    it('should handle negative luminance values by clamping to zero', () => {
      const negativeColor = xyz(0, -0.1, 0);
      const positiveColor = xyz(0, 0.5, 0);

      // Negative luminance should be clamped to 0
      // So this should be equivalent to (0.5 - 0) / (0.5 + 0) = 1
      expect(contrastMichelson(negativeColor, positiveColor)).toBe(1);
    });

    it('should handle very small luminance differences', () => {
      const color1 = xyz(0, 0.0001, 0);
      const color2 = xyz(0, 0.0002, 0);

      // (0.0002 - 0.0001) / (0.0002 + 0.0001) = 0.0001 / 0.0003 = 0.333...
      const expected = 1/3;

      expect(contrastMichelson(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Alpha handling', () => {
    it('should ignore alpha values if present', () => {
      const color1 = xyz(0.2, 0.2, 0.2, 1.0);
      const color2 = xyz(0.8, 0.8, 0.8, 0.5);

      // Manual calculation ignoring alpha: (0.8 - 0.2) / (0.8 + 0.2) = 0.6 / 1.0 = 0.6
      const expected = 0.6;

      expect(contrastMichelson(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Implementation details', () => {
    it('should use the correct formula', () => {
      const color1 = xyz(0.25, 0.25, 0.25);
      const color2 = xyz(0.75, 0.75, 0.75);

      // Manual calculation
      const lum1 = 0.25;
      const lum2 = 0.75;
      const maxLum = Math.max(lum1, lum2);
      const minLum = Math.min(lum1, lum2);
      const expected = (maxLum - minLum) / (maxLum + minLum);

      expect(contrastMichelson(color1, color2)).toBe(expected);
    });
  });
});
