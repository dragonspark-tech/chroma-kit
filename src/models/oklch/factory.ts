import { ColorFactory } from '../factory';
import { OKLChColor } from './oklch';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for OKLCh color factory functions
 */
export interface OKLChFactory extends ColorFactory {
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-1)
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
   * Converts the factory to a plain OKLCh color object.
   *
   * @returns {OKLChColor} Plain OKLCh color object
   */
  toColor(): OKLChColor;
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
/*@__NO_SIDE_EFFECTS__*/
export function oklch(l: number, c: number, h: number, alpha?: number): OKLChFactory {
  // Normalize hue to 0-360 range
  const normalizedH = ((h % 360) + 360) % 360;
  const color: OKLChColor = { space: 'oklch', l, c, h: normalizedH, alpha };

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
        return oklchToCSSString(color);
      }
      return serializeV1(color);
    },

    toCSSString: () => oklchToCSSString(color),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Converts an OKLCh color to a CSS-compatible string representation.
 *
 * @param {OKLChColor} color - The OKLCh color to convert
 * @returns {string} CSS-compatible string representation of the OKLCh color
 */
/*@__NO_SIDE_EFFECTS__*/
function oklchToCSSString(color: OKLChColor): string {
  const { l, c, h, alpha } = color;

  // Format lightness as decimal (0-1)
  const lFormatted = l.toFixed(3);
  const cFormatted = c.toFixed(4);
  const hFormatted = h.toFixed(1);

  if (alpha !== undefined && alpha < 1) {
    return `oklch(${lFormatted} ${cFormatted} ${hFormatted} / ${alpha.toFixed(3)})`;
  }

  return `oklch(${lFormatted} ${cFormatted} ${hFormatted})`;
}
