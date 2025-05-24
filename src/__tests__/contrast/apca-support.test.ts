import { describe, expect, it } from 'vitest';
import {
  alphaBlendsRGBColor,
  applyBlackSoftClamp,
  deriveYFromRGBColor,
  inputConformsToClamp
} from '../../contrast/apca/support';
import { srgb } from '../../models/srgb';
import {
  APCA_INPUT_CLAMP_MAX,
  APCA_INPUT_CLAMP_MIN,
  SA98G_BLACK_THRESHOLD
} from '../../contrast/apca/constants';

describe('APCA Support Functions', () => {
  describe('inputConformsToClamp', () => {
    it('should return true for values within the acceptable range', () => {
      expect(inputConformsToClamp(0.5)).toBe(true);
      expect(inputConformsToClamp(0)).toBe(true);
      expect(inputConformsToClamp(1)).toBe(true);
    });

    it('should return false for values outside the acceptable range', () => {
      expect(inputConformsToClamp(-0.1)).toBe(false);
      expect(inputConformsToClamp(APCA_INPUT_CLAMP_MAX + 0.1)).toBe(false);
    });
  });

  describe('applyBlackSoftClamp', () => {
    it('should return the input value if above the black threshold', () => {
      const value = SA98G_BLACK_THRESHOLD + 0.01;
      expect(applyBlackSoftClamp(value)).toBe(value);
    });

    it('should adjust values below the black threshold', () => {
      const value = SA98G_BLACK_THRESHOLD - 0.01;
      expect(applyBlackSoftClamp(value)).toBeGreaterThan(value);
    });
  });

  describe('deriveYFromRGBColor', () => {
    it('should calculate luminance from RGB values', () => {
      const white = srgb(1, 1, 1);
      const black = srgb(0, 0, 0);
      const gray = srgb(0.5, 0.5, 0.5);

      expect(deriveYFromRGBColor(white)).toBeCloseTo(1);
      expect(deriveYFromRGBColor(black)).toBeCloseTo(0);
      expect(deriveYFromRGBColor(gray)).toBeGreaterThan(0);
      expect(deriveYFromRGBColor(gray)).toBeLessThan(1);
    });

    it('should weight RGB channels according to their luminance contribution', () => {
      const red = srgb(1, 0, 0);
      const green = srgb(0, 1, 0);
      const blue = srgb(0, 0, 1);

      // Green should have the highest luminance contribution
      expect(deriveYFromRGBColor(green)).toBeGreaterThan(deriveYFromRGBColor(red));
      expect(deriveYFromRGBColor(green)).toBeGreaterThan(deriveYFromRGBColor(blue));
    });
  });

  describe('alphaBlendsRGBColor', () => {
    it('should blend colors based on alpha value', () => {
      const white = srgb(1, 1, 1);
      const black = srgb(0, 0, 0);
      const transparentWhite = srgb(1, 1, 1, 0.5);

      const result = alphaBlendsRGBColor(transparentWhite, black);

      // Should be a gray color (50% blend)
      expect(result.r).toBeCloseTo(0.5);
      expect(result.g).toBeCloseTo(0.5);
      expect(result.b).toBeCloseTo(0.5);
    });

    it('should handle undefined alpha value by defaulting to 1.0', () => {
      const white = srgb(1, 1, 1); // No alpha specified
      const black = srgb(0, 0, 0);

      const result = alphaBlendsRGBColor(white, black);

      // Should be fully opaque white (alpha defaulted to 1.0)
      expect(result.r).toBeCloseTo(1);
      expect(result.g).toBeCloseTo(1);
      expect(result.b).toBeCloseTo(1);
    });

    it('should clamp alpha values to the range [0, 1]', () => {
      const white = srgb(1, 1, 1);
      const black = srgb(0, 0, 0);

      // Test with alpha > 1
      const overAlpha = srgb(1, 1, 1, 1.5);
      const overResult = alphaBlendsRGBColor(overAlpha, black);

      // Should be treated as alpha = 1 (fully opaque)
      expect(overResult.r).toBeCloseTo(1);

      // Test with alpha < 0
      const underAlpha = srgb(1, 1, 1, -0.5);
      const underResult = alphaBlendsRGBColor(underAlpha, black);

      // Should be treated as alpha = 0 (fully transparent, so background shows through)
      expect(underResult.r).toBeCloseTo(0);
    });

    it('should clamp resulting RGB values to the range [0, 1]', () => {
      // Create colors that might result in out-of-range values when blended
      const superWhite = srgb(1.5, 1.5, 1.5, 0.5);
      const superBlack = srgb(-0.5, -0.5, -0.5);

      const result = alphaBlendsRGBColor(superWhite, superBlack);

      // Results should be clamped to [0, 1]
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(1);
      expect(result.g).toBeGreaterThanOrEqual(0);
      expect(result.g).toBeLessThanOrEqual(1);
      expect(result.b).toBeGreaterThanOrEqual(0);
      expect(result.b).toBeLessThanOrEqual(1);
    });
  });
});
