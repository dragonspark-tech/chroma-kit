import { describe, expect, it } from 'vitest';
import { findClosestTailwindFamily } from '../../../plugins/palettes/src/support/find-shade';
import { TailwindColors } from '../../../plugins/tailwind';
import { oklch } from '../../../models/oklch';

describe('Color Palettes Plugin - Shade deltas', () => {
  describe('findClosestTailwindFamily', () => {
    it('should find the right family', () => {
      const lime = oklch(0.7, 0.2068, 139.76);
      const orange = oklch(0.5941, 0.1911, 29.23);
      const blue = oklch(0.4941, 0.2507, 264.052);
      const purple = oklch(0.4941, 0.2131, 311.29);

      expect(findClosestTailwindFamily(lime, TailwindColors).family).toBe('Lime');
      expect(findClosestTailwindFamily(orange, TailwindColors).family).toBe('Orange');
      expect(findClosestTailwindFamily(blue, TailwindColors).family).toBe('Blue');
      expect(findClosestTailwindFamily(purple, TailwindColors).family).toBe('Purple');
    });
  });
});
