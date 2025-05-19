import { LChColor } from '../models/lch';
import { DEG_TO_RAD } from './constants';

export type DeltaECMCTolerances = {
  kL: number;
  kC: number;
};

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

  // Calculate ΔH (not delta hue angle, but color difference in the hue plane)
  // ΔH^2 = ΔE^2 - ΔL^2 - ΔC^2, but more efficiently:
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

  // Step 2: Calculate weighting functions S_L, S_C, S_H

  // S_L: lightness weighting function
  let S_L: number;
  if (L1 < 16) {
    S_L = 0.511;
  } else {
    S_L = (0.040975 * L1) / (1 + 0.01765 * L1);
  }

  // S_C: chroma weighting function
  const S_C = (0.0638 * C1) / (1 + 0.0131 * C1) + 0.638;

  // F: factor for S_H
  const h1Rad = h1 * DEG_TO_RAD;
  let T: number;
  if (h1 >= 164 && h1 <= 345) {
    T = 0.56 + Math.abs(0.2 * Math.cos((h1 + 168) * DEG_TO_RAD));
  } else {
    T = 0.36 + Math.abs(0.4 * Math.cos((h1 + 35) * DEG_TO_RAD));
  }

  // S_H: hue weighting function
  const S_H = S_C * T;

  // Step 3: Final formula
  return Math.sqrt(
    Math.pow(ΔL / (kL * S_L), 2) + Math.pow(ΔC / (kC * S_C), 2) + Math.pow(ΔH / S_H, 2)
  );
};
