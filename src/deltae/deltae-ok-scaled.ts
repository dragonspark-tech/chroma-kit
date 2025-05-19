import { type OKLabColor } from '../models/oklab';
import { APPRX_OKLAB_SCALING } from './constants';

/**
 *
 * @param color
 * @param sample
 * @param scalingFactor
 *
 * @see {@link OKLAB_DELTAE_SCALING}
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
