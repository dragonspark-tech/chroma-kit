import { lab, LabColor } from './lab';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS Lab color string into a LabColor object.
 *
 * Supports both comma and space syntax, as well as optional alpha:
 * - lab(50%, 43.5, -47.3)
 * - lab(50% 43.5 -47.3)
 * - lab(50%, 43.5, -47.3, 0.5)
 * - lab(50% 43.5 -47.3 / 0.5)
 *
 * The function handles:
 * - Lightness as a percentage (0-100%)
 * - A and B components as numbers (can be negative)
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS Lab color string to parse
 * @returns {LabColor} The parsed Lab color object, with lightness normalized to 0-1 range
 * @throws {SyntaxError} If the string format is invalid
 */
export function labFromCSSString(src: string): LabColor {
  const parser = new ColorStringParser(src, 4);

  parser.skipWS();
  const l = parser.readComponent({
    isPercentageOnly: true,
    min: 0,
    max: 100,
    scale: 0.01
  });

  parser.determineDelimiterStyle();

  parser.skipWS();
  const a = parser.readComponent();
  parser.consumeCommaIfNeeded();

  parser.skipWS();
  const b = parser.readComponent();
  parser.skipWS();

  const alpha = parser.parseOptionalAlpha();

  parser.checkEnd();

  return lab(l, a, b, alpha);
}
