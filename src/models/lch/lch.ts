import { LabColor, labToXYZ } from '../lab/lab';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { OKLChColor } from '../oklch/oklch';
import { RGBColor } from '../rgb/rgb';
import { XYZColor, xyzToOKLab, xyzToRGB } from '../xyz/xyz';

export type LChColor = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

export const lchToRGB = (color: LChColor): RGBColor =>
  xyzToRGB(lchToXYZ(color));

export const lchToXYZ = (color: LChColor): XYZColor =>
  labToXYZ(lchToLab(color));

export const lchToLab = (color: LChColor): LabColor => {
  const hRad = (color.h * Math.PI) / 180; // deg → rad
  return {
    l: color.l,
    a: color.c * Math.cos(hRad),
    b: color.c * Math.sin(hRad),
    alpha: color.alpha
  };
};

export const lchToOKLab = (color: LChColor): OKLabColor =>
  xyzToOKLab(lchToXYZ(color));

export const lchToOKLCh = (color: LChColor): OKLChColor =>
  oklabToOKLCh(lchToOKLab(color));
