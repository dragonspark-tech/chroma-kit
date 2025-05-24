import { describe, expect, it } from 'vitest';
import {
  DEG_TO_RAD,
  RAD_TO_DEG,
  E2000_GFACTOR,
  APPRX_OKLAB_SCALING,
  COMBVD_OKLAB_SCALING,
  OSAUCS_OKLAB_SCALING,
  OKLAB_DELTAE_SCALING
} from '../../deltae/constants';

describe('Delta E Constants', () => {
  describe('Angle conversion constants', () => {
    it('should have the correct value for DEG_TO_RAD', () => {
      expect(DEG_TO_RAD).toBeCloseTo(Math.PI / 180);
      expect(DEG_TO_RAD).toBe(0.017453292519943295);
    });

    it('should have the correct value for RAD_TO_DEG', () => {
      expect(RAD_TO_DEG).toBeCloseTo(180 / Math.PI);
      expect(RAD_TO_DEG).toBe(57.29577951308232);
    });

    it('should be inverse of each other', () => {
      expect(DEG_TO_RAD * RAD_TO_DEG).toBeCloseTo(1);
    });
  });

  describe('CIEDE2000 constants', () => {
    it('should have the correct value for E2000_GFACTOR', () => {
      expect(E2000_GFACTOR).toBe(6103515625); // 25^7
      expect(E2000_GFACTOR).toBe(Math.pow(25, 7));
    });
  });

  describe('OKLab scaling factors', () => {
    it('should have the correct value for APPRX_OKLAB_SCALING', () => {
      expect(APPRX_OKLAB_SCALING).toBe(2.0);
    });

    it('should have the correct value for COMBVD_OKLAB_SCALING', () => {
      expect(COMBVD_OKLAB_SCALING).toBe(2.016);
    });

    it('should have the correct value for OSAUCS_OKLAB_SCALING', () => {
      expect(OSAUCS_OKLAB_SCALING).toBe(2.045);
    });
  });

  describe('OKLAB_DELTAE_SCALING object', () => {
    it('should contain all scaling factors', () => {
      expect(OKLAB_DELTAE_SCALING).toEqual({
        approximate: APPRX_OKLAB_SCALING,
        combvd: COMBVD_OKLAB_SCALING,
        osaucs: OSAUCS_OKLAB_SCALING
      });
    });

    it('should have the correct values for each scaling factor', () => {
      expect(OKLAB_DELTAE_SCALING.approximate).toBe(2.0);
      expect(OKLAB_DELTAE_SCALING.combvd).toBe(2.016);
      expect(OKLAB_DELTAE_SCALING.osaucs).toBe(2.045);
    });
  });
});
