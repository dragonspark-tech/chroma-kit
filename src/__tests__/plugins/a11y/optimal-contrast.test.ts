import { describe, expect, it } from 'vitest';
import {
  getOptimalColorForContrast,
  getOptimalColorForContrastAPCA,
  getOptimalColorForContrastWCAG21
} from '../../../plugins/a11y/src/utils/optimal-contrast';
import { rgb } from '../../../models/rgb';
import { contrastAPCA } from '../../../contrast/apca';
import { contrastWCAG21 } from '../../../contrast/wcag21';
import { rgbToXYZ } from '../../../models/rgb';

describe('A11y Plugin - Optimal Contrast Utils', () => {
  describe('getOptimalColorForContrastAPCA', () => {
    it('should find a color with the target APCA contrast', () => {
      const background = rgb(1, 1, 1); // White background
      const foreground = rgb(0.5, 0.5, 0.5); // Gray foreground
      const targetContrast = 60; // Target APCA contrast

      const result = getOptimalColorForContrastAPCA(foreground, background, targetContrast);

      // Check that the result is a valid RGB color
      expect(result.space).toBe('rgb');
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(1);
      expect(result.g).toBeGreaterThanOrEqual(0);
      expect(result.g).toBeLessThanOrEqual(1);
      expect(result.b).toBeGreaterThanOrEqual(0);
      expect(result.b).toBeLessThanOrEqual(1);

      // Check that the contrast is close to the target
      const actualContrast = contrastAPCA(result, background);
      expect(Math.abs(actualContrast - targetContrast)).toBeLessThan(5); // Allow some tolerance
    });

    it('should preserve hue and saturation', () => {
      const background = rgb(1, 1, 1); // White background
      const foreground = rgb(1, 0, 0); // Red foreground
      const targetContrast = 60; // Target APCA contrast

      const result = getOptimalColorForContrastAPCA(foreground, background, targetContrast);

      // The result should still be reddish (r component should be higher than g and b)
      expect(result.r).toBeGreaterThan(result.g);
      expect(result.r).toBeGreaterThan(result.b);
    });

    it('should handle negative contrast targets', () => {
      const background = rgb(0, 0, 0); // Black background
      const foreground = rgb(0.5, 0.5, 0.5); // Gray foreground
      const targetContrast = -60; // Negative target APCA contrast

      const result = getOptimalColorForContrastAPCA(foreground, background, targetContrast);

      // Check that the contrast is close to the target
      const actualContrast = contrastAPCA(result, background);
      expect(Math.abs(actualContrast - targetContrast)).toBeLessThan(5); // Allow some tolerance
    });

    it('should handle cases where very low contrasts are present, such as dark-on-dark (WCAG21)', () => {
      const background = rgb(0.02, 0.02, 0.02);
      const foreground = rgb(0.1, 0.1, 0.1);
      const targetContrast = 4.5;

      const result = getOptimalColorForContrastWCAG21(foreground, background, targetContrast);

      const originalContrast = contrastWCAG21(rgbToXYZ(foreground), rgbToXYZ(background));
      const newContrast = contrastWCAG21(rgbToXYZ(result), rgbToXYZ(background));
      expect(newContrast).toBeGreaterThan(originalContrast);
      expect(newContrast).toBeCloseTo(targetContrast, 0);
    });

    // Additional test with more extreme values to try to cover line 70
    it('should handle extreme cases for increasing contrast', () => {
      const background = rgb(0.95, 0.95, 0.95); // Very light background
      const foreground = rgb(0.94, 0.94, 0.94); // Almost identical to background (very low contrast)
      const targetContrast = 90; // Very high target contrast

      const result = getOptimalColorForContrastAPCA(foreground, background, targetContrast);

      // The result should have much higher contrast than the original
      const originalContrast = contrastAPCA(foreground, background);
      const newContrast = contrastAPCA(result, background);
      expect(Math.abs(newContrast)).toBeGreaterThan(Math.abs(originalContrast));
    });

    // Additional test with more extreme values to try to cover line 78
    it('should handle extreme cases for decreasing contrast', () => {
      const background = rgb(0, 0, 0); // Black background
      const foreground = rgb(1, 1, 1); // White foreground (maximum contrast)
      const targetContrast = -30; // Low target contrast

      const result = getOptimalColorForContrastAPCA(foreground, background, targetContrast);

      // The result should have much lower contrast than the original
      const originalContrast = contrastAPCA(foreground, background);
      const newContrast = contrastAPCA(result, background);
      expect(Math.abs(newContrast)).toBeLessThan(Math.abs(originalContrast));
    });
  });

  describe('getOptimalColorForContrastWCAG21', () => {
    it('should find a color with the target WCAG 2.1 contrast', () => {
      const background = rgb(1, 1, 1); // White background
      const foreground = rgb(0.5, 0.5, 0.5); // Gray foreground
      const targetContrast = 4.5; // Target WCAG 2.1 contrast

      const result = getOptimalColorForContrastWCAG21(foreground, background, targetContrast);

      // Check that the result is a valid RGB color
      expect(result.space).toBe('rgb');
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(1);
      expect(result.g).toBeGreaterThanOrEqual(0);
      expect(result.g).toBeLessThanOrEqual(1);
      expect(result.b).toBeGreaterThanOrEqual(0);
      expect(result.b).toBeLessThanOrEqual(1);

      // Check that the contrast is close to the target
      const actualContrast = contrastWCAG21(rgbToXYZ(result), rgbToXYZ(background));
      expect(Math.abs(actualContrast - targetContrast)).toBeLessThan(0.5); // Allow some tolerance
    });

    it('should preserve hue and saturation', () => {
      const background = rgb(1, 1, 1); // White background
      const foreground = rgb(1, 0, 0); // Red foreground
      const targetContrast = 4.5; // Target WCAG 2.1 contrast

      const result = getOptimalColorForContrastWCAG21(foreground, background, targetContrast);

      // The result should still be reddish (r component should be higher than g and b)
      expect(result.r).toBeGreaterThan(result.g);
      expect(result.r).toBeGreaterThan(result.b);
    });
  });

  describe('getOptimalColorForContrast', () => {
    it('should use APCA by default', () => {
      const background = rgb(1, 1, 1); // White background
      const foreground = rgb(0.5, 0.5, 0.5); // Gray foreground
      const targetContrast = 60; // Target contrast

      const result = getOptimalColorForContrast(foreground, background, targetContrast);
      const resultAPCA = getOptimalColorForContrastAPCA(foreground, background, targetContrast);

      // The result should be the same as using getOptimalColorForContrastAPCA
      expect(result.r).toBeCloseTo(resultAPCA.r, 2);
      expect(result.g).toBeCloseTo(resultAPCA.g, 2);
      expect(result.b).toBeCloseTo(resultAPCA.b, 2);
    });

    it('should use WCAG 2.1 when specified', () => {
      const background = rgb(1, 1, 1); // White background
      const foreground = rgb(0.5, 0.5, 0.5); // Gray foreground
      const targetContrast = 4.5; // Target contrast

      const result = getOptimalColorForContrast(foreground, background, targetContrast, 'WCAG21');
      const resultWCAG21 = getOptimalColorForContrastWCAG21(foreground, background, targetContrast);

      // The result should be the same as using getOptimalColorForContrastWCAG21
      expect(result.r).toBeCloseTo(resultWCAG21.r, 2);
      expect(result.g).toBeCloseTo(resultWCAG21.g, 2);
      expect(result.b).toBeCloseTo(resultWCAG21.b, 2);
    });

    it('should work with string color values', () => {
      // Test with hex strings
      const result1 = getOptimalColorForContrast('#808080', '#FFFFFF', 60);
      expect(result1.space).toBe('rgb');
    });

    it('should throw an error for unknown method', () => {
      // @ts-expect-error - Testing with invalid method
      expect(() => getOptimalColorForContrast('#000000', '#FFFFFF', 60, 'INVALID')).toThrow(
        'Unknown contrast algorithm: INVALID'
      );
    });
  });
});
