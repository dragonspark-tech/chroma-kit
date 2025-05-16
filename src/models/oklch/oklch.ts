import { LabColor } from '../lab/lab';
import { LChColor } from '../lch/lch';
import { OKLabColor, oklabToLab, oklabToLCh, oklabToXYZ } from '../oklab/oklab';
import { RGBColor } from '../rgb/rgb';
import { XYZColor, xyzToRGB } from '../xyz/xyz';

export type OKLChColor = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

export const oklchToRGB = (color: OKLChColor): RGBColor => {
  const xyz = oklchToXYZ(color);
  return xyzToRGB(xyz);
};

export const oklchToXYZ = (color: OKLChColor): XYZColor => {
  const oklab = oklchToOKLab(color);
  return oklabToXYZ(oklab);
};

export const oklchToLab = (color: OKLChColor): LabColor => oklabToLab(oklchToOKLab(color));

export const oklchToLCh = (color: OKLChColor): LChColor => oklabToLCh(oklchToOKLab(color));

export const oklchToOKLab = (color: OKLChColor): OKLabColor => {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);

  return { l: color.l, a, b, alpha: color.alpha };
};
