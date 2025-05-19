import { parse } from '../semantics/parsing';
import { deltaE76 } from './deltae-76';
import { deltaECMC } from './deltae-cmc';
import { deltaE2000 } from './deltae-2000';
import { deltaEOK } from './deltae-ok';
import { deltaEOKScaled } from './deltae-ok-scaled';
import { deltaEJZ } from './deltae-jz';
import { JzCzHzColor } from '../models/jzczhz';
import { Color } from '../foundation';

/**
 * Represents the available algorithms for calculating color difference (Delta E) between two colors.
 *
 * The Delta E calculation measures the perceived distance between colors, and different algorithms
 * are optimized for various use cases to achieve better perceptual uniformity in different contexts.
 * The algorithms provided are:
 *
 * - 'Euclidean': Uses simple Euclidean distance in the color space, typically less accurate in perceptual uniformity.
 * - 'CMC': Refers to the CMC l:c metric by the Color Measurement Committee, designed for textiles.
 * - '2000': Represents the CIEDE2000 algorithm, an advanced standard for Delta E computation.
 * - 'OKLab': Based on the OKLab color space, more perceptually uniform than earlier spaces.
 * - 'ScaledOKLab': A scaled variation of OKLab for specific use cases with adjusted perceptual scaling.
 * - 'Jz': Refers to color difference calculation based on the JzCzhz color space.
 *
 * This type is used to specify which algorithm to apply during Delta E computations.
 */
export type DeltaEAlgorithm = 'Euclidean' | 'CMC' | '2000' | 'OKLab' | 'ScaledOKLab' | 'Jz';

/**
 * Calculates the color difference (Delta E) between two colors based on the provided algorithm.
 *
 * @param {any} color - The first color input, which is parsed for calculation.
 * @param {any} sample - The second color input, which is parsed for calculation.
 * @param {DeltaEAlgorithm} [algorithm='2000'] - The Delta E algorithm to use for the calculation.
 *       Supported values include:
 *       - 'Euclidean': Basic Euclidean distance (Delta E76).
 *       - 'CMC': Color Measurement Committee (CMC) method.
 *       - '2000': Delta E based on CIEDE2000.
 *       - 'OKLab': Delta E based on OKLab color space.
 *       - 'ScaledOKLab': Scaled version of Delta E in OKLab color space.
 *       - 'Jz': Delta E in JzCzHz color space.
 *
 * @throws {Error} Throws an error if an unknown algorithm is provided.
 *
 * @returns {number} The computed color difference value using the specified algorithm.
 */
export const deltaE = (
  color: string | Color,
  sample: string | Color,
  algorithm: DeltaEAlgorithm = '2000'
): number => {
  switch (algorithm) {
    case 'Euclidean':
      return deltaE76(parse(color, 'xyz'), parse(sample, 'xyz'));

    case 'CMC':
      return deltaECMC(parse(color, 'lch'), parse(sample, 'lch'));

    case '2000':
      return deltaE2000(parse(color, 'lab'), parse(sample, 'lab'));

    case 'OKLab':
      return deltaEOK(parse(color, 'oklab'), parse(sample, 'oklab'));

    case 'ScaledOKLab':
      return deltaEOKScaled(parse(color, 'oklab'), parse(sample, 'oklab'));

    case 'Jz':
      return deltaEJZ(parse(color, 'jzczhz'), parse(sample, 'jzczhz') as JzCzHzColor);

    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
};
