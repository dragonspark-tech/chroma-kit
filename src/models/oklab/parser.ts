import { oklab, OKLabColor } from './oklab';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS OKLab color string into an OKLabColor object.
 *
 * Supports both comma and space syntax:
 * - oklab(0.5, 0.1, -0.2)
 * - oklab(0.5 0.1 -0.2)
 * - oklab(50%, 0.1, -0.2)
 * - oklab(50% 0.1 -0.2)
 * - oklab(0.5, 0.1, -0.2, 0.5)
 * - oklab(0.5 0.1 -0.2 / 0.5)
 *
 * @param src The CSS OKLab color string to parse
 * @returns An OKLabColor object
 */
export function oklabFromCSSString(src: string): OKLabColor {
  /* we already know src starts with "oklab(" (the dispatcher guaranteed it) */
  const parser = new ColorStringParser(src, 6);

  // Parse lightness (0-1 or 0-100%)
  parser.skipWS();
  const l = parser.readComponent({
    min: 0,
    max: 1,
    scale: 1 // Will be scaled if percentage
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

  return oklab(l, a, b, alpha);
}
