import { describe, expect, it } from 'vitest';
import { contrastDeltaPhiStar } from '../../contrast/delta-phi';
import { lab } from '../../models/lab';
import { φ } from '../../contrast/delta-phi/constants';

describe('Delta Phi* Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate contrast using the golden ratio formula', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(80, 0, 0);

      // Manual calculation: (|50^φ - 80^φ|)^(1/φ) * √2 - 40
      const delta = Math.abs(50 ** φ - 80 ** φ);
      const expected = delta ** (1 / φ) * Math.SQRT2 - 40;

      expect(contrastDeltaPhiStar(color1, color2)).toBeCloseTo(expected);
    });

    it('should return a higher value for greater lightness differences', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(80, 0, 0);
      const color3 = lab(90, 0, 0);

      const contrast1 = contrastDeltaPhiStar(color1, color2);
      const contrast2 = contrastDeltaPhiStar(color1, color3);

      expect(contrast2).toBeGreaterThan(contrast1);
    });

    it('should ignore a* and b* components', () => {
      const color1 = lab(50, 10, 20);
      const color2 = lab(50, -30, 40);

      // The lightness values are the same, so the contrast should be 0
      expect(contrastDeltaPhiStar(color1, color2)).toBe(0);
    });
  });

  describe('Threshold behavior', () => {
    it('should return 0 for contrast below the default threshold', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(52, 0, 0); // Small difference

      // Calculate the actual contrast value
      const delta = Math.abs(50 ** φ - 52 ** φ);
      const actualContrast = delta ** (1 / φ) * Math.SQRT2 - 40;

      // Verify our test assumption that this is below the default threshold of 7.5
      expect(actualContrast).toBeLessThan(7.5);

      // The function should return 0 since it's below threshold
      expect(contrastDeltaPhiStar(color1, color2)).toBe(0);
    });

    it('should use a custom threshold when provided', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(60, 0, 0);

      // Calculate the actual contrast value
      const delta = Math.abs(50 ** φ - 60 ** φ);
      const actualContrast = delta ** (1 / φ) * Math.SQRT2 - 40;

      // Set a threshold higher than the actual contrast
      const highThreshold = actualContrast + 10;
      expect(contrastDeltaPhiStar(color1, color2, highThreshold)).toBe(0);

      // Set a threshold lower than the actual contrast
      const lowThreshold = actualContrast - 10;
      expect(contrastDeltaPhiStar(color1, color2, lowThreshold)).toBeCloseTo(actualContrast);
    });
  });

  describe('Edge cases', () => {
    it('should return 0 for identical colors', () => {
      const color = lab(50, 10, 20);
      expect(contrastDeltaPhiStar(color, color)).toBe(0);
    });

    it('should handle extreme lightness values', () => {
      const black = lab(0, 0, 0);
      const white = lab(100, 0, 0);

      // The contrast between black and white should be high
      const result = contrastDeltaPhiStar(black, white);
      expect(result).toBeGreaterThan(50);
    });

    it('should handle negative lightness values', () => {
      const color1 = lab(-10, 0, 0);
      const color2 = lab(10, 0, 0);

      // Should still calculate a result for negative values
      expect(contrastDeltaPhiStar(color1, color2)).not.toBeNaN();
    });
  });

  describe('Alpha handling', () => {
    it('should ignore alpha values if present', () => {
      const color1 = lab(50, 0, 0, 1.0);
      const color2 = lab(80, 0, 0, 0.5);

      // Manual calculation ignoring alpha
      const delta = Math.abs(50 ** φ - 80 ** φ);
      const expected = delta ** (1 / φ) * Math.SQRT2 - 40;

      expect(contrastDeltaPhiStar(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Implementation details', () => {
    it('should use the correct formula with the golden ratio', () => {
      const color1 = lab(25, 0, 0);
      const color2 = lab(75, 0, 0);

      // Manual calculation using the formula
      const delta = Math.abs(25 ** φ - 75 ** φ);
      const expected = delta ** (1 / φ) * Math.SQRT2 - 40;

      expect(contrastDeltaPhiStar(color1, color2)).toBeCloseTo(expected);
    });
  });
});
