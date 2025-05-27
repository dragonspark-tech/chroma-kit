import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  hsv,
  hsvFromVector,
  hsvToCSSString,
  hsvToHSL,
  hsvToHWB,
  hsvToJzAzBz,
  hsvToJzCzHz,
  hsvToLab,
  hsvToLCh,
  hsvToOKLab,
  hsvToOKLCh,
  hsvToRGB,
  hsvToXYZ
} from '../../models/hsv';
import { hsvFromCSSString } from '../../models/hsv/parser';

describe('HSV Color Model', () => {
  // Test hsv factory function
  describe('hsv', () => {
    it('should create an HSV color with the correct properties', () => {
      const color = hsv(120, 0.5, 0.6);
      expect(color.space).toBe('hsv');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.v).toBe(0.6);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an HSV color with alpha', () => {
      const color = hsv(120, 0.5, 0.6, 0.8);
      expect(color.space).toBe('hsv');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.v).toBe(0.6);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = hsv(120, 0.5, 0.6, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('hsv');
    });

    it('should have a toCSSString method', () => {
      const color = hsv(120, 0.5, 0.6, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('hsl');
    });

    it('should have a to method for color space conversion', () => {
      const color = hsv(120, 0.5, 0.6);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test hsvFromVector function
  describe('hsvFromVector', () => {
    it('should create an HSV color from a vector', () => {
      const color = hsvFromVector([120, 0.5, 0.6]);
      expect(color.space).toBe('hsv');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.v).toBe(0.6);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an HSV color from a vector with alpha', () => {
      const color = hsvFromVector([120, 0.5, 0.6], 0.8);
      expect(color.space).toBe('hsv');
      expect(color.h).toBe(120);
      expect(color.s).toBe(0.5);
      expect(color.v).toBe(0.6);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => hsvFromVector([120, 0.5])).toThrow('Invalid vector length');
      expect(() => hsvFromVector([120, 0.5, 0.6, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test hsvToCSSString function
  describe('hsvToCSSString', () => {
    it('should convert an HSV color to a CSS string', () => {
      const color = hsv(120, 0.5, 0.6);
      const cssString = hsvToCSSString(color);
      expect(cssString).toContain('hsl');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = hsv(120, 0.5, 0.6, 0.8);
      const cssString = hsvToCSSString(color);
      expect(cssString).toContain('0.8');
    });
  });

  // Test hsvFromCSSString function
  describe('hsvFromCSSString', () => {
    it('should parse a CSS HSV color string with comma syntax', () => {
      const color = hsvFromCSSString('hsv(120, 50%, 60%)');
      expect(color.space).toBe('hsv');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.v).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS HSV color string with space syntax', () => {
      const color = hsvFromCSSString('hsv(120 50% 60%)');
      expect(color.space).toBe('hsv');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.v).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS HSV color string with alpha using comma syntax', () => {
      const color = hsvFromCSSString('hsv(120, 50%, 60%, 0.8)');
      expect(color.space).toBe('hsv');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.v).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS HSV color string with alpha using slash syntax', () => {
      const color = hsvFromCSSString('hsv(120 50% 60% / 0.8)');
      expect(color.space).toBe('hsv');
      expect(color.h).toBeCloseTo(120, 5);
      expect(color.s).toBeCloseTo(0.5, 5);
      expect(color.v).toBeCloseTo(0.6, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid HSV color format', () => {
      expect(() => hsvFromCSSString('rgb(0, 0, 0)')).toThrow();
      expect(() => hsvFromCSSString('hsv()')).toThrow();
      expect(() => hsvFromCSSString('hsv(120, 50%, 60%, 0.8, extra)')).toThrow();
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = hsv(120, 0.5, 0.6);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('rgb');
        expect(rgb.space).toBe('rgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('hsvToRGB', () => {
      it('should convert HSV to RGB', () => {
        const rgb = hsvToRGB(testColor);
        expect(rgb.space).toBe('rgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const rgb = hsvToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });

      it('should handle edge cases correctly', () => {
        // Test black (v = 0)
        const black = hsv(0, 0, 0);
        const blackRgb = hsvToRGB(black);
        expect(blackRgb.r).toBeCloseTo(0, 5);
        expect(blackRgb.g).toBeCloseTo(0, 5);
        expect(blackRgb.b).toBeCloseTo(0, 5);

        // Test white (s = 0, v = 1)
        const white = hsv(0, 0, 1);
        const whiteRgb = hsvToRGB(white);
        expect(whiteRgb.r).toBeCloseTo(1, 5);
        expect(whiteRgb.g).toBeCloseTo(1, 5);
        expect(whiteRgb.b).toBeCloseTo(1, 5);

        // Test primary colors
        const red = hsv(0, 1, 1);
        const redRgb = hsvToRGB(red);
        expect(redRgb.r).toBeCloseTo(1, 5);
        expect(redRgb.g).toBeCloseTo(0, 5);
        expect(redRgb.b).toBeCloseTo(0, 5);

        const green = hsv(120, 1, 1);
        const greenRgb = hsvToRGB(green);
        expect(greenRgb.r).toBeCloseTo(0, 5);
        expect(greenRgb.g).toBeCloseTo(1, 5);
        expect(greenRgb.b).toBeCloseTo(0, 5);

        const blue = hsv(240, 1, 1);
        const blueRgb = hsvToRGB(blue);
        expect(blueRgb.r).toBeCloseTo(0, 5);
        expect(blueRgb.g).toBeCloseTo(0, 5);
        expect(blueRgb.b).toBeCloseTo(1, 5);

        // Test colors in the 60-120 hue range (yellow/green)
        const yellow = hsv(60, 1, 1);
        const yellowRgb = hsvToRGB(yellow);
        expect(yellowRgb.r).toBeCloseTo(1, 5);
        expect(yellowRgb.g).toBeCloseTo(1, 5);
        expect(yellowRgb.b).toBeCloseTo(0, 5);

        // Test colors in the 120-180 hue range (green/cyan)
        const cyan = hsv(180, 1, 1);
        const cyanRgb = hsvToRGB(cyan);
        expect(cyanRgb.r).toBeCloseTo(0, 5);
        expect(cyanRgb.g).toBeCloseTo(1, 5);
        expect(cyanRgb.b).toBeCloseTo(1, 5);

        // Test colors in the 180-240 hue range (cyan/blue)
        const azure = hsv(210, 1, 1);
        const azureRgb = hsvToRGB(azure);
        expect(azureRgb.r).toBeCloseTo(0, 5);
        expect(azureRgb.g).toBeCloseTo(0.5, 5);
        expect(azureRgb.b).toBeCloseTo(1, 5);

        // Test colors in the 240-300 hue range (magenta/purple)
        const magenta = hsv(270, 1, 1);
        const magentaRgb = hsvToRGB(magenta);
        expect(magentaRgb.r).toBeCloseTo(0.5, 5);
        expect(magentaRgb.g).toBeCloseTo(0, 5);
        expect(magentaRgb.b).toBeCloseTo(1, 5);

        // Test colors in the 300-360 hue range (pink/red)
        const pink = hsv(330, 1, 1);
        const pinkRgb = hsvToRGB(pink);
        expect(pinkRgb.r).toBeCloseTo(1, 5);
        expect(pinkRgb.g).toBeCloseTo(0, 5);
        expect(pinkRgb.b).toBeCloseTo(0.5, 5);
      });
    });

    describe('hsvToHSL', () => {
      it('should convert HSV to HSL', () => {
        const hsl = hsvToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const hsl = hsvToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });

      it('should handle edge cases correctly', () => {
        // Test black (v = 0)
        const black = hsv(0, 0, 0);
        const blackHsl = hsvToHSL(black);
        expect(blackHsl.l).toBeCloseTo(0, 5);

        // Test white (s = 0, v = 1)
        const white = hsv(0, 0, 1);
        const whiteHsl = hsvToHSL(white);
        expect(whiteHsl.l).toBeCloseTo(1, 5);
        expect(whiteHsl.s).toBeCloseTo(0, 5);

        // Test gray (s = 0, v = 0.5)
        const gray = hsv(0, 0, 0.5);
        const grayHsl = hsvToHSL(gray);
        expect(grayHsl.l).toBeCloseTo(0.5, 5);
        expect(grayHsl.s).toBeCloseTo(0, 5);

        // Test fully saturated color
        const saturated = hsv(120, 1, 1);
        const saturatedHsl = hsvToHSL(saturated);
        expect(saturatedHsl.h).toBeCloseTo(120, 5);
        expect(saturatedHsl.s).toBeCloseTo(1, 5);
        expect(saturatedHsl.l).toBeCloseTo(0.5, 5);
      });
    });

    describe('hsvToHWB', () => {
      it('should convert HSV to HWB', () => {
        const hwb = hsvToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const hwb = hsvToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });

      it('should handle edge cases correctly', () => {
        // Test black (v = 0)
        const black = hsv(0, 0, 0);
        const blackHwb = hsvToHWB(black);
        expect(blackHwb.w).toBeCloseTo(0, 5);
        expect(blackHwb.b).toBeCloseTo(1, 5);

        // Test white (s = 0, v = 1)
        const white = hsv(0, 0, 1);
        const whiteHwb = hsvToHWB(white);
        expect(whiteHwb.w).toBeCloseTo(1, 5);
        expect(whiteHwb.b).toBeCloseTo(0, 5);

        // Test fully saturated color
        const saturated = hsv(120, 1, 1);
        const saturatedHwb = hsvToHWB(saturated);
        expect(saturatedHwb.h).toBeCloseTo(120, 5);
        expect(saturatedHwb.w).toBeCloseTo(0, 5);
        expect(saturatedHwb.b).toBeCloseTo(0, 5);
      });
    });

    describe('hsvToXYZ', () => {
      it('should convert HSV to XYZ', () => {
        const xyz = hsvToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(typeof xyz.x).toBe('number');
        expect(typeof xyz.y).toBe('number');
        expect(typeof xyz.z).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const xyz = hsvToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.8);
      });
    });

    describe('hsvToLab', () => {
      it('should convert HSV to Lab', () => {
        const lab = hsvToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const lab = hsvToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.8);
      });
    });

    describe('hsvToLCh', () => {
      it('should convert HSV to LCh', () => {
        const lch = hsvToLCh(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const lch = hsvToLCh(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });
    });

    describe('hsvToOKLab', () => {
      it('should convert HSV to OKLab with default chromatic adaptation', () => {
        const oklab = hsvToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should convert HSV to OKLab with chromatic adaptation', () => {
        const oklab = hsvToOKLab(testColor, true);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const oklab = hsvToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });
    });

    describe('hsvToOKLCh', () => {
      it('should convert HSV to OKLCh with default chromatic adaptation', () => {
        const oklch = hsvToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
        expect(oklch.c).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeLessThanOrEqual(360);
      });

      it('should convert HSV to OKLCh with chromatic adaptation', () => {
        const oklch = hsvToOKLCh(testColor, true);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const oklch = hsvToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });
    });

    describe('hsvToJzAzBz', () => {
      it('should convert HSV to JzAzBz with default peak luminance', () => {
        const jzazbz = hsvToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert HSV to JzAzBz with custom peak luminance', () => {
        const jzazbz = hsvToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const jzazbz = hsvToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('hsvToJzCzHz', () => {
      it('should convert HSV to JzCzHz with default peak luminance', () => {
        const jzczhz = hsvToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeLessThanOrEqual(360);
      });

      it('should convert HSV to JzCzHz with custom peak luminance', () => {
        const jzczhz = hsvToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = hsv(120, 0.5, 0.6, 0.8);
        const jzczhz = hsvToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve HSV values when converting to RGB and back', () => {
      const original = hsv(120, 0.5, 0.6);
      const rgb = hsvToRGB(original);
      const roundTrip = rgb.to('hsv');

      expect(roundTrip.h).toBeCloseTo(original.h, 0);
      expect(roundTrip.s).toBeCloseTo(original.s, 1);
      expect(roundTrip.v).toBeCloseTo(original.v, 1);
    });

    it('should approximately preserve HSV values when converting to HSL and back', () => {
      const original = hsv(120, 0.5, 0.6);
      const hsl = hsvToHSL(original);
      const roundTrip = hsl.to('hsv');

      expect(roundTrip.h).toBeCloseTo(original.h, 0);
      expect(roundTrip.s).toBeCloseTo(original.s, 1);
      expect(roundTrip.v).toBeCloseTo(original.v, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert primary colors correctly', () => {
      // Red
      const red = hsv(0, 1, 1);
      const redRgb = hsvToRGB(red);
      expect(redRgb.r).toBeCloseTo(1, 5);
      expect(redRgb.g).toBeCloseTo(0, 5);
      expect(redRgb.b).toBeCloseTo(0, 5);

      // Green
      const green = hsv(120, 1, 1);
      const greenRgb = hsvToRGB(green);
      expect(greenRgb.r).toBeCloseTo(0, 5);
      expect(greenRgb.g).toBeCloseTo(1, 5);
      expect(greenRgb.b).toBeCloseTo(0, 5);

      // Blue
      const blue = hsv(240, 1, 1);
      const blueRgb = hsvToRGB(blue);
      expect(blueRgb.r).toBeCloseTo(0, 5);
      expect(blueRgb.g).toBeCloseTo(0, 5);
      expect(blueRgb.b).toBeCloseTo(1, 5);
    });

    it('should handle edge cases correctly', () => {
      // Black
      const black = hsv(0, 0, 0);
      const blackRgb = hsvToRGB(black);
      expect(blackRgb.r).toBeCloseTo(0, 5);
      expect(blackRgb.g).toBeCloseTo(0, 5);
      expect(blackRgb.b).toBeCloseTo(0, 5);

      // White
      const white = hsv(0, 0, 1);
      const whiteRgb = hsvToRGB(white);
      expect(whiteRgb.r).toBeCloseTo(1, 5);
      expect(whiteRgb.g).toBeCloseTo(1, 5);
      expect(whiteRgb.b).toBeCloseTo(1, 5);

      // Gray
      const gray = hsv(0, 0, 0.5);
      const grayRgb = hsvToRGB(gray);
      expect(grayRgb.r).toBeCloseTo(0.5, 5);
      expect(grayRgb.g).toBeCloseTo(0.5, 5);
      expect(grayRgb.b).toBeCloseTo(0.5, 5);
    });

    it('should handle hue wrapping correctly', () => {
      // Hue values should wrap around 360 degrees
      const color1 = hsv(360, 0.5, 0.6);
      const color2 = hsv(0, 0.5, 0.6);
      const rgb1 = hsvToRGB(color1);
      const rgb2 = hsvToRGB(color2);

      expect(rgb1.r).toBeCloseTo(rgb2.r, 5);
      expect(rgb1.g).toBeCloseTo(rgb2.g, 5);
      expect(rgb1.b).toBeCloseTo(rgb2.b, 5);

      // Negative hue values should also work
      const color3 = hsv(-120, 0.5, 0.6);
      const color4 = hsv(240, 0.5, 0.6);
      const rgb3 = hsvToRGB(color3);
      const rgb4 = hsvToRGB(color4);

      expect(rgb3.r).toBeCloseTo(rgb4.r, 5);
      expect(rgb3.g).toBeCloseTo(rgb4.g, 5);
      expect(rgb3.b).toBeCloseTo(rgb4.b, 5);
    });
  });
});
