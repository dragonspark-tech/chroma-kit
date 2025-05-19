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

export type Color =
  | RGBColor
  | HSLColor
  | HSVColor
  | XYZColor
  | LabColor
  | LChColor
  | OKLabColor
  | OKLChColor
  | JzAzBzColor
  | JzCzHzColor;

export type ColorSpace = Color['space'];

export interface ColorBase {
  space: string;

  alpha?: number;
  toString: () => string;
  toCSSString: () => string;
  to: <T extends ColorBase>(colorSpace: ColorSpace) => T;
}

export type CreatedColor<T extends ColorSpace> = T extends 'rgb'
  ? RGBColor
  : T extends 'xyz'
    ? XYZColor
    : T extends 'hsl'
      ? HSLColor
      : T extends 'hsv'
        ? HSVColor
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
  lab: ['l', 'a', 'b'],
  lch: ['l', 'c', 'h'],
  oklab: ['l', 'a', 'b'],
  oklch: ['l', 'c', 'h'],
  jzazbz: ['jz', 'az', 'bz'],
  jzczhz: ['jz', 'cz', 'hz']
} as const;
