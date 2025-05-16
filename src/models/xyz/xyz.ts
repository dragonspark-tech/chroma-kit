import { LabColor, labToLCH } from '../lab/lab';
import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { ϵ, κ } from '../lab/constants';
import { RGBColor } from '../rgb/rgb';
import { multiplyMatrixByVector } from '../../utils/linear';
import { delinearizeRGBColor } from '../rgb/transform';
import { XYZ_OKLCH_THROUGH_LMS_MATRIX, XYZ_RGB_MATRIX } from './constants';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { LChColor } from '../lch/lch';
import { OKLChColor } from '../oklch/oklch';
import { LMS_OKLAB_MATRIX } from '../oklab/constants';

export type XYZColor = {
  x: number;
  y: number;
  z: number;
  alpha?: number;
  illuminant?: Illuminant;
};

export const xyzToRGB = (color: XYZColor): RGBColor => {
  const lRGB = multiplyMatrixByVector(XYZ_RGB_MATRIX, [color.x, color.y, color.z]);
  return delinearizeRGBColor({ r: lRGB[0], g: lRGB[1], b: lRGB[2], a: color.alpha });
};

export const xyzToLab = (color: XYZColor): LabColor => {
  const i = color.illuminant || IlluminantD65;

  const xn = color.x / i.xR,
    yn = color.y / i.yR,
    zn = color.z / i.zR;

  const fx = xn > ϵ ? Math.cbrt(xn) : (κ * xn + 16) / 116;
  const fy = yn > ϵ ? Math.cbrt(yn) : (κ * yn + 16) / 116;
  const fz = zn > ϵ ? Math.cbrt(zn) : (κ * zn + 16) / 116;

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
    alpha: color.alpha
  };
};

export const xyzToLCh = (color: XYZColor): LChColor =>
  labToLCH(xyzToLab(color))

export const xyzToOKLab = (color: XYZColor): OKLabColor => {
  const [l, m, s] = multiplyMatrixByVector(XYZ_OKLCH_THROUGH_LMS_MATRIX, [color.x, color.y, color.z]);
  const nonLinear = [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)];

  const oklab = multiplyMatrixByVector(LMS_OKLAB_MATRIX, nonLinear);
  return { l: oklab[0], a: oklab[1], b: oklab[2], alpha: color.alpha };
};

export const xyzToOKLCh = (color: XYZColor): OKLChColor =>
  oklabToOKLCh(xyzToOKLab(color));
