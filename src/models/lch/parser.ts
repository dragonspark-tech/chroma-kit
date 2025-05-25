import { lch, LChColor } from './lch';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS LCh color string into a LChColor object.
 *
 * Supports both comma and space syntax, as well as optional alpha values:
 * - lch(50%, 75, 270)
 * - lch(50% 75 270)
 * - lch(50%, 75, 270, 0.5)
 * - lch(50% 75 270 / 0.5)
 *
 * The function handles:
 * - Lightness as a percentage (0-100%)
 * - Chroma as a number (no specific range, but typically 0-230 for RGB gamut)
 * - Hue as an angle in degrees (0-360)
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS LCh color string to parse
 * @returns {LChColor} The parsed LCh color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function lchFromCSSString(src: string): LChColor {
  const parser = new ColorStringParser(src, 4);

  parser.skipWS();
  const l = parser.readComponent({
    isPercentageOnly: true,
    min: 0,
    max: 100,
    scale: 1
  });

  parser.determineDelimiterStyle();

  parser.skipWS();
  const c = parser.readComponent({ min: 0 });
  parser.consumeCommaIfNeeded();

  parser.skipWS();
  const h = parser.readComponent({ isHue: true });
  parser.skipWS();

  const alpha = parser.parseOptionalAlpha();

  parser.checkEnd();

  return lch(l, c, h, alpha);
}
