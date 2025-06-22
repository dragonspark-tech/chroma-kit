/**
 * Represents a range of channels, defined by a tuple containing two numeric values or null.
 * The tuple includes a starting value and an ending value for the range.
 *
 * The range is defined as:
 * - The first element in the tuple is the starting value of the range, or null if not specified.
 * - The second element in the tuple is the ending value of the range, or null if not specified.
 *
 * This type can be used to define or manipulate numeric ranges for specific purposes, where bounds may be optional.
 */
export type ChannelRange = [number | null, number | null];

/**
 * Enum representing various channel attributes.
 *
 * ChannelAttribute provides a set of pre-defined values associated with specific channel characteristics.
 * These attributes can be used for categorization or functional purposes in applications.
 *
 * Enumeration values:
 * - ANGLE: Represents angle-related attribute.
 * - PERCENTAGE: Represents percentage-related attribute.
 * - OPTIONAL_PERCENTAGE: Represents an optional percentage-related attribute.
 * - MIRROR_PERCENTAGE: Represents a mirrored percentage-related attribute.
 */
export enum ChannelAttribute {
  ANGLE = 1,
  PERCENTAGE = 2,

  OPTIONAL_PERCENTAGE = 4,
  MIRROR_PERCENTAGE = 8
}

/**
 * Represents a color channel within a defined structure.
 * This interface is used to encapsulate all properties and information related to a color channel.
 *
 * Properties:
 * - `accessor`: A unique identifier or key used to access this color channel.
 * - `name`: The descriptive name of the color channel.
 * - `range`: The valid range of values the color channel can hold, defined as a `ChannelRange`.
 * - `attributes`: Bitmask derived from {@link ChannelAttribute}.
 */
export interface ColorChannel {
  accessor: string;
  name: string;

  range: ChannelRange;

  attributes: number;
}

/**
 * Creates a color channel object with specified properties.
 *
 * @param {string} accessor - The data accessor that defines the source of the channel's values.
 * @param {string} name - The name of the channel.
 * @param {ChannelRange} [range=[null, null]] - The range of values for the channel. Defaults to a range with null bounds.
 * @param {ChannelAttribute[]} [attributes=[]] - An array of attributes associated with the channel. Defaults to an empty array.
 * @returns {ColorChannel} The color channel object with computed properties and provided inputs.
 */
export const channel = (
  accessor: string,
  name: string,
  range: ChannelRange = [null, null],
  attributes: ChannelAttribute[] = []
): ColorChannel => ({
  accessor,
  name,

  range,

  attributes: attributes.reduce((acc, attr) => acc | attr, 0)
});
