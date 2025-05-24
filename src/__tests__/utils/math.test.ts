import { describe, it, expect } from 'vitest';
import { clamp, round, floor, normalize, pow7 } from '../../../src/utils/math';

describe('math', () => {
  describe('clamp', () => {
    it('should return the value if it is within the range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should return the minimum value if the value is less than the minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return the maximum value if the value is greater than the maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle the case where min is greater than max', () => {
      expect(clamp(5, 10, 0)).toBe(5);
      expect(clamp(15, 10, 0)).toBe(10);
      expect(clamp(-5, 10, 0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(clamp(1.5, 1, 2)).toBe(1.5);
      expect(clamp(0.5, 1, 2)).toBe(1);
      expect(clamp(2.5, 1, 2)).toBe(2);
    });
  });

  describe('round', () => {
    it('should round to the nearest integer when digits is 0', () => {
      expect(round(1.4)).toBe(1);
      expect(round(1.5)).toBe(2);
      expect(round(1.6)).toBe(2);
      expect(round(-1.4)).toBe(-1);
      expect(round(-1.5)).toBe(-1); // Note: Math.round(-1.5) is -1 in JavaScript
      expect(round(-1.6)).toBe(-2);
    });

    it('should round to the specified number of decimal places', () => {
      expect(round(1.234, 2)).toBe(1.23);
      expect(round(1.235, 2)).toBe(1.24);
      expect(round(1.236, 2)).toBe(1.24);
      expect(round(-1.234, 2)).toBe(-1.23);
      expect(round(-1.235, 2)).toBe(-1.24);
      expect(round(-1.236, 2)).toBe(-1.24);
    });

    it('should handle large numbers of decimal places', () => {
      expect(round(Math.PI, 5)).toBe(3.14159);
    });
  });

  describe('floor', () => {
    it('should round down to the nearest integer when digits is 0', () => {
      expect(floor(1.4)).toBe(1);
      expect(floor(1.9)).toBe(1);
      expect(floor(-1.1)).toBe(-2);
      expect(floor(-1.9)).toBe(-2);
    });

    it('should round down to the specified number of decimal places', () => {
      expect(floor(1.234, 2)).toBe(1.23);
      expect(floor(1.239, 2)).toBe(1.23);
      expect(floor(-1.234, 2)).toBe(-1.24);
      expect(floor(-1.231, 2)).toBe(-1.24);
    });

    it('should handle large numbers of decimal places', () => {
      expect(floor(Math.PI, 5)).toBe(3.14159);
    });
  });

  describe('normalize', () => {
    it('should normalize a value within a range to a value between 0 and 1', () => {
      expect(normalize(5, 0, 10)).toBe(0.5);
      expect(normalize(0, 0, 10)).toBe(0);
      expect(normalize(10, 0, 10)).toBe(1);
    });

    it('should handle values outside the range', () => {
      expect(normalize(-5, 0, 10)).toBe(-0.5);
      expect(normalize(15, 0, 10)).toBe(1.5);
    });

    it('should handle custom ranges', () => {
      expect(normalize(0, -10, 10)).toBe(0.5);
      expect(normalize(-10, -10, 10)).toBe(0);
      expect(normalize(10, -10, 10)).toBe(1);
    });

    it('should handle decimal values', () => {
      expect(normalize(1.5, 1, 2)).toBe(0.5);
      expect(normalize(1.25, 1, 2)).toBe(0.25);
      expect(normalize(1.75, 1, 2)).toBe(0.75);
    });
  });

  describe('pow7', () => {
    it('should calculate the 7th power of a number', () => {
      expect(pow7(2)).toBe(128); // 2^7 = 128
      expect(pow7(1)).toBe(1);   // 1^7 = 1
      expect(pow7(0)).toBe(0);   // 0^7 = 0
    });

    it('should handle negative numbers', () => {
      expect(pow7(-2)).toBe(-128); // (-2)^7 = -128
    });

    it('should handle decimal numbers', () => {
      expect(pow7(0.5)).toBe(0.0078125); // 0.5^7 = 0.0078125
    });

    it('should match the result of Math.pow', () => {
      const testValues = [0.1, 0.5, 1, 2, 3, -0.5, -1, -2];
      for (const value of testValues) {
        expect(pow7(value)).toBeCloseTo(Math.pow(value, 7));
      }
    });
  });
});
