import { Color } from '../foundation';
import { contrastAPCA } from './apca';
import { parseColor } from '../semantics/parsing';
import { contrastDeltaLStar } from './delta-lstar';
import { contrastDeltaPhiStar } from './delta-phi';
import { contrastMichelson } from './michelson';
import { contrastWCAG21 } from './wcag21';
import { contrastWeber } from './weber';

/**
 * Supported contrast calculation algorithms.
 *
 * Each algorithm has different characteristics, use cases, and output ranges:
 *
 * - 'APCA': Modern algorithm designed for text readability, outputs -108% to 106%
 * - 'DeltaL*': Simple lightness difference used in Material Design, outputs 0-100
 * - 'DeltaPhi*': Extended lightness difference that includes chroma, outputs 0-100+
 * - 'Michelson': Classic formula for optical contrast, outputs 0-1
 * - 'WCAG21': Web accessibility standard, outputs 1:1 to 21:1
 * - 'Weber': Classic psychophysical contrast formula, outputs 0 to ∞
 */
export type ContrastAlgorithm = 'APCA' | 'DeltaL*' | 'DeltaPhi*' | 'Michelson' | 'WCAG21' | 'Weber';

/**
 * Calculates the contrast between two colors using the specified algorithm.
 *
 * This function provides a unified interface to access multiple contrast calculation
 * algorithms. It automatically converts the input colors to the appropriate color space
 * required by each algorithm.
 *
 * Usage examples:
 * ```
 * // Calculate contrast using the default APCA algorithm
 * const apcaContrast = contrast('#000000', '#FFFFFF');
 *
 * // Calculate contrast using WCAG 2.1
 * const wcagContrast = contrast('#000000', '#FFFFFF', 'WCAG21');
 *
 * // Calculate contrast using Delta L*
 * const deltaLContrast = contrast('#000000', '#FFFFFF', 'DeltaL*');
 * ```
 *
 * Note that each algorithm produces values in different ranges and with different
 * interpretations:
 *
 * - APCA: Values from -108% to 106%, with negative values for light-on-dark
 * - DeltaL*: Values from 0 to 100, with higher values indicating more contrast
 * - DeltaPhi*: Values from 0 to 100+, with higher values indicating more contrast
 * - Michelson: Values from 0 to 1, with higher values indicating more contrast
 * - WCAG21: Values from 1:1 to 21:1, with higher values indicating more contrast
 * - Weber: Values from 0 to ∞, with higher values indicating more contrast
 *
 * @param {string | Color} foreground - The foreground color (typically text)
 * @param {string | Color} background - The background color
 * @param {ContrastAlgorithm} [algorithm='APCA'] - The contrast algorithm to use
 * @returns {number} The calculated contrast value
 *
 * @throws {Error} If an unknown algorithm is specified
 */
export const contrast = (
  foreground: string | Color,
  background: string | Color,
  algorithm: ContrastAlgorithm = 'APCA'
): number => {
  // Parse the colors to their appropriate color spaces
  const fgSRGB = parseColor(foreground, 'srgb');
  const bgSRGB = parseColor(background, 'srgb');

  // Check if colors are identical (comparing RGB values)
  const colorsAreIdentical =
    fgSRGB.r === bgSRGB.r &&
    fgSRGB.g === bgSRGB.g &&
    fgSRGB.b === bgSRGB.b;

  // If colors are identical, return 0 for all algorithms for consistency
  if (colorsAreIdentical) {
    return 0;
  }

  // Otherwise, calculate contrast using the specified algorithm
  switch (algorithm) {
    case 'APCA':
      return contrastAPCA(fgSRGB, bgSRGB);
    case 'DeltaL*':
      return contrastDeltaLStar(parseColor(foreground, 'lab'), parseColor(background, 'lab'));
    case 'DeltaPhi*':
      return contrastDeltaPhiStar(parseColor(foreground, 'lab'), parseColor(background, 'lab'));
    case 'Michelson':
      return contrastMichelson(parseColor(foreground, 'xyz'), parseColor(background, 'xyz'));
    case 'WCAG21':
      return contrastWCAG21(parseColor(foreground, 'xyz'), parseColor(background, 'xyz'));
    case 'Weber':
      return contrastWeber(parseColor(foreground, 'xyz'), parseColor(background, 'xyz'));
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
};
