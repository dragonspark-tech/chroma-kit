import { oklch, oklchToRGB, type OKLChColor } from '../../../../models/oklch/oklch';
import { isInSRGB, rgb, rgbToOKLCh } from '../../../../models/rgb/rgb';
import { getOptimalColorForContrastAPCA } from '../../../a11y/src/utils/optimal-contrast';
import { RadixColors } from '../../../radix/src/colors';
import type { RadixPalette, RadixShade } from '../../../radix/src/radix.types';
import { findClosestRadixFamily } from '../support/find-shade';
import type { ColorPaletteShade, RadixColorFamily } from './palette.types';
import {
  ShadeContrastAverages,
  type RadixShadeContrastAverage
} from '../support/radix-contrast-averages';

export const generateRadixPalette = (
  input: OKLChColor,
  adjustContrast = true,
  ensureColorInAdjustment = true
): RadixColorFamily => {
  const builtFamily: RadixColorFamily = {} as RadixColorFamily;

  const availableSchemas: Record<string, RadixPalette> = Object.fromEntries(
    Object.entries(RadixColors).filter(([n]) => !['Black', 'White', 'Slate'].includes(n))
  );

  const closestSet = findClosestRadixFamily(input, availableSchemas);
  const categories = Object.keys(closestSet.shade.color) as (keyof RadixShade)[];

  for (const category of categories) {
    const closest = closestSet.shade.color[category];

    const inputHue = input.h;
    const baseHue = closest.h;

    let ΔHue = (((inputHue - baseHue) % 360) + 360) % 360;
    let hueMode: 'replace' | 'operate' = 'operate';

    if (ΔHue === 0) {
      ΔHue = baseHue;
      hueMode = 'replace';
    }

    const chromaRatio = input.c / closest.c;

    const builtShades: ColorPaletteShade[] = Object.entries(closestSet.palette).map(
      ([numStr, baseSet]) => {
        const baseShade = baseSet[category] as OKLChColor;
        const shadeNumber = parseInt(numStr, 10);
        const base = baseShade;

        if (ensureColorInAdjustment && shadeNumber === closestSet.shade.number) {
          return {
            number: shadeNumber,
            isBase: shadeNumber === closestSet.shade.number,

            color: input, // canonical OKLCh
            rgb: oklchToRGB(input).toCSSString(),
            oklch: input.toCSSString(),
            chromakit: input.toString()
          };
        }

        const l = base.l;
        const c = base.c * chromaRatio;
        const h = hueMode === 'replace' ? ΔHue : (base.h + ΔHue) % 360;

        let ok = oklch(l, c, h, base.alpha);
        let rgbSrgb = oklchToRGB(ok);

        if (!isInSRGB(rgbSrgb)) {
          let cSafe = c;
          while (cSafe > 0 && !isInSRGB(rgbSrgb)) {
            cSafe -= 0.002;
            ok = oklch(l, cSafe, h, base.alpha);
            rgbSrgb = oklchToRGB(ok);
          }
        }

        if (
          adjustContrast &&
          (ensureColorInAdjustment ? shadeNumber !== closestSet.shade.number : true) &&
          shadeNumber > 10
        ) {
          const black = rgb(0, 0, 0);
          const white = rgb(1, 1, 1);

          const refΔ = ShadeContrastAverages[category].find(
            (x) => x.shade === shadeNumber
          ) as RadixShadeContrastAverage;

          rgbSrgb = category.includes('light')
            ? getOptimalColorForContrastAPCA(rgbSrgb, black, refΔ.onBlack)
            : getOptimalColorForContrastAPCA(rgbSrgb, white, refΔ.onWhite);

          ok = rgbToOKLCh(rgbSrgb);
        }

        return {
          number: shadeNumber,
          isBase: shadeNumber === closestSet.shade.number,

          color: ok, // canonical OKLCh
          rgb: rgbSrgb.toCSSString(),
          oklch: ok.toCSSString(),
          chromakit: baseShade.toString()
        };
      }
    );

    const palette = {
      1: builtShades[0],
      2: builtShades[1],
      3: builtShades[2],
      4: builtShades[3],
      5: builtShades[4],
      6: builtShades[5],
      7: builtShades[6],
      8: builtShades[7],
      9: builtShades[8],
      10: builtShades[9],
      11: builtShades[10],
      12: builtShades[11],

      arrayValues: builtShades
    };

    builtFamily[category] = palette;
  }

  return builtFamily;
};
