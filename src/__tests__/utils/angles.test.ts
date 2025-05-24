import { describe, it, expect } from 'vitest';
import { constrainAngle } from '../../../src/utils/angles';

describe('angles', () => {
  describe('constrainAngle', () => {
    it('should return the same angle when it is between 0 and 359', () => {
      expect(constrainAngle(0)).toBe(0);
      expect(constrainAngle(180)).toBe(180);
      expect(constrainAngle(359)).toBe(359);
    });

    it('should normalize angles greater than or equal to 360', () => {
      expect(constrainAngle(360)).toBe(0);
      expect(constrainAngle(361)).toBe(1);
      expect(constrainAngle(540)).toBe(180); // 540 = 360 + 180
      expect(constrainAngle(720)).toBe(0);   // 720 = 360 * 2
    });

    it('should normalize negative angles', () => {
      expect(constrainAngle(-1)).toBe(359);
      expect(constrainAngle(-180)).toBe(180);
      expect(constrainAngle(-360)).toBe(0);
      expect(constrainAngle(-361)).toBe(359);
      expect(constrainAngle(-720)).toBe(0);  // -720 = -360 * 2
    });

    it('should handle large angles', () => {
      expect(constrainAngle(3600)).toBe(0);  // 3600 = 360 * 10
      expect(constrainAngle(3601)).toBe(1);
      expect(constrainAngle(-3600)).toBe(0); // -3600 = -360 * 10
      expect(constrainAngle(-3601)).toBe(359);
    });

    it('should handle decimal angles', () => {
      expect(constrainAngle(0.5)).toBe(0.5);
      expect(constrainAngle(359.5)).toBe(359.5);
      expect(constrainAngle(360.5)).toBe(0.5);
      expect(constrainAngle(-0.5)).toBe(359.5);
    });
  });
});
