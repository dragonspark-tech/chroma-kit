import { ColorFactory } from '../factory';
import { JzCzHzColor } from './jzczhz';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for JzCzHz color factory functions
 */
export interface JzCzHzFactory extends ColorFactory {
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component
   */
  jz: number;
  /**
   * Gets the chroma component.
   *
   * @returns {number} Chroma component
   */
  cz: number;
  /**
   * Gets the hue component.
   *
   * @returns {number} Hue component (0-360 degrees)
   */
  hz: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain JzCzHz color object.
   *
   * @returns {JzCzHzColor} Plain JzCzHz color object
   */
  toColor(): JzCzHzColor;
}

/**
 * Creates a new JzCzHz color.
 *
 * @param {number} jz - Lightness component
 * @param {number} cz - Chroma component
 * @param {number} hz - Hue component (0-360 degrees)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {JzCzHzFactory} A new JzCzHz factory
 */
/*@__NO_SIDE_EFFECTS__*/
export function jzczhz(jz: number, cz: number, hz: number, alpha?: number): JzCzHzFactory {
  // Normalize hue to 0-360 range
  const normalizedHz = ((hz % 360) + 360) % 360;
  const color: JzCzHzColor = { space: 'jzczhz', jz, cz, hz: normalizedHz, alpha };

  return {
    // Properties
    jz,
    cz,
    hz: normalizedHz,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      return serializeV1(color);
    },

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}
