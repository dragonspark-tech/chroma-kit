/**
 * Parses a CSS XYZ color string into an XYZColor object.
 *
 * Supports the CSS Color Module Level 4 color() function format:
 * - color(xyz-d65 0.5 0.5 0.5)
 * - color(xyz-d65 0.5 0.5 0.5 / 0.5)
 *
 * The parsing process:
 * 1. Assumes the string starts with "color(xyz-" (verified by the dispatcher)
 * 2. Parses the illuminant (e.g., "d65")
 * 3. Determines the delimiter style (comma or space)
 * 4. Parses the x component
 * 5. Parses the y component
 * 6. Parses the z component
 * 7. Parses the optional alpha component
 * 8. Verifies proper closing of the string
 *
 * @param {string} src - The CSS XYZ color string to parse
 * @returns {XYZColor} The parsed XYZ color object
 */
import { xyz, XYZColor } from './xyz';
import { ColorStringParser } from '../../semantics/colorParser';
import { Illuminant, IlluminantD50, IlluminantD65 } from '../../standards/illuminants';

export function xyzFromCSSString(src: string): XYZColor {
  // Check if the string starts with "color(xyz-"
  if (!src.toLowerCase().startsWith('color(xyz-')) {
    throw new SyntaxError('XYZ color string must start with "color(xyz-"');
  }

  // Extract the illuminant name
  const illuminantEndIndex = src.indexOf(' ', 10);
  if (illuminantEndIndex === -1) {
    throw new SyntaxError('Invalid XYZ color format');
  }

  const illuminantName = src.substring(10, illuminantEndIndex).toLowerCase();
  let illuminant: Illuminant;

  // Set illuminant based on name
  if (illuminantName === 'd50') {
    illuminant = IlluminantD50;
  } else if (illuminantName === 'd65') {
    illuminant = IlluminantD65;
  } else {
    throw new SyntaxError(`Unsupported illuminant: ${illuminantName}`);
  }

  // Create a parser starting after the illuminant
  const parser = new ColorStringParser(src, illuminantEndIndex);

  parser.skipWS();

  // Parse x, y, z components
  const x = parser.readComponent();

  parser.determineDelimiterStyle();

  parser.skipWS();
  const y = parser.readComponent();
  parser.consumeCommaIfNeeded();

  parser.skipWS();
  const z = parser.readComponent();
  parser.skipWS();

  // Parse optional alpha
  const alpha = parser.parseOptionalAlpha();

  parser.checkEnd();

  return xyz(x, y, z, alpha, illuminant);
}
