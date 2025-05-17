import { BaseColorFactory } from '../factory';
import { LabColor } from './lab';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';

/**
 * Factory for creating and manipulating Lab colors.
 */
export class LabFactory extends BaseColorFactory {
  private color: LabColor;

  /**
   * Creates a new Lab color factory.
   *
   * @param {number} l - Lightness component (0-100)
   * @param {number} a - Green-red component
   * @param {number} b - Blue-yellow component
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(l: number, a: number, b: number, alpha?: number) {
    super();
    this.color = { space: 'lab', l, a, b, alpha };
  }

  /**
   * Converts the factory to a plain Lab color object.
   *
   * @returns {LabColor} Plain Lab color object
   */
  toColor(): LabColor {
    return this.color;
  }

  /**
   * Converts the Lab color to a CSS-compatible string representation.
   *
   * @returns {string} CSS-compatible string representation of the Lab color
   */
  toCSSString(): string {
    const { l, a, b, alpha } = this.color;

    if (alpha !== undefined && alpha < 1) {
      return `lab(${l.toFixed(1)}% ${a.toFixed(1)} ${b.toFixed(1)} / ${alpha.toFixed(3)})`;
    }

    return `lab(${l.toFixed(1)}% ${a.toFixed(1)} ${b.toFixed(1)})`;
  }

  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-100)
   */
  get l(): number {
    return this.color.l;
  }

  /**
   * Gets the green-red component.
   *
   * @returns {number} Green-red component
   */
  get a(): number {
    return this.color.a;
  }

  /**
   * Gets the blue-yellow component.
   *
   * @returns {number} Blue-yellow component
   */
  get b(): number {
    return this.color.b;
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
 * Creates a new Lab color.
 *
 * @param {number} l - Lightness component (0-100)
 * @param {number} a - Green-red component
 * @param {number} b - Blue-yellow component
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {LabFactory} A new Lab factory
 */
export function lab(l: number, a: number, b: number, alpha?: number): LabFactory {
  return new LabFactory(l, a, b, alpha);
}
