import type { Color } from '../../../../foundation';
import { parseColor } from '../../../../';
import { generateTailwindPalette } from './tailwind-generator';
import type { RadixColorFamily, TailwindColorPalette } from './palette.types';
import { generateRadixPalette } from './radix-generator';

/**
 * Represents a type for defining a specific generator family.
 * This type is used to categorize or specify the versioned family of a generator,
 * particularly for tools or frameworks where versioning differentiates functionality or compatibility.
 */
export type GeneratorFamily = 'Tailwind v4' | 'Radix UI';

type CreatedPalette<T extends GeneratorFamily> = T extends 'Tailwind v4'
  ? TailwindColorPalette
  : T extends 'Radix UI'
    ? RadixColorFamily
    : never;

export const generatePalette = <T extends GeneratorFamily>(
  color: Color | string,
  adjustContrast = true,
  ensureColorInAdjustment = true,
  family: T
): CreatedPalette<T> => {
  const baseColor = parseColor(color, 'oklch');
  switch (family) {
    case 'Tailwind v4':
      return generateTailwindPalette(
        baseColor,
        adjustContrast,
        ensureColorInAdjustment
      ) as CreatedPalette<T>;
    case 'Radix UI':
      return generateRadixPalette(
        baseColor,
        adjustContrast,
        ensureColorInAdjustment
      ) as CreatedPalette<T>;
    default:
      throw new Error(`Unknown generator family: ${family}`);
  }
};
