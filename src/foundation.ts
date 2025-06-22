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
import type { P3Color } from './models/p3/p3';

/**
 * A type representing a color in various color spaces.
 * This type provides flexibility to handle multiple color formats depending on application requirements.
 */
export type Color =
  | RGBColor
  | P3Color
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
  : T extends 'p3'
    ? P3Color
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
