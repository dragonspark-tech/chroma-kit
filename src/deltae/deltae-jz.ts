import type { JzCzHzColor } from '../models/jzczhz';
import { isNone } from '../utils/logic';
import { DEG_TO_RAD } from './constants';

/**
 * Calculates the color difference (Delta E) between two colors in the JzCzHz color space.
 *
 * This function computes the Euclidean distance in the cylindrical JzCzHz color space,
 * which is designed for high dynamic range (HDR) content and provides improved perceptual
 * uniformity across a wide range of luminance levels.
 *
 * The function handles undefined hue values by using appropriate fallbacks.
 *
 * @param {JzCzHzColor} color - The first color in JzCzHz space
 * @param {JzCzHzColor} sample - The second color in JzCzHz space to compare against
 * @returns {number} The color difference value (Delta E)
 */
export const deltaEJZ = (color: JzCzHzColor, sample: JzCzHzColor): number => {
  const { jz: Jz1, cz: Cz1, hz: Hz1 } = color;
  const { jz: Jz2, cz: Cz2, hz: Hz2 } = sample;

  const ΔJ = Jz1 - Jz2;
  const ΔC = Cz1 - Cz2;

  const h1 = isNone(Hz1) && isNone(Hz2) ? 0 : isNone(Hz1) ? Hz2 : Hz1;
  const h2 = isNone(Hz1) && isNone(Hz2) ? 0 : isNone(Hz2) ? Hz1 : Hz2;

  const Δh = h1 - h2;
  const ΔH = 2 * Math.sqrt(Cz1 * Cz2) * Math.sin(Δh * DEG_TO_RAD);

  return Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);
};
