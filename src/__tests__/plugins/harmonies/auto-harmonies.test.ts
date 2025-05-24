import { describe, expect, it } from 'vitest';
import { harmony, HarmonyType } from '../../../plugins/harmonies/src/auto-harmonies';
import { hsl } from '../../../models/hsl';
import {
  getAnalogous,
  getComplementaries,
  getDoubleSplitComplementaries,
  getMonochromatics,
  getSplitComplementaries,
  getSquares,
  getTetradics,
  getTriadics
} from '../../../plugins/harmonies/src/harmonies';
import { ColorSpace } from '../../../foundation';

describe('Auto Harmonies', () => {
  // Test color for all tests
  const testColor = hsl(120, 0.5, 0.6);
  const testColorString = 'hsl(120, 50%, 60%)';

  describe('harmony function', () => {
    it('should accept a color object as input', () => {
      const result = harmony(testColor, 'Complementary', 'hsl');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2); // Complementary harmony has 2 colors
    });

    it('should accept a color string as input', () => {
      const result = harmony(testColorString, 'Complementary', 'hsl');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2); // Complementary harmony has 2 colors
    });

    it('should convert colors to the requested output space', () => {
      const result = harmony(testColor, 'Complementary', 'srgb');
      expect(result[0].space).toBe('srgb');
      expect(result[1].space).toBe('srgb');
    });

    it('should throw an error for unknown harmony type', () => {
      // @ts-ignore - Testing invalid input
      expect(() => harmony(testColor, 'InvalidHarmony', 'hsl')).toThrow('Unknown harmony');
    });

    // Test each harmony type
    const harmonyTypes: HarmonyType[] = [
      'Analogous',
      'Complementary',
      'SplitComplementary',
      'DoubleSplitComplementary',
      'Square',
      'Tetradic',
      'Triadic',
      'Monochromatic'
    ];

    harmonyTypes.forEach(type => {
      it(`should generate ${type} harmony correctly`, () => {
        const result = harmony(testColor, type, 'hsl');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);

        // Verify the correct harmony function was called by checking the length
        let expectedLength: number;
        switch (type) {
          case 'Analogous':
            expectedLength = getAnalogous(testColor).length;
            break;
          case 'Complementary':
            expectedLength = getComplementaries(testColor).length;
            break;
          case 'SplitComplementary':
            expectedLength = getSplitComplementaries(testColor).length;
            break;
          case 'DoubleSplitComplementary':
            expectedLength = getDoubleSplitComplementaries(testColor).length;
            break;
          case 'Square':
            expectedLength = getSquares(testColor).length;
            break;
          case 'Tetradic':
            expectedLength = getTetradics(testColor).length;
            break;
          case 'Triadic':
            expectedLength = getTriadics(testColor).length;
            break;
          case 'Monochromatic':
            expectedLength = getMonochromatics(testColor).length;
            break;
          default:
            expectedLength = 0;
        }

        expect(result.length).toBe(expectedLength);
      });
    });

    // Test with different output color spaces
    const colorSpaces: ColorSpace[] = ['hsl', 'srgb', 'lab', 'lch', 'oklab', 'oklch'];
    colorSpaces.forEach(space => {
      it(`should output colors in ${space} color space`, () => {
        const result = harmony(testColor, 'Complementary', space);
        result.forEach(color => {
          expect(color.space).toBe(space);
        });
      });
    });
  });
});
