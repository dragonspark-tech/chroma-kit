import { WCAG21_AA_LARGE_MIN_RATIO, WCAG21_AA_NORMAL_MIN_RATIO, WCAG21_AAA_NORMAL_MIN_RATIO, WCAG21_AAA_LARGE_MIN_RATIO } from '../constants';
import { type Color } from '../../../../foundation';
import { contrast } from '../../../../';

/**
 * Types of content for WCAG 2.1 contrast compliance checking
 * - AANormal: Level AA compliance for normal text (less than 18pt or 14pt bold)
 * - AALarge: Level AA compliance for large text (at least 18pt or 14pt bold)
 * - AAANormal: Level AAA compliance for normal text (less than 18pt or 14pt bold)
 * - AAALarge: Level AAA compliance for large text (at least 18pt or 14pt bold)
 */
export type WCAG21ContentType = 'AANormal' | 'AALarge' | 'AAANormal' | 'AAALarge';

/**
 * Checks if a contrast value meets WCAG 2.1 requirements for a specific content type
 *
 * @param contrast - The WCAG 2.1 contrast value to check
 * @param content - The type of content being checked
 * @returns True if the contrast meets the minimum requirement for the content type, false otherwise
 */
export const isContrastWCAG21Compliant = (contrast: number, content: WCAG21ContentType): boolean => {
  const absContrast = Math.abs(contrast);
  switch (content) {
    case 'AANormal':
      return absContrast >= WCAG21_AA_NORMAL_MIN_RATIO;

    case 'AALarge':
      return absContrast >= WCAG21_AA_LARGE_MIN_RATIO;

    case 'AAANormal':
      return absContrast >= WCAG21_AAA_NORMAL_MIN_RATIO;

    case 'AAALarge':
      return absContrast >= WCAG21_AAA_LARGE_MIN_RATIO;

    default:
      throw new Error(`Unknown content type: ${content}`);
  }
};

/**
 * Checks if the contrast between two colors meets WCAG 2.1 requirements for a specific content type
 *
 * @param foreground - The foreground color (text color)
 * @param background - The background color
 * @param content - The type of content being checked
 * @returns True if the contrast meets the minimum requirement for the content type, false otherwise
 */
export const checkWCAG21Contrast = (foreground: Color | string, background: Color | string, content: WCAG21ContentType): boolean =>
  isContrastWCAG21Compliant(contrast(foreground, background, 'WCAG21'), content);
