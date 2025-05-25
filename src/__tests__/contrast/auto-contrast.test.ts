import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import { contrast, type ContrastAlgorithm } from '../../contrast/auto-contrast';
import { rgb } from '../../models/rgb';

describe('Auto Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate contrast using the default APCA algorithm', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      // APCA contrast between black and white should be a high positive value
      const result = contrast(black, white);
      expect(result).toBeGreaterThan(100); // APCA contrast for black on white is around 106%
    });

    it('should accept string color values', () => {
      const result = contrast('#000000', '#FFFFFF');
      expect(result).toBeGreaterThan(100);
    });
  });

  describe('Algorithm selection', () => {
    it('should use APCA algorithm when specified', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      const result = contrast(black, white, 'APCA');
      expect(result).toBeGreaterThan(100);
    });

    it('should use DeltaL* algorithm when specified', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      const result = contrast(black, white, 'DeltaL*');
      expect(result).toBeCloseTo(100); // DeltaL* between black and white should be close to 100
    });

    it('should use DeltaPhi* algorithm when specified', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      const result = contrast(black, white, 'DeltaPhi*');
      expect(result).toBeGreaterThanOrEqual(100); // DeltaPhi* between black and white should be at least 100
    });

    it('should use Michelson algorithm when specified', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      const result = contrast(black, white, 'Michelson');
      expect(result).toBeCloseTo(1); // Michelson contrast between black and white should be close to 1
    });

    it('should use WCAG21 algorithm when specified', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      const result = contrast(black, white, 'WCAG21');
      expect(result).toBeCloseTo(21); // WCAG 2.1 contrast between black and white should be close to 21:1
    });

    it('should use Weber algorithm when specified', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      const result = contrast(black, white, 'Weber');
      expect(result).toBeGreaterThan(0); // Weber contrast between black and white should be positive
    });
  });

  describe('Error handling', () => {
    it('should throw an error for unknown algorithms', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      // @ts-expect-error Testing invalid algorithm
      expect(() => contrast(black, white, 'InvalidAlgorithm')).toThrow('Unknown algorithm');
    });
  });

  describe('Edge cases', () => {
    it('should handle identical colors', () => {
      const gray = rgb(0.5, 0.5, 0.5);

      // Contrast between identical colors should be 0 or very close to 0 for all algorithms
      const algorithms: ContrastAlgorithm[] = ['APCA', 'DeltaL*', 'DeltaPhi*', 'Michelson', 'WCAG21', 'Weber'];

      for (const algorithm of algorithms) {
        const result = contrast(gray, gray, algorithm);
        expect(result).toBeCloseTo(0, 1);
      }
    });

    it('should handle colors with alpha transparency', () => {
      const black = rgb(0, 0, 0, 1);
      const transparentWhite = rgb(1, 1, 1, 0.5);

      // Test that alpha is properly handled
      const result = contrast(transparentWhite, black, 'APCA');
      expect(result).not.toBeCloseTo(0);
    });
  });
});
