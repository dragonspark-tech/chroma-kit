import type { Color } from '../../foundation';
import { parseV1 } from '../../fn';

/**
 * Clips a channel value within the specified minimum and maximum bounds.
 *
 * @param {number} channel - The value to be clipped.
 * @param {number | null} min - The minimum allowable value for the channel.
 *                              If null, no minimum limit is applied.
 * @param {number | null} max - The maximum allowable value for the channel.
 *                              If null, no maximum limit is applied.
 * @returns {number} - The clipped channel value within the specified bounds.
 */
const clipChannel = (channel: number, min: number | null, max: number | null): number =>
  Math.max(Math.min(channel, max ?? Infinity), min ?? -Infinity);

/**
 * Clips the color channels of a given color object within their specified range.
 *
 * This function iterates through the channels of the given color object and ensures
 * that each channel value lies within the defined range. If a channel value surpasses
 * its limits, it is clipped to the minimum or maximum value as appropriate. The color
 * is then reconstructed and returned.
 *
 * @template T - The type extending the Color interface.
 * @param {T} color - The color object whose channels are to be clipped. It must have
 * a `channels` property mapping channel names to their range, as well as potentially
 * a `space` and `alpha` property.
 * @returns {T} - A new color object with its channel values clipped to their respective ranges.
 */
export const clipGamut = <T extends Color>(color: T): T => {
  const processedChannels: number[] = [];

  for (const [channelKey, channel] of Object.entries(color.channels)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Any cast is necessary, as the color object may have additional properties
    const value = (color as any)[channelKey];
    if (typeof value !== 'number') continue;

    const [cMin, cMax] = channel.range;
    if ((cMin !== null && value < cMin) || (cMax !== null && value > cMax)) {
      processedChannels.push(clipChannel(value, cMin, cMax));
    } else {
      processedChannels.push(value);
    }
  }

  const channelString = processedChannels.join(' ');
  const alphaString = color.alpha !== undefined ? ` / ${color.alpha.toString()}` : '';

  return parseV1(`ChromaKit|v1 ${color.space} ${channelString}${alphaString}`) as T;
};
