export type {
  ColorPaletteShade,
  TailwindColorPalette,
  RadixColorPalette,
  RadixColorFamily
} from './src/generators/palette.types';

export {
  generatePalette,
  type GeneratorFamily,
  type CreatedPalette
} from './src/generators/auto-generator';
