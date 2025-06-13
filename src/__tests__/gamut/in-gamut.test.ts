import '../../conversion/register-all-conversions';
import { describe, expect, it } from 'vitest';
import { isColorSpaceUnbound, isInGamut } from '../../gamut/in-gamut';
import { rgb } from '../../models/rgb';
import type { Color } from '../../foundation';

describe('Gamut Utilities', () => {
  describe('isColorSpaceUnbound', () => {
    it('should return true if all channel ranges are null', () => {
      // Create a mock color with all null ranges
      const unboundColor = {
        space: 'hsv',
        channels: {
          h: { range: [null, null] },
          s: { range: [null, null] },
          v: { range: [null, null] }
        }
      };

      expect(isColorSpaceUnbound(unboundColor as unknown as Color)).toBe(true);
    });

    it('should return false if any channel range has bounds', () => {
      // Create a mock color with some bounded ranges
      const boundedColor = {
        space: 'hsv',
        channels: {
          h: { range: [null, null] },
          s: { range: [0, 1] },
          v: { range: [null, null] }
        }
      };

      expect(isColorSpaceUnbound(boundedColor as unknown as Color)).toBe(false);
    });
  });

  describe('isInGamut', () => {
    it('should return true for unbound color spaces', () => {
      // Create a mock color with all null ranges
      const unboundColor = {
        space: 'test',
        a: 0.5,
        b: 0.2,
        c: 0.3,
        channels: {
          a: { range: [null, null] },
          b: { range: [null, null] },
          c: { range: [null, null] }
        }
      };

      expect(isInGamut(unboundColor as unknown as Color)).toBe(true);
    });

    it('should return true if all channel values are within their ranges', () => {
      const inGamutColor = rgb(0.5, 0.5, 0.5);
      expect(isInGamut(inGamutColor)).toBe(true);
    });

    it('should return false if any channel value is outside its range', () => {
      const outOfGamutColor = rgb(1.5, 0.5, 0.5);
      expect(isInGamut(outOfGamutColor)).toBe(false);
    });

    it('should handle non-numeric channel values', () => {
      // Create a mock color with a non-numeric channel
      const colorWithNonNumeric = {
        space: 'test',
        a: 0.5,
        b: 'not a number',
        c: 0.3,
        channels: {
          a: { range: [0, 1] },
          b: { range: [0, 1] },
          c: { range: [0, 1] }
        }
      };

      expect(isInGamut(colorWithNonNumeric as unknown as Color)).toBe(true);
    });
  });
});
