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
 * Represents a color channel within a system.
 *
 * This interface is used to define the properties and characteristics of a
 * specific color channel, including its name, permissible range, binding state,
 * and additional attributes.
 *
 * Properties:
 * - `name`: A string representing the name of the color channel.
 * - `range`: An object defining the valid range for this channel.
 * - `isBound` (optional): A boolean indicating whether the channel is bound to a specific property.
 * - `attributes`: A numeric representation of attributes associated with the channel.
 */
export interface ColorChannel {
  accessor: string;
  name: string;

  range: ChannelRange;
  isBound?: boolean;

  attributes: number;
}

/**
 * Creates a color channel object with the given name, range, and attributes.
 *
 * @param {string} name - The name of the color channel.
 * @param {ChannelRange} [range=[null, null]] - The range of the color channel as a tuple of two values, defaulting to [null, null].
 * @param {ChannelAttribute[]} [attributes=[]] - An array of attributes relevant to the channel, defaulting to an empty array.
 * @returns {ColorChannel} - Returns a color channel object containing the specified properties:
 *                            - name: The name of the channel.
 *                            - range: The range of the channel.
 *                            - isBound: A boolean indicating whether the range is bounded (i.e., at least one value in the range is not null).
 *                            - attributes: A bitwise OR of all channel attributes provided.
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
  isBound: range.some((r) => r !== null),

  attributes: attributes.reduce((acc, attr) => acc | attr, 0)
});
