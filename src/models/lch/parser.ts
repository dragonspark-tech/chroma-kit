import { lch, LChColor } from './lch';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS LCh color string into a LChColor object.
 *
 * Supports both comma and space syntax:
 * - lch(50%, 75, 270)
 * - lch(50% 75 270)
 * - lch(50%, 75, 270, 0.5)
 * - lch(50% 75 270 / 0.5)
 *
 * @param src The CSS LCh color string to parse
 * @returns A LChColor object
 */
export function lchFromCSSString(src: string): LChColor {
  /* we already know src starts with "lch(" (the dispatcher guaranteed it) */
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

  return lch(l, c, h, alpha);
}
