import { ColorFactory } from '../factory';
import { hexToRGB, RGBColor, rgbToHex } from './rgb';
import { linearizeRGBColor } from './transform';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';

/**
 * Interface for RGB color factory functions
 */
export interface RGBFactory extends ColorFactory {
  /**
   * Gets the red component.
   *
   * @returns {number} Red component (0-1)
   */
  r: number;
  /**
   * Gets the green component.
   *
   * @returns {number} Green component (0-1)
   */
  g: number;
  /**
   * Gets the blue component.
   *
   * @returns {number} Blue component (0-1)
   */
  b: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain RGB color object.
   *
   * @returns {RGBColor} Plain RGB color object
   */
  toColor(): RGBColor;
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
  const color: RGBColor = { space: 'rgb', r, g, b, alpha };

  return {
    // Properties
    r,
    g,
    b,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      if (options?.css) {
        return rgbToCSSString(color);
      }
      return serializeV1(color);
    },

    toCSSString: () => rgbToCSSString(color),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Creates an RGB color from a hex string.
 *
 * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @param {boolean} [linearize=false] - Whether to linearize the RGB values
 * @returns {RGBFactory} A new RGB factory
 */
export function hexToFactory(hex: string, linearize: boolean = false): RGBFactory {
  const color = hexToRGB(hex);
  const finalColor = linearize ? linearizeRGBColor(color) : color;
  return rgb(finalColor.r, finalColor.g, finalColor.b, finalColor.alpha);
}

/**
 * Creates an RGB color from a hex string.
 *
 * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns {RGBFactory} A new RGB factory
 */
export function hex(hex: string): RGBFactory {
  return hexToFactory(hex);
}

/**
 * Creates a linearized RGB color from a hex string.
 *
 * @param {string} hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns {RGBFactory} A new RGB factory with linearized values
 */
export function hexLinear(hex: string): RGBFactory {
  return hexToFactory(hex, true);
}

/**
 * Converts an RGB color to a CSS-compatible string representation.
 *
 * @param {RGBColor} color - The RGB color to convert
 * @returns {string} CSS-compatible string representation of the RGB color
 */
export function rgbToCSSString(color: RGBColor): string {
  const { r, g, b, alpha } = color;

  // Convert to 0-255 range for CSS
  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);

  if (alpha !== undefined && alpha < 1) {
    return `rgba(${rInt}, ${gInt}, ${bInt}, ${alpha.toFixed(3)})`;
  }

  // For fully opaque colors, use hex format as it's more compact
  return rgbToHex(color);
}
