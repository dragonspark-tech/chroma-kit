import { jzczhz, JzCzHzColor } from './jzczhz';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS JzCzHz color string into a JzCzHzColor object.
 *
 * Supports both comma and space syntax, as well as optional alpha values:
 * - jzczhz(0.01, 0.1, 270)
 * - jzczhz(0.01 0.1 270)
 * - jzczhz(0.01, 0.1, 270, 0.5)
 * - jzczhz(0.01 0.1 270 / 0.5)
 *
 * The function handles:
 * - Jz (lightness) as a number (typically 0-1)
 * - Cz (chroma) as a number (typically 0-0.5)
 * - Hz (hue) as an angle in degrees (0-360)
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS JzCzHz color string to parse
 * @returns {JzCzHzColor} The parsed JzCzHz color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function jzczhzFromCSSString(src: string): JzCzHzColor {
  const parser = new ColorStringParser(src, 7);

  parser.skipWS();
  const jz = parser.readComponent({
    min: 0,
    max: 1
  });

  parser.determineDelimiterStyle();

  parser.skipWS();
  const cz = parser.readComponent({ min: 0 });
  parser.consumeCommaIfNeeded();

  parser.skipWS();
  const hz = parser.readComponent({ isHue: true });
  parser.skipWS();

  const alpha = parser.parseOptionalAlpha();

  parser.checkEnd();

  return jzczhz(jz, cz, hz, alpha);
}
