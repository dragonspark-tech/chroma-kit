/**
 * Options for parsing color components in CSS color strings.
 *
 * These options control how numeric values are interpreted and validated
 * during the parsing process.
 */
export type ComponentParseOptions = {
  /** Whether the component is a hue value (0-360 degrees) */
  isHue?: boolean;
  /** Whether the component is an alpha value (0-1) */
  isAlpha?: boolean;
  /** Whether the component must be specified as a percentage */
  isPercentageOnly?: boolean;
  /** Whether the component must be specified as a number (not percentage) */
  isNumberOnly?: boolean;
  /** Minimum allowed value after scaling */
  min?: number;
  /** Maximum allowed value after scaling */
  max?: number;
  /** Scale factor to apply to the parsed value */
  scale?: number;
};

/**
 * A low-level parser for CSS color string formats.
 *
 * This class provides the core functionality for parsing CSS color strings,
 * handling different syntax variations (comma vs. space delimiters),
 * and properly interpreting numeric values with units (percentages, degrees).
 *
 * It manages the parsing state and provides methods for consuming and validating
 * different parts of a color string according to CSS specifications.
 */
export class ColorStringParser {
  private src: string;
  private i: number;
  private N: number;
  private commaSyntax: boolean = false;
  private sawWS: boolean = false;

  /**
   * Creates a new parser for the given CSS color string.
   *
   * @param src The CSS color string to parse
   * @param prefixLength The length of the prefix to skip (e.g., 4 for "rgb(")
   *                     This positions the parser cursor just after the prefix
   */
  constructor(src: string, prefixLength: number) {
    this.src = src;
    this.i = prefixLength;
    this.N = src.length;
  }

  /**
   * Advances the parser position past any whitespace characters.
   *
   * This method is used to skip over spaces, tabs, newlines, etc. in the input string,
   * moving the cursor to the next non-whitespace character.
   */
  public skipWS(): void {
    while (this.i < this.N && this.isWS(this.src.charCodeAt(this.i))) ++this.i;
  }

  /**
   * Reads a numeric component with options for different formats.
   *
   * This method parses a numeric value from the current position in the string,
   * handling various formats including:
   * - Sign (+ or -)
   * - Integer and decimal parts
   * - Percentage notation
   * - Range validation
   * - Value scaling
   *
   * For hue values, it automatically normalizes to the 0-360 range.
   * For percentage values, it converts to the appropriate decimal range.
   *
   * @param options Options for parsing the component
   * @returns The parsed component value
   * @throws {SyntaxError} If the value format is invalid or out of allowed range
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

    if (this.src[this.i] === '-') {
      if (!isHue && min >= 0) throw new SyntaxError('negative value not allowed');
      negative = true;
      ++this.i;
    } else if (this.src[this.i] === '+') {
      ++this.i;
    }

    for (; this.i < this.N; ++this.i) {
      const d = this.src.charCodeAt(this.i) - 48;
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

    const pct = this.src[this.i] === '%';
    if (pct) {
      if (isNumberOnly) throw new SyntaxError('percentage not allowed');
      ++this.i;
    } else if (isPercentageOnly) {
      throw new SyntaxError('percentage required');
    }

    if (isHue) {
      if (pct) throw new SyntaxError('hue cannot be a percentage');
      while (v < 0) v += 360;
      while (v >= 360) v -= 360;
    } else if (pct) {
      v *= 0.01 * scale;
    } else if (scale !== 1) {
      v *= scale;
    }

    if (v < min || v > max) {
      throw new SyntaxError(`value ${v} out of range [${min}, ${max}]`);
    }

    return v;
  }

  /**
   * Determines and consumes the delimiter style (comma or space).
   *
   * CSS color formats support two delimiter styles:
   * 1. Comma syntax (e.g., "rgb(255, 0, 0)")
   * 2. Space syntax (e.g., "rgb(255 0 0)")
   *
   * This method consumes delimiters after the first component and determines
   * which syntax is being used, setting internal state accordingly.
   *
   * @throws {SyntaxError} If no valid delimiter is found
   */
  public determineDelimiterStyle(): void {
    this.sawWS = false;
    this.commaSyntax = false;

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
   * Checks if comma syntax is being used for this color string.
   *
   * This method returns the delimiter style determined by the `determineDelimiterStyle` method.
   *
   * @returns True if comma syntax is being used, false if space syntax is being used
   */
  public isCommaSyntax(): boolean {
    return this.commaSyntax;
  }

  /**
   * Consumes a comma if using comma syntax.
   *
   * When parsing a color string that uses comma syntax (e.g., "rgb(255, 0, 0)"),
   * this method ensures that commas are present between components and advances
   * the parser position past the comma.
   *
   * @throws {SyntaxError} If comma syntax is being used but a comma is not found
   */
  public consumeCommaIfNeeded(): void {
    if (this.commaSyntax) {
      this.skipWS();
      if (this.src[this.i] !== ',') throw new SyntaxError("expected ','");
      ++this.i;
    }
  }

  /**
   * Parses an optional alpha component if present.
   *
   * This method handles two different alpha syntax formats:
   * 1. Legacy comma syntax (e.g., "rgba(255, 0, 0, 0.5)")
   * 2. CSS Color Level 4 slash syntax (e.g., "rgb(255 0 0 / 0.5)")
   *
   * @returns The parsed alpha value (0-1) or undefined if no alpha component is present
   */
  public parseOptionalAlpha(): number | undefined {
    let alpha: number | undefined;

    if (this.commaSyntax && this.src[this.i] === ',') {
      ++this.i;
      this.skipWS();
      alpha = this.readComponent({ isAlpha: true });
    } else if (this.src[this.i] === '/') {
      ++this.i;
      this.skipWS();
      alpha = this.readComponent({ isAlpha: true });
    }

    return alpha;
  }

  /**
   * Checks for a closing parenthesis and ensures there's no trailing content.
   *
   * This method is typically called after all color components have been parsed
   * to ensure the color string is properly terminated with a closing parenthesis
   * and that there's no unexpected content after it.
   *
   * @throws {SyntaxError} If the closing parenthesis is missing or if there's unexpected content after it
   */
  public checkEnd(): void {
    this.skipWS();
    if (this.src[this.i] !== ')') throw new SyntaxError('missing ")"');
    if (++this.i !== this.N) throw new SyntaxError('unexpected text after ")"');
  }

  /**
   * Gets the current position in the string.
   *
   * This method returns the current index where the parser is positioned
   * in the input string.
   *
   * @returns The current position (index) in the string
   */
  public getPosition(): number {
    return this.i;
  }

  /**
   * Gets the character at the current position.
   *
   * This method returns the character in the input string at the current
   * parser position.
   *
   * @returns The character at the current position
   */
  public getCurrentChar(): string {
    return this.src[this.i];
  }

  /**
   * Checks if a character code represents a whitespace character.
   *
   * This method considers any character with code point less than or equal to 32 (space)
   * as whitespace, which includes space, tab, newline, carriage return, etc.
   *
   * @param cc The character code to check
   * @returns True if the character is whitespace, false otherwise
   */
  private isWS(cc: number): boolean {
    return cc <= 32;
  }
}
