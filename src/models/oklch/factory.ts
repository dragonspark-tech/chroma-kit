import { BaseColorFactory } from '../factory';
import { OKLChColor } from './oklch';

/**
 * Factory for creating and manipulating OKLCh colors.
 */
export class OKLChFactory extends BaseColorFactory {
  private color: OKLChColor;

  /**
   * Creates a new OKLCh color factory.
   *
   * @param {number} l - Lightness component (0-1)
   * @param {number} c - Chroma component
   * @param {number} h - Hue component (0-360 degrees)
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(l: number, c: number, h: number, alpha?: number) {
    super();
    // Normalize hue to 0-360 range
    const normalizedH = ((h % 360) + 360) % 360;
    this.color = { space: 'oklch', l, c, h: normalizedH, alpha };
  }

  /**
   * Converts the factory to a plain OKLCh color object.
   *
   * @returns {OKLChColor} Plain OKLCh color object
   */
  toColor(): OKLChColor {
    return this.color;
  }

  /**
   * Converts the OKLCh color to a CSS-compatible string representation.
   *
   * @returns {string} CSS-compatible string representation of the OKLCh color
   */
  toCSSString(): string {
    const { l, c, h, alpha } = this.color;

    // Format lightness as decimal (0-1)
    const lFormatted = l.toFixed(3);
    const cFormatted = c.toFixed(4);
    const hFormatted = h.toFixed(1);

    if (alpha !== undefined && alpha < 1) {
      return `oklch(${lFormatted} ${cFormatted} ${hFormatted} / ${alpha.toFixed(3)})`;
    }

    return `oklch(${lFormatted} ${cFormatted} ${hFormatted})`;
  }

  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-1)
   */
  get l(): number {
    return this.color.l;
  }

  /**
   * Gets the chroma component.
   *
   * @returns {number} Chroma component
   */
  get c(): number {
    return this.color.c;
  }

  /**
   * Gets the hue component.
   *
   * @returns {number} Hue component (0-360 degrees)
   */
  get h(): number {
    return this.color.h;
  }

  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  get alpha(): number | undefined {
    return this.color.alpha;
  }
}

/**
 * Creates a new OKLCh color.
 *
 * @param {number} l - Lightness component (0-1)
 * @param {number} c - Chroma component
 * @param {number} h - Hue component (0-360 degrees)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {OKLChFactory} A new OKLCh factory
 */
export function oklch(l: number, c: number, h: number, alpha?: number): OKLChFactory {
  return new OKLChFactory(l, c, h, alpha);
}
