import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  jzczhz,
  jzczhzFromVector,
  jzczhzToCSSString,
  jzczhzToHSL,
  jzczhzToHSV,
  jzczhzToHWB,
  jzczhzToJzAzBz,
  jzczhzToLab,
  jzczhzToLCh,
  jzczhzToOKLab,
  jzczhzToOKLCh,
  jzczhzToRGB,
  jzczhzToXYZ
} from '../../models/jzczhz';
import { jzczhzFromCSSString } from '../../models/jzczhz/parser';
import { srgb } from '../../models/srgb';

describe('JzCzHz Color Model', () => {
  // Test jzczhz factory function
  describe('jzczhz', () => {
    it('should create a JzCzHz color with the correct properties', () => {
      const color = jzczhz(0.1, 0.2, 180);
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBe(0.1);
      expect(color.cz).toBe(0.2);
      expect(color.hz).toBe(180);
      expect(color.alpha).toBeUndefined();
    });

    it('should create a JzCzHz color with alpha', () => {
      const color = jzczhz(0.1, 0.2, 180, 0.8);
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBe(0.1);
      expect(color.cz).toBe(0.2);
      expect(color.hz).toBe(180);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = jzczhz(0.1, 0.2, 180, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('jzczhz');
    });

    it('should have a toCSSString method', () => {
      const color = jzczhz(0.1, 0.2, 180, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('jzczhz');
    });

    it('should have a to method for color space conversion', () => {
      const color = jzczhz(0.1, 0.2, 180);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test jzczhzFromVector function
  describe('jzczhzFromVector', () => {
    it('should create a JzCzHz color from a vector', () => {
      const color = jzczhzFromVector([0.1, 0.2, 180]);
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBe(0.1);
      expect(color.cz).toBe(0.2);
      expect(color.hz).toBe(180);
      expect(color.alpha).toBeUndefined();
    });

    it('should create a JzCzHz color from a vector with alpha', () => {
      const color = jzczhzFromVector([0.1, 0.2, 180], 0.8);
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBe(0.1);
      expect(color.cz).toBe(0.2);
      expect(color.hz).toBe(180);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => jzczhzFromVector([0.1, 0.2])).toThrow('Invalid vector length');
      expect(() => jzczhzFromVector([0.1, 0.2, 180, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test jzczhzToCSSString function
  describe('jzczhzToCSSString', () => {
    it('should convert a JzCzHz color to a CSS string', () => {
      const color = jzczhz(0.1, 0.2, 180);
      expect(jzczhzToCSSString(color)).toBe('color(jzczhz 0.1 0.2 180)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = jzczhz(0.1, 0.2, 180, 0.8);
      expect(jzczhzToCSSString(color)).toBe('color(jzczhz 0.1 0.2 180 / 0.8)');
    });
  });

  // Test jzczhzFromCSSString function
  describe('jzczhzFromCSSString', () => {
    it('should parse a CSS JzCzHz color string', () => {
      const color = jzczhzFromCSSString('jzczhz(0.1, 0.2, 180)');
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBeCloseTo(0.1, 5);
      expect(color.cz).toBeCloseTo(0.2, 5);
      expect(color.hz).toBeCloseTo(180, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS JzCzHz color string with alpha', () => {
      const color = jzczhzFromCSSString('jzczhz(0.1, 0.2, 180, 0.8)');
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBeCloseTo(0.1, 5);
      expect(color.cz).toBeCloseTo(0.2, 5);
      expect(color.hz).toBeCloseTo(180, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS JzCzHz color string with space syntax', () => {
      const color = jzczhzFromCSSString('jzczhz(0.1 0.2 180)');
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBeCloseTo(0.1, 5);
      expect(color.cz).toBeCloseTo(0.2, 5);
      expect(color.hz).toBeCloseTo(180, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS JzCzHz color string with space syntax and alpha', () => {
      const color = jzczhzFromCSSString('jzczhz(0.1 0.2 180 / 0.8)');
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBeCloseTo(0.1, 5);
      expect(color.cz).toBeCloseTo(0.2, 5);
      expect(color.hz).toBeCloseTo(180, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid JzCzHz color format', () => {
      expect(() => jzczhzFromCSSString('rgb(0, 0, 0)')).toThrow();
      expect(() => jzczhzFromCSSString('jzczhz()')).toThrow();
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = jzczhz(0.1, 0.2, 180);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('srgb');
        expect(rgb.space).toBe('srgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('jzczhzToRGB', () => {
      it('should convert JzCzHz to RGB', () => {
        const rgb = jzczhzToRGB(testColor);
        expect(rgb.space).toBe('srgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const rgb = jzczhzToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToHSL', () => {
      it('should convert JzCzHz to HSL', () => {
        const hsl = jzczhzToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const hsl = jzczhzToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToHSV', () => {
      it('should convert JzCzHz to HSV', () => {
        const hsv = jzczhzToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const hsv = jzczhzToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToHWB', () => {
      it('should convert JzCzHz to HWB', () => {
        const hwb = jzczhzToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const hwb = jzczhzToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToXYZ', () => {
      it('should convert JzCzHz to XYZ', () => {
        const xyz = jzczhzToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(typeof xyz.x).toBe('number');
        expect(typeof xyz.y).toBe('number');
        expect(typeof xyz.z).toBe('number');
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const xyz = jzczhzToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToLab', () => {
      it('should convert JzCzHz to Lab', () => {
        const lab = jzczhzToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const lab = jzczhzToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToLCh', () => {
      it('should convert JzCzHz to LCh', () => {
        const lch = jzczhzToLCh(testColor);
        expect(lch.space).toBe('lch');
        expect(typeof lch.l).toBe('number');
        expect(typeof lch.c).toBe('number');
        expect(typeof lch.h).toBe('number');
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const lch = jzczhzToLCh(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToOKLab', () => {
      it('should convert JzCzHz to OKLab', () => {
        const oklab = jzczhzToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(typeof oklab.l).toBe('number');
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const oklab = jzczhzToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToOKLCh', () => {
      it('should convert JzCzHz to OKLCh', () => {
        const oklch = jzczhzToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(typeof oklch.l).toBe('number');
        expect(typeof oklch.c).toBe('number');
        expect(typeof oklch.h).toBe('number');
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const oklch = jzczhzToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });
    });

    describe('jzczhzToJzAzBz', () => {
      it('should convert JzCzHz to JzAzBz', () => {
        const jzazbz = jzczhzToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(typeof jzazbz.jz).toBe('number');
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should preserve alpha during conversion', () => {
        const colorWithAlpha = jzczhz(0.1, 0.2, 180, 0.8);
        const jzazbz = jzczhzToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });

      it('should correctly convert hue angle to cartesian coordinates', () => {
        // Test with 0 degrees (should be positive az, zero bz)
        const color0 = jzczhz(0.1, 0.2, 0);
        const jzazbz0 = jzczhzToJzAzBz(color0);
        expect(jzazbz0.az).toBeCloseTo(0.2, 5);
        expect(jzazbz0.bz).toBeCloseTo(0, 5);

        // Test with 90 degrees (should be zero az, positive bz)
        const color90 = jzczhz(0.1, 0.2, 90);
        const jzazbz90 = jzczhzToJzAzBz(color90);
        expect(jzazbz90.az).toBeCloseTo(0, 5);
        expect(jzazbz90.bz).toBeCloseTo(0.2, 5);

        // Test with 180 degrees (should be negative az, zero bz)
        const color180 = jzczhz(0.1, 0.2, 180);
        const jzazbz180 = jzczhzToJzAzBz(color180);
        expect(jzazbz180.az).toBeCloseTo(-0.2, 5);
        expect(jzazbz180.bz).toBeCloseTo(0, 5);

        // Test with 270 degrees (should be zero az, negative bz)
        const color270 = jzczhz(0.1, 0.2, 270);
        const jzazbz270 = jzczhzToJzAzBz(color270);
        expect(jzazbz270.az).toBeCloseTo(0, 5);
        expect(jzazbz270.bz).toBeCloseTo(-0.2, 5);
      });
    });
  });

  // Test roundtrip conversions
  describe('Roundtrip Conversions', () => {
    it('should preserve values in JzCzHz -> JzAzBz -> JzCzHz conversion', () => {
      const original = jzczhz(0.1, 0.2, 180);
      const jzazbz = jzczhzToJzAzBz(original);
      const roundtrip = jzazbz.to('jzczhz');

      expect(roundtrip.jz).toBeCloseTo(original.jz, 5);
      expect(roundtrip.cz).toBeCloseTo(original.cz, 5);
      expect(roundtrip.hz).toBeCloseTo(original.hz, 5);
    });

    it('should approximately preserve values in JzCzHz -> RGB -> JzCzHz conversion', () => {
      const original = jzczhz(0.1, 0.2, 180);
      const rgb = jzczhzToRGB(original);
      const roundtrip = rgb.to('jzczhz');

      // JzCzHz to RGB to JzCzHz conversion can have significant differences
      // due to the nature of the transformations and gamut limitations
      // For this test, we'll check that the values are within a reasonable range
      expect(roundtrip.jz).toBeGreaterThan(0);
      expect(roundtrip.jz).toBeLessThan(0.3);

      expect(roundtrip.cz).toBeGreaterThan(0);
      expect(roundtrip.cz).toBeLessThan(0.3);

      // Hue might have some variation in roundtrip conversions
      // so we check for equivalence modulo 360
      const hueDiff = Math.abs(roundtrip.hz - original.hz) % 360;
      expect(hueDiff < 1 || hueDiff > 359).toBeTruthy();
    });
  });
});
