import { XYZColor, xyzToLab, xyzToLCh, xyzToOKLab } from '../xyz/xyz';
import { multiplyMatrixByVector } from '../../utils/linear';
import { RGB_XYZ_MATRIX } from './constants';
import { denormalizeRGBColor, linearizeRGBColor, normalizeRGBColor } from './transform';
import { getAdaptationMatrix } from '../../adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { BradfordConeModel } from '../../adaptation/cone-response';
import { LabColor } from '../lab/lab';
import { OKLabColor, oklabToOKLCh } from '../oklab/oklab';
import { OKLChColor } from '../oklch/oklch';
import { LChColor } from '../lch/lch';

export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export const hexToRGB = (hex: string): RGBColor => {
  // Avoid allocating a new string when possible.
  let offset = 0;
  if (hex.charCodeAt(0) === 35) {
    // 35 === '#'
    offset = 1;
  }
  const len = hex.length - offset;
  let r: number, g: number, b: number, a: number | undefined;

  // For shorthand hex (3 or 4 digits) multiply each digit by 17.
  if (len === 3 || len === 4) {
    const c0 = hex.charCodeAt(offset),
      c1 = hex.charCodeAt(offset + 1),
      c2 = hex.charCodeAt(offset + 2);
    const v0 = c0 < 58 ? c0 - 48 : (c0 & 0xdf) - 55;
    const v1 = c1 < 58 ? c1 - 48 : (c1 & 0xdf) - 55;
    const v2 = c2 < 58 ? c2 - 48 : (c2 & 0xdf) - 55;
    r = v0 * 17;
    g = v1 * 17;
    b = v2 * 17;
    if (len === 4) {
      const c3 = hex.charCodeAt(offset + 3);
      const v3 = c3 < 58 ? c3 - 48 : (c3 & 0xdf) - 55;
      a = (v3 * 17) / 255;
    }
  }
  // For full hex (6 or 8 digits) convert each pair manually.
  else if (len === 6 || len === 8) {
    const c0 = hex.charCodeAt(offset),
      c1 = hex.charCodeAt(offset + 1),
      c2 = hex.charCodeAt(offset + 2),
      c3 = hex.charCodeAt(offset + 3),
      c4 = hex.charCodeAt(offset + 4),
      c5 = hex.charCodeAt(offset + 5);
    const v0 = c0 < 58 ? c0 - 48 : (c0 & 0xdf) - 55;
    const v1 = c1 < 58 ? c1 - 48 : (c1 & 0xdf) - 55;
    const v2 = c2 < 58 ? c2 - 48 : (c2 & 0xdf) - 55;
    const v3 = c3 < 58 ? c3 - 48 : (c3 & 0xdf) - 55;
    const v4 = c4 < 58 ? c4 - 48 : (c4 & 0xdf) - 55;
    const v5 = c5 < 58 ? c5 - 48 : (c5 & 0xdf) - 55;
    r = (v0 << 4) | v1;
    g = (v2 << 4) | v3;
    b = (v4 << 4) | v5;
    if (len === 8) {
      const c6 = hex.charCodeAt(offset + 6),
        c7 = hex.charCodeAt(offset + 7);
      const v6 = c6 < 58 ? c6 - 48 : (c6 & 0xdf) - 55;
      const v7 = c7 < 58 ? c7 - 48 : (c7 & 0xdf) - 55;
      a = ((v6 << 4) | v7) / 255;
    }
  } else {
    throw new Error('Invalid hex color format');
  }
  return normalizeRGBColor({ r, g, b, a });
};

export function rgbToHex(color: RGBColor): string {
  const nC = denormalizeRGBColor(color);

  let r = Math.round(nC.r),
    g = Math.round(nC.g),
    b = Math.round(nC.b);
  let a = nC.a;
  let alpha: number | undefined = undefined;
  if (a !== undefined) {
    alpha = Math.round(a * 255);
  }

  // Check for shorthand possibility (e.g., #abc or #abcd)
  const isShort = (n: number) => (n & 0xf0) >> 4 === (n & 0x0f);
  const canShort =
    isShort(r) && isShort(g) && isShort(b) && (alpha === undefined || isShort(alpha));

  if (canShort) {
    let hex = `#${((r & 0xf0) >> 4).toString(16)}${((g & 0xf0) >> 4).toString(16)}${((b & 0xf0) >> 4).toString(16)}`;
    if (alpha !== undefined && alpha !== 255) {
      hex += ((alpha & 0xf0) >> 4).toString(16);
    }
    return hex;
  }

  // Full hex
  let hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  if (alpha !== undefined && alpha !== 255) {
    hex += alpha.toString(16).padStart(2, '0');
  }
  return hex;
}

export const rgbToXYZ = (color: RGBColor, useChromaticAdaptation: boolean = false): XYZColor => {
  const lC = linearizeRGBColor(color);
  const xyz = multiplyMatrixByVector(RGB_XYZ_MATRIX, [lC.r, lC.g, lC.b]);

  if (useChromaticAdaptation) {
    const adaptationMatrix = getAdaptationMatrix(IlluminantD65, IlluminantD50, BradfordConeModel);
    const adaptedXYZ = multiplyMatrixByVector(adaptationMatrix, xyz);

    return {
      x: adaptedXYZ[0],
      y: adaptedXYZ[1],
      z: adaptedXYZ[2],
      alpha: color.a,
      illuminant: IlluminantD50
    };
  }

  return {
    x: xyz[0],
    y: xyz[1],
    z: xyz[2],
    alpha: color.a,
    illuminant: IlluminantD65
  };
};

export const rgbToLab = (rgb: RGBColor): LabColor =>
  xyzToLab(rgbToXYZ(rgb));

export const rgbToLCH = (rgb: RGBColor): LChColor =>
  xyzToLCh(rgbToXYZ(rgb));

export const rgbToOKLab = (rgb: RGBColor, useChromaticAdaptation: boolean = false): OKLabColor =>
  xyzToOKLab(rgbToXYZ(rgb, useChromaticAdaptation));

export const rgbToOKLCh = (rgb: RGBColor, useChromaticAdaptation: boolean = false): OKLChColor =>
  oklabToOKLCh(rgbToOKLab(rgb, useChromaticAdaptation));
