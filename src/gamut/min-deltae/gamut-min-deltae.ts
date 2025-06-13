import { convertColor } from '../../conversion/conversion';
import { deltaEOK } from '../../deltae/deltae-ok';
import type { ColorSpace, CreatedColor } from '../../foundation';
import { oklabFromVector } from '../../models/oklab';
import { oklch, oklchToOKLab, type OKLChColor } from '../../models/oklch';
import { clipGamut } from '../clip/gamut-clip';
import { isInGamut } from '../in-gamut';

const LAB_WHITE = [1, 0, 0];
const LAB_BLACK = [0, 0, 0];

export const gamutMapMinDeltaE = <T extends ColorSpace>(
  color: OKLChColor,
  to: T
): CreatedColor<T> => {
  const JND = 0.02;
  const ε = 0.0001;

  const L = color.l;

  if (L >= 1) {
    return clipGamut(convertColor(oklabFromVector(LAB_WHITE, color.alpha), to));
  }

  if (L <= 0) {
    return clipGamut(convertColor(oklabFromVector(LAB_BLACK, color.alpha), to));
  }

  const convertedBase = convertColor(color, to);
  if (isInGamut(convertedBase)) {
    return convertedBase;
  }

  let min = 0;
  let max = color.c;
  let minInGamut = true;

  const current = oklch(color.l, color.c, color.h, color.alpha);
  let clipped = clipGamut(convertColor(current, to));

  let ΔE = deltaEOK(convertColor(clipped, 'oklab'), oklchToOKLab(current));
  if (ΔE < JND) {
    return clipped;
  }

  while (max - min > ε) {
    const chroma = (min + max) / 2;
    current.c = chroma;

    if (minInGamut && isInGamut(convertColor(current, to))) {
      min = chroma;
    } else {
      clipped = clipGamut(convertColor(current, to));
      ΔE = deltaEOK(convertColor(clipped, 'oklab'), oklchToOKLab(current));

      if (ΔE < JND) {
        if (JND - ΔE < ε) {
          break;
        } else {
          minInGamut = false;
          min = chroma;
        }
      } else {
        max = chroma;
      }
    }
  }

  return clipped;
};
