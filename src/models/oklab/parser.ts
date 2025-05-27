import { oklab, type OKLabColor } from './oklab';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS OKLab color string into an OKLabColor object.
 *
 * Supports both comma and space syntax, as well as percentage notation for lightness:
 * - oklab(0.5, 0.1, -0.2)
 * - oklab(0.5 0.1 -0.2)
 * - oklab(50%, 0.1, -0.2)
 * - oklab(50% 0.1 -0.2)
 * - oklab(0.5, 0.1, -0.2, 0.5)
 * - oklab(0.5 0.1 -0.2 / 0.5)
 *
 * The function handles:
 * - Lightness values as either decimals (0-1) or percentages (0-100%)
 * - A and B components as signed decimal values
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS OKLab color string to parse
 * @returns {OKLabColor} The parsed OKLab color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function oklabFromCSSString(src: string): OKLabColor {
  // Initialize the parser with the input string, skipping the "oklab(" prefix
  const parser = new ColorStringParser(src, 6);

  /**
   * Parse lightness component (0-1 or 0-100%)
   * The lightness in OKLab is constrained between 0 and 1
   */
  parser.skipWS();
  const l = parser.readComponent({
    min: 0,
    max: 1,
    scale: 1 // Will be scaled if percentage
  });

  /**
   * Determine whether comma or space syntax is being used
   * This affects how subsequent components are separated
   */
  parser.determineDelimiterStyle();

  /**
   * Parse a component (green-red axis)
   * Negative values represent green, positive values represent red
   */
  parser.skipWS();
  const a = parser.readComponent();
  parser.consumeCommaIfNeeded();

  /**
   * Parse b component (blue-yellow axis)
   * Negative values represent blue, positive values represent yellow
   */
  parser.skipWS();
  const b = parser.readComponent();
  parser.skipWS();

  /**
   * Parse optional alpha component
   * This handles both comma syntax (oklab(l, a, b, alpha))
   * and slash syntax (oklab(l a b / alpha))
   */
  const alpha = parser.parseOptionalAlpha();

  /**
   * Ensure the string is properly terminated with a closing parenthesis
   * and that there's no unexpected content after it
   */
  parser.checkEnd();

  return oklab(l, a, b, alpha);
}
