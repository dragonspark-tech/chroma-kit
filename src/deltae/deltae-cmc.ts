import type { LChColor } from '../models/lch';
import { DEG_TO_RAD } from './constants';

/**
 * Tolerances for the CMC color difference calculation.
 *
 * @property {number} kL - Lightness tolerance factor (default: 2)
 * @property {number} kC - Chroma tolerance factor (default: 1)
 */
export interface DeltaECMCTolerances {
  kL: number;
  kC: number;
}

/**
 * Calculates the CMC l:c color difference (Delta E) between two colors.
 *
 * This function implements the Color Measurement Committee (CMC) color difference formula,
 * which provides improved perceptual uniformity compared to CIE76, especially for textiles.
 * The formula uses different weighting functions for lightness, chroma, and hue to better
 * match human perception.
 *
 * The calculation includes the following steps:
 * 1. Calculate the differences in L, C, and H components
 * 2. Calculate weighting functions S_L, S_C, and S_H
 * 3. Apply the final formula with the specified tolerances
 *
 * The default tolerances (kL=2, kC=1) correspond to the standard CMC 2:1 formula
 * commonly used for acceptability testing.
 *
 * @param {LChColor} color - The first color in LCh space
 * @param {LChColor} sample - The second color in LCh space to compare against
 * @param {DeltaECMCTolerances} [tolerances] - The tolerance factors for lightness and chroma
 * @returns {number} The color difference value (Delta E)
 */
export const deltaECMC = (
  color: LChColor,
  sample: LChColor,
  tolerances: DeltaECMCTolerances = {
    kL: 2,
    kC: 1
  }
) => {
  const { l: L1, c: C1, h: h1 } = color;
  const { l: L2, c: C2, h: h2 } = sample;

  const { kL, kC } = tolerances;

  const ΔL = L1 - L2;
  const ΔC = C1 - C2;

  const ΔH = Math.sqrt(
    Math.max(
      0,
      (L1 - L2) * (L1 - L2) +
        (C1 - C2) * (C1 - C2) +
        C1 * C2 * 2 * (1 - Math.cos((h1 - h2) * DEG_TO_RAD))
    ) -
      ΔL * ΔL -
      ΔC * ΔC
  );

  let S_L: number;
  if (L1 < 16) {
    S_L = 0.511;
  } else {
    S_L = (0.040975 * L1) / (1 + 0.01765 * L1);
  }

  const S_C = (0.0638 * C1) / (1 + 0.0131 * C1) + 0.638;

  let T: number;
  if (h1 >= 164 && h1 <= 345) {
    T = 0.56 + Math.abs(0.2 * Math.cos((h1 + 168) * DEG_TO_RAD));
  } else {
    T = 0.36 + Math.abs(0.4 * Math.cos((h1 + 35) * DEG_TO_RAD));
  }

  const S_H = S_C * T;
  return Math.sqrt(
    Math.pow(ΔL / (kL * S_L), 2) + Math.pow(ΔC / (kC * S_C), 2) + Math.pow(ΔH / S_H, 2)
  );
};
