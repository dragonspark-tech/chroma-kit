import { ColorFactory } from '../factory';
import { LabColor } from './lab';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for Lab color factory functions
 */
export interface LabFactory extends ColorFactory {
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-100)
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
   * Converts the factory to a plain Lab color object.
   *
   * @returns {LabColor} Plain Lab color object
   */
  toColor(): LabColor;
}

/**
 * Creates a new Lab color.
 *
 * @param {number} l - Lightness component (0-100)
 * @param {number} a - Green-red component
 * @param {number} b - Blue-yellow component
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {LabFactory} A new Lab factory
 */
/*@__NO_SIDE_EFFECTS__*/
export function lab(l: number, a: number, b: number, alpha?: number): LabFactory {
  const color: LabColor = { space: 'lab', l, a, b, alpha };

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
        return labToCSSString(color);
      }
      return serializeV1(color);
    },

    toCSSString: () => labToCSSString(color),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Converts a Lab color to a CSS-compatible string representation.
 *
 * @param {LabColor} color - The Lab color to convert
 * @returns {string} CSS-compatible string representation of the Lab color
 */
/*@__NO_SIDE_EFFECTS__*/
function labToCSSString(color: LabColor): string {
  const { l, a, b, alpha } = color;

  if (alpha !== undefined && alpha < 1) {
    return `lab(${l.toFixed(1)}% ${a.toFixed(1)} ${b.toFixed(1)} / ${alpha.toFixed(3)})`;
  }

  return `lab(${l.toFixed(1)}% ${a.toFixed(1)} ${b.toFixed(1)})`;
}
