import { describe, expect, it } from 'vitest';
import { contrastAPCA } from '../../contrast/apca';
import { srgb } from '../../models/srgb';

describe('APCA Contrast', () => {
  describe('Basic functionality', () => {
    it('should calculate contrast between black and white', () => {
      const black = srgb(0, 0, 0);
      const white = srgb(1, 1, 1);

      // APCA contrast between black and white should be a high positive value
      const result = contrastAPCA(black, white);
      expect(result).toBeGreaterThan(100); // APCA contrast for black on white is around 106%
    });

    it('should calculate contrast between white and black', () => {
      const black = srgb(0, 0, 0);
      const white = srgb(1, 1, 1);

      // APCA contrast between white and black should be a high negative value
      const result = contrastAPCA(white, black);
      expect(result).toBeLessThan(-100); // APCA contrast for white on black is around -108%
    });

    it('should calculate contrast between gray values', () => {
      const darkGray = srgb(0.2, 0.2, 0.2);
      const lightGray = srgb(0.8, 0.8, 0.8);

      // APCA contrast between dark gray and light gray should be positive but less than black/white
      const result = contrastAPCA(darkGray, lightGray);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });
  });

  describe('Polarity', () => {
    it('should return positive values for dark text on light background', () => {
      const darkText = srgb(0.1, 0.1, 0.1);
      const lightBg = srgb(0.9, 0.9, 0.9);

      const result = contrastAPCA(darkText, lightBg);
      expect(result).toBeGreaterThan(0);
    });

    it('should return negative values for light text on dark background', () => {
      const lightText = srgb(0.9, 0.9, 0.9);
      const darkBg = srgb(0.1, 0.1, 0.1);

      const result = contrastAPCA(lightText, darkBg);
      expect(result).toBeLessThan(0);
    });
  });

  describe('Alpha handling', () => {
    it('should handle foreground colors with alpha transparency', () => {
      const black = srgb(0, 0, 0);
      const transparentWhite = srgb(1, 1, 1, 0.5);
      const semiTransparentWhite = srgb(1, 1, 1, 0.8);

      // Test that alpha is properly handled
      const result1 = contrastAPCA(transparentWhite, black);
      const result2 = contrastAPCA(semiTransparentWhite, black);

      // More transparent should have less contrast
      expect(Math.abs(result1)).toBeLessThan(Math.abs(result2));
    });

    it('should ignore alpha on background colors', () => {
      const white = srgb(1, 1, 1);
      const transparentBlack = srgb(0, 0, 0, 0.5);

      // Alpha on background should be ignored
      const result = contrastAPCA(white, transparentBlack);
      expect(result).toBeLessThan(-100); // Should be treated as solid black
    });
  });

  describe('Edge cases', () => {
    it('should return 0 for identical colors', () => {
      const gray = srgb(0.5, 0.5, 0.5);
      expect(contrastAPCA(gray, gray)).toBe(0);
    });

    it('should return 0 for very small differences', () => {
      const gray1 = srgb(0.5, 0.5, 0.5);
      const gray2 = srgb(0.501, 0.501, 0.501);

      // Very small differences should return 0
      expect(contrastAPCA(gray1, gray2)).toBe(0);
    });

    it('should return 0 for low contrast in white-on-black scenario', () => {
      // Create colors that will produce a very small negative contrast
      // that will be clipped to 0 due to being above -SA98G_G4G_LOW_CLIP
      const almostBlack = srgb(0.1, 0.1, 0.1);
      const veryDarkGray = srgb(0.12, 0.12, 0.12);

      // This should produce a small negative contrast that gets clipped to 0
      const result = contrastAPCA(veryDarkGray, almostBlack);
      expect(result).toBe(0);
    });

    it('should handle extreme values', () => {
      const superBlack = srgb(-0.1, -0.1, -0.1); // Out of range values
      const superWhite = srgb(1.1, 1.1, 1.1); // Out of range values

      // Should clamp values and still produce a result
      expect(contrastAPCA(superBlack, superWhite)).not.toBeNaN();
    });
  });

  describe('Color variations', () => {
    it('should handle different colors with similar luminance', () => {
      const red = srgb(1, 0, 0);
      const green = srgb(0, 1, 0);
      const blue = srgb(0, 0, 1);

      // These colors have different RGB values but may have similar luminance
      // The contrast should be based on luminance, not RGB differences
      const redGreenContrast = contrastAPCA(red, green);
      const redBlueContrast = contrastAPCA(red, blue);
      const greenBlueContrast = contrastAPCA(green, blue);

      // Just verify we get some result, not NaN or undefined
      expect(redGreenContrast).not.toBeNaN();
      expect(redBlueContrast).not.toBeNaN();
      expect(greenBlueContrast).not.toBeNaN();
    });
  });
});
