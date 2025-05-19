import { hsl, HSLColor } from './hsl';

export function hslFromCSSString(src: string): HSLColor {
  /* Check if the string starts with "hsl(" or "hsla(" */
  let i = src.startsWith('hsla(') ? 5 : 4; // cursor just after '('
  const N = src.length;

  /* ---- helpers --------------------------------------------------------- */
  const isWS = (cc: number) => cc <= 32; // 0x20 = space
  const skipWS = () => {
    while (i < N && isWS(src.charCodeAt(i))) ++i;
  };

  /**
   * Reads either <number> or <percentage>.
   * For hue it returns 0-360, for saturation and lightness 0-1, for alpha 0-1.
   */
  const readComp = (isHue: boolean, isAlpha: boolean): number => {
    let v = 0,
      dot = false,
      frac = 0.1;
    let negative = false;

    /* sign – CSS allows negative hue values */
    if (src[i] === '-') {
      negative = true;
      ++i;
    } else if (src[i] === '+') {
      ++i;
    }

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

    if (negative) v = -v;

    /* percentage? */
    const pct = src[i] === '%';
    if (pct) ++i;

    if (isHue) {
      // hue is in degrees, no percentage
      if (pct) throw new SyntaxError('hue cannot be a percentage');
      // normalize negative hue values
      while (v < 0) v += 360;
      while (v >= 360) v -= 360;
      return v;
    } else if (isAlpha) {
      // alpha 0-1   or   0-100 %
      if (pct) v *= 0.01;
      if (v < 0 || v > 1) throw new SyntaxError('alpha 0–1');
      return v;
    } else {
      // saturation/lightness 0-1  or 0-100 %
      if (!pct) throw new SyntaxError('saturation and lightness must be percentages');
      v *= 0.01; // 1 / 100
      if (v < 0 || v > 1) throw new SyntaxError('saturation/lightness 0–100%');
      return v;
    }
  };

  /* Determine delimiter style after the first component ------------------ */
  skipWS();
  const h = readComp(true, false); // -------- H
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
  const s = readComp(false, false); // -------- S
  if (commaSyntax) {
    skipWS();
    if (src[i] !== ',') throw new SyntaxError("expected ','");
    ++i;
  }
  skipWS();

  /* third component ------------------------------------------------------- */
  const l = readComp(false, false); // -------- L
  skipWS();

  /* optional alpha -------------------------------------------------------- */
  let alpha: number | undefined;
  if (commaSyntax && src[i] === ',') {
    // legacy comma alpha
    ++i;
    skipWS();
    alpha = readComp(false, true);
    skipWS();
  } else if (src[i] === '/') {
    // CSS-4 space alpha
    ++i;
    skipWS();
    alpha = readComp(false, true);
    skipWS();
  }

  /* closing parenthesis & trailing garbage -------------------------------- */
  if (src[i] !== ')') throw new SyntaxError('missing ")"');
  if (++i !== N) throw new SyntaxError('unexpected text after ")"');

  return hsl(h, s, l, alpha);
}
