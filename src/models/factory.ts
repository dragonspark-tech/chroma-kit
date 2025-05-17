import { serializeV1 } from '../semantics/serialization';

/**
 * Base interface for color factory objects.
 *
 * This interface defines the common methods that all color factories should implement,
 * including toString() with optional CSS formatting and a toCSSString() method for
 * color spaces that can be represented in CSS.
 */
export interface ColorFactory {
  /**
   * Converts the color to a string representation.
   *
   * @param {Object} [options] - Options for string conversion
   * @param {boolean} [options.css=false] - If true, returns CSS-compatible string
   * @returns {string} String representation of the color
   */
  toString(options?: { css?: boolean }): string;

  /**
   * Converts the color to a CSS-compatible string representation.
   * This method is only implemented for color spaces that can be represented in CSS.
   *
   * @returns {string} CSS-compatible string representation of the color
   * @throws {Error} If the color space is not representable in CSS
   */
  toCSSString?(): string;

  to(colorSpace: string): ColorFactory | null;
}

/**
 * Base class for color factories that implements common functionality.
 */
export abstract class BaseColorFactory implements ColorFactory {
  /**
   * Converts the color to a string representation.
   *
   * @param {Object} [options] - Options for string conversion
   * @param {boolean} [options.css=false] - If true, returns CSS-compatible string
   * @returns {string} String representation of the color
   */
  toString(options?: { css?: boolean }): string {
    if (options?.css && this.toCSSString) {
      return this.toCSSString();
    }
    return serializeV1(this.toColor());
  }

  /**
   * Converts the color to a CSS-compatible string representation.
   * This default implementation throws an error as not all color spaces
   * can be represented in CSS.
   *
   * @returns {string} CSS-compatible string representation of the color
   * @throws {Error} If the color space is not representable in CSS
   */
  toCSSString(): string {
    throw new Error('This color space is not representable in CSS.');
  }

  /**
   * Converts the factory to a plain color object.
   *
   * @returns {any} Plain color object
   */
  abstract toColor(): any;

  /**
   * Converts the current color to the specified color space.
   *
   * @param {string} colorSpace - The target color space to convert to.
   * @return {ColorFactory | null} The converted color object in the specified color space,
   * or null if conversion is not possible.
   */
  abstract to(colorSpace: string): ColorFactory | null;
}

/**
 * Type guard to check if a color factory supports CSS representation.
 *
 * @param {ColorFactory} factory - The color factory to check
 * @returns {boolean} True if the factory supports CSS representation
 */
export function supportsCSSRepresentation(factory: ColorFactory): factory is ColorFactory & {
  toCSSString: () => string;
} {
  return typeof (factory as any).toCSSString === 'function';
}
