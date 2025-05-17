import { ColorFactory } from '../factory';
import { HSLColor, hslToRGB } from './hsl';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';
import { rgbToCSSString } from '../rgb/factory';

/**
 * Interface for HSL color factory functions
 */
export interface HSLFactory extends ColorFactory {
  /**
   * Gets the hue component.
   *
   * @returns {number} Hue component (0-360 degrees)
   */
  h: number;
  /**
   * Gets the saturation component.
   *
   * @returns {number} Saturation component (0-1)
   */
  s: number;
  /**
   * Gets the lightness component.
   *
   * @returns {number} Lightness component (0-1)
   */
  l: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain HSL color object.
   *
   * @returns {HSLColor} Plain HSL color object
   */
  toColor(): HSLColor;
}

/**
 * Creates a new HSL color.
 *
 * @param {number} h - Hue component (0-360 degrees)
 * @param {number} s - Saturation component (0-1)
 * @param {number} l - Lightness component (0-1)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {HSLFactory} A new HSL factory
 */
export function hsl(h: number, s: number, l: number, alpha?: number): HSLFactory {
  const color: HSLColor = { space: 'hsl', h, s, l, alpha };

  return {
    // Properties
    h,
    s,
    l,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      if (options?.css) {
        return hslToCSSString(color);
      }
      return serializeV1(color);
    },

    toCSSString: () => hslToCSSString(color),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Converts an HSL color to a CSS-compatible string representation.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {string} CSS-compatible string representation of the HSL color
 */
export function hslToCSSString(color: HSLColor): string {
  const { h, s, l, alpha } = color;

  // Convert saturation and lightness to percentages for CSS
  const sPercent = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  if (alpha !== undefined && alpha < 1) {
    return `hsla(${Math.round(h)}, ${sPercent}%, ${lPercent}%, ${alpha.toFixed(3)})`;
  }

  // For fully opaque colors, use the standard hsl format
  return `hsl(${Math.round(h)}, ${sPercent}%, ${lPercent}%)`;
}

/**
 * Converts an HSL color to a CSS-compatible RGB string representation.
 * This is useful for browsers that don't support HSL.
 *
 * @param {HSLColor} color - The HSL color to convert
 * @returns {string} CSS-compatible RGB string representation of the HSL color
 */
export function hslToRGBString(color: HSLColor): string {
  return rgbToCSSString(hslToRGB(color));
}
