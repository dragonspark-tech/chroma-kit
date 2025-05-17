import { ColorFactory } from '../factory';
import { OKLabColor } from './oklab';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for OKLab color factory functions
 */
export interface OKLabFactory extends ColorFactory {
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-1)
   */
  l: number;
  /**
   * Gets the green-red component.
   *
   * @returns {number} Green-red component
   */
  a: number;
  /**
   * Gets the blue-yellow component.
   *
   * @returns {number} Blue-yellow component
   */
  b: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain OKLab color object.
   *
   * @returns {OKLabColor} Plain OKLab color object
   */
  toColor(): OKLabColor;
}

/**
 * Creates a new OKLab color.
 *
 * @param {number} l - Lightness component (0-1)
 * @param {number} a - Green-red component
 * @param {number} b - Blue-yellow component
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {OKLabFactory} A new OKLab factory
 */
/*@__NO_SIDE_EFFECTS__*/
export function oklab(l: number, a: number, b: number, alpha?: number): OKLabFactory {
  const color: OKLabColor = { space: 'oklab', l, a, b, alpha };

  return {
    // Properties
    l,
    a,
    b,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      if (options?.css) {
        return oklabToCSSString(color);
      }
      return serializeV1(color);
    },

    toCSSString: () => oklabToCSSString(color),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Converts an OKLab color to a CSS-compatible string representation.
 *
 * @param {OKLabColor} color - The OKLab color to convert
 * @returns {string} CSS-compatible string representation of the OKLab color
 */
/*@__NO_SIDE_EFFECTS__*/
function oklabToCSSString(color: OKLabColor): string {
  const { l, a, b, alpha } = color;

  // Convert lightness to percentage for CSS
  const lPercent = l.toFixed(3);

  if (alpha !== undefined && alpha < 1) {
    return `oklab(${lPercent} ${a.toFixed(4)} ${b.toFixed(4)} / ${alpha.toFixed(3)})`;
  }

  return `oklab(${lPercent} ${a.toFixed(4)} ${b.toFixed(4)})`;
}
