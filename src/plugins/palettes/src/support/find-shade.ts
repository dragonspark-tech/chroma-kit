import { type OKLChColor, oklchToOKLab } from '../../../../models/oklch';
import { deltaEOKScaled } from '../../../../deltae';
import type { TailwindPalette } from '../../../tailwind/src/tailwind.types';

export interface TailwindColorApproximation {
  family: string;
  palette: TailwindPalette;
  shade: {
    number: number;
    color: OKLChColor;
  };
  delta: number;
}

/**
 * Finds the closest matching Tailwind color family from a given input color.
 *
 * This function calculates the difference between a provided OKLChColor and the available
 * Tailwind color families using the Delta E OKLab + Scale algorithm, which measures color differences.
 * It returns the palette of the closest matching Tailwind color family.
 *
 * @param {OKLChColor} inputColor - The OKLCh color to be compared against available Tailwind color families.
 * @param {Record<string, TailwindPalette>} availableFamilies - A record of Tailwind color families, where the key is the family name and the value is its corresponding palette.
 * @returns {TailwindPalette} The palette of the closest matching Tailwind color family.
 */
export const findClosestTailwindFamily = (
  inputColor: OKLChColor,
  availableFamilies: Record<string, TailwindPalette>
): TailwindColorApproximation => {
  const approximations: { family: string; delta: number; shade: number }[] = [];

  for (const [family, shades] of Object.entries(availableFamilies)) {
    const deltaShades: { family: string; shade: number; delta: number }[] = [];

    for (const [shade, shadeColor] of Object.entries(shades)) {
      const delta = deltaEOKScaled(oklchToOKLab(inputColor), oklchToOKLab(shadeColor));

      deltaShades.push({ family, shade: parseInt(shade), delta });
    }

    deltaShades.sort((a, b) => a.delta - b.delta);
    approximations.push({ family, delta: deltaShades[0].delta, shade: deltaShades[0].shade });
  }

  approximations.sort((a, b) => a.delta - b.delta);

  const finalApproximation = approximations[0];
  const finalFamily = finalApproximation.family;
  return {
    family: finalFamily,
    palette: availableFamilies[finalFamily],
    shade: {
      number: finalApproximation.shade,
      color:
        availableFamilies[finalFamily][
          finalApproximation.shade as keyof (typeof availableFamilies)[typeof finalFamily]
        ]
    },
    delta: finalApproximation.delta
  };
};
