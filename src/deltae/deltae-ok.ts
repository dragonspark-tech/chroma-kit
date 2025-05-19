import { type OKLabColor } from '../models/oklab';

export const deltaEOK = (color: OKLabColor, sample: OKLabColor): number => {
  const { l: L1, a: a1, b: b1 } = color;
  const { l: L2, a: a2, b: b2 } = sample;

  const ΔL = L1 - L2;
  const Δa = a1 - a2;
  const Δb = b1 - b2;

  return Math.sqrt(ΔL * ΔL + Δa * Δa + Δb * Δb);
};
