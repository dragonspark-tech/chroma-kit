import '../../conversion/register-conversions';

import { describe, expect, it } from 'vitest';
import {
  hsl,
  HSLColor,
  hslToCSSString,
  hslFromVector,
  hslToRGB,
  hslToHSV,
  hslToHWB,
  hslToXYZ,
  hslToLab,
  hslToLCh,
  hslToOKLab,
  hslToOKLCh,
  hslToJzAzBz,
  hslToJzCzHz
} from '../../models/hsl';
import { hslFromCSSString } from '../../models/hsl/parser';
import { srgb } from '../../models/srgb';

describe('HSL Color Model', () => {
  // Test hsl factory function
  describe('hsl', () => {
    it('should create an HSL color with the correct properties', () => {
      const color = hsl(120, 0.5, 0.6);
      expect(color.space).toBe('hsl');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.l).toBe(0.6);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an HSL color with alpha', () => {
      const color = hsl(120, 0.5, 0.6, 0.8);
      expect(color.space).toBe('hsl');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.l).toBe(0.6);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = hsl(120, 0.5, 0.6, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('hsl');
    });

    it('should have a toCSSString method', () => {
      const color = hsl(120, 0.5, 0.6, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('hsl');
    });

    it('should have a to method for color space conversion', () => {
      const color = hsl(120, 0.5, 0.6);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test hslFromVector function
  describe('hslFromVector', () => {
    it('should create an HSL color from a vector', () => {
      const color = hslFromVector([120, 0.5, 0.6]);
      expect(color.space).toBe('hsl');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.l).toBe(0.6);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an HSL color from a vector with alpha', () => {
      const color = hslFromVector([120, 0.5, 0.6], 0.8);
      expect(color.space).toBe('hsl');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.l).toBe(0.6);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => hslFromVector([120, 0.5])).toThrow('Invalid vector length');
      expect(() => hslFromVector([120, 0.5, 0.6, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test hslToCSSString function
  describe('hslToCSSString', () => {
    it('should convert an HSL color to a CSS string', () => {
      const color = hsl(120, 0.5, 0.6);
      expect(hslToCSSString(color)).toBe('hsl(120.00, 50.00%, 60.00%)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = hsl(120, 0.5, 0.6, 0.8);
      expect(hslToCSSString(color)).toBe('hsl(120.00, 50.00%, 60.00% / 0.800)');
    });
  });

  // Test hslFromCSSString function
  describe('hslFromCSSString', () => {
    it('should parse a CSS HSL color string in hsl() format', () => {
      const color = hslFromCSSString('hsl(120, 50%, 60%)');
      expect(color.space).toBe('hsl');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.l).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS HSL color string in hsla() format', () => {
      const color = hslFromCSSString('hsla(120, 50%, 60%, 0.8)');
      expect(color.space).toBe('hsl');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.l).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBeCloseTo(0.8, 5);
    });

    it('should parse a CSS HSL color string with space syntax', () => {
      const color = hslFromCSSString('hsl(120 50% 60%)');
      expect(color.space).toBe('hsl');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.l).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS HSL color string with space syntax and alpha', () => {
      const color = hslFromCSSString('hsl(120 50% 60% / 0.8)');
      expect(color.space).toBe('hsl');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.l).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBeCloseTo(0.8, 5);
    });

    it('should handle negative hue values', () => {
      const color = hslFromCSSString('hsl(-120, 50%, 60%)');
      expect(color.h).toBeCloseTo(240, 5); // -120 + 360 = 240
    });

    it('should handle positive sign prefix for hue values', () => {
      const color = hslFromCSSString('hsl(+120, 50%, 60%)');
      expect(color.h).toBeCloseTo(120, 5);
    });

    it('should handle hue values greater than 360', () => {
      const color = hslFromCSSString('hsl(480, 50%, 60%)');
      expect(color.h).toBeCloseTo(120, 5); // 480 - 360 = 120
    });

    it('should throw an error for invalid HSL color format', () => {
      expect(() => hslFromCSSString('rgb(0, 0, 0)')).toThrow();
      expect(() => hslFromCSSString('hsl()')).toThrow();
      expect(() => hslFromCSSString('hsl(120, 50%, 60%, 0.8, 1)')).toThrow();
    });

    it('should throw an error when saturation is not a percentage', () => {
      expect(() => hslFromCSSString('hsl(120, 0.5, 60%)')).toThrow('saturation and lightness must be percentages');
    });

    it('should throw an error when lightness is not a percentage', () => {
      expect(() => hslFromCSSString('hsl(120, 50%, 0.6)')).toThrow('saturation and lightness must be percentages');
    });

    it('should throw an error when hue is a percentage', () => {
      expect(() => hslFromCSSString('hsl(120%, 50%, 60%)')).toThrow('hue cannot be a percentage');
    });

    it('should throw an error when alpha is out of range', () => {
      expect(() => hslFromCSSString('hsl(120, 50%, 60%, 1.5)')).toThrow('alpha 0–1');
      expect(() => hslFromCSSString('hsl(120, 50%, 60%, -0.5)')).toThrow('alpha 0–1');
    });

    it('should throw an error when saturation is out of range', () => {
      expect(() => hslFromCSSString('hsl(120, 150%, 60%)')).toThrow('saturation/lightness 0–100%');
      expect(() => hslFromCSSString('hsl(120, -50%, 60%)')).toThrow('saturation/lightness 0–100%');
    });

    it('should throw an error when lightness is out of range', () => {
      expect(() => hslFromCSSString('hsl(120, 50%, 160%)')).toThrow('saturation/lightness 0–100%');
      expect(() => hslFromCSSString('hsl(120, 50%, -60%)')).toThrow('saturation/lightness 0–100%');
    });

    it('should throw an error for multiple decimal points', () => {
      expect(() => hslFromCSSString('hsl(120.5.5, 50%, 60%)')).toThrow('multiple "."');
    });

    it('should handle alpha as a percentage', () => {
      const color = hslFromCSSString('hsl(120, 50%, 60%, 50%)');
      expect(color.alpha).toBeCloseTo(0.5, 5);
    });

    it('should throw an error for missing comma in comma syntax', () => {
      expect(() => hslFromCSSString('hsl(120, 50% 60%)')).toThrow("expected ','");
    });

    it('should throw an error for extra text after closing parenthesis', () => {
      expect(() => hslFromCSSString('hsl(120, 50%, 60%)extra')).toThrow('unexpected text after ")"');
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = hsl(120, 0.5, 0.6);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('srgb');
        expect(rgb.space).toBe('srgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('hslToRGB', () => {
      it('should convert HSL to RGB', () => {
        const rgb = hslToRGB(testColor);
        expect(rgb.space).toBe('srgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const rgb = hslToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });

      it('should convert black correctly', () => {
        const black = hsl(0, 0, 0);
        const rgb = hslToRGB(black);
        expect(rgb.r).toBeCloseTo(0, 5);
        expect(rgb.g).toBeCloseTo(0, 5);
        expect(rgb.b).toBeCloseTo(0, 5);
      });

      it('should convert white correctly', () => {
        const white = hsl(0, 0, 1);
        const rgb = hslToRGB(white);
        expect(rgb.r).toBeCloseTo(1, 5);
        expect(rgb.g).toBeCloseTo(1, 5);
        expect(rgb.b).toBeCloseTo(1, 5);
      });

      it('should convert primary colors correctly', () => {
        // Red
        const red = hsl(0, 1, 0.5);
        const rgbRed = hslToRGB(red);
        expect(rgbRed.r).toBeCloseTo(1, 5);
        expect(rgbRed.g).toBeCloseTo(0, 5);
        expect(rgbRed.b).toBeCloseTo(0, 5);

        // Green
        const green = hsl(120, 1, 0.5);
        const rgbGreen = hslToRGB(green);
        expect(rgbGreen.r).toBeCloseTo(0, 5);
        expect(rgbGreen.g).toBeCloseTo(1, 5);
        expect(rgbGreen.b).toBeCloseTo(0, 5);

        // Blue
        const blue = hsl(240, 1, 0.5);
        const rgbBlue = hslToRGB(blue);
        expect(rgbBlue.r).toBeCloseTo(0, 5);
        expect(rgbBlue.g).toBeCloseTo(0, 5);
        expect(rgbBlue.b).toBeCloseTo(1, 5);
      });
    });

    describe('hslToHSV', () => {
      it('should convert HSL to HSV', () => {
        const hsv = hslToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const hsv = hslToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });

      it('should handle edge cases correctly', () => {
        // Black
        const black = hsl(0, 0, 0);
        const hsvBlack = hslToHSV(black);
        expect(hsvBlack.v).toBeCloseTo(0, 5);
        expect(hsvBlack.s).toBeCloseTo(0, 5);

        // White
        const white = hsl(0, 0, 1);
        const hsvWhite = hslToHSV(white);
        expect(hsvWhite.v).toBeCloseTo(1, 5);
        expect(hsvWhite.s).toBeCloseTo(0, 5);
      });
    });

    describe('hslToHWB', () => {
      it('should convert HSL to HWB', () => {
        const hwb = hslToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const hwb = hslToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('hslToXYZ', () => {
      it('should convert HSL to XYZ', () => {
        const xyz = hslToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(typeof xyz.x).toBe('number');
        expect(typeof xyz.y).toBe('number');
        expect(typeof xyz.z).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const xyz = hslToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.8);
      });
    });

    describe('hslToLab', () => {
      it('should convert HSL to Lab', () => {
        const lab = hslToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const lab = hslToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.8);
      });
    });

    describe('hslToLCh', () => {
      it('should convert HSL to LCh', () => {
        const lch = hslToLCh(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const lch = hslToLCh(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });
    });

    describe('hslToOKLab', () => {
      it('should convert HSL to OKLab', () => {
        const oklab = hslToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should convert HSL to OKLab with chromatic adaptation', () => {
        const oklab = hslToOKLab(testColor, true);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const oklab = hslToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });
    });

    describe('hslToOKLCh', () => {
      it('should convert HSL to OKLCh', () => {
        const oklch = hslToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
        expect(oklch.c).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeLessThanOrEqual(360);
      });

      it('should convert HSL to OKLCh with chromatic adaptation', () => {
        const oklch = hslToOKLCh(testColor, true);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const oklch = hslToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });
    });

    describe('hslToJzAzBz', () => {
      it('should convert HSL to JzAzBz with default peak luminance', () => {
        const jzazbz = hslToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert HSL to JzAzBz with custom peak luminance', () => {
        const jzazbz = hslToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const jzazbz = hslToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('hslToJzCzHz', () => {
      it('should convert HSL to JzCzHz with default peak luminance', () => {
        const jzczhz = hslToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeLessThanOrEqual(360);
      });

      it('should convert HSL to JzCzHz with custom peak luminance', () => {
        const jzczhz = hslToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsl(120, 0.5, 0.6, 0.8);
        const jzczhz = hslToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve HSL values when converting to RGB and back', () => {
      const original = hsl(120, 0.5, 0.6);
      const rgb = hslToRGB(original);
      const roundTrip = rgb.to('hsl') as HSLColor;

      expect(roundTrip.h).toBeCloseTo(original.h, 0);
      expect(roundTrip.s).toBeCloseTo(original.s, 1);
      expect(roundTrip.l).toBeCloseTo(original.l, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert primary colors correctly', () => {
      // Red in HSL
      const red = hsl(0, 1, 0.5);
      const rgbRed = hslToRGB(red);
      expect(rgbRed.r).toBeCloseTo(1, 5);
      expect(rgbRed.g).toBeCloseTo(0, 5);
      expect(rgbRed.b).toBeCloseTo(0, 5);

      // Green in HSL
      const green = hsl(120, 1, 0.5);
      const rgbGreen = hslToRGB(green);
      expect(rgbGreen.r).toBeCloseTo(0, 5);
      expect(rgbGreen.g).toBeCloseTo(1, 5);
      expect(rgbGreen.b).toBeCloseTo(0, 5);

      // Blue in HSL
      const blue = hsl(240, 1, 0.5);
      const rgbBlue = hslToRGB(blue);
      expect(rgbBlue.r).toBeCloseTo(0, 5);
      expect(rgbBlue.g).toBeCloseTo(0, 5);
      expect(rgbBlue.b).toBeCloseTo(1, 5);
    });

    it('should convert RGB primaries to HSL correctly', () => {
      // Red in RGB
      const rgbRed = srgb(1, 0, 0);
      const hslRed = rgbRed.to('hsl') as HSLColor;
      expect(hslRed.h).toBeCloseTo(0, 0);
      expect(hslRed.s).toBeCloseTo(1, 5);
      expect(hslRed.l).toBeCloseTo(0.5, 5);

      // Green in RGB
      const rgbGreen = srgb(0, 1, 0);
      const hslGreen = rgbGreen.to('hsl') as HSLColor;
      expect(hslGreen.h).toBeCloseTo(120, 0);
      expect(hslGreen.s).toBeCloseTo(1, 5);
      expect(hslGreen.l).toBeCloseTo(0.5, 5);

      // Blue in RGB
      const rgbBlue = srgb(0, 0, 1);
      const hslBlue = rgbBlue.to('hsl') as HSLColor;
      expect(hslBlue.h).toBeCloseTo(240, 0);
      expect(hslBlue.s).toBeCloseTo(1, 5);
      expect(hslBlue.l).toBeCloseTo(0.5, 5);
    });
  });
});
