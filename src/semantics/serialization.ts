import { LChColor } from '../models/lch';
import { OKLabColor } from '../models/oklab';
import { OKLChColor } from '../models/oklch';
import { JzAzBzColor } from '../models/jzazbz';
import { JzCzHzColor } from '../models/jzczhz';
import { LabColor } from '../models/lab';
import { RGBColor } from '../models/rgb';
import { XYZColor } from '../models/xyz';
import { HSLColor } from '../models/hsl';
import { HSVColor } from '../models/hsv';

type Color =
  | RGBColor
  | HSLColor
  | HSVColor
  | XYZColor
  | LabColor
  | LChColor
  | OKLabColor
  | OKLChColor
  | JzAzBzColor
  | JzCzHzColor;
type ColorSpace = Color['space'];

/**
 * A mapping of color spaces to their respective channel identifiers.
 *
 * The `colorMappings` object defines a collection of color spaces and their corresponding
 * array of string identifiers representing the channels in that particular color space.
 *
 * Each color space is represented as a key in the object, and its value is an array of
 * strings that denote the individual channel names used for that color space.
 *
 * It uses the `Record` utility type to ensure that each key corresponds to a predefined
 * `ColorSpace` and the associated values are readonly arrays of strings.
 */
const colorMappings: Record<ColorSpace, readonly string[]> = {
  rgb: ['r', 'g', 'b'],
  xyz: ['x', 'y', 'z'],
  hsl: ['h', 's', 'l'],
  hsv: ['h', 's', 'v'],
  lab: ['l', 'a', 'b'],
  lch: ['l', 'c', 'h'],
  oklab: ['l', 'a', 'b'],
  oklch: ['l', 'c', 'h'],
  jzazbz: ['jz', 'az', 'bz'],
  jzczhz: ['jz', 'cz', 'hz']
} as const;

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
    case 'rgb': {
      const [r, g, b] = nums;
      return { space, r, g, b, alpha };
    }
    case 'hsl': {
      const [h, s, l] = nums;
      return { space, h, s, l, alpha };
    }
    case 'hsv': {
      const [h, s, v] = nums;
      return { space, h, s, v, alpha };
    }
    case 'xyz': {
      const [x, y, z] = nums;
      return { space, x, y, z, alpha };
    }
    case 'lab':
    case 'oklab': {
      const [l, a, b] = nums;
      return { space, l, a, b, alpha };
    }
    case 'lch':
    case 'oklch': {
      const [l, c, h] = nums;
      return { space, l, c, h, alpha };
    }
    case 'jzazbz': {
      const [jz, az, bz] = nums;
      return { space, jz, az, bz, alpha };
    }
    case 'jzczhz': {
      const [jz, cz, hz] = nums;
      return { space, jz, cz, hz, alpha };
    }
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
  const { space, alpha } = color;

  const keys = colorMappings[space] as readonly (keyof typeof color)[];
  const numbers = keys.map((k) => color[k]);

  return `ChromaKit|v1 ${space} ${numbers.join(' ')}` + (alpha !== undefined ? ` / ${alpha}` : '');
}
