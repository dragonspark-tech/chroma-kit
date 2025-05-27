import type { Color } from '../../../../foundation';
import { parseColor } from '../../../../';
import { generateTailwindPalette } from './tailwind-generator';
import type { ColorPalette } from './palette.types';

/**
 * Represents a type for defining a specific generator family.
 * This type is used to categorize or specify the versioned family of a generator,
 * particularly for tools or frameworks where versioning differentiates functionality or compatibility.
 */
export type GeneratorFamily = 'Tailwind v4';

/**
 * Generates a color palette based on the specified base color and options.
 *
 * @param {Color | string} color - The input color to generate the palette from. Can be a `Color` object or a valid color string.
 * @param {boolean} [adjustContrast=true] - Indicates whether to adjust contrast for the generated palette to improve accessibility.
 * @param {boolean} [ensureColorInAdjustment=true] - Determines whether to ensure the base color is passed unmodified during the contrast adjustment process.
 * @param {GeneratorFamily} [family='Tailwind v4'] - The generator family to use for creating the palette. Defaults to 'Tailwind v4'.
 * @returns {ColorPalette} - The generated color palette as a `ColorPalette` object.
 * @throws {Error} - Throws an error if the specified `family` is not recognized.
 */
export const generatePalette = (
  color: Color | string,
  adjustContrast = true,
  ensureColorInAdjustment = true,
  family: GeneratorFamily = 'Tailwind v4'
): ColorPalette => {
  const baseColor = parseColor(color, 'oklch');
  switch (family) {
    case 'Tailwind v4':
      return generateTailwindPalette(baseColor, adjustContrast, ensureColorInAdjustment);
    default:
      throw new Error(`Unknown generator family: ${family}`);
  }
};
