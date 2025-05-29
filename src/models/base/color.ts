import type { ColorSpace, CreatedColor } from '../../foundation';
import type { ColorChannel } from './channel';

/**
 * ColorBase interface represents a base structure for handling color information and conversions.
 *
 * This interface contains a set of properties and methods to represent a color in a specific color space,
 * manipulate its alpha (transparency), and perform conversions between different color spaces.
 *
 * Properties:
 * - `space`: Specifies the color space of the color, such as "RGB", "HSL", or others.
 * - `alpha`: An optional alpha (transparency) value ranging from 0 (fully transparent) to 1 (fully opaque).
 *
 * Methods:
 * - `toString`: Converts the color object into a string representation.
 * - `toCSSString`: Converts the color object into a CSS-compatible string representation.
 * - `to`: Converts the color into a specified target color space.
 *
 * This interface serves as the foundation for implementing color handling and manipulation in a flexible way.
 */
export interface ColorBase {
  space: string;

  channels: Record<string, ColorChannel>;
  alpha?: number;

  toString: () => string;
  toCSSString: () => string;
  to: <T extends ColorSpace>(colorSpace: T) => CreatedColor<T>;
}
