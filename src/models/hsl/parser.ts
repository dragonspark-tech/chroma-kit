import { hsl, HSLColor } from './hsl';

/**
 * Parses a CSS HSL color string into an HSLColor object.
 *
 * Supports both comma and space syntax, as well as both hsl() and hsla() formats:
 * - hsl(120, 100%, 50%)
 * - hsla(120, 100%, 50%, 0.5)
 * - hsl(120 100% 50%)
 * - hsl(120 100% 50% / 0.5)
 *
 * The function handles:
 * - Hue values in degrees (0-360, normalized if outside this range)
 * - Saturation and lightness as percentages (0-100%)
 * - Optional alpha value (0-1 or 0-100%)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS HSL color string to parse
 * @returns {HSLColor} The parsed HSL color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function hslFromCSSString(src: string): HSLColor {
  let i = src.startsWith('hsla(') ? 5 : 4;
  const N = src.length;

  const isWS = (cc: number) => cc <= 32;
  const skipWS = () => {
    while (i < N && isWS(src.charCodeAt(i))) ++i;
  };

  const readComp = (isHue: boolean, isAlpha: boolean): number => {
    let v = 0,
      dot = false,
      frac = 0.1;
    let negative = false;

    if (src[i] === '-') {
      negative = true;
      ++i;
    } else if (src[i] === '+') {
      ++i;
    }

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

    if (negative) v = -v;

    const pct = src[i] === '%';
    if (pct) ++i;

    if (isHue) {
      if (pct) throw new SyntaxError('hue cannot be a percentage');
      while (v < 0) v += 360;
      while (v >= 360) v -= 360;
      return v;
    } else if (isAlpha) {
      if (pct) v *= 0.01;
      if (v < 0 || v > 1) throw new SyntaxError('alpha 0–1');
      return v;
    } else {
      if (!pct) throw new SyntaxError('saturation and lightness must be percentages');
      v *= 0.01;
      if (v < 0 || v > 1) throw new SyntaxError('saturation/lightness 0–100%');
      return v;
    }
  };

  skipWS();
  const h = readComp(true, false);
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

  const s = readComp(false, false);
  if (commaSyntax) {
    skipWS();
    if (src[i] !== ',') throw new SyntaxError("expected ','");
    ++i;
  }
  skipWS();

  const l = readComp(false, false);
  skipWS();

  let alpha: number | undefined;
  if (commaSyntax && src[i] === ',') {
    ++i;
    skipWS();
    alpha = readComp(false, true);
    skipWS();
  } else if (src[i] === '/') {
    ++i;
    skipWS();
    alpha = readComp(false, true);
    skipWS();
  }

  if (src[i] !== ')') throw new SyntaxError('missing ")"');
  if (++i !== N) throw new SyntaxError('unexpected text after ")"');

  return hsl(h, s, l, alpha);
}
