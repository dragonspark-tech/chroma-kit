/**
 * Type for component parsing options
 */
export type ComponentParseOptions = {
  isHue?: boolean;
  isAlpha?: boolean;
  isPercentageOnly?: boolean;
  isNumberOnly?: boolean;
  min?: number;
  max?: number;
  scale?: number;
};

/**
 * Base parser for CSS color strings
 */
export class ColorStringParser {
  private src: string;
  private i: number;
  private N: number;
  private commaSyntax: boolean = false;
  private sawWS: boolean = false;

  /**
   * Creates a new parser for the given CSS color string
   *
   * @param src The CSS color string to parse
   * @param prefixLength The length of the prefix to skip (e.g., 4 for "rgb(")
   */
  constructor(src: string, prefixLength: number) {
    this.src = src;
    this.i = prefixLength; // cursor just after prefix
    this.N = src.length;
  }

  /**
   * Skips whitespace characters
   */
  public skipWS(): void {
    while (this.i < this.N && this.isWS(this.src.charCodeAt(this.i))) ++this.i;
  }

  /**
   * Reads a numeric component with options for different formats
   *
   * @param options Options for parsing the component
   * @returns The parsed component value
   */
  public readComponent(options: ComponentParseOptions = {}): number {
    const {
      isHue = false,
      isAlpha = false,
      isPercentageOnly = false,
      isNumberOnly = false,
      min = isAlpha ? 0 : isHue ? 0 : -Infinity,
      max = isAlpha ? 1 : isHue ? 360 : Infinity,
      scale = 1
    } = options;

    let v = 0;
    let dot = false;
    let frac = 0.1;
    let negative = false;

    // Handle sign
    if (this.src[this.i] === '-') {
      if (!isHue && min >= 0) throw new SyntaxError('negative value not allowed');
      negative = true;
      ++this.i;
    } else if (this.src[this.i] === '+') {
      ++this.i;
    }

    // Parse integer/fraction part
    for (; this.i < this.N; ++this.i) {
      const d = this.src.charCodeAt(this.i) - 48; // '0'→0 … '9'→9, others negative
      if (d >= 0 && d <= 9) {
        if (dot) {
          v += d * frac;
          frac *= 0.1;
        } else v = v * 10 + d;
      } else if (this.src[this.i] === '.') {
        if (dot) throw new SyntaxError('multiple "."');
        dot = true;
      } else break;
    }

    if (negative) v = -v;

    // Handle percentage
    const pct = this.src[this.i] === '%';
    if (pct) {
      if (isNumberOnly) throw new SyntaxError('percentage not allowed');
      ++this.i;
    } else if (isPercentageOnly) {
      throw new SyntaxError('percentage required');
    }

    // Apply scaling and constraints
    if (isHue) {
      if (pct) throw new SyntaxError('hue cannot be a percentage');
      // Normalize hue to 0-360
      while (v < 0) v += 360;
      while (v >= 360) v -= 360;
    } else if (pct) {
      v *= 0.01 * scale; // Convert percentage to decimal
    } else if (scale !== 1) {
      v *= scale;
    }

    // Validate range
    if (v < min || v > max) {
      throw new SyntaxError(`value ${v} out of range [${min}, ${max}]`);
    }

    return v;
  }

  /**
   * Determines and consumes the delimiter style (comma or space)
   */
  public determineDelimiterStyle(): void {
    this.sawWS = false;
    this.commaSyntax = false;

    // Consume at least one delimiter
    while (this.i < this.N) {
      const ch = this.src[this.i];
      if (ch === ',') {
        this.commaSyntax = true;
        ++this.i;
        break;
      }
      if (this.isWS(this.src.charCodeAt(this.i))) {
        this.sawWS = true;
        ++this.i;
      } else break;
    }

    if (!this.commaSyntax && !this.sawWS) {
      throw new SyntaxError("expected ',' or <whitespace> after first value");
    }
  }

  /**
   * Checks if comma syntax is being used
   */
  public isCommaSyntax(): boolean {
    return this.commaSyntax;
  }

  /**
   * Consumes a comma if using comma syntax
   */
  public consumeCommaIfNeeded(): void {
    if (this.commaSyntax) {
      this.skipWS();
      if (this.src[this.i] !== ',') throw new SyntaxError("expected ','");
      ++this.i;
    }
  }

  /**
   * Parses an optional alpha component
   */
  public parseOptionalAlpha(): number | undefined {
    let alpha: number | undefined;

    if (this.commaSyntax && this.src[this.i] === ',') {
      // Legacy comma alpha
      ++this.i;
      this.skipWS();
      alpha = this.readComponent({ isAlpha: true });
    } else if (this.src[this.i] === '/') {
      // CSS-4 space alpha
      ++this.i;
      this.skipWS();
      alpha = this.readComponent({ isAlpha: true });
    }

    return alpha;
  }

  /**
   * Checks for closing parenthesis and trailing garbage
   */
  public checkEnd(): void {
    this.skipWS();
    if (this.src[this.i] !== ')') throw new SyntaxError('missing ")"');
    if (++this.i !== this.N) throw new SyntaxError('unexpected text after ")"');
  }

  /**
   * Gets the current position in the string
   */
  public getPosition(): number {
    return this.i;
  }

  /**
   * Gets the character at the current position
   */
  public getCurrentChar(): string {
    return this.src[this.i];
  }

  /**
   * Checks if a character code is whitespace
   */
  private isWS(cc: number): boolean {
    return cc <= 32; // 0x20 = space
  }
}
