import { describe, expect, it } from 'vitest';
import {
  alphaBlendRGBColor,
  applyBlackSoftClamp,
  deriveYFromRGBColor,
  inputConformsToClamp
} from '../../contrast/apca/support';
import { rgb } from '../../models/rgb';
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
      const white = rgb(1, 1, 1);
      const black = rgb(0, 0, 0);
      const gray = rgb(0.5, 0.5, 0.5);

      expect(deriveYFromRGBColor(white)).toBeCloseTo(1);
      expect(deriveYFromRGBColor(black)).toBeCloseTo(0);
      expect(deriveYFromRGBColor(gray)).toBeGreaterThan(0);
      expect(deriveYFromRGBColor(gray)).toBeLessThan(1);
    });

    it('should weight RGB channels according to their luminance contribution', () => {
      const red = rgb(1, 0, 0);
      const green = rgb(0, 1, 0);
      const blue = rgb(0, 0, 1);

      // Green should have the highest luminance contribution
      expect(deriveYFromRGBColor(green)).toBeGreaterThan(deriveYFromRGBColor(red));
      expect(deriveYFromRGBColor(green)).toBeGreaterThan(deriveYFromRGBColor(blue));
    });
  });

  describe('alphaBlendRGBColor', () => {
    it('should blend colors based on alpha value', () => {
      const white = rgb(1, 1, 1);
      const black = rgb(0, 0, 0);
      const transparentWhite = rgb(1, 1, 1, 0.5);

      const result = alphaBlendRGBColor(transparentWhite, black);

      // Should be a gray color (50% blend)
      expect(result.r).toBeCloseTo(0.5);
      expect(result.g).toBeCloseTo(0.5);
      expect(result.b).toBeCloseTo(0.5);
    });

    it('should handle undefined alpha value by defaulting to 1.0', () => {
      const white = rgb(1, 1, 1); // No alpha specified
      const black = rgb(0, 0, 0);

      const result = alphaBlendRGBColor(white, black);

      // Should be fully opaque white (alpha defaulted to 1.0)
      expect(result.r).toBeCloseTo(1);
      expect(result.g).toBeCloseTo(1);
      expect(result.b).toBeCloseTo(1);
    });

    it('should clamp alpha values to the range [0, 1]', () => {
      const white = rgb(1, 1, 1);
      const black = rgb(0, 0, 0);

      // Test with alpha > 1
      const overAlpha = rgb(1, 1, 1, 1.5);
      const overResult = alphaBlendRGBColor(overAlpha, black);

      // Should be treated as alpha = 1 (fully opaque)
      expect(overResult.r).toBeCloseTo(1);

      // Test with alpha < 0
      const underAlpha = rgb(1, 1, 1, -0.5);
      const underResult = alphaBlendRGBColor(underAlpha, black);

      // Should be treated as alpha = 0 (fully transparent, so background shows through)
      expect(underResult.r).toBeCloseTo(0);
    });

    it('should clamp resulting RGB values to the range [0, 1]', () => {
      // Create colors that might result in out-of-range values when blended
      const superWhite = rgb(1.5, 1.5, 1.5, 0.5);
      const superBlack = rgb(-0.5, -0.5, -0.5);

      const result = alphaBlendRGBColor(superWhite, superBlack);

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
