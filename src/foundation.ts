import type { LChColor } from './models/lch';
import type { OKLabColor } from './models/oklab';
import type { OKLChColor } from './models/oklch';
import type { JzAzBzColor } from './models/jzazbz';
import type { JzCzHzColor } from './models/jzczhz';
import type { LabColor } from './models/lab';
import type { RGBColor } from './models/rgb';
import type { XYZColor } from './models/xyz';
import type { HSLColor } from './models/hsl';
import type { HSVColor } from './models/hsv';
import type { HWBColor } from './models/hwb';

/**
 * A type representing a color in various color spaces. Color can be expressed in one of the following formats:
 * - RGBColor: Standard Red Green Blue color space.
 * - HSLColor: Hue, Saturation, Lightness color representation.
 * - HSVColor: Hue, Saturation, Value color representation.
 * - HWBColor: Hue, Whiteness, Blackness color model.
 * - XYZColor: CIE 1931 color space.
 * - LabColor: CIE Lab color space.
 * - LChColor: Lightness, Chroma, and Hue color model.
 * - OKLabColor: Perceptually uniform Lab color space.
 * - OKLChColor: Perceptually uniform LCh color space.
 * - JzAzBzColor: Uniform color space designed for high dynamic range.
 * - JzCzHzColor: JzAzBz sibling with chroma and hue components.
 *
 * This type provides flexibility to handle multiple color formats depending on application requirements.
 */
export type Color =
  | RGBColor
  | HSLColor
  | HSVColor
  | HWBColor
  | XYZColor
  | LabColor
  | LChColor
  | OKLabColor
  | OKLChColor
  | JzAzBzColor
  | JzCzHzColor;

/**
 * Represents the color space of a given color type.
 *
 * The `ColorSpace` type is derived from the `space` property of the `Color` interface.
 * It defines the specific color encoding such as RGB, HSL, LAB, or other color spaces.
 *
 * This type is typically used to specify or query the color space
 * associated with a color object in a type-safe way.
 */
export type ColorSpace = Color['space'];

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

  alpha?: number;
  toString: () => string;
  toCSSString: () => string;
  to: <T extends ColorSpace>(colorSpace: T) => CreatedColor<T>;
}

/**
 * Represents a type that maps a `ColorSpace` to its corresponding color model.
 *
 * This type alias allows for conditional extraction of a specific color model
 * based on the provided `ColorSpace` type parameter. Supported color spaces
 * include 'rgb', 'xyz', 'hsl', 'hsv', 'hwb', 'lab', 'lch', 'oklab',
 * 'oklch', 'jzazbz', and 'jzczhz'. If a provided color space does not match
 * one of these, the type resolves to `never`.
 *
 * @template T Extends the `ColorSpace` defining the color space to retrieve.
 */
export type CreatedColor<T extends ColorSpace> = T extends 'rgb'
  ? RGBColor
  : T extends 'xyz'
    ? XYZColor
    : T extends 'hsl'
      ? HSLColor
      : T extends 'hsv'
        ? HSVColor
        : T extends 'hwb'
          ? HWBColor
          : T extends 'lab'
            ? LabColor
            : T extends 'lch'
              ? LChColor
              : T extends 'oklab'
                ? OKLabColor
                : T extends 'oklch'
                  ? OKLChColor
                  : T extends 'jzazbz'
                    ? JzAzBzColor
                    : T extends 'jzczhz'
                      ? JzCzHzColor
                      : never;

/**
 * A mapping of color spaces to their respective channel identifiers.
 *
 * The `colorMappings` object defines a collection of color spaces and their corresponding
 * array of string identifiers representing the channels in that particular color space.
 *
 * Each color space is represented as a key in the object, and its value is an array of
 * strings that denote the individual channel names used for that color space.
 *
 * It uses the `Record` utility type to ensure that each key corresponds to a predefined
 * `ColorSpace` and the associated values are readonly arrays of strings.
 */
export const colorVectorMappings: Record<ColorSpace, readonly string[]> = {
  rgb: ['r', 'g', 'b'],
  xyz: ['x', 'y', 'z'],
  hsl: ['h', 's', 'l'],
  hsv: ['h', 's', 'v'],
  hwb: ['h', 'w', 'b'],
  lab: ['l', 'a', 'b'],
  lch: ['l', 'c', 'h'],
  oklab: ['l', 'a', 'b'],
  oklch: ['l', 'c', 'h'],
  jzazbz: ['jz', 'az', 'bz'],
  jzczhz: ['jz', 'cz', 'hz']
} as const;
