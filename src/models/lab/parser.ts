import { lab, LabColor } from './lab';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS Lab color string into a LabColor object.
 *
 * Supports both comma and space syntax:
 * - lab(50%, 43.5, -47.3)
 * - lab(50% 43.5 -47.3)
 * - lab(50%, 43.5, -47.3, 0.5)
 * - lab(50% 43.5 -47.3 / 0.5)
 *
 * @param src The CSS Lab color string to parse
 * @returns A LabColor object
 */
export function labFromCSSString(src: string): LabColor {
  /* we already know src starts with "lab(" (the dispatcher guaranteed it) */
  const parser = new ColorStringParser(src, 4);

  // Parse lightness (0-100%)
  parser.skipWS();
  const l = parser.readComponent({
    isPercentageOnly: true,
    min: 0,
    max: 100,
    scale: 1 // Already in the correct range
  });

  // Determine delimiter style
  parser.determineDelimiterStyle();

  // Parse a component (green-red)
  parser.skipWS();
  const a = parser.readComponent();
  parser.consumeCommaIfNeeded();

  // Parse b component (blue-yellow)
  parser.skipWS();
  const b = parser.readComponent();
  parser.skipWS();

  // Parse optional alpha
  const alpha = parser.parseOptionalAlpha();

  // Check for proper closing
  parser.checkEnd();

  return lab(l, a, b, alpha);
}
