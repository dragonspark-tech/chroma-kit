import '../../../conversion/register-all-conversions';
import { describe, expect, it } from 'vitest';
import { gamutMapMinDeltaE } from '../../../gamut/min-deltae/gamut-min-deltae';
import { oklch } from '../../../models/oklch';
import { convertColor } from '../../../conversion/conversion';
import { isInGamut } from '../../../gamut/in-gamut';

describe('Gamut Mapping with Minimum Delta E', () => {
  describe('gamutMapMinDeltaE', () => {
    it('should return white when lightness is >= 1', () => {
      const color = oklch(1.1, 0.2, 30);
      const mapped = gamutMapMinDeltaE(color, 'rgb');

      // Should be white (or very close to it)
      expect(mapped.r).toBeCloseTo(1);
      expect(mapped.g).toBeCloseTo(1);
      expect(mapped.b).toBeCloseTo(1);
    });

    it('should return black when lightness is <= 0', () => {
      const color = oklch(-0.1, 0.2, 30);
      const mapped = gamutMapMinDeltaE(color, 'rgb');

      // Should be black (or very close to it)
      expect(mapped.r).toBeCloseTo(0);
      expect(mapped.g).toBeCloseTo(0);
      expect(mapped.b).toBeCloseTo(0);
    });

    it('should preserve alpha when returning white or black', () => {
      const whiteColor = oklch(1.1, 0.2, 30, 0.5);
      const blackColor = oklch(-0.1, 0.2, 30, 0.7);

      const mappedWhite = gamutMapMinDeltaE(whiteColor, 'rgb');
      const mappedBlack = gamutMapMinDeltaE(blackColor, 'rgb');

      expect(mappedWhite.alpha).toBe(0.5);
      expect(mappedBlack.alpha).toBe(0.7);
    });

    it('should return the original color if it is already in gamut', () => {
      // Create a color that's already in the RGB gamut
      const inGamutColor = oklch(0.5, 0.1, 30);
      const mapped = gamutMapMinDeltaE(inGamutColor, 'rgb');

      // Convert the original color to RGB for comparison
      const originalAsRGB = convertColor(inGamutColor, 'rgb');

      // The mapped color should be the same as the original converted to RGB
      expect(mapped.r).toBeCloseTo(originalAsRGB.r);
      expect(mapped.g).toBeCloseTo(originalAsRGB.g);
      expect(mapped.b).toBeCloseTo(originalAsRGB.b);

      // Verify that the original color was indeed in gamut
      expect(isInGamut(originalAsRGB)).toBe(true);
    });

    it('should find a color with similar appearance when original is out of gamut', () => {
      // Create a color with high chroma that's likely out of the RGB gamut
      const outOfGamutColor = oklch(0.7, 0.4, 30);
      const originalAsRGB = convertColor(outOfGamutColor, 'rgb');

      // Verify that the original color is indeed out of gamut
      expect(isInGamut(originalAsRGB)).toBe(false);

      // Map the color to the RGB gamut
      const mapped = gamutMapMinDeltaE(outOfGamutColor, 'rgb');

      // The mapped color should be in gamut
      expect(isInGamut(mapped)).toBe(true);

      // The mapped color should preserve lightness and hue as much as possible
      const mappedAsOKLCh = convertColor(mapped, 'oklch');
      expect(mappedAsOKLCh.l).toBeCloseTo(0.6831, 1);
      expect(mappedAsOKLCh.h).toBeCloseTo(30.1816, 1);

      // The chroma should be reduced to fit in gamut
      expect(mappedAsOKLCh.c).toBeLessThan(outOfGamutColor.c);
    });

    it('should work with different target color spaces', () => {
      const color = oklch(0.7, 0.4, 30);

      // Map to RGB
      const mappedToRGB = gamutMapMinDeltaE(color, 'rgb');
      expect(mappedToRGB.space).toBe('rgb');
      expect(isInGamut(mappedToRGB)).toBe(true);

      // Map to P3
      const mappedToP3 = gamutMapMinDeltaE(color, 'p3');
      expect(mappedToP3.space).toBe('p3');
      expect(isInGamut(mappedToP3)).toBe(true);

      // Map to Lab
      const mappedToLab = gamutMapMinDeltaE(color, 'lab');
      expect(mappedToLab.space).toBe('lab');
      expect(isInGamut(mappedToLab)).toBe(true);
    });
  });
});
