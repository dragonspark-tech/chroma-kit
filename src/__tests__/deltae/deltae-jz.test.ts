import { describe, expect, it } from 'vitest';
import { deltaEJZ } from '../../deltae/deltae-jz';
import { jzczhz, type JzCzHzColor } from '../../models/jzczhz';
import { DEG_TO_RAD } from '../../deltae/constants';

describe('Delta E JZ', () => {
  describe('Basic functionality', () => {
    it('should calculate the color difference between two JzCzHz colors', () => {
      const color1 = jzczhz(0.01, 0.02, 30);
      const color2 = jzczhz(0.02, 0.03, 60);

      // Manual calculation
      const ΔJ = 0.01 - 0.02;
      const ΔC = 0.02 - 0.03;
      const Δh = 30 - 60;
      const ΔH = 2 * Math.sqrt(0.02 * 0.03) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });

    it('should return 0 for identical colors', () => {
      const color: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 30 };
      expect(deltaEJZ(color, color)).toBe(0);
    });
  });

  describe('Handling of undefined hue values', () => {
    it('should handle both hue values being undefined', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: undefined };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.02, cz: 0.03, hz: undefined };

      // When both hues are undefined, h1 and h2 should be set to 0
      // Manual calculation
      const ΔJ = 0.01 - 0.02;
      const ΔC = 0.02 - 0.03;
      const Δh = 0 - 0; // Both hues are set to 0
      const ΔH = 2 * Math.sqrt(0.02 * 0.03) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle only the first hue value being undefined', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: undefined };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.02, cz: 0.03, hz: 60 };

      // When only the first hue is undefined, h1 should be set to h2 (60)
      // Manual calculation
      const ΔJ = 0.01 - 0.02;
      const ΔC = 0.02 - 0.03;
      const Δh = 60 - 60; // h1 is set to h2
      const ΔH = 2 * Math.sqrt(0.02 * 0.03) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle only the second hue value being undefined', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 30 };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.02, cz: 0.03, hz: undefined };

      // When only the second hue is undefined, h2 should be set to h1 (30)
      // Manual calculation
      const ΔJ = 0.01 - 0.02;
      const ΔC = 0.02 - 0.03;
      const Δh = 30 - 30; // h2 is set to h1
      const ΔH = 2 * Math.sqrt(0.02 * 0.03) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle null hue values the same as undefined', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: null as unknown as undefined };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.02, cz: 0.03, hz: 60 };

      // When only the first hue is null, h1 should be set to h2 (60)
      // Manual calculation
      const ΔJ = 0.01 - 0.02;
      const ΔC = 0.02 - 0.03;
      const Δh = 60 - 60; // h1 is set to h2
      const ΔH = 2 * Math.sqrt(0.02 * 0.03) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero chroma values', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0, hz: 30 };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.02, cz: 0, hz: 60 };

      // When chroma is zero, the hue difference component (ΔH) should be zero
      // Manual calculation
      const ΔJ = 0.01 - 0.02;
      const ΔC = 0 - 0;
      // ΔH is zero because Cz1 * Cz2 = 0

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle extreme hue differences', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 0 };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 180 };

      // Manual calculation
      const ΔJ = 0.01 - 0.01;
      const ΔC = 0.02 - 0.02;
      const Δh = 0 - 180;
      const ΔH = 2 * Math.sqrt(0.02 * 0.02) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.sqrt(ΔJ * ΔJ + ΔC * ΔC + ΔH * ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle alpha values if present (by ignoring them)', () => {
      const color1: JzCzHzColor & { alpha?: number } = {
        space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 30, alpha: 1.0
      };
      const color2: JzCzHzColor & { alpha?: number } = {
        space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 30, alpha: 0.5
      };

      // Alpha should be ignored, so identical colors should have a delta E of 0
      expect(deltaEJZ(color1, color2)).toBe(0);
    });
  });

  describe('Implementation details', () => {
    it('should use the correct formula for the hue difference component', () => {
      const color1: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 30 };
      const color2: JzCzHzColor = { space: 'jzczhz', jz: 0.01, cz: 0.02, hz: 60 };

      // Only the hue differs, so ΔJ and ΔC are zero
      // The result should be equal to the hue difference component
      const Δh = 30 - 60;
      const ΔH = 2 * Math.sqrt(0.02 * 0.02) * Math.sin(Δh * DEG_TO_RAD);

      const expected = Math.abs(ΔH);

      expect(deltaEJZ(color1, color2)).toBeCloseTo(expected);
    });
  });
});
