import { Color, ColorSpace, CreatedColor } from '../foundation';
import { parseV1 } from './serialization';
import { hexToRGB, rgbFromCSSString } from '../models/rgb';
import { hslFromCSSString } from '../models/hsl';
import { hsvFromCSSString } from '../models/hsv';
import { labFromCSSString } from '../models/lab';
import { lchFromCSSString } from '../models/lch';
import { oklabFromCSSString } from '../models/oklab';
import { oklchFromCSSString } from '../models/oklch';

const HOT_CACHE_SIZE = 32;
const hotKeys = new Array<string>(HOT_CACHE_SIZE);
const hotVals = new Array(HOT_CACHE_SIZE);
let hotIndex = 0;

export function parse<T extends ColorSpace>(
  input: string | Color,
  targetSpace: T
): CreatedColor<T> {
  if (typeof input !== 'string') return input.to(targetSpace);

  /* 1-A. Hot cache probe -------------------------------------------------- */
  for (let i = 0; i < HOT_CACHE_SIZE; ++i) if (hotKeys[i] === input) return hotVals[i];

  /* 1-B. NEW: hex-string fast-path  ❱❱❱  ################################### */
  if (input.charCodeAt(0) === 35) {
    // 35 = '#'
    const col = hexToRGB(input); // ← your existing parser
    hotKeys[hotIndex] = input;
    hotVals[hotIndex] = col;
    hotIndex = (hotIndex + 1) & (HOT_CACHE_SIZE - 1); // cheap ring
    return col.to(targetSpace);
  }

  /* ---------- 2. ChromaKit|v1 fast-path ---------------------------------- */
  if (input.length > 11 && input[0] === 'C' && input[9] === '|' && input[10] === 'v') {
    const col = parseV1(input);
    hotKeys[hotIndex] = input;
    hotVals[hotIndex] = col;
    hotIndex = (hotIndex + 1) & (HOT_CACHE_SIZE - 1);
    return col.to(targetSpace);
  }

  /* ---------- 3. CSS string dispatch ------------------------------------- */
  if (input.length < 4) throw new SyntaxError('CSS color string too short');
  const prefix =
    ((input.charCodeAt(0) | 32) << 24) |
    ((input.charCodeAt(1) | 32) << 16) |
    ((input.charCodeAt(2) | 32) << 8) |
    (input.charCodeAt(3) | 32);
  switch (prefix) {
    case 0x72676200:
      return rgbFromCSSString(input).to(targetSpace); // 'rgb('
    case 0x68736c00:
      return hslFromCSSString(input).to(targetSpace); // 'hsl('
    case 0x68736c61:
      return hslFromCSSString(input).to(targetSpace); // 'hsla'
    // case 0x68776200: return hwbFromCSSString(input); // 'hwb(' (todo)
    case 0x68737600:
      return hsvFromCSSString(input).to(targetSpace); // 'hsv('
    case 0x6c616200:
      return labFromCSSString(input).to(targetSpace); // 'lab('
    case 0x6c636800:
      return lchFromCSSString(input).to(targetSpace); // 'lch('
    // case 0x63796d00: return cmykFromCSSString(input);// 'cmyk' (todo)
    case 0x6f6b6c61:
      return oklabFromCSSString(input).to(targetSpace); // 'okla'
    case 0x6f6b6c63:
      return oklchFromCSSString(input).to(targetSpace); // 'oklc'
    default:
      if ((input.charCodeAt(0) | 32) === 0x63 && input.startsWith('color(')) {
        throw new SyntaxError('Generic CSS Color 4 parsing not implemented yet');
      }
  }
  throw new SyntaxError('Unsupported / invalid CSS color string');
}
