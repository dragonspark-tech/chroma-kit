import { BaseColorFactory } from '../factory';
import { XYZColor } from './xyz';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';

/**
 * Factory for creating and manipulating XYZ colors.
 */
export class XYZFactory extends BaseColorFactory {
  private color: XYZColor;

  /**
   * Creates a new XYZ color factory.
   *
   * @param {number} x - X component
   * @param {number} y - Y component
   * @param {number} z - Z component
   * @param {number} [alpha] - Alpha component (0-1)
   * @param {Illuminant} [illuminant] - Reference white point (defaults to D65)
   */
  constructor(x: number, y: number, z: number, alpha?: number, illuminant: Illuminant = IlluminantD65) {
    super();
    this.color = { space: 'xyz', x, y, z, alpha, illuminant };
  }

  /**
   * Converts the factory to a plain XYZ color object.
   *
   * @returns {XYZColor} Plain XYZ color object
   */
  toColor(): XYZColor {
    return this.color;
  }

  /**
   * Gets the X component.
   *
   * @returns {number} X component
   */
  get x(): number {
    return this.color.x;
  }

  /**
   * Gets the Y component.
   *
   * @returns {number} Y component
   */
  get y(): number {
    return this.color.y;
  }

  /**
   * Gets the Z component.
   *
   * @returns {number} Z component
   */
  get z(): number {
    return this.color.z;
  }

  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  get alpha(): number | undefined {
    return this.color.alpha;
  }

  /**
   * Gets the illuminant (reference white point).
   *
   * @returns {Illuminant} Illuminant
   */
  get illuminant(): Illuminant {
    return this.color.illuminant || IlluminantD65;
  }
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
export function xyz(x: number, y: number, z: number, alpha?: number, illuminant?: Illuminant): XYZFactory {
  return new XYZFactory(x, y, z, alpha, illuminant);
}
