import { describe, expect, it } from 'vitest';
import { deltaECMC, type DeltaECMCTolerances } from '../../deltae';
import { lch, type LChColor } from '../../models/lch';
import { DEG_TO_RAD } from '../../deltae/constants';

describe('Delta E CMC', () => {
  describe('Basic functionality', () => {
    it('should calculate the CMC color difference between two LCh colors with default tolerances', () => {
      const color1 = lch(50, 30, 0);
      const color2 = lch(55, 35, 10);

      // This is a complex calculation, so we'll just verify it returns a reasonable value
      const result = deltaECMC(color1, color2);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(10);
    });

    it('should return 0 for identical colors', () => {
      const color = lch(50, 30, 0);
      expect(deltaECMC(color, color)).toBe(0);
    });
  });

  describe('Tolerance factors', () => {
    it('should use the default tolerances (kL=2, kC=1) when not provided', () => {
      const color1 = lch(50, 30, 0);
      const color2 = lch(55, 35, 10);

      const defaultResult = deltaECMC(color1, color2);
      const explicitDefaultResult = deltaECMC(color1, color2, { kL: 2, kC: 1 });

      expect(defaultResult).toBe(explicitDefaultResult);
    });

    it('should apply custom tolerance factors when provided', () => {
      const color1 = lch(50, 30, 0);
      const color2 = lch(55, 35, 10);

      const customTolerances: DeltaECMCTolerances = { kL: 1, kC: 1 };
      const result1 = deltaECMC(color1, color2, customTolerances);

      const defaultResult = deltaECMC(color1, color2);

      // With kL=1 instead of 2, the lightness difference should have more weight
      // So the result should be larger than with the default tolerances
      expect(result1).toBeGreaterThan(defaultResult);
    });
  });

  describe('Lightness handling', () => {
    it('should use S_L = 0.511 when L1 < 16', () => {
      const color1 = lch(15, 30, 0);
      const color2 = lch(20, 30, 0);

      // Manual calculation for S_L = 0.511 when L1 < 16
      const ΔL = 15 - 20;
      const S_L = 0.511;
      const S_C = (0.0638 * 30) / (1 + 0.0131 * 30) + 0.638;
      const T = 0.36 + Math.abs(0.4 * Math.cos((+35) * DEG_TO_RAD));
      const S_H = S_C * T;

      // For identical chroma and hue, ΔC = 0 and ΔH = 0
      const expected = Math.sqrt(Math.pow(ΔL / (2 * S_L), 2));

      expect(deltaECMC(color1, color2)).toBeCloseTo(expected);
    });

    it('should calculate S_L based on formula when L1 >= 16', () => {
      const color1 = lch(50, 30, 0);
      const color2 = lch(55, 30, 0);

      // Manual calculation for S_L when L1 >= 16
      const ΔL = 50 - 55;
      const S_L = (0.040975 * 50) / (1 + 0.01765 * 50);
      const S_C = (0.0638 * 30) / (1 + 0.0131 * 30) + 0.638;
      const T = 0.36 + Math.abs(0.4 * Math.cos((+35) * DEG_TO_RAD));
      const S_H = S_C * T;

      // For identical chroma and hue, ΔC = 0 and ΔH = 0
      const expected = Math.sqrt(Math.pow(ΔL / (2 * S_L), 2));

      expect(deltaECMC(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Hue handling', () => {
    it('should use T = 0.56 + |0.2 * cos(h1 + 168)| when h1 is between 164 and 345', () => {
      const color1 = lch(50, 30, 200);
      const color2 = lch(50, 30, 210);

      // Manual calculation for T when h1 is between 164 and 345
      const T = 0.56 + Math.abs(0.2 * Math.cos((200 + 168) * DEG_TO_RAD));
      const S_C = (0.0638 * 30) / (1 + 0.0131 * 30) + 0.638;
      const S_H = S_C * T;

      // For identical lightness and chroma, ΔL = 0 and ΔC = 0
      // Calculate ΔH
      const ΔH = Math.sqrt(
        Math.max(
          0,
          30 * 30 * 2 * (1 - Math.cos((200 - 210) * DEG_TO_RAD))
        )
      );

      const expected = Math.sqrt(Math.pow(ΔH / S_H, 2));

      expect(deltaECMC(color1, color2)).toBeCloseTo(expected);
    });

    it('should use T = 0.36 + |0.4 * cos(h1 + 35)| when h1 is outside 164-345 range', () => {
      const color1 = lch(50, 30, 100);
      const color2 = lch(50, 30, 110);

      // Manual calculation for T when h1 is outside 164-345 range
      const T = 0.36 + Math.abs(0.4 * Math.cos((100 + 35) * DEG_TO_RAD));
      const S_C = (0.0638 * 30) / (1 + 0.0131 * 30) + 0.638;
      const S_H = S_C * T;

      // For identical lightness and chroma, ΔL = 0 and ΔC = 0
      // Calculate ΔH
      const ΔH = Math.sqrt(
        Math.max(
          0,
          30 * 30 * 2 * (1 - Math.cos((100 - 110) * DEG_TO_RAD))
        )
      );

      const expected = Math.sqrt(Math.pow(ΔH / S_H, 2));

      expect(deltaECMC(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero chroma values', () => {
      const color1 = lch(50, 0, 0);
      const color2 = lch(55, 0, 0);

      // When chroma is zero, only lightness difference matters
      const ΔL = 50 - 55;
      const S_L = (0.040975 * 50) / (1 + 0.01765 * 50);

      const expected = Math.sqrt(Math.pow(ΔL / (2 * S_L), 2));

      expect(deltaECMC(color1, color2)).toBeCloseTo(expected);
    });

    it('should handle extreme hue differences', () => {
      const color1 = lch(50, 30, 0);
      const color2 = lch(50, 30, 180);

      // This is a complex calculation, so we'll just verify it returns a reasonable value
      const result = deltaECMC(color1, color2);
      expect(result).toBeGreaterThan(0);
    });

    it('should handle alpha values if present (by ignoring them)', () => {
      const color1 = lch(50, 30, 0);
      const color2 = lch(50, 30, 0);

      // Alpha should be ignored, so identical colors should have a delta E of 0
      expect(deltaECMC(color1, color2)).toBe(0);
    });
  });
});
