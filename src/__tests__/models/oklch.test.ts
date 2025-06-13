import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  oklch,
  oklchFromVector,
  oklchToCSSString,
  oklchToHSL,
  oklchToHSV,
  oklchToHWB,
  oklchToJzAzBz,
  oklchToJzCzHz,
  oklchToLab,
  oklchToLCh,
  oklchToOKLab,
  oklchToP3,
  oklchToRGB,
  oklchToXYZ
} from '../../models/oklch';
import { oklchFromCSSString } from '../../models/oklch/parser';
import { rgb } from '../../models/rgb';

describe('OKLCh Color Model', () => {
  // Test oklch factory function
  describe('oklch', () => {
    it('should create an OKLCh color with the correct properties', () => {
      const color = oklch(0.5, 0.2, 270);
      expect(color.space).toBe('oklch');
      expect(color.l).toBe(0.5);
      expect(color.c).toBe(0.2);
      expect(color.h).toBe(270);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an OKLCh color with alpha', () => {
      const color = oklch(0.5, 0.2, 270, 0.8);
      expect(color.space).toBe('oklch');
      expect(color.l).toBe(0.5);
      expect(color.c).toBe(0.2);
      expect(color.h).toBe(270);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = oklch(0.5, 0.2, 270, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('oklch');
    });

    it('should have a toCSSString method', () => {
      const color = oklch(0.5, 0.2, 270, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('oklch');
    });

    it('should have a to method for color space conversion', () => {
      const color = oklch(0.5, 0.2, 270);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test oklchFromVector function
  describe('oklchFromVector', () => {
    it('should create an OKLCh color from a vector', () => {
      const color = oklchFromVector([0.5, 0.2, 270]);
      expect(color.space).toBe('oklch');
      expect(color.l).toBe(0.5);
      expect(color.c).toBe(0.2);
      expect(color.h).toBe(270);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an OKLCh color from a vector with alpha', () => {
      const color = oklchFromVector([0.5, 0.2, 270], 0.8);
      expect(color.space).toBe('oklch');
      expect(color.l).toBe(0.5);
      expect(color.c).toBe(0.2);
      expect(color.h).toBe(270);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => oklchFromVector([0.5, 0.2])).toThrow('Invalid vector length');
      expect(() => oklchFromVector([0.5, 0.2, 270, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test oklchToCSSString function
  describe('oklchToCSSString', () => {
    it('should convert an OKLCh color to a CSS string', () => {
      const color = oklch(0.5, 0.2, 270);
      expect(oklchToCSSString(color)).toBe('oklch(50.00% 0.200 270.000)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = oklch(0.5, 0.2, 270, 0.8);
      expect(oklchToCSSString(color)).toBe('oklch(50.00% 0.200 270.000 / 0.800)');
    });
  });

  // Test oklchFromCSSString function
  describe('oklchFromCSSString', () => {
    it('should parse a CSS OKLCh color string with space syntax', () => {
      const color = oklchFromCSSString('oklch(50% 0.2 270)');
      expect(color.space).toBe('oklch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(0.2, 5);
      expect(color.h).toBeCloseTo(270, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS OKLCh color string with comma syntax', () => {
      const color = oklchFromCSSString('oklch(50%, 0.2, 270)');
      expect(color.space).toBe('oklch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(0.2, 5);
      expect(color.h).toBeCloseTo(270, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS OKLCh color string with decimal lightness', () => {
      const color = oklchFromCSSString('oklch(0.5 0.2 270)');
      expect(color.space).toBe('oklch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(0.2, 5);
      expect(color.h).toBeCloseTo(270, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS OKLCh color string with alpha using slash syntax', () => {
      const color = oklchFromCSSString('oklch(50% 0.2 270 / 0.8)');
      expect(color.space).toBe('oklch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(0.2, 5);
      expect(color.h).toBeCloseTo(270, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS OKLCh color string with alpha using comma syntax', () => {
      const color = oklchFromCSSString('oklch(50%, 0.2, 270, 0.8)');
      expect(color.space).toBe('oklch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(0.2, 5);
      expect(color.h).toBeCloseTo(270, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS OKLCh color string with alpha as percentage', () => {
      const color = oklchFromCSSString('oklch(50% 0.2 270 / 80%)');
      expect(color.space).toBe('oklch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(0.2, 5);
      expect(color.h).toBeCloseTo(270, 5);
      expect(color.alpha).toBe(0.8);
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = oklch(0.5, 0.2, 270);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('rgb');
        expect(rgb.space).toBe('rgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('oklchToRGB', () => {
      it('should convert OKLCh to RGB', () => {
        const rgb = oklchToRGB(testColor);
        expect(rgb.space).toBe('rgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const rgb = oklchToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });
    });

    describe('oklchToHSL', () => {
      it('should convert OKLCh to HSL', () => {
        const hsl = oklchToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const hsl = oklchToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });
    });

    describe('oklchToHSV', () => {
      it('should convert OKLCh to HSV', () => {
        const hsv = oklchToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const hsv = oklchToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });
    });

    describe('oklchToHWB', () => {
      it('should convert OKLCh to HWB', () => {
        const hwb = oklchToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const hwb = oklchToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('oklchToXYZ', () => {
      it('should convert OKLCh to XYZ', () => {
        const xyz = oklchToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(typeof xyz.x).toBe('number');
        expect(typeof xyz.y).toBe('number');
        expect(typeof xyz.z).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const xyz = oklchToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.8);
      });
    });

    describe('oklchToLab', () => {
      it('should convert OKLCh to Lab', () => {
        const lab = oklchToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const lab = oklchToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.8);
      });
    });

    describe('oklchToLCh', () => {
      it('should convert OKLCh to LCh', () => {
        const lch = oklchToLCh(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const lch = oklchToLCh(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });
    });

    describe('oklchToOKLab', () => {
      it('should convert OKLCh to OKLab', () => {
        const oklab = oklchToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeCloseTo(testColor.l, 5);
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const oklab = oklchToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });

      it('should correctly convert polar to cartesian coordinates', () => {
        // For h = 0, a should be positive and b should be 0
        const color0 = oklch(0.5, 0.2, 0);
        const oklab0 = oklchToOKLab(color0);
        expect(oklab0.a).toBeCloseTo(0.2, 5);
        expect(oklab0.b).toBeCloseTo(0, 5);

        // For h = 90, a should be 0 and b should be positive
        const color90 = oklch(0.5, 0.2, 90);
        const oklab90 = oklchToOKLab(color90);
        expect(oklab90.a).toBeCloseTo(0, 5);
        expect(oklab90.b).toBeCloseTo(0.2, 5);

        // For h = 180, a should be negative and b should be 0
        const color180 = oklch(0.5, 0.2, 180);
        const oklab180 = oklchToOKLab(color180);
        expect(oklab180.a).toBeCloseTo(-0.2, 5);
        expect(oklab180.b).toBeCloseTo(0, 5);

        // For h = 270, a should be 0 and b should be negative
        const color270 = oklch(0.5, 0.2, 270);
        const oklab270 = oklchToOKLab(color270);
        expect(oklab270.a).toBeCloseTo(0, 5);
        expect(oklab270.b).toBeCloseTo(-0.2, 5);
      });
    });

    describe('oklchToJzAzBz', () => {
      it('should convert OKLCh to JzAzBz with default peak luminance', () => {
        const jzazbz = oklchToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert OKLCh to JzAzBz with custom peak luminance', () => {
        const jzazbz = oklchToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const jzazbz = oklchToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('oklchToJzCzHz', () => {
      it('should convert OKLCh to JzCzHz with default peak luminance', () => {
        const jzczhz = oklchToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeLessThanOrEqual(360);
      });

      it('should convert OKLCh to JzCzHz with custom peak luminance', () => {
        const jzczhz = oklchToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const jzczhz = oklchToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });

    describe('oklchToP3', () => {
      it('should convert OKLCh to P3', () => {
        const p3 = oklchToP3(testColor);
        expect(p3.space).toBe('p3');
        expect(p3.r).toBeGreaterThanOrEqual(0);
        expect(p3.r).toBeLessThanOrEqual(1);
        expect(p3.g).toBeGreaterThanOrEqual(0);
        expect(p3.g).toBeLessThanOrEqual(1);
        expect(p3.b).toBeGreaterThanOrEqual(0);
        expect(p3.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklch(0.5, 0.2, 270, 0.8);
        const p3 = oklchToP3(colorWithAlpha);
        expect(p3.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve OKLCh values when converting to OKLab and back', () => {
      const original = oklch(0.5, 0.2, 270);
      const oklab = oklchToOKLab(original);
      const roundTrip = oklab.to('oklch');

      expect(roundTrip.l).toBeCloseTo(original.l, 5);
      expect(roundTrip.c).toBeCloseTo(original.c, 5);
      expect(roundTrip.h).toBeCloseTo(original.h, 5);
    });

    it('should approximately preserve OKLCh values when converting to RGB and back', () => {
      const original = oklch(0.5, 0.1, 270); // Using lower chroma to stay in gamut
      const rgb = oklchToRGB(original);
      const roundTrip = rgb.to('oklch');

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.c).toBeCloseTo(original.c, 1);
      // Hue can be unstable for low chroma colors, so we don't test it here
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert pure red in OKLCh correctly', () => {
      // Pure red in OKLCh
      const red = oklch(0.627986, 0.25764, 29.23);
      const rgb = oklchToRGB(red);
      expect(rgb.r).toBeCloseTo(1, 1);
      expect(rgb.g).toBeCloseTo(0, 1);
      expect(rgb.b).toBeCloseTo(0, 1);
    });

    it('should convert pure green in OKLCh correctly', () => {
      // First convert from RGB to OKLCh to get accurate values
      const rgb1 = rgb(0, 1, 0);
      const green = rgb1.to('oklch');
      // Then convert back to RGB
      const result = oklchToRGB(green);
      expect(result.r).toBeCloseTo(0, 1);
      expect(result.g).toBeCloseTo(1, 1);
      expect(result.b).toBeCloseTo(0, 1);
    });

    it('should convert pure blue in OKLCh correctly', () => {
      // First convert from RGB to OKLCh to get accurate values
      const rgb1 = rgb(0, 0, 1);
      const blue = rgb1.to('oklch');
      // Then convert back to RGB
      const result = oklchToRGB(blue);
      expect(result.r).toBeCloseTo(0, 1);
      expect(result.g).toBeCloseTo(0, 1);
      expect(result.b).toBeCloseTo(1, 1);
    });
  });
});
