import { oklch, OKLChColor, oklchToRGB } from '../../../../models/oklch';
import { TailwindColors } from '../../../tailwind';
import { findClosestTailwindFamily } from '../support/find-shade';
import { TailwindPalette } from '../../../tailwind/src/tailwind.types';
import { ShadeContrastAverages } from '../support/contrast-averages';
import { getOptimalColorForContrastAPCA } from '../../../a11y/fn';
import { isInSRGB, rgb, rgbToOKLCh } from '../../../../models/rgb';
import { ColorPalette, ColorPaletteShade } from './palette.types';

/**
 * Generates a Tailwind-compatible color palette from a given OKLCh color, allowing for optional contrast adjustments.
 *
 * @param {OKLChColor} input - The base OKLCh color to generate a palette from.
 * @param {boolean} [adjustContrast=false] - Optional flag to adjust contrast for optimal readability.
 * @param {boolean} [ensureColorInAdjustment=true] - Optional flag to ensure the input color is included in the generated palette adjustments.
 * @returns {ColorPalette} The generated color palette, structured in a Tailwind-compatible format, including the canonical OKLCh colors, RGB strings, and chroma key values across different shade numbers.
 */
export const generateTailwindPalette = (
  input: OKLChColor,
  adjustContrast: boolean = true,
  ensureColorInAdjustment: boolean = true
): ColorPalette => {
  const availableSchemas: Record<string, TailwindPalette> = Object.fromEntries(
    Object.entries(TailwindColors).filter(
      ([n]) => !['Slate', 'Gray', 'Zinc', 'Neutral', 'Stone'].includes(n)
    )
  );

  const closest = findClosestTailwindFamily(input, availableSchemas);

  const inputHue = input.h;
  const baseHue = closest.shade.color.h;

  let ΔHue = (((inputHue - baseHue) % 360) + 360) % 360; // wrap to [0,360)
  let hueMode: 'replace' | 'operate' = 'operate';

  if (ΔHue === 0) {
    ΔHue = baseHue;
    hueMode = 'replace';
  }

  const chromaRatio = input.c / closest.shade.color.c;

  const builtShades: ColorPaletteShade[] = Object.entries(closest.palette).map(
    ([numStr, baseShade]) => {
      const shadeNumber = parseInt(numStr, 10);
      const base = baseShade as OKLChColor;

      if (ensureColorInAdjustment && shadeNumber === closest.shade.number) {
        return {
          number: shadeNumber,
          isBase: shadeNumber === closest.shade.number,

          color: input, // canonical OKLCh
          rgb: oklchToRGB(input).toCSSString(),
          oklch: input.toCSSString(),
          chromakit: input.toString()
        };
      }

      const l = base.l;
      const c = base.c * chromaRatio;
      const h = hueMode === 'replace' ? ΔHue : (base.h + ΔHue) % 360;

      let ok = oklch(l, c, h);
      let rgbSrgb = oklchToRGB(ok, false);

      if (!isInSRGB(rgbSrgb)) {
        let cSafe = c;
        while (cSafe > 0 && !isInSRGB(rgbSrgb)) {
          cSafe -= 0.002;
          ok = oklch(l, cSafe, h);
          rgbSrgb = oklchToRGB(ok, false);
        }
      }

      if (
        adjustContrast &&
        (ensureColorInAdjustment ? shadeNumber !== closest.shade.number : true)
      ) {
        const black = rgb(0, 0, 0);
        const white = rgb(1, 1, 1);

        const refΔ = ShadeContrastAverages.find((x) => x.shade === shadeNumber)!;

        rgbSrgb =
          shadeNumber < 500
            ? getOptimalColorForContrastAPCA(rgbSrgb, black, refΔ.onBlack)
            : getOptimalColorForContrastAPCA(rgbSrgb, white, refΔ.onWhite);

        ok = rgbToOKLCh(rgbSrgb);
      }

      return {
        number: shadeNumber,
        isBase: shadeNumber === closest.shade.number,

        color: ok, // canonical OKLCh
        rgb: rgbSrgb.toCSSString(),
        oklch: ok.toCSSString(),
        chromakit: baseShade.toString()
      };
    }
  );

  return {
    50: builtShades[0],
    100: builtShades[1],
    200: builtShades[2],
    300: builtShades[3],
    400: builtShades[4],
    500: builtShades[5],
    600: builtShades[6],
    700: builtShades[7],
    800: builtShades[8],
    900: builtShades[9],
    950: builtShades[10],

    arrayValues: builtShades
  };
};
