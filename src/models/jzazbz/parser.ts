import { jzazbz, type JzAzBzColor } from './jzazbz';

/**
 * Parses a CSS JzAzBz color string into a JzAzBzColor object.
 *
 * Supports the format:
 * - jzazbz(jz az bz [/ alpha])
 * - jzazbz(jz, az, bz[, alpha])
 *
 * The function handles:
 * - JzAzBz values as floating-point numbers
 * - Optional alpha value (0-1)
 * - Both comma-separated and space-separated formats
 * - Whitespace flexibility according to CSS specifications
 *
 * @param {string} src - The CSS JzAzBz color string to parse
 * @returns {JzAzBzColor} The parsed JzAzBz color object
 * @throws {SyntaxError} If the string format is invalid
 */
export function jzazbzFromCSSString(src: string): JzAzBzColor {
  // Check if the string starts with "jzazbz("
  if (!src.startsWith('jzazbz(')) {
    throw new SyntaxError('Invalid JzAzBz color string format');
  }

  let i = 7; // Start after "jzazbz("
  const N = src.length;

  const isWS = (cc: number) => cc <= 32;
  const skipWS = () => {
    while (i < N && isWS(src.charCodeAt(i))) ++i;
  };

  const readComp = (isAlpha: boolean): number => {
    let v = 0,
      dot = false,
      frac = 0.1,
      neg = false;

    if (src[i] === '-') {
      neg = true;
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

    if (neg) v = -v;

    if (isAlpha && (v < 0 || v > 1)) {
      throw new SyntaxError('alpha must be between 0 and 1');
    }

    return v;
  };

  skipWS();
  const jz = readComp(false);
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

  const az = readComp(false);
  if (commaSyntax) {
    skipWS();
    if (src[i] !== ',') throw new SyntaxError("expected ','");
    ++i;
  }
  skipWS();

  const bz = readComp(false);
  skipWS();

  let alpha: number | undefined;
  if (commaSyntax && src[i] === ',') {
    ++i;
    skipWS();
    alpha = readComp(true);
    skipWS();
  } else if (src[i] === '/') {
    ++i;
    skipWS();
    alpha = readComp(true);
    skipWS();
  }

  if (src[i] !== ')') throw new SyntaxError('missing ")"');
  if (++i !== N) throw new SyntaxError('unexpected text after ")"');

  return jzazbz(jz, az, bz, alpha);
}
