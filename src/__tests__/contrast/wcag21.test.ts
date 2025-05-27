import { describe, expect, it } from 'vitest';
import { contrastWCAG21 } from '../../contrast/wcag21';
import { xyz } from '../../models/xyz';
import { WCAG21_LUMINANCE_OFFSET } from '../../contrast/wcag21/constants';

describe('WCAG 2.1 Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate contrast using the WCAG 2.1 formula', () => {
      const color1 = xyz(0.2, 0.2, 0.2);
      const color2 = xyz(0.8, 0.8, 0.8);

      // Manual calculation: (0.8 + 0.05) / (0.2 + 0.05) = 0.85 / 0.25 = 3.4
      const expected = (0.8 + WCAG21_LUMINANCE_OFFSET) / (0.2 + WCAG21_LUMINANCE_OFFSET);

      expect(contrastWCAG21(color1, color2)).toBeCloseTo(expected);
    });

    it('should return the same result regardless of order', () => {
      const color1 = xyz(0.2, 0.2, 0.2);
      const color2 = xyz(0.8, 0.8, 0.8);

      const result1 = contrastWCAG21(color1, color2);
      const result2 = contrastWCAG21(color2, color1);

      expect(result1).toBeCloseTo(result2);
    });

    it('should only use the Y component (luminance)', () => {
      const color1 = xyz(0.1, 0.2, 0.3);
      const color2 = xyz(0.4, 0.8, 0.5);

      // Manual calculation using only Y values: (0.8 + 0.05) / (0.2 + 0.05) = 0.85 / 0.25 = 3.4
      const expected = (0.8 + WCAG21_LUMINANCE_OFFSET) / (0.2 + WCAG21_LUMINANCE_OFFSET);

      expect(contrastWCAG21(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Range behavior', () => {
    it('should return values between 1 and 21', () => {
      const testCases = [
        { color1: xyz(0, 0, 0), color2: xyz(1, 1, 1) }, // Black vs White (max contrast)
        { color1: xyz(0.3, 0.3, 0.3), color2: xyz(0.7, 0.7, 0.7) }, // Medium contrast
        { color1: xyz(0.4, 0.4, 0.4), color2: xyz(0.6, 0.6, 0.6) }, // Low contrast
        { color1: xyz(0.5, 0.5, 0.5), color2: xyz(0.5, 0.5, 0.5) } // No contrast
      ];

      for (const { color1, color2 } of testCases) {
        const result = contrastWCAG21(color1, color2);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(21);
      }
    });

    it('should return close to 21 for maximum contrast (black vs white)', () => {
      const black = xyz(0, 0, 0);
      const white = xyz(1, 1, 1);

      // (1 + 0.05) / (0 + 0.05) = 1.05 / 0.05 = 21
      expect(contrastWCAG21(black, white)).toBeCloseTo(21);
    });

    it('should return 1 for identical colors', () => {
      const color = xyz(0.5, 0.5, 0.5);

      // (0.5 + 0.05) / (0.5 + 0.05) = 0.55 / 0.55 = 1
      expect(contrastWCAG21(color, color)).toBeCloseTo(1);
    });
  });

  describe('Accessibility thresholds', () => {
    it('should identify AA-compliant text contrast (4.5:1)', () => {
      // Create colors with contrast just above and below 4.5:1
      const darkColor = xyz(0, 0, 0);

      // Find a gray that gives approximately 4.5:1 contrast with black
      // Solving (y + 0.05) / (0 + 0.05) = 4.5
      // y + 0.05 = 4.5 * 0.05
      // y = 4.5 * 0.05 - 0.05
      // y = 0.225 - 0.05 = 0.175
      const grayAboveThreshold = xyz(0, 0.18, 0); // Just above 4.5:1
      const grayBelowThreshold = xyz(0, 0.17, 0); // Just below 4.5:1

      expect(contrastWCAG21(darkColor, grayAboveThreshold)).toBeGreaterThanOrEqual(4.5);
      expect(contrastWCAG21(darkColor, grayBelowThreshold)).toBeLessThan(4.5);
    });

    it('should identify AAA-compliant text contrast (7:1)', () => {
      // Create colors with contrast just above and below 7:1
      const darkColor = xyz(0, 0, 0);

      // Find a gray that gives approximately 7:1 contrast with black
      // Solving (y + 0.05) / (0 + 0.05) = 7
      // y + 0.05 = 7 * 0.05
      // y = 7 * 0.05 - 0.05
      // y = 0.35 - 0.05 = 0.3
      const grayAboveThreshold = xyz(0, 0.31, 0); // Just above 7:1
      const grayBelowThreshold = xyz(0, 0.29, 0); // Just below 7:1

      expect(contrastWCAG21(darkColor, grayAboveThreshold)).toBeGreaterThanOrEqual(7);
      expect(contrastWCAG21(darkColor, grayBelowThreshold)).toBeLessThan(7);
    });
  });

  describe('Edge cases', () => {
    it('should handle negative luminance values by clamping to zero', () => {
      const negativeColor = xyz(0, -0.1, 0);
      const positiveColor = xyz(0, 0.5, 0);

      // Negative luminance should be clamped to 0
      // So this should be equivalent to (0.5 + 0.05) / (0 + 0.05) = 0.55 / 0.05 = 11
      const expected = (0.5 + WCAG21_LUMINANCE_OFFSET) / (0 + WCAG21_LUMINANCE_OFFSET);

      expect(contrastWCAG21(negativeColor, positiveColor)).toBeCloseTo(expected);
    });

    it('should handle very small luminance differences', () => {
      const color1 = xyz(0, 0.0001, 0);
      const color2 = xyz(0, 0.0002, 0);

      // (0.0002 + 0.05) / (0.0001 + 0.05) = 0.0502 / 0.0501 ≈ 1.002
      const expected = (0.0002 + WCAG21_LUMINANCE_OFFSET) / (0.0001 + WCAG21_LUMINANCE_OFFSET);

      expect(contrastWCAG21(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Alpha handling', () => {
    it('should ignore alpha values if present', () => {
      const color1 = xyz(0.2, 0.2, 0.2, 1.0);
      const color2 = xyz(0.8, 0.8, 0.8, 0.5);

      // Manual calculation ignoring alpha: (0.8 + 0.05) / (0.2 + 0.05) = 0.85 / 0.25 = 3.4
      const expected = (0.8 + WCAG21_LUMINANCE_OFFSET) / (0.2 + WCAG21_LUMINANCE_OFFSET);

      expect(contrastWCAG21(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Implementation details', () => {
    it('should use the correct formula with the luminance offset', () => {
      const color1 = xyz(0.25, 0.25, 0.25);
      const color2 = xyz(0.75, 0.75, 0.75);

      // Manual calculation
      const lum1 = 0.25;
      const lum2 = 0.75;
      const maxLum = Math.max(lum1, lum2);
      const minLum = Math.min(lum1, lum2);
      const expected = (maxLum + WCAG21_LUMINANCE_OFFSET) / (minLum + WCAG21_LUMINANCE_OFFSET);

      expect(contrastWCAG21(color1, color2)).toBeCloseTo(expected);
    });
  });
});
