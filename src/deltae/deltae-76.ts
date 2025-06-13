import { isNone } from '../utils/logic';
import { type Color } from '../foundation';

/**
 * Calculates the CIE76 color difference (Delta E) between two colors.
 *
 * This function computes the Euclidean distance between two colors in any color space,
 * using the vector components of each color. It's the simplest form of Delta E calculation
 * and is equivalent to the original CIE76 formula when used with Lab colors.
 *
 * @param {Color} color - The first color
 * @param {Color} sample - The second color to compare against
 * @returns {number} The color difference value (Delta E)
 */
export const deltaE76 = (color: Color, sample: Color): number => {
  const { channels } = color;

  const keys = Object.keys(channels);

  let sum = 0;
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];

    const c1 = color[key as keyof Color] as number;
    const c2 = sample[key as keyof Color] as number;

    if (isNone(c1) || isNone(c2)) continue;

    const diff = c2 - c1;
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};
