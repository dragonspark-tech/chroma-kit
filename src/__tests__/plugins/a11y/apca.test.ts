import { describe, expect, it } from 'vitest';
import { checkAPCAContrast, isContrastAPCACompliant, APCAContentType } from '../../../plugins/a11y/src/checks/apca';
import { srgb } from '../../../models/srgb';
import { APCA_BODY_MIN_RATIO, APCA_LARGE_MIN_RATIO, APCA_PLACEHOLDER_MIN_RATIO } from '../../../plugins/a11y/src/constants';

describe('A11y Plugin - APCA Checks', () => {
  describe('isContrastAPCACompliant', () => {
    it('should correctly check BodyText compliance', () => {
      // Test with a value above the threshold
      expect(isContrastAPCACompliant(APCA_BODY_MIN_RATIO + 1, 'BodyText')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastAPCACompliant(APCA_BODY_MIN_RATIO, 'BodyText')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastAPCACompliant(APCA_BODY_MIN_RATIO - 1, 'BodyText')).toBe(false);
    });

    it('should correctly check LargeText compliance', () => {
      // Test with a value above the threshold
      expect(isContrastAPCACompliant(APCA_LARGE_MIN_RATIO + 1, 'LargeText')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastAPCACompliant(APCA_LARGE_MIN_RATIO, 'LargeText')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastAPCACompliant(APCA_LARGE_MIN_RATIO - 1, 'LargeText')).toBe(false);
    });

    it('should correctly check NonEssentialText compliance', () => {
      // Test with a value above the threshold
      expect(isContrastAPCACompliant(APCA_PLACEHOLDER_MIN_RATIO + 1, 'NonEssentialText')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastAPCACompliant(APCA_PLACEHOLDER_MIN_RATIO, 'NonEssentialText')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastAPCACompliant(APCA_PLACEHOLDER_MIN_RATIO - 1, 'NonEssentialText')).toBe(false);
    });

    it('should correctly check UIControls compliance', () => {
      // UIControls uses the same threshold as BodyText
      // Test with a value above the threshold
      expect(isContrastAPCACompliant(APCA_BODY_MIN_RATIO + 1, 'UIControls')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastAPCACompliant(APCA_BODY_MIN_RATIO, 'UIControls')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastAPCACompliant(APCA_BODY_MIN_RATIO - 1, 'UIControls')).toBe(false);
    });

    it('should throw an error for unknown content type', () => {
      // @ts-expect-error - Testing with invalid content type
      expect(() => isContrastAPCACompliant(60, 'InvalidType')).toThrow('Unknown content type: InvalidType');
    });
  });

  describe('checkAPCAContrast', () => {
    it('should correctly check contrast for dark text on light background', () => {
      const black = srgb(0, 0, 0);
      const white = srgb(1, 1, 1);

      // Black text on white background should pass all content types
      expect(checkAPCAContrast(black, white, 'BodyText')).toBe(true);
      expect(checkAPCAContrast(black, white, 'LargeText')).toBe(true);
      expect(checkAPCAContrast(black, white, 'NonEssentialText')).toBe(true);
      expect(checkAPCAContrast(black, white, 'UIControls')).toBe(true);
    });

    it('should correctly check contrast for light text on dark background', () => {
      const black = srgb(0, 0, 0);
      const white = srgb(1, 1, 1);

      // White text on black background should pass all content types
      expect(checkAPCAContrast(white, black, 'BodyText')).toBe(true);
      expect(checkAPCAContrast(white, black, 'LargeText')).toBe(true);
      expect(checkAPCAContrast(white, black, 'NonEssentialText')).toBe(true);
      expect(checkAPCAContrast(white, black, 'UIControls')).toBe(true);
    });

    it('should correctly identify insufficient contrast', () => {
      // Create colors with low contrast
      const lightGray = srgb(0.8, 0.8, 0.8);
      const slightlyDarkerGray = srgb(0.7, 0.7, 0.7);

      // These colors should fail all content types due to low contrast
      expect(checkAPCAContrast(lightGray, slightlyDarkerGray, 'BodyText')).toBe(false);
      expect(checkAPCAContrast(lightGray, slightlyDarkerGray, 'LargeText')).toBe(false);
      expect(checkAPCAContrast(lightGray, slightlyDarkerGray, 'UIControls')).toBe(false);

      // Might pass for NonEssentialText which has lower requirements
      // Let's test with even lower contrast to ensure it fails
      const barelyDifferentGray = srgb(0.79, 0.79, 0.79);
      expect(checkAPCAContrast(lightGray, barelyDifferentGray, 'NonEssentialText')).toBe(false);
    });

    it('should work with string color values', () => {
      // Test with hex strings
      expect(checkAPCAContrast('#000000', '#FFFFFF', 'BodyText')).toBe(true);
      expect(checkAPCAContrast('#FFFFFF', '#000000', 'BodyText')).toBe(true);
    });

    it('should handle edge cases', () => {
      // Same color should always fail (contrast = 0)
      const gray = srgb(0.5, 0.5, 0.5);
      expect(checkAPCAContrast(gray, gray, 'BodyText')).toBe(false);
      expect(checkAPCAContrast(gray, gray, 'LargeText')).toBe(false);
      expect(checkAPCAContrast(gray, gray, 'NonEssentialText')).toBe(false);
      expect(checkAPCAContrast(gray, gray, 'UIControls')).toBe(false);

      // Test with colors that have very small difference
      const barelyDifferentGray = srgb(0.51, 0.51, 0.51);
      expect(checkAPCAContrast(gray, barelyDifferentGray, 'BodyText')).toBe(false);
    });
  });
});
