import { type OKLabColor } from '../models/oklab';
import { APPRX_OKLAB_SCALING } from './constants';

/**
 * Calculates a scaled color difference (Delta E) between two colors in the OKLab color space.
 *
 * This function applies a scaling factor to the a and b components before calculating
 * the Euclidean distance. This scaling can improve the perceptual uniformity of the
 * color difference calculation for specific use cases.
 *
 * @param {OKLabColor} color - The first color in OKLab space
 * @param {OKLabColor} sample - The second color in OKLab space to compare against
 * @param {number} [scalingFactor=APPRX_OKLAB_SCALING] - The scaling factor to apply to the a and b components
 * @returns {number} The scaled color difference value (Delta E)
 *
 * @see {@link OKLAB_DELTAE_SCALING} for predefined scaling factors
 */
export const deltaEOKScaled = (
  color: OKLabColor,
  sample: OKLabColor,
  scalingFactor: number = APPRX_OKLAB_SCALING
) => {
  const { l: L1, a: a1, b: b1 } = color;
  const { l: L2, a: a2, b: b2 } = sample;

  const ΔL = L1 - L2;
  const Δa = scalingFactor * (a1 - a2);
  const Δb = scalingFactor * (b1 - b2);

  return Math.hypot(ΔL, Δa, Δb);
};
