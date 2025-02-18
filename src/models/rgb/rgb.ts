import { XYZColor } from '../xyz/xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { RGB_XYZ_MATRIX } from './constants';
import { linearizeRGBColor, normalizeRGBColor } from './transform';
import { getAdaptationMatrix } from '../../adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { BradfordConeModel } from '../../adaptation/cone-response';

export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
}


/**
 * Converts an RGB color to the CIE 1931 XYZ color space.
 *
 * @param {RGBColor} color - The input color in the RGB color space.
 * @param {boolean} [useChromaticAdaptation=true] - Determines whether chromatic adaptation
 *        is applied during the conversion. If true, the base D65 color is adapted to D50.
 * @returns {XYZColor} The resulting XYZ color, including the alpha channel if present.
 */
export const rgbToXYZ = (color: RGBColor, useChromaticAdaptation: boolean = true): XYZColor => {
  const lC = linearizeRGBColor(color);
  const xyz = multiplyMatrixByVector(RGB_XYZ_MATRIX, [lC.r, lC.g, lC.b]);

  if (useChromaticAdaptation) {
    const adaptationMatrix = getAdaptationMatrix(IlluminantD65, IlluminantD50, BradfordConeModel);
    const adaptedXYZ = multiplyMatrixByVector(adaptationMatrix, xyz);

    return {
      x: adaptedXYZ[0],
      y: adaptedXYZ[1],
      z: adaptedXYZ[2],
      a: color.a
    };
  }

  return {
    x: xyz[0],
    y: xyz[1],
    z: xyz[2],
    a: color.a
  };
};