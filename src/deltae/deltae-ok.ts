import { type OKLabColor } from '../models/oklab';

/**
 * Calculates the color difference (Delta E) between two colors in the OKLab color space.
 *
 * This function computes the Euclidean distance between two colors in the OKLab color space,
 * which is designed to be perceptually uniform. This means that the same numerical difference
 * corresponds to roughly the same perceived difference anywhere in the color space.
 *
 * @param {OKLabColor} color - The first color in OKLab space
 * @param {OKLabColor} sample - The second color in OKLab space to compare against
 * @returns {number} The color difference value (Delta E)
 */
export const deltaEOK = (color: OKLabColor, sample: OKLabColor): number => {
  const { l: L1, a: a1, b: b1 } = color;
  const { l: L2, a: a2, b: b2 } = sample;

  const ΔL = L1 - L2;
  const Δa = a1 - a2;
  const Δb = b1 - b2;

  return Math.sqrt(ΔL * ΔL + Δa * Δa + Δb * Δb);
};
