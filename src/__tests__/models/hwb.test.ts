import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  hwb,
  hwbFromVector,
  hwbToCSSString,
  hwbToHSL,
  hwbToHSV,
  hwbToJzAzBz,
  hwbToJzCzHz,
  hwbToLab,
  hwbToLCH,
  hwbToOKLab,
  hwbToOKLCh,
  hwbToP3,
  hwbToRGB,
  hwbToXYZ
} from '../../models/hwb';
import { hwbFromCSSString } from '../../models/hwb/parser';
import { rgb } from '../../models/rgb';
import { hsl } from '../../models/hsl';
import { hsv } from '../../models/hsv';

describe('HWB Color Model', () => {
  // Test hwb factory function
  describe('hwb', () => {
    it('should create an HWB color with the correct properties', () => {
      const color = hwb(120, 0.3, 0.4);
      expect(color.space).toBe('hwb');
      expect(color.h).toBe(120);
      expect(color.w).toBe(0.3);
      expect(color.b).toBe(0.4);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an HWB color with alpha', () => {
      const color = hwb(120, 0.3, 0.4, 0.8);
      expect(color.space).toBe('hwb');
      expect(color.h).toBe(120);
      expect(color.w).toBe(0.3);
      expect(color.b).toBe(0.4);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = hwb(120, 0.3, 0.4, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('hwb');
    });

    it('should have a toCSSString method', () => {
      const color = hwb(120, 0.3, 0.4, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('hwb');
    });

    it('should have a to method for color space conversion', () => {
      const color = hwb(120, 0.3, 0.4);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test hwbFromVector function
  describe('hwbFromVector', () => {
    it('should create an HWB color from a vector', () => {
      const color = hwbFromVector([120, 0.3, 0.4]);
      expect(color.space).toBe('hwb');
      expect(color.h).toBe(120);
      expect(color.w).toBe(0.3);
      expect(color.b).toBe(0.4);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an HWB color from a vector with alpha', () => {
      const color = hwbFromVector([120, 0.3, 0.4], 0.8);
      expect(color.space).toBe('hwb');
      expect(color.h).toBe(120);
      expect(color.w).toBe(0.3);
      expect(color.b).toBe(0.4);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => hwbFromVector([120, 0.3])).toThrow('Invalid vector length');
      expect(() => hwbFromVector([120, 0.3, 0.4, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test hwbToCSSString function
  describe('hwbToCSSString', () => {
    it('should convert an HWB color to a CSS string', () => {
      const color = hwb(120, 0.3, 0.4);
      expect(hwbToCSSString(color)).toBe('hwb(120.00 30.00% 40.00%)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = hwb(120, 0.3, 0.4, 0.8);
      expect(hwbToCSSString(color)).toBe('hwb(120.00 30.00% 40.00% / 0.800)');
    });
  });

  // Test hwbFromCSSString function
  describe('hwbFromCSSString', () => {
    it('should parse a CSS HWB color string with space syntax', () => {
      const color = hwbFromCSSString('hwb(120 30% 40%)');
      expect(color.space).toBe('hwb');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.w).toBeCloseTo(0.3, 5);
      expect(color.b).toBeCloseTo(0.4, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS HWB color string with comma syntax', () => {
      const color = hwbFromCSSString('hwb(120, 30%, 40%)');
      expect(color.space).toBe('hwb');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.w).toBeCloseTo(0.3, 5);
      expect(color.b).toBeCloseTo(0.4, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS HWB color string with alpha using space syntax', () => {
      const color = hwbFromCSSString('hwb(120 30% 40% / 0.8)');
      expect(color.space).toBe('hwb');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.w).toBeCloseTo(0.3, 5);
      expect(color.b).toBeCloseTo(0.4, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS HWB color string with alpha using comma syntax', () => {
      const color = hwbFromCSSString('hwb(120, 30%, 40%, 0.8)');
      expect(color.space).toBe('hwb');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.w).toBeCloseTo(0.3, 5);
      expect(color.b).toBeCloseTo(0.4, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS HWB color string with percentage alpha', () => {
      const color = hwbFromCSSString('hwb(120 30% 40% / 80%)');
      expect(color.space).toBe('hwb');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.w).toBeCloseTo(0.3, 5);
      expect(color.b).toBeCloseTo(0.4, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should normalize hue values outside the 0-360 range', () => {
      const color1 = hwbFromCSSString('hwb(480 30% 40%)');
      expect(color1.h).toBeCloseTo(120, 5); // 480 - 360 = 120

      const color2 = hwbFromCSSString('hwb(-240 30% 40%)');
      expect(color2.h).toBeCloseTo(120, 5); // -240 + 360 = 120
    });

    it('should handle explicit positive signs in component values', () => {
      const color = hwbFromCSSString('hwb(+120 30% 40%)');
      expect(color.space).toBe('hwb');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.w).toBeCloseTo(0.3, 5);
      expect(color.b).toBeCloseTo(0.4, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should throw an error for invalid HWB color format', () => {
      expect(() => hwbFromCSSString('rgb(0, 0, 0)')).toThrow();
      expect(() => hwbFromCSSString('hwb()')).toThrow();
      expect(() => hwbFromCSSString('hwb(120)')).toThrow();
      expect(() => hwbFromCSSString('hwb(120, 30)')).toThrow();
      expect(() => hwbFromCSSString('hwb(120, 30%, 40%, 1.5)')).toThrow();
      expect(() => hwbFromCSSString('hwb(120, 30%, 400%)')).toThrow();
      expect(() => hwbFromCSSString('hwb(120%, 30%, 40%)')).toThrow();
    });

    it('should throw an error for a number with multiple decimal points', () => {
      expect(() => hwbFromCSSString('hwb(120..5 30% 40%)')).toThrow('multiple "."');
    });

    it('should throw an error for missing comma in comma syntax', () => {
      expect(() => hwbFromCSSString('hwb(120, 30% 40%)')).toThrow("expected ','");
    });

    it('should throw an error for missing closing parenthesis', () => {
      expect(() => hwbFromCSSString('hwb(120 30% 40%')).toThrow('missing ")"');
    });

    it('should throw an error for extra text after closing parenthesis', () => {
      expect(() => hwbFromCSSString('hwb(120 30% 40%)extra')).toThrow('unexpected text after ")"');
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = hwb(120, 0.3, 0.4);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('rgb');
        expect(rgb.space).toBe('rgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('hwbToRGB', () => {
      it('should convert HWB to RGB', () => {
        const rgb = hwbToRGB(testColor);
        expect(rgb.space).toBe('rgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should handle the case where whiteness + blackness >= 1', () => {
        const grayColor = hwb(120, 0.6, 0.6);
        const rgb = hwbToRGB(grayColor);
        expect(rgb.space).toBe('rgb');
        // Should be a shade of gray (r = g = b)
        expect(rgb.r).toBeCloseTo(rgb.g, 5);
        expect(rgb.g).toBeCloseTo(rgb.b, 5);
        // Gray value should be w / (w + b)
        expect(rgb.r).toBeCloseTo(0.6 / (0.6 + 0.6), 5);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const rgb = hwbToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });
    });

    describe('hwbToHSL', () => {
      it('should convert HWB to HSL', () => {
        const hslColor = hwbToHSL(testColor);
        expect(hslColor.space).toBe('hsl');
        expect(hslColor.h).toBeGreaterThanOrEqual(0);
        expect(hslColor.h).toBeLessThanOrEqual(360);
        expect(hslColor.s).toBeGreaterThanOrEqual(0);
        expect(hslColor.s).toBeLessThanOrEqual(1);
        expect(hslColor.l).toBeGreaterThanOrEqual(0);
        expect(hslColor.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const hslColor = hwbToHSL(colorWithAlpha);
        expect(hslColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToHSV', () => {
      it('should convert HWB to HSV', () => {
        const hsvColor = hwbToHSV(testColor);
        expect(hsvColor.space).toBe('hsv');
        expect(hsvColor.h).toBeGreaterThanOrEqual(0);
        expect(hsvColor.h).toBeLessThanOrEqual(360);
        expect(hsvColor.s).toBeGreaterThanOrEqual(0);
        expect(hsvColor.s).toBeLessThanOrEqual(1);
        expect(hsvColor.v).toBeGreaterThanOrEqual(0);
        expect(hsvColor.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const hsvColor = hwbToHSV(colorWithAlpha);
        expect(hsvColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToXYZ', () => {
      it('should convert HWB to XYZ', () => {
        const xyzColor = hwbToXYZ(testColor);
        expect(xyzColor.space).toBe('xyz');
        expect(typeof xyzColor.x).toBe('number');
        expect(typeof xyzColor.y).toBe('number');
        expect(typeof xyzColor.z).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const xyzColor = hwbToXYZ(colorWithAlpha);
        expect(xyzColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToLab', () => {
      it('should convert HWB to Lab', () => {
        const labColor = hwbToLab(testColor);
        expect(labColor.space).toBe('lab');
        expect(typeof labColor.l).toBe('number');
        expect(typeof labColor.a).toBe('number');
        expect(typeof labColor.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const labColor = hwbToLab(colorWithAlpha);
        expect(labColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToLCH', () => {
      it('should convert HWB to LCH', () => {
        const lchColor = hwbToLCH(testColor);
        expect(lchColor.space).toBe('lch');
        expect(lchColor.l).toBeGreaterThan(0);
        expect(lchColor.c).toBeGreaterThanOrEqual(0);
        expect(lchColor.h).toBeGreaterThanOrEqual(0);
        expect(lchColor.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const lchColor = hwbToLCH(colorWithAlpha);
        expect(lchColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToOKLab', () => {
      it('should convert HWB to OKLab', () => {
        const oklabColor = hwbToOKLab(testColor);
        expect(oklabColor.space).toBe('oklab');
        expect(oklabColor.l).toBeGreaterThan(0);
        expect(typeof oklabColor.a).toBe('number');
        expect(typeof oklabColor.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const oklabColor = hwbToOKLab(colorWithAlpha);
        expect(oklabColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToOKLCh', () => {
      it('should convert HWB to OKLCh', () => {
        const oklchColor = hwbToOKLCh(testColor);
        expect(oklchColor.space).toBe('oklch');
        expect(oklchColor.l).toBeGreaterThan(0);
        expect(oklchColor.c).toBeGreaterThanOrEqual(0);
        expect(oklchColor.h).toBeGreaterThanOrEqual(0);
        expect(oklchColor.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const oklchColor = hwbToOKLCh(colorWithAlpha);
        expect(oklchColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToJzAzBz', () => {
      it('should convert HWB to JzAzBz with default peak luminance', () => {
        const jzazbzColor = hwbToJzAzBz(testColor);
        expect(jzazbzColor.space).toBe('jzazbz');
        expect(jzazbzColor.jz).toBeGreaterThan(0);
        expect(typeof jzazbzColor.az).toBe('number');
        expect(typeof jzazbzColor.bz).toBe('number');
      });

      it('should convert HWB to JzAzBz with custom peak luminance', () => {
        const jzazbzColor = hwbToJzAzBz(testColor, 1000);
        expect(jzazbzColor.space).toBe('jzazbz');
        expect(jzazbzColor.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const jzazbzColor = hwbToJzAzBz(colorWithAlpha);
        expect(jzazbzColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToJzCzHz', () => {
      it('should convert HWB to JzCzHz with default peak luminance', () => {
        const jzczhzColor = hwbToJzCzHz(testColor);
        expect(jzczhzColor.space).toBe('jzczhz');
        expect(jzczhzColor.jz).toBeGreaterThan(0);
        expect(jzczhzColor.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhzColor.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhzColor.hz).toBeLessThanOrEqual(360);
      });

      it('should convert HWB to JzCzHz with custom peak luminance', () => {
        const jzczhzColor = hwbToJzCzHz(testColor, 1000);
        expect(jzczhzColor.space).toBe('jzczhz');
        expect(jzczhzColor.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const jzczhzColor = hwbToJzCzHz(colorWithAlpha);
        expect(jzczhzColor.alpha).toBe(0.8);
      });
    });

    describe('hwbToP3', () => {
      it('should convert HWB to P3', () => {
        const p3Color = hwbToP3(testColor);
        expect(p3Color.space).toBe('p3');
        expect(p3Color.r).toBeGreaterThanOrEqual(0);
        expect(p3Color.r).toBeLessThanOrEqual(1);
        expect(p3Color.g).toBeGreaterThanOrEqual(0);
        expect(p3Color.g).toBeLessThanOrEqual(1);
        expect(p3Color.b).toBeGreaterThanOrEqual(0);
        expect(p3Color.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hwb(120, 0.3, 0.4, 0.8);
        const p3Color = hwbToP3(colorWithAlpha);
        expect(p3Color.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve HWB values when converting to RGB and back', () => {
      const original = hwb(120, 0.3, 0.4);
      const rgb = hwbToRGB(original);
      const roundTrip = rgb.to('hwb');

      expect(roundTrip.h).toBeCloseTo(original.h, 0);
      expect(roundTrip.w).toBeCloseTo(original.w, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });

    it('should approximately preserve HWB values when converting to HSL and back', () => {
      const original = hwb(120, 0.3, 0.4);
      const hslColor = hwbToHSL(original);
      const roundTrip = hslColor.to('hwb');

      expect(roundTrip.h).toBeCloseTo(original.h, 0);
      expect(roundTrip.w).toBeCloseTo(original.w, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });

    it('should approximately preserve HWB values when converting to HSV and back', () => {
      const original = hwb(120, 0.3, 0.4);
      const hsvColor = hwbToHSV(original);
      const roundTrip = hsvColor.to('hwb');

      expect(roundTrip.h).toBeCloseTo(original.h, 0);
      expect(roundTrip.w).toBeCloseTo(original.w, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert white correctly', () => {
      const white = hwb(0, 1, 0); // White in HWB
      const rgb = hwbToRGB(white);

      expect(rgb.r).toBeCloseTo(1, 5);
      expect(rgb.g).toBeCloseTo(1, 5);
      expect(rgb.b).toBeCloseTo(1, 5);
    });

    it('should convert black correctly', () => {
      const black = hwb(0, 0, 1); // Black in HWB
      const rgb = hwbToRGB(black);

      expect(rgb.r).toBeCloseTo(0, 5);
      expect(rgb.g).toBeCloseTo(0, 5);
      expect(rgb.b).toBeCloseTo(0, 5);
    });

    it('should convert primary colors correctly', () => {
      // Red in HWB
      const red = hwb(0, 0, 0);
      const rgbRed = hwbToRGB(red);
      expect(rgbRed.r).toBeCloseTo(1, 5);
      expect(rgbRed.g).toBeCloseTo(0, 5);
      expect(rgbRed.b).toBeCloseTo(0, 5);

      // Green in HWB
      const green = hwb(120, 0, 0);
      const rgbGreen = hwbToRGB(green);
      expect(rgbGreen.r).toBeCloseTo(0, 5);
      expect(rgbGreen.g).toBeCloseTo(1, 5);
      expect(rgbGreen.b).toBeCloseTo(0, 5);

      // Blue in HWB
      const blue = hwb(240, 0, 0);
      const rgbBlue = hwbToRGB(blue);
      expect(rgbBlue.r).toBeCloseTo(0, 5);
      expect(rgbBlue.g).toBeCloseTo(0, 5);
      expect(rgbBlue.b).toBeCloseTo(1, 5);
    });

    it('should convert RGB to HWB correctly', () => {
      // Red in RGB
      const rgbRed = rgb(1, 0, 0);
      const hwbRed = rgbRed.to('hwb');
      expect(hwbRed.h).toBeCloseTo(0, 0);
      expect(hwbRed.w).toBeCloseTo(0, 5);
      expect(hwbRed.b).toBeCloseTo(0, 5);

      // Green in RGB
      const rgbGreen = rgb(0, 1, 0);
      const hwbGreen = rgbGreen.to('hwb');
      expect(hwbGreen.h).toBeCloseTo(120, 0);
      expect(hwbGreen.w).toBeCloseTo(0, 5);
      expect(hwbGreen.b).toBeCloseTo(0, 5);

      // Blue in RGB
      const rgbBlue = rgb(0, 0, 1);
      const hwbBlue = rgbBlue.to('hwb');
      expect(hwbBlue.h).toBeCloseTo(240, 0);
      expect(hwbBlue.w).toBeCloseTo(0, 5);
      expect(hwbBlue.b).toBeCloseTo(0, 5);
    });

    it('should convert HSL to HWB correctly', () => {
      // Red in HSL
      const hslRed = hsl(0, 1, 0.5);
      const hwbRed = hslRed.to('hwb');
      expect(hwbRed.h).toBeCloseTo(0, 0);
      expect(hwbRed.w).toBeCloseTo(0, 5);
      expect(hwbRed.b).toBeCloseTo(0, 5);

      // Green in HSL
      const hslGreen = hsl(120, 1, 0.5);
      const hwbGreen = hslGreen.to('hwb');
      expect(hwbGreen.h).toBeCloseTo(120, 0);
      expect(hwbGreen.w).toBeCloseTo(0, 5);
      expect(hwbGreen.b).toBeCloseTo(0, 5);

      // Blue in HSL
      const hslBlue = hsl(240, 1, 0.5);
      const hwbBlue = hslBlue.to('hwb');
      expect(hwbBlue.h).toBeCloseTo(240, 0);
      expect(hwbBlue.w).toBeCloseTo(0, 5);
      expect(hwbBlue.b).toBeCloseTo(0, 5);
    });

    it('should convert HSV to HWB correctly', () => {
      // Red in HSV
      const hsvRed = hsv(0, 1, 1);
      const hwbRed = hsvRed.to('hwb');
      expect(hwbRed.h).toBeCloseTo(0, 0);
      expect(hwbRed.w).toBeCloseTo(0, 5);
      expect(hwbRed.b).toBeCloseTo(0, 5);

      // Green in HSV
      const hsvGreen = hsv(120, 1, 1);
      const hwbGreen = hsvGreen.to('hwb');
      expect(hwbGreen.h).toBeCloseTo(120, 0);
      expect(hwbGreen.w).toBeCloseTo(0, 5);
      expect(hwbGreen.b).toBeCloseTo(0, 5);

      // Blue in HSV
      const hsvBlue = hsv(240, 1, 1);
      const hwbBlue = hsvBlue.to('hwb');
      expect(hwbBlue.h).toBeCloseTo(240, 0);
      expect(hwbBlue.w).toBeCloseTo(0, 5);
      expect(hwbBlue.b).toBeCloseTo(0, 5);
    });
  });
});
