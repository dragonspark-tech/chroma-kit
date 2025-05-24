import { describe, it, expect } from 'vitest';
import { isNone } from '../../../src/utils/logic';

describe('logic', () => {
  describe('isNone', () => {
    it('should return true for null', () => {
      expect(isNone(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNone(undefined)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(isNone(0)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isNone('')).toBe(false);
    });

    it('should return false for false', () => {
      expect(isNone(false)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isNone(NaN)).toBe(false);
    });

    it('should return false for objects', () => {
      expect(isNone({})).toBe(false);
      expect(isNone([])).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isNone(() => {})).toBe(false);
    });
  });
});
