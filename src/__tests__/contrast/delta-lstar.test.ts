import { describe, expect, it } from 'vitest';
import { contrastDeltaLStar } from '../../contrast/delta-lstar';
import { lab } from '../../models/lab';

describe('Delta L* Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate the absolute difference between lightness values', () => {
      const color1 = lab(50, 0, 0);
      const color2 = lab(80, 0, 0);

      // The difference should be |50 - 80| = 30
      expect(contrastDeltaLStar(color1, color2)).toBe(30);
    });

    it('should return the same result regardless of order', () => {
      const color1 = lab(30, 10, 20);
      const color2 = lab(70, -10, -20);

      // The difference should be |30 - 70| = 40, regardless of order
      expect(contrastDeltaLStar(color1, color2)).toBe(40);
      expect(contrastDeltaLStar(color2, color1)).toBe(40);
    });

    it('should ignore a* and b* components', () => {
      const color1 = lab(50, 10, 20);
      const color2 = lab(50, -30, 40);

      // The lightness values are the same, so the contrast should be 0
      expect(contrastDeltaLStar(color1, color2)).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should return 0 for identical colors', () => {
      const color = lab(50, 10, 20);
      expect(contrastDeltaLStar(color, color)).toBe(0);
    });

    it('should handle extreme lightness values', () => {
      const black = lab(0, 0, 0);
      const white = lab(100, 0, 0);

      // The difference between black and white should be 100
      expect(contrastDeltaLStar(black, white)).toBe(100);
    });

    it('should handle negative lightness values', () => {
      const color1 = lab(-10, 0, 0);
      const color2 = lab(10, 0, 0);

      // The difference should be |-10 - 10| = 20
      expect(contrastDeltaLStar(color1, color2)).toBe(20);
    });
  });

  describe('Alpha handling', () => {
    it('should ignore alpha values if present', () => {
      const color1 = lab(50, 0, 0, 1.0);
      const color2 = lab(80, 0, 0, 0.5);

      // The difference should be |50 - 80| = 30, ignoring alpha
      expect(contrastDeltaLStar(color1, color2)).toBe(30);
    });
  });

  describe('Implementation details', () => {
    it('should use the correct formula', () => {
      const color1 = lab(25, 0, 0);
      const color2 = lab(75, 0, 0);

      // Manual calculation
      const expected = Math.abs(color1.l - color2.l);

      expect(contrastDeltaLStar(color1, color2)).toBe(expected);
    });
  });
});
