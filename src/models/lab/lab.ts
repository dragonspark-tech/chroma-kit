import { Illuminant, IlluminantD65 } from '../../standards/illuminants';
import { XYZColor, xyzToOKLab, xyzToRGB } from '../xyz/xyz';
import { ϵ, κ } from './constants';
import { RGBColor } from '../rgb/rgb';
import { LChColor } from '../lch/lch';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { OKLChColor } from '../oklch/oklch';

export type LabColor = {
  l: number;
  a: number;
  b: number;
  alpha?: number;
};

export const labToRGB = (color: LabColor): RGBColor => xyzToRGB(labToXYZ(color));

export const labToXYZ = (color: LabColor, illuminant?: Illuminant): XYZColor => {
  const i = illuminant || IlluminantD65;

  const fy = (color.l + 16) / 116;
  const fx = fy + color.a / 500;
  const fz = fy - color.b / 200;

  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);

  const xn = fx3 > ϵ ? fx3 : (116 * fx - 16) / κ;
  const yn = color.l > κ * ϵ ? fy3 : color.l / κ;
  const zn = fz3 > ϵ ? fz3 : (116 * fz - 16) / κ;

  return {
    x: xn * i.xR,
    y: yn * i.yR,
    z: zn * i.zR,
    alpha: color.alpha,
    illuminant: i
  };
};

export const labToLCH = (color: LabColor): LChColor => {
  const c = Math.hypot(color.a, color.b);
  const h = ((Math.atan2(color.b, color.a) * 180) / Math.PI + 360) % 360;
  return { l: color.l, c, h };
};

export const labToOKLab = (color: LabColor): OKLabColor => {
  return xyzToOKLab(labToXYZ(color));
};

export const labToOKLCh = (color: LabColor): OKLChColor => {
  return oklabToOKLCh(labToOKLab(color));
};
