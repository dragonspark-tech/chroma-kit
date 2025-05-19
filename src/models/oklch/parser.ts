import { oklch, OKLChColor } from './oklch';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS OKLCh color string into an OKLChColor object.
 *
 * Supports both comma and space syntax, as well as percentage notation for lightness:
 * - oklch(0.5, 0.2, 270)
 * - oklch(0.5 0.2 270)
 * - oklch(50%, 0.2, 270)
 * - oklch(50% 0.2 270)
 * - oklch(0.5, 0.2, 270, 0.5)
 * - oklch(0.5 0.2 270 / 0.5)
 *
 * The function handles:
 * - Lightness values as either decimals (0-1) or percentages (0-100%)
 * - Chroma values as positive numbers
 * - Hue values as degrees (0-360)
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS OKLCh color string to parse
 * @returns {OKLChColor} The parsed OKLCh color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function oklchFromCSSString(src: string): OKLChColor {
  const parser = new ColorStringParser(src, 6);

  parser.skipWS();
  const l = parser.readComponent({
    min: 0,
    max: 1,
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

  return oklch(l, c, h, alpha);
}
