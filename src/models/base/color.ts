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
  isPolar: boolean;
  dynamicRange: 'SDR' | 'HDR';

  channels: Record<string, ColorChannel>;
  alpha?: number;

  toString: () => string;
  toCSSString: () => string;
  to: <T extends ColorSpace>(colorSpace: T) => CreatedColor<T>;
}

/**
 * Extracts the numeric channels from a color object and returns them as an array of numbers.
 *
 * @template T - A type that extends the ColorBase interface, representing a color object.
 * @param {T} color - The color object from which to extract numeric channel values.
 * @returns {number[]} An array of numeric values representing the color's channels.
 */
export const getColorChannels = <T extends ColorBase>(color: T): number[] => {
  const channels: number[] = [];

  for (const [channelKey] of Object.entries(color.channels)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Any cast is necessary, as the color object may have additional properties
    const value = (color as any)[channelKey];
    if (typeof value !== 'number') continue;

    channels.push(value);
  }

  return channels;
};
