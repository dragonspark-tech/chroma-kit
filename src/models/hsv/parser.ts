import { hsv, HSVColor } from './hsv';
import { ColorStringParser } from '../../semantics/colorParser';

/**
 * Parses a CSS HSV color string into an HSVColor object.
 *
 * Supports both comma and space syntax:
 * - hsv(120, 100%, 50%)
 * - hsv(120 100% 50%)
 * - hsv(120, 100%, 50%, 0.5)
 * - hsv(120 100% 50% / 0.5)
 *
 * @param src The CSS HSV color string to parse
 * @returns An HSVColor object
 */
export function hsvFromCSSString(src: string): HSVColor {
  /* we already know src starts with "hsv(" (the dispatcher guaranteed it) */
  const parser = new ColorStringParser(src, 4);

  // Parse hue (0-360 degrees)
  parser.skipWS();
  const h = parser.readComponent({ isHue: true });

  // Determine delimiter style
  parser.determineDelimiterStyle();

  // Parse saturation (0-100%)
  parser.skipWS();
  const s = parser.readComponent({
    isPercentageOnly: true,
    min: 0,
    max: 1,
    scale: 1 // Already scaled by the parser
  });
  parser.consumeCommaIfNeeded();

  // Parse value (0-100%)
  parser.skipWS();
  const v = parser.readComponent({
    isPercentageOnly: true,
    min: 0,
    max: 1,
    scale: 1 // Already scaled by the parser
  });
  parser.skipWS();

  // Parse optional alpha
  const alpha = parser.parseOptionalAlpha();

  // Check for proper closing
  parser.checkEnd();

  return hsv(h, s, v, alpha);
}
