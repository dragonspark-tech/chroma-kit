import { ColorFactory } from '../factory';
import { LChColor } from './lch';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for LCh color factory functions
 */
export interface LChFactory extends ColorFactory {
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-100)
   */
  l: number;
  /**
   * Gets the chroma component.
   *
   * @returns {number} Chroma component
   */
  c: number;
  /**
   * Gets the hue component.
   *
   * @returns {number} Hue component (0-360 degrees)
   */
  h: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain LCh color object.
   *
   * @returns {LChColor} Plain LCh color object
   */
  toColor(): LChColor;
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
  // Normalize hue to 0-360 range
  const normalizedH = ((h % 360) + 360) % 360;
  const color: LChColor = { space: 'lch', l, c, h: normalizedH, alpha };

  return {
    // Properties
    l,
    c,
    h: normalizedH,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      if (options?.css) {
        return lchToCSSString(color);
      }
      return serializeV1(color);
    },

    toCSSString: () => lchToCSSString(color),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Converts an LCh color to a CSS-compatible string representation.
 *
 * @param {LChColor} color - The LCh color to convert
 * @returns {string} CSS-compatible string representation of the LCh color
 */
function lchToCSSString(color: LChColor): string {
  const { l, c, h, alpha } = color;

  if (alpha !== undefined && alpha < 1) {
    return `lch(${l.toFixed(1)}% ${c.toFixed(1)} ${h.toFixed(1)} / ${alpha.toFixed(3)})`;
  }

  return `lch(${l.toFixed(1)}% ${c.toFixed(1)} ${h.toFixed(1)})`;
}
