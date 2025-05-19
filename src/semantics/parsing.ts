import { Color, ColorArray, ColorBase } from '../foundation';
import { parseV1 } from './serialization';
import { hexToRGB, RGBColor, rgbFromCSSString } from '../models/rgb';
import { HSLColor, hslFromCSSString } from '../models/hsl';
import { HSVColor, hsvFromCSSString } from '../models/hsv';
import { LabColor, labFromCSSString } from '../models/lab';
import { LChColor, lchFromCSSString } from '../models/lch';
import { OKLabColor, oklabFromCSSString } from '../models/oklab';
import { OKLChColor, oklchFromCSSString } from '../models/oklch';
import { JzAzBzColor } from '../models/jzazbz';

const HOT_CACHE_SIZE = 32;
const hotKeys = new Array<string>(HOT_CACHE_SIZE);
const hotVals = new Array(HOT_CACHE_SIZE);
let hotIndex = 0;

export function parse<T extends ColorBase>(input: string): Color;
export function parse<T extends ColorBase>(input: object): Color;
export function parse<T extends ColorBase>(input: any): Color {
  /* 1-A. Hot cache probe -------------------------------------------------- */
  if (typeof input === 'string') {
    for (let i = 0; i < HOT_CACHE_SIZE; ++i) if (hotKeys[i] === input) return hotVals[i];
  }

  /* 1-B. NEW: hex-string fast-path  ❱❱❱  ################################### */
  if (typeof input === 'string' && input.charCodeAt(0) === 35) {
    // 35 = '#'
    const col = hexToRGB(input); // ← your existing parser
    hotKeys[hotIndex] = input;
    hotVals[hotIndex] = col;
    hotIndex = (hotIndex + 1) & (HOT_CACHE_SIZE - 1); // cheap ring
    return col;
  }

  /* ---------- 2. ChromaKit|v1 fast-path ---------------------------------- */
  if (
    typeof input === 'string' &&
    input.length > 11 &&
    input[0] === 'C' &&
    input[9] === '|' &&
    input[10] === 'v'
  ) {
    const col = parseV1(input);
    hotKeys[hotIndex] = input;
    hotVals[hotIndex] = col;
    hotIndex = (hotIndex + 1) & (HOT_CACHE_SIZE - 1);
    return col;
  }

  /* ---------- 3. CSS string dispatch ------------------------------------- */
  if (typeof input === 'string') {
    if (input.length < 4)
      throw new SyntaxError('CSS color string too short');

    const prefix =
      ((input.charCodeAt(0) | 32) << 24) |
      ((input.charCodeAt(1) | 32) << 16) |
      ((input.charCodeAt(2) | 32) << 8) |
      (input.charCodeAt(3) | 32);

    switch (prefix) {
      case 0x72676200: return rgbFromCSSString(input);   // 'rgb('
      case 0x68736c00: return hslFromCSSString(input);   // 'hsl('
      case 0x68736c61: return hslFromCSSString(input);   // 'hsla'
      // case 0x68776200: return hwbFromCSSString(input); // 'hwb(' (commented)
      case 0x68737600: return hsvFromCSSString(input);   // 'hsv('
      case 0x6c616200: return labFromCSSString(input);   // 'lab('
      case 0x6c636800: return lchFromCSSString(input);   // 'lch('
      // case 0x63796d00: return cmykFromCSSString(input);// 'cmyk' (todo)
      case 0x6f6b6c61: return oklabFromCSSString(input); // 'okla'
      case 0x6f6b6c63: return oklchFromCSSString(input); // 'oklc'
      default:
        if ((input.charCodeAt(0) | 32) === 0x63 && input.startsWith('color(')) {
          throw new SyntaxError('Generic CSS Color 4 parsing not implemented yet');
        }
    }
    throw new SyntaxError('Unsupported / invalid CSS color string');
  }


  /* ---------- 4. Raw object pass-through ---------------------------------- */
  if (input && typeof input === 'object') {
    const space = (input as any).space;
    if (typeof space === 'string') return input as Color;
    // Allow inference if “space” omitted but keys match a single namespace
    return inferColorObject(input as Record<string, unknown>);
  }

  throw new TypeError('Value is not a string, ChromaKit v1 string, or color object');
}

/* ---- helpers ------------------------------------------------------------- */
function inferColorObject(obj: Record<string, unknown>): Color {
  // fast duck-type test, no reflection needed
  if ('r' in obj && 'g' in obj && 'b' in obj) {
    return { space: 'rgb', ...(obj as any) } as RGBColor;
  }
  if ('h' in obj && 's' in obj && 'l' in obj) {
    return { space: 'hsl', ...(obj as any) } as HSLColor;
  }
  if ('h' in obj && 's' in obj && 'v' in obj) {
    return { space: 'hsv', ...(obj as any) } as HSVColor;
  }
  if ('l' in obj && 'a' in obj && 'b' in obj && !('c' in obj) && !('h' in obj)) {
    return { space: 'lab', ...(obj as any) } as LabColor;
  }
  if ('l' in obj && 'c' in obj && 'h' in obj && !('a' in obj) && !('b' in obj)) {
    return { space: 'lch', ...(obj as any) } as LChColor;
  }
  if ('jz' in obj && 'az' in obj && 'bz' in obj) {
    return { space: 'jzazbz', ...(obj as any) } as JzAzBzColor;
  }
  // OKLAB and OKLCH have the same properties as LAB and LCH but with different ranges
  // We need to check if the l value is in the 0-1 range (OKLAB/OKLCH) or 0-100 range (LAB/LCH)
  if ('l' in obj && 'a' in obj && 'b' in obj && !('c' in obj) && !('h' in obj)) {
    const l = obj.l as number;
    if (l >= 0 && l <= 1) {
      return { space: 'oklab', ...(obj as any) } as OKLabColor;
    }
  }
  if ('l' in obj && 'c' in obj && 'h' in obj && !('a' in obj) && !('b' in obj)) {
    const l = obj.l as number;
    if (l >= 0 && l <= 1) {
      return { space: 'oklch', ...(obj as any) } as OKLChColor;
    }
  }
  // …repeat for other spaces, or throw:
  throw new TypeError('Cannot infer color space from object keys');
}
