import type { Color } from '../foundation';

/**
 * Checks if the color space for the given color is unbound.
 *
 * A color space is considered unbound if all the range values of its channels are null.
 * This function iterates through all channel ranges of the input color and ensures
 * that every range value is null.
 *
 * @param {Color} color - The color object containing channel information to be evaluated.
 * @returns {boolean} True if all channel ranges in the color are unbound (null), otherwise false.
 */
export const isColorSpaceUnbound = (color: Color): boolean =>
  Object.values(color.channels).every((cn) => cn.range.every((r) => r === null));

/**
 * Determines whether a given color is within the gamut of its defined color space.
 *
 * @param {Color} color - The color object to evaluate, containing channel data and range definitions.
 * @returns {boolean} - Returns `true` if the color is within its gamut or has an unbound color space, otherwise `false`.
 */
export const isInGamut = (color: Color): boolean => {
  if (isColorSpaceUnbound(color)) return true;

  for (const [channelKey, channel] of Object.entries(color.channels)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Any cast is necessary, as the color object may have additional properties
    const value = (color as any)[channelKey];
    if (typeof value !== 'number') continue;

    const [cMin, cMax] = channel.range;
    if ((cMin !== null && value < cMin) || (cMax !== null && value > cMax)) {
      return false;
    }
  }

  return true;
};
