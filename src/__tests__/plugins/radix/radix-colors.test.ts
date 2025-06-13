import { describe, expect, it } from 'vitest';
import { RadixColors } from '../../../plugins/radix/src/colors';
import { parseColor } from '../../../';
import { oklchToP3, type OKLChColor } from '../../../models/oklch';

const roundToThree = (num: number) => Math.round(num * 1000) / 1000;

const testColorSet = (basePalette: object | undefined, parsedPalette: OKLChColor[]) => {
  if (basePalette) {
    const basePaletteKV = Object.values(basePalette);

    for (let i = 0; i < Object.keys(basePalette).length; i++) {
      const parsedBase = parseColor(basePaletteKV[i], 'p3');
      const parsedOutput = oklchToP3(parsedPalette[i]);

      expect(roundToThree(parsedOutput.r)).toBeCloseTo(parsedBase.r, 1);
      expect(roundToThree(parsedOutput.g)).toBeCloseTo(parsedBase.g, 1);
      expect(roundToThree(parsedOutput.b)).toBeCloseTo(parsedBase.b, 1);
      expect(roundToThree(parsedOutput.alpha ?? 1)).toBeCloseTo(parsedBase.alpha ?? 1);
    }
  }
};

describe('RadixUI Colors Plugin - Parsing', () => {
  it('parsed colors should match the source colors within range', async () => {
    const RawSrcColors = await import('../../../plugins/radix/src/assets/raw');
    for (const [color, shadePalette] of Object.entries(RadixColors)) {
      const baseLight = RawSrcColors[(color.toLowerCase() + 'P3') as keyof typeof RawSrcColors];
      const baseLightA = RawSrcColors[(color.toLowerCase() + 'P3A') as keyof typeof RawSrcColors];
      const baseDark = RawSrcColors[(color.toLowerCase() + 'DarkP3') as keyof typeof RawSrcColors];
      const baseDarkA =
        RawSrcColors[(color.toLowerCase() + 'DarkP3A') as keyof typeof RawSrcColors];

      const parsedLight: OKLChColor[] = Object.values(shadePalette).map((p) => p.light);
      const parsedLightA: OKLChColor[] = Object.values(shadePalette).map((p) => p.lightAlpha);
      const parsedDark: OKLChColor[] = Object.values(shadePalette).map((p) => p.dark);
      const parsedDarkA: OKLChColor[] = Object.values(shadePalette).map((p) => p.darkAlpha);

      testColorSet(baseLight, parsedLight);
      testColorSet(baseLightA, parsedLightA);
      testColorSet(baseDark, parsedDark);
      testColorSet(baseDarkA, parsedDarkA);
    }
  });
});
