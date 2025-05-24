import { describe, expect, it, vi } from 'vitest';
import { deltaEOKScaled } from '../../deltae/deltae-ok-scaled';
import { oklab, type OKLabColor } from '../../models/oklab';
import { APPRX_OKLAB_SCALING, COMBVD_OKLAB_SCALING, OSAUCS_OKLAB_SCALING } from '../../deltae/constants';

describe('Delta E OK Scaled', () => {
  describe('Basic functionality', () => {
    it('should calculate the scaled Euclidean distance between two OKLab colors', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.6, 0.2, 0.2);

      // Calculate expected result with default scaling (2.0):
      // sqrt((0.5-0.6)^2 + (2.0*(0.1-0.2))^2 + (2.0*(0.1-0.2))^2)
      // = sqrt(0.01 + 0.04 + 0.04) = sqrt(0.09) = 0.3
      const expected = Math.sqrt(0.01 + 0.04 + 0.04);

      expect(deltaEOKScaled(color1, color2)).toBeCloseTo(expected);
    });

    it('should return 0 for identical colors', () => {
      const color = oklab(0.5, 0.1, 0.1);
      expect(deltaEOKScaled(color, color)).toBe(0);
    });
  });

  describe('Scaling factor', () => {
    it('should use the default scaling factor (APPRX_OKLAB_SCALING) when not provided', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.5, 0.2, 0.2);

      // Only a and b differ, and they're scaled by APPRX_OKLAB_SCALING (2.0)
      // sqrt((0.5-0.5)^2 + (2.0*(0.1-0.2))^2 + (2.0*(0.1-0.2))^2)
      // = sqrt(0 + 0.04 + 0.04) = sqrt(0.08) ≈ 0.2828
      const expected = Math.sqrt(0.08);

      expect(deltaEOKScaled(color1, color2)).toBeCloseTo(expected);
    });

    it('should apply a custom scaling factor when provided', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.5, 0.2, 0.2);
      const customScaling = 3.0;

      // Only a and b differ, and they're scaled by customScaling (3.0)
      // sqrt((0.5-0.5)^2 + (3.0*(0.1-0.2))^2 + (3.0*(0.1-0.2))^2)
      // = sqrt(0 + 0.09 + 0.09) = sqrt(0.18) ≈ 0.4243
      const expected = Math.sqrt(0.18);

      expect(deltaEOKScaled(color1, color2, customScaling)).toBeCloseTo(expected);
    });

    it('should work with the predefined COMBVD_OKLAB_SCALING factor', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.5, 0.2, 0.2);

      // Only a and b differ, and they're scaled by COMBVD_OKLAB_SCALING (2.016)
      // sqrt((0.5-0.5)^2 + (2.016*(0.1-0.2))^2 + (2.016*(0.1-0.2))^2)
      // = sqrt(0 + 0.04064256 + 0.04064256) ≈ sqrt(0.08128512) ≈ 0.2851
      const expected = Math.sqrt(2 * Math.pow(COMBVD_OKLAB_SCALING * 0.1, 2));

      expect(deltaEOKScaled(color1, color2, COMBVD_OKLAB_SCALING)).toBeCloseTo(expected);
    });

    it('should work with the predefined OSAUCS_OKLAB_SCALING factor', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.5, 0.2, 0.2);

      // Only a and b differ, and they're scaled by OSAUCS_OKLAB_SCALING (2.045)
      const expected = Math.sqrt(2 * Math.pow(OSAUCS_OKLAB_SCALING * 0.1, 2));

      expect(deltaEOKScaled(color1, color2, OSAUCS_OKLAB_SCALING)).toBeCloseTo(expected);
    });
  });

  describe('Edge cases', () => {
    it('should handle extreme values', () => {
      const black = oklab(0, 0, 0);
      const white = oklab(1, 0, 0);

      // Distance between black and white in OKLab is 1 (only L changes)
      expect(deltaEOKScaled(black, white)).toBe(1);
    });

    it('should handle negative values', () => {
      const color1 = oklab(0.5, -0.1, -0.1);
      const color2 = oklab(0.5, 0.1, 0.1);

      // Only a and b differ, and they're scaled by APPRX_OKLAB_SCALING (2.0)
      // sqrt((0.5-0.5)^2 + (2.0*(-0.1-0.1))^2 + (2.0*(-0.1-0.1))^2)
      // = sqrt(0 + 0.16 + 0.16) = sqrt(0.32) ≈ 0.5657
      const expected = Math.sqrt(0.32);

      expect(deltaEOKScaled(color1, color2)).toBeCloseTo(expected);
    });
  });

  describe('Implementation details', () => {
    it('should use Math.hypot for the calculation', () => {
      const color1 = oklab(0.5, 0.1, 0.1);
      const color2 = oklab(0.6, 0.2, 0.2);

      // Mock Math.hypot to verify it's called
      const originalHypot = Math.hypot;
      const mockHypot = vi.fn().mockImplementation(originalHypot);
      Math.hypot = mockHypot;

      try {
        deltaEOKScaled(color1, color2);
        expect(mockHypot).toHaveBeenCalledTimes(1);

        // Verify the arguments passed to Math.hypot
        const dL = 0.5 - 0.6;
        const da = APPRX_OKLAB_SCALING * (0.1 - 0.2);
        const db = APPRX_OKLAB_SCALING * (0.1 - 0.2);
        expect(mockHypot).toHaveBeenCalledWith(dL, da, db);
      } finally {
        // Restore the original Math.hypot
        Math.hypot = originalHypot;
      }
    });
  });
});
