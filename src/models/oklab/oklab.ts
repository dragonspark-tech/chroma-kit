import { OKLAB_LMS_MATRIX, OKLCH_THROUGH_LMS_XYZ_MATRIX } from './constants';
import { multiplyMatrixByVector } from '../../utils/linear';
import { XYZColor, xyzToLab, xyzToLCh, xyzToRGB } from '../xyz/xyz';
import { RGBColor } from '../rgb/rgb';
import { OKLChColor } from '../oklch/oklch';
import { LabColor } from '../lab/lab';
import { LChColor } from '../lch/lch';

export type OKLabColor = {
  l: number;
  a: number;
  b: number;
  alpha?: number;
};

export const oklabToRGB = (color: OKLabColor): RGBColor => xyzToRGB(oklabToXYZ(color));

export const oklabToXYZ = (color: OKLabColor): XYZColor => {
  const [l, m, s] = multiplyMatrixByVector(OKLAB_LMS_MATRIX, [color.l, color.a, color.b]);
  const linear = [l ** 3, m ** 3, s ** 3];

  const xyz = multiplyMatrixByVector(OKLCH_THROUGH_LMS_XYZ_MATRIX, linear);

  return { x: xyz[0], y: xyz[1], z: xyz[2], alpha: color.alpha };
}

export const oklabToLab = (color: OKLabColor): LabColor => xyzToLab(oklabToXYZ(color));

export const oklabToLCh = (color: OKLabColor): LChColor => xyzToLCh(oklabToXYZ(color));

export const oklabToOKLCh = (color: OKLabColor): OKLChColor => {
  const C = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;

  return { l: color.l, c: C, h, alpha: color.alpha };
};
