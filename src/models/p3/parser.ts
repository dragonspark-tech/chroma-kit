import { p3, type P3Color } from './p3';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS P3 color string into a P3Color object.
 *
 * Supports the CSS Color Module Level 4 color() function format:
 * - color(display-p3 0.5 0.5 0.5)
 * - color(display-p3 0.5 0.5 0.5 / 0.5)
 *
 * The parsing process:
 * 1. Assumes the string starts with "color(display-p3" (verified by the function)
 * 2. Determines the delimiter style (comma or space)
 * 3. Parses the r component
 * 4. Parses the g component
 * 5. Parses the b component
 * 6. Parses the optional alpha component
 * 7. Verifies proper closing of the string
 *
 * @param {string} src - The CSS P3 color string to parse
 * @returns {P3Color} The parsed P3 color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function p3FromCSSString(src: string): P3Color {
  // Check if the string starts with "color(display-p3"
  if (!src.toLowerCase().startsWith('color(display-p3')) {
    throw new SyntaxError('P3 color string must start with "color(display-p3"');
  }

  // Create a parser starting after the "color(display-p3" prefix
  const parser = new ColorStringParser(src, 16);

  parser.skipWS();

  // Parse r, g, b components
  const r = parser.readComponent();

  parser.determineDelimiterStyle();

  parser.skipWS();
  const g = parser.readComponent();
  parser.consumeCommaIfNeeded();

  parser.skipWS();
  const b = parser.readComponent();
  parser.skipWS();

  // Parse optional alpha
  const alpha = parser.parseOptionalAlpha();

  parser.checkEnd();

  return p3(r, g, b, alpha);
}
