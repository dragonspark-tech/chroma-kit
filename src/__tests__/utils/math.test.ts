import { describe, it, expect } from 'vitest';
import {
  clamp,
  round,
  floor,
  normalize,
  pow7,
  isClose,
  radiansToDegrees,
  degreesToRadians,
  rectToPolar,
  polarToRect,
  getSign,
  linearInterpolation,
  inverseLinearInterpolation,
  copySign,
  signedPow
} from '../../../src/utils/math';

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
      expect(pow7(1)).toBe(1); // 1^7 = 1
      expect(pow7(0)).toBe(0); // 0^7 = 0
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

  describe('isClose', () => {
    it('should return true for identical numbers', () => {
      expect(isClose(5, 5)).toBe(true);
      expect(isClose(0, 0)).toBe(true);
      expect(isClose(-5, -5)).toBe(true);
    });

    it('should return true for numbers within relative tolerance', () => {
      expect(isClose(1.0, 1.0000001, 1e-6)).toBe(true);
      expect(isClose(1000.0, 1000.0001, 1e-6)).toBe(true);
      expect(isClose(-1.0, -1.0000001, 1e-6)).toBe(true);
    });

    it('should return true for numbers within absolute tolerance', () => {
      expect(isClose(1.0, 1.1, 0, 0.2)).toBe(true);
      expect(isClose(-1.0, -1.1, 0, 0.2)).toBe(true);
    });

    it('should return false for numbers outside tolerances', () => {
      expect(isClose(1.0, 1.2, 1e-6, 0.1)).toBe(false);
      expect(isClose(-1.0, -1.2, 1e-6, 0.1)).toBe(false);
    });

    it('should handle NaN values', () => {
      expect(isClose(NaN, 1.0)).toBe(false);
      expect(isClose(1.0, NaN)).toBe(false);
      expect(isClose(NaN, NaN)).toBe(false);
    });

    it('should handle zero values with relative tolerance', () => {
      expect(isClose(0.0, 0.0, 1e-6)).toBe(true);
      expect(isClose(0.0, 1e-7, 1e-6, 0)).toBe(false);
      expect(isClose(0.0, 1e-7, 0, 1e-6)).toBe(true);
    });
  });

  describe('radiansToDegrees', () => {
    it('should convert radians to degrees', () => {
      expect(radiansToDegrees(0)).toBe(0);
      expect(radiansToDegrees(Math.PI)).toBe(180);
      expect(radiansToDegrees(Math.PI / 2)).toBe(90);
      expect(radiansToDegrees(Math.PI / 4)).toBe(45);
      expect(radiansToDegrees(2 * Math.PI)).toBe(360);
    });

    it('should handle negative values', () => {
      expect(radiansToDegrees(-Math.PI)).toBe(-180);
      expect(radiansToDegrees(-Math.PI / 2)).toBe(-90);
    });
  });

  describe('degreesToRadians', () => {
    it('should convert degrees to radians', () => {
      expect(degreesToRadians(0)).toBe(0);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
    });

    it('should handle negative values', () => {
      expect(degreesToRadians(-180)).toBeCloseTo(-Math.PI);
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2);
    });
  });

  describe('rectToPolar', () => {
    it('should convert rectangular coordinates to polar coordinates', () => {
      const [r, theta] = rectToPolar(1, 0);
      expect(r).toBeCloseTo(1);
      expect(theta).toBeCloseTo(0);
    });

    it('should handle the y-axis', () => {
      const [r, theta] = rectToPolar(0, 1);
      expect(r).toBeCloseTo(1);
      expect(theta).toBeCloseTo(90);
    });

    it('should handle negative x values', () => {
      const [r, theta] = rectToPolar(-1, 0);
      expect(r).toBeCloseTo(1);
      expect(theta).toBeCloseTo(180);
    });

    it('should handle negative y values', () => {
      const [r, theta] = rectToPolar(0, -1);
      expect(r).toBeCloseTo(1);
      expect(theta).toBeCloseTo(-90);
    });

    it('should handle points in different quadrants', () => {
      // First quadrant
      let [r, theta] = rectToPolar(1, 1);
      expect(r).toBeCloseTo(Math.sqrt(2));
      expect(theta).toBeCloseTo(45);

      // Second quadrant
      [r, theta] = rectToPolar(-1, 1);
      expect(r).toBeCloseTo(Math.sqrt(2));
      expect(theta).toBeCloseTo(135);

      // Third quadrant
      [r, theta] = rectToPolar(-1, -1);
      expect(r).toBeCloseTo(Math.sqrt(2));
      expect(theta).toBeCloseTo(-135);

      // Fourth quadrant
      [r, theta] = rectToPolar(1, -1);
      expect(r).toBeCloseTo(Math.sqrt(2));
      expect(theta).toBeCloseTo(-45);
    });
  });

  describe('polarToRect', () => {
    it('should convert polar coordinates to rectangular coordinates', () => {
      const [x, y] = polarToRect(1, 0);
      expect(x).toBeCloseTo(1);
      expect(y).toBeCloseTo(0);
    });

    it('should handle 90 degrees', () => {
      const [x, y] = polarToRect(1, 90);
      expect(x).toBeCloseTo(0, 5);
      expect(y).toBeCloseTo(1);
    });

    it('should handle 180 degrees', () => {
      const [x, y] = polarToRect(1, 180);
      expect(x).toBeCloseTo(-1);
      expect(y).toBeCloseTo(0, 5);
    });

    it('should handle 270 degrees', () => {
      const [x, y] = polarToRect(1, 270);
      expect(x).toBeCloseTo(0, 5);
      expect(y).toBeCloseTo(-1);
    });

    it('should handle angles in different quadrants', () => {
      // First quadrant
      let [x, y] = polarToRect(Math.sqrt(2), 45);
      expect(x).toBeCloseTo(1);
      expect(y).toBeCloseTo(1);

      // Second quadrant
      [x, y] = polarToRect(Math.sqrt(2), 135);
      expect(x).toBeCloseTo(-1);
      expect(y).toBeCloseTo(1);

      // Third quadrant
      [x, y] = polarToRect(Math.sqrt(2), 225);
      expect(x).toBeCloseTo(-1);
      expect(y).toBeCloseTo(-1);

      // Fourth quadrant
      [x, y] = polarToRect(Math.sqrt(2), 315);
      expect(x).toBeCloseTo(1);
      expect(y).toBeCloseTo(-1);
    });

    it('should handle different magnitudes', () => {
      const [x, y] = polarToRect(2, 45);
      expect(x).toBeCloseTo(Math.sqrt(2));
      expect(y).toBeCloseTo(Math.sqrt(2));
    });
  });

  describe('getSign', () => {
    it('should return 1 for positive numbers', () => {
      expect(getSign(5)).toBe(1);
      expect(getSign(0.1)).toBe(1);
    });

    it('should return -1 for negative numbers', () => {
      expect(getSign(-5)).toBe(-1);
      expect(getSign(-0.1)).toBe(-1);
    });

    it('should return 0 for zero', () => {
      expect(getSign(0)).toBe(0);
    });

    it('should return NaN for NaN', () => {
      expect(getSign(NaN)).toBeNaN();
    });
  });

  describe('linearInterpolation', () => {
    it('should interpolate between two values', () => {
      expect(linearInterpolation(0, 10, 0.5)).toBe(5);
      expect(linearInterpolation(0, 10, 0)).toBe(0);
      expect(linearInterpolation(0, 10, 1)).toBe(10);
    });

    it('should handle extrapolation', () => {
      expect(linearInterpolation(0, 10, -0.5)).toBe(-5);
      expect(linearInterpolation(0, 10, 1.5)).toBe(15);
    });

    it('should handle negative values', () => {
      expect(linearInterpolation(-10, 10, 0.5)).toBe(0);
      expect(linearInterpolation(-10, -5, 0.5)).toBe(-7.5);
    });
  });

  describe('inverseLinearInterpolation', () => {
    it('should calculate the relative position of a value between two points', () => {
      expect(inverseLinearInterpolation(0, 10, 5)).toBe(0.5);
      expect(inverseLinearInterpolation(0, 10, 0)).toBe(0);
      expect(inverseLinearInterpolation(0, 10, 10)).toBe(1);
    });

    it('should handle values outside the range', () => {
      expect(inverseLinearInterpolation(0, 10, -5)).toBe(-0.5);
      expect(inverseLinearInterpolation(0, 10, 15)).toBe(1.5);
    });

    it('should handle negative ranges', () => {
      expect(inverseLinearInterpolation(-10, 10, 0)).toBe(0.5);
      expect(inverseLinearInterpolation(-10, -5, -7.5)).toBe(0.5);
    });

    it('should return 0 when p0 equals p1 to avoid division by zero', () => {
      expect(inverseLinearInterpolation(5, 5, 5)).toBe(0);
      expect(inverseLinearInterpolation(5, 5, 10)).toBe(0);
    });
  });

  describe('copySign', () => {
    it('should return the value with the sign of the reference', () => {
      expect(copySign(5, 10)).toBe(5);
      expect(copySign(5, -10)).toBe(-5);
      expect(copySign(-5, 10)).toBe(5);
      expect(copySign(-5, -10)).toBe(-5);
    });

    it('should handle zero values', () => {
      expect(copySign(0, 10)).toBe(0);
      expect(copySign(0, -10)).toBe(-0);
      expect(copySign(5, 0)).toBe(5);
      expect(copySign(-5, -0)).toBe(-5);
    });

    it('should handle NaN values', () => {
      expect(copySign(NaN, -1)).toBeNaN();
      expect(copySign(1, NaN)).toBeNaN();
    })
  });

  describe('signedPow', () => {
    it('should preserve the sign when raising to a power', () => {
      expect(signedPow(2, 2)).toBe(4);
      expect(signedPow(-2, 2)).toBe(-4);
    });

    it('should handle zero base', () => {
      expect(signedPow(0, 2)).toBe(0);
    });

    it('should handle fractional exponents', () => {
      expect(signedPow(4, 0.5)).toBeCloseTo(2);
      expect(signedPow(-4, 0.5)).toBeCloseTo(-2);
    });

    it('should handle zero exponent', () => {
      expect(signedPow(2, 0)).toBe(1);
      expect(signedPow(-2, 0)).toBe(-1);
    });
  });
});
