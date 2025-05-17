import { BaseColorFactory } from '../factory';
import { JzAzBzColor } from './jzazbz';

/**
 * Factory for creating and manipulating JzAzBz colors.
 */
export class JzAzBzFactory extends BaseColorFactory {
  private color: JzAzBzColor;

  /**
   * Creates a new JzAzBz color factory.
   *
   * @param {number} jz - Lightness component
   * @param {number} az - Green-red component
   * @param {number} bz - Blue-yellow component
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(jz: number, az: number, bz: number, alpha?: number) {
    super();
    this.color = { space: 'jzazbz', jz, az, bz, alpha };
  }

  /**
   * Converts the factory to a plain JzAzBz color object.
   *
   * @returns {JzAzBzColor} Plain JzAzBz color object
   */
  toColor(): JzAzBzColor {
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
   * Gets the green-red component.
   *
   * @returns {number} Green-red component
   */
  get az(): number {
    return this.color.az;
  }

  /**
   * Gets the blue-yellow component.
   *
   * @returns {number} Blue-yellow component
   */
  get bz(): number {
    return this.color.bz;
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
 * Creates a new JzAzBz color.
 *
 * @param {number} jz - Lightness component
 * @param {number} az - Green-red component
 * @param {number} bz - Blue-yellow component
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {JzAzBzFactory} A new JzAzBz factory
 */
export function jzazbz(jz: number, az: number, bz: number, alpha?: number): JzAzBzFactory {
  return new JzAzBzFactory(jz, az, bz, alpha);
}
