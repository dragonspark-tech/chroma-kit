import { BaseColorFactory } from '../factory';
import { JzCzHzColor } from './jzczhz';

/**
 * Factory for creating and manipulating JzCzHz colors.
 */
export class JzCzHzFactory extends BaseColorFactory {
  private color: JzCzHzColor;

  /**
   * Creates a new JzCzHz color factory.
   *
   * @param {number} jz - Lightness component
   * @param {number} cz - Chroma component
   * @param {number} hz - Hue component (0-360 degrees)
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(jz: number, cz: number, hz: number, alpha?: number) {
    super();
    // Normalize hue to 0-360 range
    const normalizedHz = ((hz % 360) + 360) % 360;
    this.color = { space: 'jzczhz', jz, cz, hz: normalizedHz, alpha };
  }

  /**
   * Converts the factory to a plain JzCzHz color object.
   *
   * @returns {JzCzHzColor} Plain JzCzHz color object
   */
  toColor(): JzCzHzColor {
    return this.color;
  }

  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component
   */
  get jz(): number {
    return this.color.jz;
  }

  /**
   * Gets the chroma component.
   *
   * @returns {number} Chroma component
   */
  get cz(): number {
    return this.color.cz;
  }

  /**
   * Gets the hue component.
   *
   * @returns {number} Hue component (0-360 degrees)
   */
  get hz(): number {
    return this.color.hz;
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
 * Creates a new JzCzHz color.
 *
 * @param {number} jz - Lightness component
 * @param {number} cz - Chroma component
 * @param {number} hz - Hue component (0-360 degrees)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {JzCzHzFactory} A new JzCzHz factory
 */
export function jzczhz(jz: number, cz: number, hz: number, alpha?: number): JzCzHzFactory {
  return new JzCzHzFactory(jz, cz, hz, alpha);
}
