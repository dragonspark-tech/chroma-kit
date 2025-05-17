import { ColorFactory } from '../factory';
import { JzAzBzColor } from './jzazbz';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for JzAzBz color factory functions
 */
export interface JzAzBzFactory extends ColorFactory {
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component
   */
  jz: number;
  /**
   * Gets the green-red component.
   *
   * @returns {number} Green-red component
   */
  az: number;
  /**
   * Gets the blue-yellow component.
   *
   * @returns {number} Blue-yellow component
   */
  bz: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain JzAzBz color object.
   *
   * @returns {JzAzBzColor} Plain JzAzBz color object
   */
  toColor(): JzAzBzColor;
}

/**
 * Creates a new JzAzBz color.
 *
 * @param {number} jz - Lightness component
 * @param {number} az - Green-red component
 * @param {number} bz - Blue-yellow component
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {JzAzBzFactory} A new JzAzBz factory
 */
/*@__NO_SIDE_EFFECTS__*/
export function jzazbz(jz: number, az: number, bz: number, alpha?: number): JzAzBzFactory {
  const color: JzAzBzColor = { space: 'jzazbz', jz, az, bz, alpha };

  return {
    // Properties
    jz,
    az,
    bz,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      return serializeV1(color);
    },

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}
