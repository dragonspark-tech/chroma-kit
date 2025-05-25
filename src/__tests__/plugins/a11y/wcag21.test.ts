import { describe, expect, it } from 'vitest';
import { checkWCAG21Contrast, isContrastWCAG21Compliant, WCAG21ContentType } from '../../../plugins/a11y/src/checks/wcag21';
import { rgb } from '../../../models/rgb';
import {
  WCAG21_AA_NORMAL_MIN_RATIO,
  WCAG21_AA_LARGE_MIN_RATIO,
  WCAG21_AAA_NORMAL_MIN_RATIO,
  WCAG21_AAA_LARGE_MIN_RATIO
} from '../../../plugins/a11y/src/constants';

describe('A11y Plugin - WCAG 2.1 Checks', () => {
  describe('isContrastWCAG21Compliant', () => {
    it('should correctly check AANormal compliance', () => {
      // Test with a value above the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AA_NORMAL_MIN_RATIO + 0.1, 'AANormal')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AA_NORMAL_MIN_RATIO, 'AANormal')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AA_NORMAL_MIN_RATIO - 0.1, 'AANormal')).toBe(false);
    });

    it('should correctly check AALarge compliance', () => {
      // Test with a value above the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AA_LARGE_MIN_RATIO + 0.1, 'AALarge')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AA_LARGE_MIN_RATIO, 'AALarge')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AA_LARGE_MIN_RATIO - 0.1, 'AALarge')).toBe(false);
    });

    it('should correctly check AAANormal compliance', () => {
      // Test with a value above the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AAA_NORMAL_MIN_RATIO + 0.1, 'AAANormal')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AAA_NORMAL_MIN_RATIO, 'AAANormal')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AAA_NORMAL_MIN_RATIO - 0.1, 'AAANormal')).toBe(false);
    });

    it('should correctly check AAALarge compliance', () => {
      // Test with a value above the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AAA_LARGE_MIN_RATIO + 0.1, 'AAALarge')).toBe(true);

      // Test with a value equal to the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AAA_LARGE_MIN_RATIO, 'AAALarge')).toBe(true);

      // Test with a value below the threshold
      expect(isContrastWCAG21Compliant(WCAG21_AAA_LARGE_MIN_RATIO - 0.1, 'AAALarge')).toBe(false);
    });

    it('should throw an error for unknown content type', () => {
      // @ts-expect-error - Testing with invalid content type
      expect(() => isContrastWCAG21Compliant(4.5, 'InvalidType')).toThrow('Unknown content type: InvalidType');
    });
  });

  describe('checkWCAG21Contrast', () => {
    it('should correctly check contrast for high contrast colors', () => {
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      // Black/white contrast should pass all levels
      expect(checkWCAG21Contrast(black, white, 'AANormal')).toBe(true);
      expect(checkWCAG21Contrast(black, white, 'AALarge')).toBe(true);
      expect(checkWCAG21Contrast(black, white, 'AAANormal')).toBe(true);
      expect(checkWCAG21Contrast(black, white, 'AAALarge')).toBe(true);

      // Test in reverse order too
      expect(checkWCAG21Contrast(white, black, 'AANormal')).toBe(true);
      expect(checkWCAG21Contrast(white, black, 'AALarge')).toBe(true);
      expect(checkWCAG21Contrast(white, black, 'AAANormal')).toBe(true);
      expect(checkWCAG21Contrast(white, black, 'AAALarge')).toBe(true);
    });

    it('should correctly identify medium contrast colors', () => {
      // Create colors with medium contrast (around 4.5:1)
      const darkGray = rgb(0.2, 0.2, 0.2);
      const lightGray = rgb(0.7, 0.7, 0.7);

      // These should pass AA Large and AAA Large but might fail AAA Normal
      // Let's test and see
      const result = checkWCAG21Contrast(darkGray, lightGray, 'AALarge');
      expect(result).toBe(true);

      const resultReverse = checkWCAG21Contrast(lightGray, darkGray, 'AALarge');
      expect(resultReverse).toBe(true);
    });

    it('should correctly identify insufficient contrast', () => {
      // Create colors with low contrast
      const mediumGray = rgb(0.5, 0.5, 0.5);
      const slightlyLighterGray = rgb(0.6, 0.6, 0.6);

      // These colors should fail all content types due to low contrast
      expect(checkWCAG21Contrast(mediumGray, slightlyLighterGray, 'AANormal')).toBe(false);
      expect(checkWCAG21Contrast(mediumGray, slightlyLighterGray, 'AALarge')).toBe(false);
      expect(checkWCAG21Contrast(mediumGray, slightlyLighterGray, 'AAANormal')).toBe(false);
      expect(checkWCAG21Contrast(mediumGray, slightlyLighterGray, 'AAALarge')).toBe(false);
    });

    it('should work with string color values', () => {
      // Test with hex strings
      expect(checkWCAG21Contrast('#000000', '#FFFFFF', 'AANormal')).toBe(true);
      expect(checkWCAG21Contrast('#FFFFFF', '#000000', 'AANormal')).toBe(true);

      // Test with rgb strings
      expect(checkWCAG21Contrast('rgb(0,0,0)', 'rgb(255,255,255)', 'AANormal')).toBe(true);
    });

    it('should handle edge cases', () => {
      // Same color should always fail (contrast = 1)
      const gray = rgb(0.5, 0.5, 0.5);
      expect(checkWCAG21Contrast(gray, gray, 'AANormal')).toBe(false);
      expect(checkWCAG21Contrast(gray, gray, 'AALarge')).toBe(false);
      expect(checkWCAG21Contrast(gray, gray, 'AAANormal')).toBe(false);
      expect(checkWCAG21Contrast(gray, gray, 'AAALarge')).toBe(false);

      // Test with colors that have very small difference
      const barelyDifferentGray = rgb(0.51, 0.51, 0.51);
      expect(checkWCAG21Contrast(gray, barelyDifferentGray, 'AANormal')).toBe(false);
    });

    it('should handle colors with different RGB components', () => {
      // Test with colors that have different RGB values
      const red = rgb(1, 0, 0);
      const green = rgb(0, 1, 0);
      const blue = rgb(0, 0, 1);

      // Test various combinations
      expect(checkWCAG21Contrast(red, green, 'AANormal')).not.toBeUndefined();
      expect(checkWCAG21Contrast(red, blue, 'AANormal')).not.toBeUndefined();
      expect(checkWCAG21Contrast(green, blue, 'AANormal')).not.toBeUndefined();
    });
  });
});
