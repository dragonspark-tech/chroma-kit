import { type LabColor } from '../models/lab';
import { DEG_TO_RAD, E2000_GFACTOR, RAD_TO_DEG } from './constants';
import { pow7 } from '../utils/math';

/**
 * Weights for the CIEDE2000 color difference calculation.
 *
 * @property {number} kL - Lightness weight factor (default: 1)
 * @property {number} kC - Chroma weight factor (default: 1)
 * @property {number} kH - Hue weight factor (default: 1)
 */
export type DeltaE2000Weights = {
  kL: number;
  kC: number;
  kH: number;
};

/**
 * Calculates the CIEDE2000 color difference (Delta E) between two colors.
 *
 * This function implements the CIEDE2000 color difference formula, which is the most
 * advanced and perceptually accurate Delta E calculation method standardized by the CIE.
 * It provides significant improvements over earlier formulas, especially for blue colors
 * and neutral colors.
 *
 * The calculation involves multiple steps:
 * 1. Calculate chroma values and apply corrections
 * 2. Calculate hue angles with appropriate handling of edge cases
 * 3. Calculate lightness, chroma, and hue differences
 * 4. Calculate weighting functions for each component
 * 5. Apply the final formula with rotation term for improved accuracy in blue regions
 *
 * @param {LabColor} color - The first color in Lab space
 * @param {LabColor} sample - The second color in Lab space to compare against
 * @param {DeltaE2000Weights} [weights] - The weight factors for lightness, chroma, and hue
 * @returns {number} The color difference value (Delta E)
 */
export const deltaE2000 = (
  color: LabColor,
  sample: LabColor,
  weights: DeltaE2000Weights = {
    kL: 1,
    kC: 1,
    kH: 1
  }
) => {
  const { l: L1, a: a1, b: b1 } = color;
  const { l: L2, a: a2, b: b2 } = sample;
  const { kL, kC, kH } = weights;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);

  const C_ave = (C1 + C2) / 2;

  const C7 = pow7(C_ave);
  const G = 0.5 * (1 - Math.sqrt(C7 / (C7 + E2000_GFACTOR)));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  const h1p = Math.atan2(b1, a1p) * RAD_TO_DEG + (Math.atan2(b1, a1p) < 0 ? 360 : 0);
  const h2p = Math.atan2(b2, a2p) * RAD_TO_DEG + (Math.atan2(b2, a2p) < 0 ? 360 : 0);

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp: number;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p <= h1p) {
    dhp = h2p - h1p + 360;
  } else {
    dhp = h2p - h1p - 360;
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * DEG_TO_RAD) / 2);

  const Lp_ave = (L1 + L2) / 2;
  const Cp_ave = (C1p + C2p) / 2;

  let hp_ave: number;
  if (C1p * C2p === 0) {
    hp_ave = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    hp_ave = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    hp_ave = (h1p + h2p + 360) / 2;
  } else {
    hp_ave = (h1p + h2p - 360) / 2;
  }

  const hp_ave_rad = hp_ave * DEG_TO_RAD;
  const T =
    1 -
    0.17 * Math.cos(hp_ave_rad - DEG_TO_RAD * 30) +
    0.24 * Math.cos(2 * hp_ave_rad) +
    0.32 * Math.cos(3 * hp_ave_rad + DEG_TO_RAD * 6) -
    0.2 * Math.cos(4 * hp_ave_rad - DEG_TO_RAD * 63);

  const delta_theta = 30 * Math.exp(-Math.pow((hp_ave - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(pow7(Cp_ave) / (pow7(Cp_ave) + E2000_GFACTOR));
  const Sl = 1 + (0.015 * Math.pow(Lp_ave - 50, 2)) / Math.sqrt(20 + Math.pow(Lp_ave - 50, 2));
  const Sc = 1 + 0.045 * Cp_ave;
  const Sh = 1 + 0.015 * Cp_ave * T;
  const Rt = -Math.sin(2 * delta_theta * DEG_TO_RAD) * Rc;
  return Math.sqrt(
    Math.pow(dLp / (kL * Sl), 2) +
      Math.pow(dCp / (kC * Sc), 2) +
      Math.pow(dHp / (kH * Sh), 2) +
      Rt * (dCp / (kC * Sc)) * (dHp / (kH * Sh))
  );
};
