import { APCA_BODY_MIN_RATIO, APCA_LARGE_MIN_RATIO, APCA_PLACEHOLDER_MIN_RATIO } from '../constants';
import { type Color } from '../../../../foundation';
import { contrast } from '../../../../';

/**
 * Types of content for APCA contrast compliance checking
 * - BodyText: Standard body text content
 * - LargeText: Headings and other large text elements
 * - NonEssentialText: Placeholder or non-essential text
 * - UIControls: Interactive elements like buttons, form controls, etc.
 */
export type APCAContentType = 'BodyText' | 'LargeText' | 'NonEssentialText' | 'UIControls';

/**
 * Checks if a contrast value meets APCA requirements for a specific content type
 *
 * @param contrast - The APCA contrast value to check
 * @param content - The type of content being checked
 * @returns True if the contrast meets the minimum requirement for the content type, false otherwise
 */
export const isContrastAPCACompliant = (contrast: number, content: APCAContentType): boolean => {
  const absContrast = Math.abs(contrast);
  switch (content) {
    case 'BodyText':
      return absContrast >= APCA_BODY_MIN_RATIO;

    case 'LargeText':
      return absContrast >= APCA_LARGE_MIN_RATIO;

    case 'NonEssentialText':
      return absContrast >= APCA_PLACEHOLDER_MIN_RATIO;

    case 'UIControls':
      return absContrast >= APCA_BODY_MIN_RATIO;

    default:
      throw new Error(`Unknown content type: ${content}`);
  }
}

/**
 * Checks if the contrast between two colors meets APCA requirements for a specific content type
 *
 * @param foreground - The foreground color (text color)
 * @param background - The background color
 * @param content - The type of content being checked
 * @returns True if the contrast meets the minimum requirement for the content type, false otherwise
 */
export const checkAPCAContrast = (foreground: Color | string, background: Color | string, content: APCAContentType): boolean =>
  isContrastAPCACompliant(contrast(foreground, background, 'APCA'), content);
