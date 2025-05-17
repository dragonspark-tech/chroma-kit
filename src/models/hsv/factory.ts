import { ColorFactory } from '../factory';
import { HSVColor, hsvToHSL, hsvToRGB } from './hsv';
import { convertColor } from '../../conversion/conversion';
import { serializeV1 } from '../../semantics/serialization';
import { rgbToCSSString } from '../rgb/factory';
import { hslToCSSString } from '../hsl';

/**
 * Interface for HSV color factory functions
 */
export interface HSVFactory extends ColorFactory {
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
   * Gets the value component.
   *
   * @returns {number} Value component (0-1)
   */
  v: number;
  /**
   * Gets the alpha component.
   *
   * @returns {number|undefined} Alpha component (0-1) or undefined
   */
  alpha: number | undefined;

  /**
   * Converts the factory to a plain HSV color object.
   *
   * @returns {HSVColor} Plain HSV color object
   */
  toColor(): HSVColor;
}

/**
 * Creates a new HSV color.
 *
 * @param {number} h - Hue component (0-360 degrees)
 * @param {number} s - Saturation component (0-1)
 * @param {number} v - Value component (0-1)
 * @param {number} [alpha] - Alpha component (0-1)
 * @returns {HSVFactory} A new HSV factory
 */
/*@__NO_SIDE_EFFECTS__*/
export function hsv(h: number, s: number, v: number, alpha?: number): HSVFactory {
  const color: HSVColor = { space: 'hsv', h, s, v, alpha };

  return {
    // Properties
    h,
    s,
    v,
    alpha,

    // Methods
    toColor: () => color,

    toString: (options?: { css?: boolean }) => {
      if (options?.css) {
        return hslToCSSString(hsvToHSL(color));
      }
      return serializeV1(color);
    },

    toCSSString: () => hslToCSSString(hsvToHSL(color)),

    to: (colorSpace: string) => convertColor(color, colorSpace)
  };
}

/**
 * Converts an HSV color to a CSS-compatible RGB string representation.
 * HSV is not directly supported in CSS, so we convert to RGB.
 *
 * @param {HSVColor} color - The HSV color to convert
 * @returns {string} CSS-compatible RGB string representation of the HSV color
 */
/*@__NO_SIDE_EFFECTS__*/
export function hsvToRGBString(color: HSVColor): string {
  return rgbToCSSString(hsvToRGB(color));
}
