import { describe, it, expect } from 'vitest';
import { generatePalette, type GeneratorFamily } from '../../../plugins/palettes';
import { oklch } from '../../../models/oklch';
import { hexToRGB, rgbToOKLCh } from '../../../models/rgb';
import { generateTailwindPalette } from '../../../plugins/palettes/fn';
import { TailwindColors } from '../../../plugins/tailwind';
import { generateRadixPalette } from '../../../plugins/palettes/src/generators/radix-generator';
import { RadixColors } from '../../../plugins/radix/src/colors';

const base = '#69AE5D';
const oklchBase = rgbToOKLCh(hexToRGB(base));

describe('Color Palettes Plugin - Palette Generation', () => {
  describe('generatePalette', () => {
    it('should accurately parse and generate a palette without alterations', () => {
      const palette = generatePalette(base, false, false, 'Tailwind v4');
      expect(palette).toMatchSnapshot();
    });

    it('should accurately parse and generate a palette with alterations', () => {
      const palette = generatePalette(oklchBase, true, false, 'Tailwind v4');
      expect(palette).toMatchSnapshot();
    });

    it('should accurately parse and generate a palette without alterations preserving the original color', () => {
      const palette = generatePalette(base, false, true, 'Tailwind v4');
      expect(palette).toMatchSnapshot();
    });

    it('should accurately parse and generate a palette with alterations preserving the original color', () => {
      const palette = generatePalette(oklchBase, true, true, 'Tailwind v4');
      expect(palette).toMatchSnapshot();
    });

    it('should generate a Radix UI palette', () => {
      const palette = generatePalette(base, true, true, 'Radix UI');
      expect(palette).toMatchSnapshot();
    });

    it('should error when an incorrect family is provided', () => {
      expect(() =>
        generatePalette(base, false, false, 'Teil wind v5' as unknown as GeneratorFamily)
      ).toThrowError('Unknown generator family: Teil wind v5');
    });

    it('should generate an adjusted, Tailwind v4-based, color-assured palette by default', () => {
      const palette = generatePalette(base, undefined, undefined, 'Tailwind v4');
      expect(palette).toMatchSnapshot();
    });
  });

  describe('generateTailwindPalette', () => {
    it('should generate an adjusted, Tailwind v4-based, color-assured palette', () => {
      const palette = generateTailwindPalette(oklchBase);
      expect(palette).toMatchSnapshot();
    });

    it('should handle generation of matching tailwind color palettes', () => {
      const palette = generateTailwindPalette(TailwindColors.Green[500]);
      expect(palette['500'].oklch).toEqual(TailwindColors.Green[500].toCSSString());
    });

    it('should handle generation of color palettes with out of sRGB gamut inputs', () => {
      const vibrantColor = oklch(0.55, 0.45, 330);
      expect(generateTailwindPalette(vibrantColor)).toMatchSnapshot();
    });
  });

  describe('generateRadixPalette', () => {
    it('should generate an adjusted, Tailwind v4-based, color-assured palette', () => {
      const palette = generateRadixPalette(oklchBase);
      expect(palette).toMatchSnapshot();
    });

    it('should handle generation of matching tailwind color palettes', () => {
      const palette = generateRadixPalette(RadixColors.Green[5].dark);
      expect(palette.dark[5].oklch).toEqual(RadixColors.Green[5].dark.toCSSString());
    });

    it('should handle generation of color palettes with out of sRGB gamut inputs', () => {
      const vibrantColor = oklch(0.55, 0.45, 330);
      expect(generateRadixPalette(vibrantColor)).toMatchSnapshot();
    });

    it('should generate a palette with contrast adjustment but without ensuring the original color', () => {
      const palette = generateRadixPalette(oklchBase, true, false);
      expect(palette).toMatchSnapshot();
    });

    it('should generate a palette without contrast adjustment', () => {
      const palette = generateRadixPalette(oklchBase, false);
      expect(palette).toMatchSnapshot();
    });
  });
});
