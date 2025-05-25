import { describe, expect, it } from 'vitest';
import { TailwindColors } from '../../../plugins/tailwind';
import RawSrcColors from '../../../plugins/tailwind/src/assets/raw';
import { oklchFromCSSString } from '../../../models/oklch';

describe('TailwindCSS Colors Plugin - Parsing', () => {
  it('parsed colors should match the source colors', () => {
    for (const [color, shadePalette] of Object.entries(TailwindColors)) {
      const rawShades = RawSrcColors[color.toLowerCase() as keyof typeof RawSrcColors];
      if (typeof rawShades === 'string') continue; // skip 'black', 'white', etc.

      for (const [shadeNumber, shadeString] of Object.entries(rawShades)) {
        const chromaShade = shadePalette[parseInt(shadeNumber) as keyof typeof shadePalette];
        const twColor = oklchFromCSSString(shadeString);

        const ckString = chromaShade.toCSSString();
        const twString = twColor.toCSSString();

        expect(
          ckString,
          `Failed for ${color} ${shadeNumber}: parsed ${ckString} vs. raw ${twString}`
        ).toBe(twString);
      }
    }
  });
});
