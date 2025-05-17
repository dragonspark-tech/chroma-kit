import { ColorFactory } from '../factory';
import { XYZColor } from './xyz';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for XYZ color factory functions
 */
export interface XYZFactory extends ColorFactory {
  /**
   * Gets the X component.
   *
   * @returns {number} X component
   */
  x: number;
  /**
   * Gets the Y component.
   *
   * @returns {number} Y component
   */
  y: number;
  /**
   * Gets the Z component.
   *
   * @returns {number} Z component
   */
  z: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;
  /**
   * Gets the illuminant (reference white point).
   *
   * @returns {Illuminant} Illuminant
   */
  illuminant: Illuminant;

  /**
   * Converts the factory to a plain XYZ color object.
   *
   * @returns {XYZColor} Plain XYZ color object
   */
  toColor(): XYZColor;
}

/**
 * Creates a new XYZ color.
 *
 * @param {number} x - X component
 * @param {number} y - Y component
 * @param {number} z - Z component
 * @param {number} [alpha] - Alpha component (0-1)
 * @param {Illuminant} [illuminant] - Reference white point (defaults to D65)
 * @returns {XYZFactory} A new XYZ factory
 */
/*@__NO_SIDE_EFFECTS__*/
export function xyz(
  x: number,
  y: number,
  z: number,
  alpha?: number,
  illuminant: Illuminant = IlluminantD65
): XYZFactory {
  const color: XYZColor = { space: 'xyz', x, y, z, alpha, illuminant };

  return {
    // Properties
    x,
    y,
    z,
    alpha,
    illuminant: illuminant || IlluminantD65,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      return serializeV1(color);
    },

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}
