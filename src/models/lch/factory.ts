import { BaseColorFactory } from '../factory';
import { LChColor } from './lch';

/**
 * Factory for creating and manipulating LCh colors.
 */
export class LChFactory extends BaseColorFactory {
  private color: LChColor;

  /**
   * Creates a new LCh color factory.
   *
   * @param {number} l - Lightness component (0-100)
   * @param {number} c - Chroma component
   * @param {number} h - Hue component (0-360 degrees)
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(l: number, c: number, h: number, alpha?: number) {
    super();
    // Normalize hue to 0-360 range
    const normalizedH = ((h % 360) + 360) % 360;
    this.color = { space: 'lch', l, c, h: normalizedH, alpha };
  }

  /**
   * Converts the factory to a plain LCh color object.
   *
   * @returns {LChColor} Plain LCh color object
   */
  toColor(): LChColor {
    return this.color;
  }

  /**
   * Converts the LCh color to a CSS-compatible string representation.
   *
   * @returns {string} CSS-compatible string representation of the LCh color
   */
  toCSSString(): string {
    const { l, c, h, alpha } = this.color;

    if (alpha !== undefined && alpha < 1) {
      return `lch(${l.toFixed(1)}% ${c.toFixed(1)} ${h.toFixed(1)} / ${alpha.toFixed(3)})`;
    }

    return `lch(${l.toFixed(1)}% ${c.toFixed(1)} ${h.toFixed(1)})`;
  }

  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-100)
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
 * Creates a new LCh color.
 *
 * @param {number} l - Lightness component (0-100)
 * @param {number} c - Chroma component
 * @param {number} h - Hue component (0-360 degrees)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {LChFactory} A new LCh factory
 */
export function lch(l: number, c: number, h: number, alpha?: number): LChFactory {
  return new LChFactory(l, c, h, alpha);
}
