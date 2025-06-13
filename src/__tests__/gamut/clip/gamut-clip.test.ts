import { describe, expect, it } from 'vitest';
import { clipGamut } from '../../../gamut/clip/gamut-clip';
import { rgb } from '../../../models/rgb';
import { hsl } from '../../../models/hsl';
import type { Color } from '../../../foundation';

describe('Gamut Clipping', () => {
  describe('clipGamut', () => {
    it('should not modify colors that are already in gamut', () => {
      const inGamutColor = rgb(0.5, 0.5, 0.5);
      const clipped = clipGamut(inGamutColor);

      expect(clipped.r).toBe(0.5);
      expect(clipped.g).toBe(0.5);
      expect(clipped.b).toBe(0.5);
    });

    it('should clip colors that are out of gamut', () => {
      const outOfGamutColor = rgb(1.5, -0.2, 0.5);
      const clipped = clipGamut(outOfGamutColor);

      expect(clipped.r).toBe(1); // Clipped to max
      expect(clipped.g).toBe(0); // Clipped to min
      expect(clipped.b).toBe(0.5); // Unchanged
    });

    it('should handle colors with null range bounds', () => {
      // Create a mock color with some null bounds
      const colorWithNullBounds = {
        space: 'lab',
        l: 1.5,
        a: -0.2,
        b: 0.5,
        alpha: 0.8,
        channels: {
          l: { range: [null, 1] }, // Only max bound
          a: { range: [0, null] }, // Only min bound
          b: { range: [null, null] } // No bounds
        }
      };

      const clipped = clipGamut(
        colorWithNullBounds as unknown as Color
      ) as unknown as typeof colorWithNullBounds;

      expect(clipped.l).toBe(1); // Clipped to max
      expect(clipped.a).toBe(0); // Clipped to min
      expect(clipped.b).toBe(0.5); // Unchanged
    });

    it('should throw an error if the color has an invalid vector length', () => {
      // Create a mock color with a non-numeric channel
      const colorWithNonNumeric = {
        space: 'hsv',
        h: 1.5,
        s: 'not a number',
        v: 0.5,
        channels: {
          a: { range: [0, 1] },
          b: { range: [0, 1] },
          c: { range: [0, 1] }
        }
      };

      expect(() => clipGamut(colorWithNonNumeric as unknown as Color)).toThrowError(
        'Invalid vector length'
      );
    });

    it('should preserve alpha values', () => {
      const colorWithAlpha = rgb(1.5, 0.5, 0.5, 0.8);
      const clipped = clipGamut(colorWithAlpha);

      expect(clipped.r).toBe(1); // Clipped to max
      expect(clipped.alpha).toBe(0.8); // Alpha preserved
    });

    it('should handle undefined alpha values', () => {
      const colorWithoutAlpha = rgb(1.5, 0.5, 0.5); // No alpha
      const clipped = clipGamut(colorWithoutAlpha);

      expect(clipped.r).toBe(1); // Clipped to max
      expect(clipped.alpha).toBeUndefined(); // No alpha
    });

    it('should clip HSL colors correctly', () => {
      const outOfGamutHSL = hsl(400, 1.5, 1.5);
      const clipped = clipGamut(outOfGamutHSL);

      expect(clipped.h).toBe(360); // H is [0, 360]
      expect(clipped.s).toBe(1); // S is [0, 1]
      expect(clipped.l).toBe(1); // L is [0, 1]
    });
  });
});
