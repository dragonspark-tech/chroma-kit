import { rgb, RGBColor } from './rgb';
import { normalizeRGBColor } from './transform';

export function rgbFromCSSString(src: string): RGBColor {
  /* we already know src starts with "rgb(" (the dispatcher guaranteed it) */
  let i = 4; // cursor just after '('
  const N = src.length;

  /* ---- helpers --------------------------------------------------------- */
  const isWS = (cc: number) => cc <= 32; // 0x20 = space
  const skipWS = () => {
    while (i < N && isWS(src.charCodeAt(i))) ++i;
  };

  /**
   * Reads either <number> or <percentage>.
   * For color channels it returns 0-255, for alpha 0-1.
   */
  const readComp = (isAlpha: boolean): number => {
    let v = 0,
      dot = false,
      frac = 0.1;

    /* sign – CSS forbids negatives; fail early for speed */
    if (src[i] === '-') throw new SyntaxError('negative value');
    if (src[i] === '+') ++i;

    /* integer / fraction part */
    for (; i < N; ++i) {
      const d = src.charCodeAt(i) - 48; // '0'→0 … '9'→9, others negative
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

    /* percentage? */
    const pct = src[i] === '%';
    if (pct) ++i;

    if (isAlpha) {
      // alpha 0-1   or   0-100 %
      if (pct) v *= 0.01;
      if (v < 0 || v > 1) throw new SyntaxError('alpha 0–1');
      return v;
    } else {
      // channel 0-255  or 0-100 %
      if (pct) v *= 2.55; // 255 / 100
      if (v > 255) throw new SyntaxError('rgb() out of range');
      return v;
    }
  };

  /* Determine delimiter style after the first component ------------------ */
  skipWS();
  const r = readComp(false); // -------- R
  let sawWS = false;
  let commaSyntax = false;

  /* consume at least one delimiter */
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

  /* second component ------------------------------------------------------ */
  const g = readComp(false); // -------- G
  if (commaSyntax) {
    skipWS();
    if (src[i] !== ',') throw new SyntaxError("expected ','");
    ++i;
  }
  skipWS();

  /* third component ------------------------------------------------------- */
  const b = readComp(false); // -------- B
  skipWS();

  /* optional alpha -------------------------------------------------------- */
  let a: number | undefined;
  if (commaSyntax && src[i] === ',') {
    // legacy comma alpha
    ++i;
    skipWS();
    a = readComp(true);
    skipWS();
  } else if (src[i] === '/') {
    // CSS-4 space alpha
    ++i;
    skipWS();
    a = readComp(true);
    skipWS();
  }

  /* closing parenthesis & trailing garbage -------------------------------- */
  if (src[i] !== ')') throw new SyntaxError('missing ")"');
  if (++i !== N) throw new SyntaxError('unexpected text after ")"');

  return normalizeRGBColor(rgb(r, g, b, a));
}
