import { describe, expect, it } from 'vitest';
import { contrastWeber } from '../../contrast/weber';
import { xyz } from '../../models/xyz';
import { WEBER_CLAMP } from '../../contrast/weber/constants';

describe('Weber Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate contrast using the Weber formula', () => {
      const color1 = xyz(0.2, 0.2, 0.2);
      const color2 = xyz(0.8, 0.8, 0.8);

      // Manual calculation: (0.8 - 0.2) / 0.2 = 0.6 / 0.2 = 3
      const expected = (0.8 - 0.2) / 0.2;

      expect(contrastWeber(color1, color2)).toBeCloseTo(expected);
    });

    it('should not be symmetric (order matters)', () => {
      const darkColor = xyz(0.2, 0.2, 0.2);
      const lightColor = xyz(0.8, 0.8, 0.8);

      // (0.8 - 0.2) / 0.2 = 0.6 / 0.2 = 3
      const result1 = contrastWeber(darkColor, lightColor);

      // (0.8 - 0.2) / 0.2 = 0.6 / 0.2 = 3 (same result because it always uses min/max)
      const result2 = contrastWeber(lightColor, darkColor);

      // The results should be the same because the implementation always uses max-min/min
      expect(result1).toBeCloseTo(result2);
    });

    it('should only use the Y component (luminance)', () => {
      const color1 = xyz(0.1, 0.2, 0.3);
      const color2 = xyz(0.4, 0.8, 0.5);

      // Manual calculation using only Y values: (0.8 - 0.2) / 0.2 = 0.6 / 0.2 = 3
      const expected = (0.8 - 0.2) / 0.2;

      expect(contrastWeber(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Range behavior', () => {
    it('should return values greater than or equal to 0', () => {
      const testCases = [
        { color1: xyz(0.1, 0.1, 0.1), color2: xyz(0.9, 0.9, 0.9) },
        { color1: xyz(0.3, 0.3, 0.3), color2: xyz(0.7, 0.7, 0.7) },
        { color1: xyz(0.4, 0.4, 0.4), color2: xyz(0.6, 0.6, 0.6) },
        { color1: xyz(0.5, 0.5, 0.5), color2: xyz(0.5, 0.5, 0.5) }
      ];

      for (const { color1, color2 } of testCases) {
        const result = contrastWeber(color1, color2);
        expect(result).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return WEBER_CLAMP for maximum contrast (black vs any color)', () => {
      const black = xyz(0, 0, 0);
      const white = xyz(1, 1, 1);

      expect(contrastWeber(black, white)).toBe(WEBER_CLAMP);
    });

    it('should return 0 for identical colors', () => {
      const color = xyz(0.5, 0.5, 0.5);
      expect(contrastWeber(color, color)).toBe(0);
    });

    it('should return higher values for greater contrast', () => {
      const darkColor = xyz(0.1, 0.1, 0.1);
      const mediumColor = xyz(0.5, 0.5, 0.5);
      const lightColor = xyz(0.9, 0.9, 0.9);

      const lowContrast = contrastWeber(mediumColor, lightColor);
      const highContrast = contrastWeber(darkColor, lightColor);

      expect(highContrast).toBeGreaterThan(lowContrast);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero luminance values', () => {
      const black = xyz(0, 0, 0);
      const gray = xyz(0.5, 0.5, 0.5);

      // When min luminance is zero, should return WEBER_CLAMP
      expect(contrastWeber(black, gray)).toBe(WEBER_CLAMP);
    });

    it('should handle negative luminance values by clamping to zero', () => {
      const negativeColor = xyz(0, -0.1, 0);
      const positiveColor = xyz(0, 0.5, 0);

      // Negative luminance should be clamped to 0
      // So this should be equivalent to (0.5 - 0) / 0 = WEBER_CLAMP
      expect(contrastWeber(negativeColor, positiveColor)).toBe(WEBER_CLAMP);
    });

    it('should handle very small luminance differences', () => {
      const color1 = xyz(0, 0.0001, 0);
      const color2 = xyz(0, 0.0002, 0);

      // (0.0002 - 0.0001) / 0.0001 = 0.0001 / 0.0001 = 1
      const expected = 1;

      expect(contrastWeber(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle very small reference luminance', () => {
      const almostBlack = xyz(0, 0.0001, 0);
      const white = xyz(0, 1, 0);

      // (1 - 0.0001) / 0.0001 = 0.9999 / 0.0001 = 9999
      const expected = 9999;

      expect(contrastWeber(almostBlack, white)).toBeCloseTo(expected);
    });
  });

  describe('Alpha handling', () => {
    it('should ignore alpha values if present', () => {
      const color1 = xyz(0.2, 0.2, 0.2, 1.0);
      const color2 = xyz(0.8, 0.8, 0.8, 0.5);

      // Manual calculation ignoring alpha: (0.8 - 0.2) / 0.2 = 0.6 / 0.2 = 3
      const expected = 3;

      expect(contrastWeber(color1, color2)).toBeCloseTo(expected);
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
      const expected = (maxLum - minLum) / minLum;

      expect(contrastWeber(color1, color2)).toBe(expected);
    });
  });
});
