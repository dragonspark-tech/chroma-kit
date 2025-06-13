/**
 * Color serialization and deserialization module.
 *
 * This module provides functionality for converting between Color objects and
 * string representations using ChromaKit's v1 serialization format.
 *
 * The v1 format follows the pattern:
 * "ChromaKit|v1 {colorspace} {component1} {component2} ... [/ {alpha}]"
 *
 * For example:
 * "ChromaKit|v1 rgb 255 0 0" (red in RGB)
 * "ChromaKit|v1 hsl 0 100 50 / 0.5" (semi-transparent red in HSL)
 */

import { type Color, type ColorSpace } from '../foundation';
import { rgbFromVector } from '../models/rgb';
import { xyzFromVector } from '../models/xyz';
import { hslFromVector } from '../models/hsl';
import { hsvFromVector } from '../models/hsv';
import { labFromVector } from '../models/lab';
import { oklabFromVector } from '../models/oklab';
import { lchFromVector } from '../models/lch';
import { oklchFromVector } from '../models/oklch';
import { jzazbzFromVector } from '../models/jzazbz';
import { jzczhzFromVector } from '../models/jzczhz';
import { hwbFromVector } from '../models/hwb';
import { p3FromVector } from '../models/p3/p3';

/**
 * Type guard utility to ensure all color spaces are handled.
 *
 * @param x A value that should never occur if all cases are handled
 * @throws {Error} Always throws with information about the unhandled color space
 */
const assertNever = (x: never): never => {
  throw new Error(`Unhandled colorspace: ${x as string}`);
};

/**
 * Parses a ChromaKit v1 string and returns a Color object.
 *
 * @param {string} src - The input string in ChromaKit v1 format to parse.
 * @return {Color} The parsed color object containing the color space, its components, and optional alpha value.
 * @throws {Error} If the input string is not valid or not in ChromaKit v1 format.
 */
export function parseV1(src: string): Color {
  const tokens = src.trim().split(/\s+/);
  const tag = tokens.shift()?.toLowerCase();

  if (tag !== 'chromakit|v1') {
    throw new Error('Not a ChromaKit v1 string');
  }

  const space = tokens.shift() as ColorSpace;

  const slash = tokens.indexOf('/');
  let alpha: number | undefined;
  if (slash !== -1) {
    alpha = Number(tokens[slash + 1]);
    tokens.splice(slash, 2);
  }

  const nums = tokens.map(Number);

  switch (space) {
    case 'rgb':
      return rgbFromVector(nums, alpha);
    case 'p3':
      return p3FromVector(nums, alpha);
    case 'hsl':
      return hslFromVector(nums, alpha);
    case 'hsv':
      return hsvFromVector(nums, alpha);
    case 'hwb':
      return hwbFromVector(nums, alpha);
    case 'xyz':
      return xyzFromVector(nums, alpha);
    case 'lab':
      return labFromVector(nums, alpha);
    case 'oklab':
      return oklabFromVector(nums, alpha);
    case 'lch':
      return lchFromVector(nums, alpha);
    case 'oklch':
      return oklchFromVector(nums, alpha);
    case 'jzazbz':
      return jzazbzFromVector(nums, alpha);
    case 'jzczhz':
      return jzczhzFromVector(nums, alpha);
    default:
      return assertNever(space);
  }
}

/**
 * Serializes a color object into a string representation using the v1 format.
 *
 * @param {Color} color - The color object to be serialized. Must contain a color space, numeric values for the color space, and optionally an alpha value.
 * @return {string} A string representing the serialized color in the v1 format.
 */
export function serializeV1(color: Color): string {
  const { space, alpha, channels } = color;

  const keys = Object.keys(channels);
  const numbers = keys.map((k) => color[k as keyof typeof color]);

  return `ChromaKit|v1 ${space} ${numbers.join(' ')}` + (alpha !== undefined ? ` / ${alpha}` : '');
}
