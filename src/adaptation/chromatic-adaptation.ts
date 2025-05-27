import type { Illuminant } from '../standards/illuminants';
import type { ConeResponseModel } from './cone-response';
import { type Matrix3x3, multiplyMatrices, multiplyMatrixByVector } from '../utils/linear';
import { coneMatrixes } from './_cone-matrixes';

/**
 * Computes the chromatic adaptation matrix to transform colors from a source illuminant
 * to a target illuminant using a specified cone response model.
 *
 * @param {Illuminant} sourceIlluminant - The source illuminant, represented by its XYZ tri-stimulus values.
 * @param {Illuminant} targetIlluminant - The target illuminant, represented by its XYZ tri-stimulus values.
 * @param {ConeResponseModel} coneModel - The cone response model containing transformation matrices for converting between
 *                                         XYZ and LMS color spaces as well as their inverses.
 * @returns {Matrix3x3} The 3x3 chromatic adaptation matrix that can be used to adapt colors from the source illuminant
 *                      to the target illuminant.
 *
 * @see https://en.wikipedia.org/wiki/Chromatic_adaptation
 */
export const computeAdaptationMatrix = (
  sourceIlluminant: Illuminant,
  targetIlluminant: Illuminant,
  coneModel: ConeResponseModel
): Matrix3x3 => {
  const xyzSource = [sourceIlluminant.xR, sourceIlluminant.yR, sourceIlluminant.zR];
  const xyzTarget = [targetIlluminant.xR, targetIlluminant.yR, targetIlluminant.zR];

  const lmsSource = multiplyMatrixByVector(coneModel.matrix, xyzSource);
  const lmsTarget = multiplyMatrixByVector(coneModel.matrix, xyzTarget);

  const scaleL = lmsSource[0] / lmsTarget[0];
  const scaleM = lmsSource[1] / lmsTarget[1];
  const scaleS = lmsSource[2] / lmsTarget[2];

  const scalingFactorMatrix: Matrix3x3 = [
    [scaleL, 0, 0],
    [0, scaleM, 0],
    [0, 0, scaleS]
  ];

  return multiplyMatrices(
    coneModel.inverseMatrix,
    scalingFactorMatrix,
    coneModel.matrix
  ) as Matrix3x3;
};

/**
 * Calculates the chromatic adaptation matrix for converting colors from a source illuminant to a target illuminant
 * using a specific cone response model. If a precomputed matrix exists for the specified parameters, it is returned.
 * Otherwise, the matrix is computed dynamically.
 *
 * @param {Illuminant} sourceIlluminant - The illuminant representing the source light condition.
 * @param {Illuminant} targetIlluminant - The illuminant representing the target light condition.
 * @param {ConeResponseModel} coneModel - The cone response model to be used for the adaptation.
 * @returns {Matrix3x3} The 3x3 chromatic adaptation matrix.
 */
export const getAdaptationMatrix = (
  sourceIlluminant: Illuminant,
  targetIlluminant: Illuminant,
  coneModel: ConeResponseModel
): Matrix3x3 => {
  const precomputedMatrix: Matrix3x3 | undefined =
    coneMatrixes[`${coneModel.name}_${sourceIlluminant.name}_TO_${targetIlluminant.name}`];

  if (precomputedMatrix) {
    return precomputedMatrix;
  }

  return computeAdaptationMatrix(sourceIlluminant, targetIlluminant, coneModel);
};
