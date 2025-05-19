/**
 * Color parsing module for converting string representations to Color objects.
 *
 * This module provides functionality to parse various color string formats into
 * Color objects, with optimizations for performance.
 * - A hot cache for recently parsed colors
 * - Fast paths for common formats like hex strings
 * - Support for CSS color formats and ChromaKit's own serialization format
 */

import { Color, ColorSpace, CreatedColor } from '../foundation';
import { parseV1 } from './serialization';
import { hexToRGB, rgbFromCSSString } from '../models/rgb';
import { hslFromCSSString } from '../models/hsl';
import { hsvFromCSSString } from '../models/hsv';
import { labFromCSSString } from '../models/lab';
import { lchFromCSSString } from '../models/lch';
import { oklabFromCSSString } from '../models/oklab';
import { oklchFromCSSString } from '../models/oklch';
import { xyzFromCSSString } from '../models/xyz';
import { hwbFromCSSString } from '../models/hwb';

// Cache for recently parsed colors to improve performance on repeated calls
const HOT_CACHE_SIZE = 32;
const hotKeys = new Array<string>(HOT_CACHE_SIZE);
const hotVals = new Array(HOT_CACHE_SIZE);
let hotIndex = 0;

/**
 * Parses a color string or converts a Color object to the specified color space.
 *
 * This function handles multiple input formats with optimized paths:
 * 1. If input is already a Color object, it's converted to the target space
 * 2. Recently parsed strings are retrieved from a hot cache
 * 3. Hex strings (e.g., "#FF0000") are parsed via a fast path
 * 4. ChromaKit's own serialization format is handled efficiently
 * 5. CSS color strings (rgb, hsl, lab, etc.) are parsed based on their prefix
 *
 * @param input A color string or Color object to parse/convert
 * @param targetSpace The destination color space
 * @returns A Color object in the specified target space
 * @throws {SyntaxError} If the input string format is invalid or unsupported
 */
export function parse<T extends ColorSpace>(
  input: string | Color,
  targetSpace: T
): CreatedColor<T> {
  if (typeof input !== 'string') return input.to(targetSpace);

  // Check hot cache for recently parsed strings
  for (let i = 0; i < HOT_CACHE_SIZE; ++i) if (hotKeys[i] === input) return hotVals[i];

  // Fast path for hex strings (starting with '#')
  if (input.charCodeAt(0) === 35) {
    const col = hexToRGB(input);
    hotKeys[hotIndex] = input;
    hotVals[hotIndex] = col;
    hotIndex = (hotIndex + 1) & (HOT_CACHE_SIZE - 1);
    return col.to(targetSpace);
  }

  // Fast path for ChromaKit|v1 format
  if (input.length > 11 && input[0] === 'C' && input[9] === '|' && input[10] === 'v') {
    const col = parseV1(input);
    hotKeys[hotIndex] = input;
    hotVals[hotIndex] = col;
    hotIndex = (hotIndex + 1) & (HOT_CACHE_SIZE - 1);
    return col.to(targetSpace);
  }

  // CSS color string parsing based on prefix
  if (input.length < 4) throw new SyntaxError('CSS color string too short');
  const prefix =
    ((input.charCodeAt(0) | 32) << 24) |
    ((input.charCodeAt(1) | 32) << 16) |
    ((input.charCodeAt(2) | 32) << 8) |
    (input.charCodeAt(3) | 32);
  switch (prefix) {
    case 0x72676200: // 'rgb('
      return rgbFromCSSString(input).to(targetSpace);
    case 0x68736c00: // 'hsl('
      return hslFromCSSString(input).to(targetSpace);
    case 0x68736c61: // 'hsla'
      return hslFromCSSString(input).to(targetSpace);
    case 0x68776200:
      return hwbFromCSSString(input).to(targetSpace);
    case 0x68737600: // 'hsv('
      return hsvFromCSSString(input).to(targetSpace);
    case 0x6c616200: // 'lab('
      return labFromCSSString(input).to(targetSpace);
    case 0x6c636800: // 'lch('
      return lchFromCSSString(input).to(targetSpace);
    // case 0x63796d00: return cmykFromCSSString(input);// 'cmyk' (todo)
    case 0x6f6b6c61: // 'okla'
      return oklabFromCSSString(input).to(targetSpace);
    case 0x6f6b6c63: // 'oklc'
      return oklchFromCSSString(input).to(targetSpace);
    default:
      if ((input.charCodeAt(0) | 32) === 0x63 && input.startsWith('color(')) {
        // Check for XYZ color format
        if (input.toLowerCase().startsWith('color(xyz-')) {
          return xyzFromCSSString(input).to(targetSpace);
        }
        throw new SyntaxError('Generic CSS Color 4 parsing not implemented yet');
      }
  }
  throw new SyntaxError('Unsupported / invalid CSS color string');
}
