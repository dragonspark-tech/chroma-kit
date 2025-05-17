import { BaseColorFactory } from '../factory';
import { OKLabColor } from './oklab';

/**
 * Factory for creating and manipulating OKLab colors.
 */
export class OKLabFactory extends BaseColorFactory {
  private color: OKLabColor;

  /**
   * Creates a new OKLab color factory.
   *
   * @param {number} l - Lightness component (0-1)
   * @param {number} a - Green-red component
   * @param {number} b - Blue-yellow component
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(l: number, a: number, b: number, alpha?: number) {
    super();
    this.color = { space: 'oklab', l, a, b, alpha };
  }

  /**
   * Converts the factory to a plain OKLab color object.
   *
   * @returns {OKLabColor} Plain OKLab color object
   */
  toColor(): OKLabColor {
    return this.color;
  }

  /**
   * Converts the OKLab color to a CSS-compatible string representation.
   *
   * @returns {string} CSS-compatible string representation of the OKLab color
   */
  toCSSString(): string {
    const { l, a, b, alpha } = this.color;

    // Convert lightness to percentage for CSS
    const lPercent = l.toFixed(3);

    if (alpha !== undefined && alpha < 1) {
      return `oklab(${lPercent} ${a.toFixed(4)} ${b.toFixed(4)} / ${alpha.toFixed(3)})`;
    }

    return `oklab(${lPercent} ${a.toFixed(4)} ${b.toFixed(4)})`;
  }

  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-1)
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
 * Creates a new OKLab color.
 *
 * @param {number} l - Lightness component (0-1)
 * @param {number} a - Green-red component
 * @param {number} b - Blue-yellow component
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {OKLabFactory} A new OKLab factory
 */
export function oklab(l: number, a: number, b: number, alpha?: number): OKLabFactory {
  return new OKLabFactory(l, a, b, alpha);
}
