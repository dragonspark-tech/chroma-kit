import { describe, expect, it } from 'vitest';
import {
  findClosestRadixFamily,
  findClosestTailwindFamily
} from '../../../plugins/palettes/src/support/find-shade';
import { TailwindColors } from '../../../plugins/tailwind';
import { oklch } from '../../../models/oklch';
import { RadixColors } from '../../../plugins/radix/src/colors';

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

  describe('findClosestRadixFamily', () => {
    it('should find the right family', () => {
      const amberDark = oklch(0.183564, 0.012647, 77.267509);
      const blueLight = oklch(0.993194, 0.003287, 247.643574);
      const crimsonLightAlpha = oklch(0.586109, 0.263637, 14.747349, 0.083);
      const grassDarkAlpha = oklch(0.904317, 0.19678, 148.259541, 0.358);

      expect(findClosestRadixFamily(amberDark, RadixColors).family).toBe('Amber');
      expect(findClosestRadixFamily(blueLight, RadixColors).family).toBe('Blue');
      expect(findClosestRadixFamily(crimsonLightAlpha, RadixColors).family).toBe('Crimson');
      expect(findClosestRadixFamily(grassDarkAlpha, RadixColors).family).toBe('Grass');
    });
  });
});
