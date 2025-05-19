import { srgb, sRGBColor } from './srgb';
import { normalizesRGBColor } from './transform';

/**
 * Parses a CSS RGB color string into an RGBColor object.
 *
 * Supports both comma and space syntax, as well as both srgb() and rgba() formats:
 * - srgb(255, 128, 0)
 * - rgba(255, 128, 0, 0.5)
 * - srgb(255 128 0)
 * - srgb(255 128 0 / 0.5)
 * - srgb(100%, 50%, 0%)
 * - srgb(100% 50% 0% / 0.5)
 *
 * The function handles:
 * - RGB values as either integers (0-255) or percentages (0-100%)
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS RGB color string to parse
 * @returns {sRGBColor} The parsed RGB color object, with values normalized to 0-1 range
 * @throws {SyntaxError} If the string format is invalid
 */
export function srgbFromCSSString(src: string): sRGBColor {
  let i = 4;
  const N = src.length;

  const isWS = (cc: number) => cc <= 32;
  const skipWS = () => {
    while (i < N && isWS(src.charCodeAt(i))) ++i;
  };

  const readComp = (isAlpha: boolean): number => {
    let v = 0,
      dot = false,
      frac = 0.1;

    if (src[i] === '-') throw new SyntaxError('negative value');
    if (src[i] === '+') ++i;

    for (; i < N; ++i) {
      const d = src.charCodeAt(i) - 48;
      if (d >= 0 && d <= 9) {
        if (dot) {
          v += d * frac;
          frac *= 0.1;
        } else v = v * 10 + d;
      } else if (src[i] === '.') {
        if (dot) throw new SyntaxError('multiple "."');
        dot = true;
      } else break;
    }

    const pct = src[i] === '%';
    if (pct) ++i;

    if (isAlpha) {
      if (pct) v *= 0.01;
      if (v < 0 || v > 1) throw new SyntaxError('alpha 0–1');
      return v;
    } else {
      if (pct) v *= 2.55;
      if (v > 255) throw new SyntaxError('srgb() out of range');
      return v;
    }
  };

  skipWS();
  const r = readComp(false);
  let sawWS = false;
  let commaSyntax = false;

  while (i < N) {
    const ch = src[i];
    if (ch === ',') {
      commaSyntax = true;
      ++i;
      break;
    }
    if (isWS(src.charCodeAt(i))) {
      sawWS = true;
      ++i;
    } else break;
  }
  if (!commaSyntax && !sawWS)
    throw new SyntaxError("expected ',' or <whitespace> after first value");
  skipWS();

  const g = readComp(false);
  if (commaSyntax) {
    skipWS();
    if (src[i] !== ',') throw new SyntaxError("expected ','");
    ++i;
  }
  skipWS();

  const b = readComp(false);
  skipWS();

  let a: number | undefined;
  if (commaSyntax && src[i] === ',') {
    ++i;
    skipWS();
    a = readComp(true);
    skipWS();
  } else if (src[i] === '/') {
    ++i;
    skipWS();
    a = readComp(true);
    skipWS();
  }

  if (src[i] !== ')') throw new SyntaxError('missing ")"');
  if (++i !== N) throw new SyntaxError('unexpected text after ")"');

  return normalizesRGBColor(srgb(r, g, b, a));
}
