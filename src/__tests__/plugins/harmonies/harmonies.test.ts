import { describe, expect, it } from 'vitest';
import { hsl, HSLColor } from '../../../models/hsl';
import {
  buildHarmony,
  getAnalogous,
  getComplementaries,
  getDoubleSplitComplementaries,
  getMonochromatics,
  getSplitComplementaries,
  getSquares,
  getTetradics,
  getTriadics
} from '../../../plugins/harmonies/src/harmonies';
import {
  ANALOGOUS_HUESHIFT,
  COMPLEMENTARY_HUESHIFT,
  DOUBLE_SPLIT_COMPLEMENTARY_HUESHIFT,
  SPLIT_COMPLEMENTARY_HUESHIFT,
  SQUARE_HUESHIFT,
  TETRADIC_HUESHIFT,
  TRIADIC_HUESHIFT
} from '../../../plugins/harmonies/src/constants';

describe('Harmonies Plugin', () => {
  // Test base color for all tests
  const baseColor = hsl(120, 0.5, 0.6);

  describe('buildHarmony', () => {
    it('should apply hue shifts to the base color', () => {
      const shifts = [0, 30, 60];
      const harmony = buildHarmony(baseColor, shifts);

      expect(harmony.length).toBe(shifts.length);

      // Check each color in the harmony
      harmony.forEach((color, index) => {
        expect(color.space).toBe('hsl');
        expect(color.h).toBe((baseColor.h + shifts[index]) % 360);
        expect(color.s).toBe(baseColor.s);
        expect(color.l).toBe(baseColor.l);
      });
    });

    it('should handle negative hue shifts correctly', () => {
      const shifts = [-30, 0, 30];
      const harmony = buildHarmony(baseColor, shifts);

      expect(harmony.length).toBe(shifts.length);

      // Check each color in the harmony
      harmony.forEach((color, index) => {
        const expectedHue = (baseColor.h + shifts[index]) % 360;
        expect(color.h).toBe(expectedHue < 0 ? expectedHue + 360 : expectedHue);
      });
    });

    it('should preserve alpha value', () => {
      const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
      const shifts = [0, 30, 60];
      const harmony = buildHarmony(colorWithAlpha, shifts);

      harmony.forEach(color => {
        expect(color.alpha).toBe(0.8);
      });
    });
  });

  describe('getAnalogous', () => {
    it('should generate analogous colors', () => {
      const harmony = getAnalogous(baseColor);
      const expected = buildHarmony(baseColor, ANALOGOUS_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getComplementaries', () => {
    it('should generate complementary colors', () => {
      const harmony = getComplementaries(baseColor);
      const expected = buildHarmony(baseColor, COMPLEMENTARY_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getSplitComplementaries', () => {
    it('should generate split complementary colors', () => {
      const harmony = getSplitComplementaries(baseColor);
      const expected = buildHarmony(baseColor, SPLIT_COMPLEMENTARY_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getDoubleSplitComplementaries', () => {
    it('should generate double split complementary colors', () => {
      const harmony = getDoubleSplitComplementaries(baseColor);
      const expected = buildHarmony(baseColor, DOUBLE_SPLIT_COMPLEMENTARY_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getSquares', () => {
    it('should generate square colors', () => {
      const harmony = getSquares(baseColor);
      const expected = buildHarmony(baseColor, SQUARE_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getTetradics', () => {
    it('should generate tetradic colors', () => {
      const harmony = getTetradics(baseColor);
      const expected = buildHarmony(baseColor, TETRADIC_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getTriadics', () => {
    it('should generate triadic colors', () => {
      const harmony = getTriadics(baseColor);
      const expected = buildHarmony(baseColor, TRIADIC_HUESHIFT);

      expect(harmony.length).toBe(expected.length);
      harmony.forEach((color, index) => {
        expect(color.h).toBe(expected[index].h);
        expect(color.s).toBe(expected[index].s);
        expect(color.l).toBe(expected[index].l);
      });
    });
  });

  describe('getMonochromatics', () => {
    it('should generate monochromatic colors', () => {
      const harmony = getMonochromatics(baseColor);

      // Should return 4 colors
      expect(harmony.length).toBe(4);

      // All colors should have the same hue and saturation
      harmony.forEach(color => {
        expect(color.h).toBe(baseColor.h);
        expect(color.s).toBe(baseColor.s);
        // Lightness should be different but within 0-1 range
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(1);
      });

      // Colors should be ordered from darkest to lightest
      for (let i = 0; i < harmony.length - 1; i++) {
        expect(harmony[i].l).toBeLessThan(harmony[i + 1].l);
      }
    });

    it('should handle edge cases for very light colors', () => {
      const lightColor = hsl(120, 0.5, 0.9);
      const harmony = getMonochromatics(lightColor);

      // All lightness values should be within 0-1 range
      harmony.forEach(color => {
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(1);
      });
    });

    it('should handle edge cases for very dark colors', () => {
      const darkColor = hsl(120, 0.5, 0.1);
      const harmony = getMonochromatics(darkColor);

      // All lightness values should be within 0-1 range
      harmony.forEach(color => {
        expect(color.l).toBeGreaterThanOrEqual(0);
        expect(color.l).toBeLessThanOrEqual(1);
      });
    });
  });
});
