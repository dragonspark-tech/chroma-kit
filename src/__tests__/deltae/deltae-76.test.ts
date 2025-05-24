import '../../conversion/register-conversions';

import { describe, expect, it } from 'vitest';
import { deltaE76 } from '../../deltae/deltae-76';
import { lab, type LabColor } from '../../models/lab';
import { srgb, type sRGBColor } from '../../models/srgb';
import { hsl, type HSLColor } from '../../models/hsl';

describe('Delta E 76', () => {
  describe('Basic functionality', () => {
    it('should calculate the Euclidean distance between two Lab colors', () => {
      const color1 = lab(0.5, 0.1, 0.1);
      const color2 = lab(0.6, 0.2, 0.2);

      // Calculate expected result: sqrt((0.5-0.6)^2 + (0.1-0.2)^2 + (0.1-0.2)^2)
      // = sqrt(0.01 + 0.01 + 0.01) = sqrt(0.03) ≈ 0.1732
      const expected = Math.sqrt(0.03);

      expect(deltaE76(color1, color2)).toBeCloseTo(expected);
    });

    it('should return 0 for identical colors', () => {
      const color = lab(0.5, 0.1, 0.1);
      expect(deltaE76(color, color)).toBe(0);
    });

    it('should work with sRGB colors', () => {
      const color1 = srgb(1, 0, 0);
      const color2 = srgb(0, 1, 0);

      // Calculate expected result: sqrt((1-0)^2 + (0-1)^2 + (0-0)^2)
      // = sqrt(1 + 1 + 0) = sqrt(2) ≈ 1.4142
      const expected = Math.sqrt(2);

      expect(deltaE76(color1, color2)).toBeCloseTo(expected);
    });

    it('should work with HSL colors', () => {
      const color1 = hsl(0, 1, 0.5);
      const color2 = hsl(120, 1, 0.5);

      // Calculate expected result: sqrt((0-120)^2 + (1-1)^2 + (0.5-0.5)^2)
      // = sqrt(14400 + 0 + 0) = 120
      const expected = 120;

      expect(deltaE76(color1, color2)).toBe(expected);
    });
  });

  describe('Edge cases', () => {
    it('should ignore alpha values if present', () => {
      const color1 = lab(0.5, 0.1, 0.1, 1.0);
      const color2 = lab(0.6, 0.2, 0.2, 0.5);

      // Calculate expected result: sqrt((0.5-0.6)^2 + (0.1-0.2)^2 + (0.1-0.2)^2)
      // = sqrt(0.01 + 0.01 + 0.01) = sqrt(0.03) ≈ 0.1732
      const expected = Math.sqrt(0.03);

      expect(deltaE76(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle null or undefined properties', () => {
      const color1 = { space: 'lab', l: 0.5, a: 0.1, b: null } as unknown as LabColor;
      const color2 = { space: 'lab', l: 0.6, a: 0.2, b: undefined } as unknown as LabColor;

      // Only l and a should be compared, b is null/undefined
      // sqrt((0.5-0.6)^2 + (0.1-0.2)^2) = sqrt(0.01 + 0.01) = sqrt(0.02) ≈ 0.1414
      const expected = Math.sqrt(0.02);

      expect(deltaE76(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle colors with different properties', () => {
      // This is a contrived example to test the function's robustness
      const color1 = { space: 'xyz', x: 1, y: 2, z: 3, alpha: 0.5 } as unknown as LabColor;
      const color2 = { space: 'lab', x: 2, y: 3, z: 4 } as unknown as LabColor;

      // Calculate expected result: sqrt((1-2)^2 + (2-3)^2 + (3-4)^2)
      // = sqrt(1 + 1 + 1) = sqrt(3) ≈ 1.7321
      const expected = Math.sqrt(3);

      expect(deltaE76(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle colors with no matching properties', () => {
      const color1 = { space: 'custom1', a: 1, b: 2, c: 3 } as unknown as LabColor;
      const color2 = { space: 'custom1', x: 2, y: 3, z: 4 } as unknown as LabColor;

      // No matching properties, so the distance should be 0
      expect(deltaE76(color1, color2)).toBe(0);
    });
  });

  describe('Implementation details', () => {
    it('should use the colorVectorMappings to determine which properties to compare', () => {
      // Create colors with extra properties that should be ignored
      const color1 = Object.assign(srgb(1, 0, 0), { extra: 5 });
      const color2 = Object.assign(srgb(0, 1, 0), { extra: 10 });

      // Only r, g, b should be compared, extra should be ignored
      // sqrt((1-0)^2 + (0-1)^2 + (0-0)^2) = sqrt(2) ≈ 1.4142
      const expected = Math.sqrt(2);

      expect(deltaE76(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle colors with different spaces correctly', () => {
      const color1: sRGBColor = srgb(1, 0, 0);
      const color2: LabColor = lab(0.5, 0.1, 0.1);

      expect(deltaE76(color1, color2)).toBe(0.1);
    });
  });
});
