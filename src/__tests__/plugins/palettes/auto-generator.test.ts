import { describe, it, expect } from 'vitest';
import { generatePalette } from '../../../plugins/palettes';
import { oklch } from '../../../models/oklch';

describe('Auto Generator', () => {
  it('should throw an error for unknown generator family', () => {
    const color = oklch(0.7, 0.2, 120);

    // @ts-expect-error - Testing invalid family
    expect(() => generatePalette(color, true, true, 'Unknown Family')).toThrowError(
      'Unknown generator family: Unknown Family'
    );
  });
});
