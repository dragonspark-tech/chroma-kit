import { BaseColorFactory } from '../factory';
import { RGBColor, hexToRGB, rgbToHex } from './rgb';
import { linearizeRGBColor } from './transform';

/**
 * Factory for creating and manipulating RGB colors.
 */
export class RGBFactory extends BaseColorFactory {
  private color: RGBColor;

  /**
   * Creates a new RGB color factory.
   *
   * @param {number} r - Red component (0-1)
   * @param {number} g - Green component (0-1)
   * @param {number} b - Blue component (0-1)
   * @param {number} [alpha] - Alpha component (0-1)
   */
  constructor(r: number, g: number, b: number, alpha?: number) {
    super();
    this.color = { space: 'rgb', r, g, b, alpha };
  }

  /**
   * Creates an RGB color from a hex string, with optional linearization.
   *
   * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
   * @param {boolean} [linearize=false] - Whether to linearize the RGB values
   * @returns {RGBFactory} A new RGB factory
   */
  static fromHex(hex: string, linearize: boolean = false): RGBFactory {
    const color = hexToRGB(hex);
    const finalColor = linearize ? linearizeRGBColor(color) : color;
    return new RGBFactory(finalColor.r, finalColor.g, finalColor.b, finalColor.alpha);
  }

  /**
   * Creates a linearized RGB color from a hex string.
   *
   * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
   * @returns {RGBFactory} A new RGB factory with linearized values
   */
  static fromHexLinear(hex: string): RGBFactory {
    return RGBFactory.fromHex(hex, true);
  }

  /**
   * Converts the factory to a plain RGB color object.
   *
   * @returns {RGBColor} Plain RGB color object
   */
  toColor(): RGBColor {
    return this.color;
  }

  /**
   * Converts the RGB color to a CSS-compatible string representation.
   *
   * @returns {string} CSS-compatible string representation of the RGB color
   */
  toCSSString(): string {
    const { r, g, b, alpha } = this.color;

    // Convert to 0-255 range for CSS
    const rInt = Math.round(r * 255);
    const gInt = Math.round(g * 255);
    const bInt = Math.round(b * 255);

    if (alpha !== undefined && alpha < 1) {
      return `rgba(${rInt}, ${gInt}, ${bInt}, ${alpha.toFixed(3)})`;
    }

    // For fully opaque colors, use hex format as it's more compact
    return rgbToHex(this.color);
  }

  /**
   * Gets the red component.
   *
   * @returns {number} Red component (0-1)
   */
  get r(): number {
    return this.color.r;
  }

  /**
   * Gets the green component.
   *
   * @returns {number} Green component (0-1)
   */
  get g(): number {
    return this.color.g;
  }

  /**
   * Gets the blue component.
   *
   * @returns {number} Blue component (0-1)
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
 * Creates a new RGB color.
 *
 * @param {number} r - Red component (0-1)
 * @param {number} g - Green component (0-1)
 * @param {number} b - Blue component (0-1)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {RGBFactory} A new RGB factory
 */
export function rgb(r: number, g: number, b: number, alpha?: number): RGBFactory {
  return new RGBFactory(r, g, b, alpha);
}

/**
 * Creates an RGB color from a hex string.
 *
 * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns {RGBFactory} A new RGB factory
 */
export function hex(hex: string): RGBFactory {
  return RGBFactory.fromHex(hex);
}

/**
 * Creates a linearized RGB color from a hex string.
 *
 * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns {RGBFactory} A new RGB factory with linearized values
 */
export function hexLinear(hex: string): RGBFactory {
  return RGBFactory.fromHexLinear(hex);
}
