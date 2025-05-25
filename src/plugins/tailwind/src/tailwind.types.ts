import { OKLChColor } from '../../../models/oklch';

export type TailwindPalette = {
  50: OKLChColor;
  100: OKLChColor;
  200: OKLChColor;
  300: OKLChColor;
  400: OKLChColor;
  500: OKLChColor;
  600: OKLChColor;
  700: OKLChColor;
  800: OKLChColor;
  900: OKLChColor;
  950: OKLChColor;
}

export type TailwindPalettes = {
  [key: string]: TailwindPalette;
};
