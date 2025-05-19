import { oklch, OKLChColor } from './oklch';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS OKLCh color string into an OKLChColor object.
 *
 * Supports both comma and space syntax:
 * - oklch(0.5, 0.2, 270)
 * - oklch(0.5 0.2 270)
 * - oklch(50%, 0.2, 270)
 * - oklch(50% 0.2 270)
 * - oklch(0.5, 0.2, 270, 0.5)
 * - oklch(0.5 0.2 270 / 0.5)
 *
 * @param src The CSS OKLCh color string to parse
 * @returns An OKLChColor object
 */
export function oklchFromCSSString(src: string): OKLChColor {
  /* we already know src starts with "oklch(" (the dispatcher guaranteed it) */
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

  // Parse chroma (saturation/colorfulness)
  parser.skipWS();
  const c = parser.readComponent({ min: 0 });
  parser.consumeCommaIfNeeded();

  // Parse hue (0-360 degrees)
  parser.skipWS();
  const h = parser.readComponent({ isHue: true });
  parser.skipWS();

  // Parse optional alpha
  const alpha = parser.parseOptionalAlpha();

  // Check for proper closing
  parser.checkEnd();

  return oklch(l, c, h, alpha);
}
