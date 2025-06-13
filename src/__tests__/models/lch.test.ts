import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  lch,
  lchFromVector,
  lchToCSSString,
  lchToHSL,
  lchToHSV,
  lchToHWB,
  lchToJzAzBz,
  lchToJzCzHz,
  lchToLab,
  lchToOKLab,
  lchToOKLCh,
  lchToP3,
  lchToRGB,
  lchToXYZ
} from '../../models/lch';
import { lchFromCSSString } from '../../models/lch/parser';
import { lab } from '../../models/lab';
import { rgb, rgbToXYZ } from '../../models/rgb';

describe('LCh Color Model', () => {
  // Test lch factory function
  describe('lch', () => {
    it('should create an LCh color with the correct properties', () => {
      const color = lch(50, 60, 70);
      expect(color.space).toBe('lch');
      expect(color.l).toBe(50);
      expect(color.c).toBe(60);
      expect(color.h).toBe(70);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an LCh color with alpha', () => {
      const color = lch(50, 60, 70, 0.8);
      expect(color.space).toBe('lch');
      expect(color.l).toBe(50);
      expect(color.c).toBe(60);
      expect(color.h).toBe(70);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = lch(50, 60, 70, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('lch');
    });

    it('should have a toCSSString method', () => {
      const color = lch(50, 60, 70, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('lch');
    });

    it('should have a to method for color space conversion', () => {
      const color = lch(50, 60, 70);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test lchFromVector function
  describe('lchFromVector', () => {
    it('should create an LCh color from a vector', () => {
      const color = lchFromVector([50, 60, 70]);
      expect(color.space).toBe('lch');
      expect(color.l).toBe(50);
      expect(color.c).toBe(60);
      expect(color.h).toBe(70);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an LCh color from a vector with alpha', () => {
      const color = lchFromVector([50, 60, 70], 0.8);
      expect(color.space).toBe('lch');
      expect(color.l).toBe(50);
      expect(color.c).toBe(60);
      expect(color.h).toBe(70);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => lchFromVector([50, 60])).toThrow('Invalid vector length');
      expect(() => lchFromVector([50, 60, 70, 80])).toThrow('Invalid vector length');
    });
  });

  // Test lchToCSSString function
  describe('lchToCSSString', () => {
    it('should convert an LCh color to a CSS string', () => {
      const color = lch(50, 60, 70);
      expect(lchToCSSString(color)).toBe('lch(50.00% 60.00 70.00deg)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = lch(50, 60, 70, 0.8);
      expect(lchToCSSString(color)).toBe('lch(50.00% 60.00 70.00deg / 0.800)');
    });
  });

  // Test lchFromCSSString function
  describe('lchFromCSSString', () => {
    it('should parse a CSS LCh color string with space syntax', () => {
      const color = lchFromCSSString('lch(50% 60 70)');
      expect(color.space).toBe('lch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(60, 5);
      expect(color.h).toBeCloseTo(70, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS LCh color string with comma syntax', () => {
      const color = lchFromCSSString('lch(50%, 60, 70)');
      expect(color.space).toBe('lch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(60, 5);
      expect(color.h).toBeCloseTo(70, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS LCh color string with alpha using slash syntax', () => {
      const color = lchFromCSSString('lch(50% 60 70 / 0.8)');
      expect(color.space).toBe('lch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(60, 5);
      expect(color.h).toBeCloseTo(70, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS LCh color string with alpha using comma syntax', () => {
      const color = lchFromCSSString('lch(50%, 60, 70, 0.8)');
      expect(color.space).toBe('lch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(60, 5);
      expect(color.h).toBeCloseTo(70, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS LCh color string with alpha as percentage', () => {
      const color = lchFromCSSString('lch(50% 60 70 / 80%)');
      expect(color.space).toBe('lch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(60, 5);
      expect(color.h).toBeCloseTo(70, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should handle negative hue values', () => {
      const color = lchFromCSSString('lch(50% 60 -70)');
      expect(color.space).toBe('lch');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.c).toBeCloseTo(60, 5);
      expect(color.h).toBeCloseTo(290, 5); // -70 + 360 = 290
      expect(color.alpha).toBeUndefined();
    });

    it('should throw an error for invalid LCh color format', () => {
      expect(() => lchFromCSSString('rgb(0, 0, 0)')).toThrow();
      expect(() => lchFromCSSString('lch()')).toThrow();
      expect(() => lchFromCSSString('lch(50%)')).toThrow();
      expect(() => lchFromCSSString('lch(50%, 60)')).toThrow();
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = lch(50, 60, 70);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const lab = testColor.to('lab');
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });
    });

    describe('lchToLab', () => {
      it('should convert LCh to Lab', () => {
        const labColor = lchToLab(testColor);
        expect(labColor.space).toBe('lab');
        expect(labColor.l).toBe(50);
        // a = c * cos(h * π/180)
        expect(labColor.a).toBeCloseTo(60 * Math.cos((70 * Math.PI) / 180), 5);
        // b = c * sin(h * π/180)
        expect(labColor.b).toBeCloseTo(60 * Math.sin((70 * Math.PI) / 180), 5);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const labColor = lchToLab(colorWithAlpha);
        expect(labColor.alpha).toBe(0.8);
      });
    });

    describe('lchToXYZ', () => {
      it('should convert LCh to XYZ', () => {
        const xyz = lchToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(typeof xyz.x).toBe('number');
        expect(typeof xyz.y).toBe('number');
        expect(typeof xyz.z).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const xyz = lchToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.8);
      });
    });

    describe('lchToRGB', () => {
      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const rgb = lchToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });
    });

    describe('lchToHSL', () => {
      it('should convert LCh to HSL', () => {
        const hsl = lchToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const hsl = lchToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });
    });

    describe('lchToHSV', () => {
      it('should convert LCh to HSV', () => {
        const hsv = lchToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const hsv = lchToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });
    });

    describe('lchToHWB', () => {
      it('should convert LCh to HWB', () => {
        const hwb = lchToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const hwb = lchToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('lchToOKLab', () => {
      it('should convert LCh to OKLab', () => {
        const oklab = lchToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(typeof oklab.l).toBe('number');
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const oklab = lchToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });
    });

    describe('lchToOKLCh', () => {
      it('should convert LCh to OKLCh', () => {
        const oklch = lchToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(typeof oklch.l).toBe('number');
        expect(typeof oklch.c).toBe('number');
        expect(typeof oklch.h).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const oklch = lchToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });
    });

    describe('lchToJzAzBz', () => {
      it('should convert LCh to JzAzBz with default peak luminance', () => {
        const jzazbz = lchToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(typeof jzazbz.jz).toBe('number');
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert LCh to JzAzBz with custom peak luminance', () => {
        const jzazbz = lchToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const jzazbz = lchToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('lchToJzCzHz', () => {
      it('should convert LCh to JzCzHz with default peak luminance', () => {
        const jzczhz = lchToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(typeof jzczhz.jz).toBe('number');
        expect(typeof jzczhz.cz).toBe('number');
        expect(typeof jzczhz.hz).toBe('number');
      });

      it('should convert LCh to JzCzHz with custom peak luminance', () => {
        const jzczhz = lchToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const jzczhz = lchToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });

    describe('lchToP3', () => {
      it('should preserve alpha', () => {
        const colorWithAlpha = lch(50, 60, 70, 0.8);
        const p3 = lchToP3(colorWithAlpha);
        expect(p3.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve LCh values when converting to Lab and back', () => {
      const original = lch(50, 60, 70);
      const lab = lchToLab(original);
      const roundTrip = lab.to('lch');

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.c).toBeCloseTo(original.c, 1);
      expect(roundTrip.h).toBeCloseTo(original.h, 1);
    });

    it('should approximately preserve LCh values when converting to XYZ and back', () => {
      const original = lch(50, 60, 70);
      const xyz = lchToXYZ(original);
      const roundTrip = xyz.to('lch');

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.c).toBeCloseTo(original.c, 1);
      expect(roundTrip.h).toBeCloseTo(original.h, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert known Lab colors to LCh correctly', () => {
      // Lab(50, 0, 0) should convert to LCh(50, 0, 0)
      const grayLab = lab(50, 0, 0);
      const grayLCh = grayLab.to('lch');
      expect(grayLCh.l).toBeCloseTo(50, 5);
      expect(grayLCh.c).toBeCloseTo(0, 5);
      expect(grayLCh.h).toBeCloseTo(0, 5);

      // Lab(50, 50, 0) should convert to LCh(50, 50, 0)
      const redLab = lab(50, 50, 0);
      const redLCh = redLab.to('lch');
      expect(redLCh.l).toBeCloseTo(50, 5);
      expect(redLCh.c).toBeCloseTo(50, 5);
      expect(redLCh.h).toBeCloseTo(0, 5);

      // Lab(50, 0, 50) should convert to LCh(50, 50, 90)
      const yellowLab = lab(50, 0, 50);
      const yellowLCh = yellowLab.to('lch');
      expect(yellowLCh.l).toBeCloseTo(50, 5);
      expect(yellowLCh.c).toBeCloseTo(50, 5);
      expect(yellowLCh.h).toBeCloseTo(90, 5);

      // Lab(50, -50, 0) should convert to LCh(50, 50, 180)
      const greenLab = lab(50, -50, 0);
      const greenLCh = greenLab.to('lch');
      expect(greenLCh.l).toBeCloseTo(50, 5);
      expect(greenLCh.c).toBeCloseTo(50, 5);
      expect(greenLCh.h).toBeCloseTo(180, 5);

      // Lab(50, 0, -50) should convert to LCh(50, 50, 270)
      const blueLab = lab(50, 0, -50);
      const blueLCh = blueLab.to('lch');
      expect(blueLCh.l).toBeCloseTo(50, 5);
      expect(blueLCh.c).toBeCloseTo(50, 5);
      expect(blueLCh.h).toBeCloseTo(270, 5);
    });

    it('should convert primary RGB colors to LCh correctly with illuminant D65', () => {
      const red = rgb(1, 0, 0).to('lch');

      expect(red.l).toBeCloseTo(53.2371);
      expect(red.c).toBeCloseTo(104.55);
      expect(red.h).toBeCloseTo(39.9998);
      expect(red.illuminant?.name).toBe('D65');
    });

    it('should convert primary RGB colors to LCh correctly with illuminant D50', () => {
      // Red
      const rgbRed = rgb(1, 0, 0);
      const red = rgbToXYZ(rgbRed, true).to('lch');

      expect(red.l).toBeCloseTo(54.2905);
      expect(red.c).toBeCloseTo(106.8371);
      expect(red.h).toBeCloseTo(40.8576);
      expect(red.illuminant?.name).toBe('D50');

      // Green
      const rgbGreen = rgb(0, 1, 0);
      const green = rgbToXYZ(rgbGreen, true).to('lch');

      expect(green.l).toBeCloseTo(87.8185);
      expect(green.c).toBeCloseTo(113.3314);
      expect(green.h).toBeCloseTo(134.3838);
      expect(green.illuminant?.name).toBe('D50');

      // Blue
      const rgbBlue = rgb(0, 0, 1);
      const blue = rgbToXYZ(rgbBlue, true).to('lch');

      expect(blue.l).toBeCloseTo(29.5683);
      expect(blue.c).toBeCloseTo(131.2014);
      expect(blue.h).toBeCloseTo(301.3642);
      expect(blue.illuminant?.name).toBe('D50');
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    it('should handle zero chroma correctly', () => {
      const color = lch(50, 0, 0);
      const lab = lchToLab(color);
      expect(lab.l).toBe(50);
      expect(lab.a).toBe(0);
      expect(lab.b).toBe(0);
    });

    it('should handle hue wrapping correctly', () => {
      // Hue of 370 should be equivalent to 10
      const color1 = lch(50, 60, 370);
      const color2 = lch(50, 60, 10);
      const lab1 = lchToLab(color1);
      const lab2 = lchToLab(color2);
      expect(lab1.a).toBeCloseTo(lab2.a, 5);
      expect(lab1.b).toBeCloseTo(lab2.b, 5);

      // Hue of -10 should be equivalent to 350
      const color3 = lch(50, 60, -10);
      const color4 = lch(50, 60, 350);
      const lab3 = lchToLab(color3);
      const lab4 = lchToLab(color4);
      expect(lab3.a).toBeCloseTo(lab4.a, 5);
      expect(lab3.b).toBeCloseTo(lab4.b, 5);
    });
  });
});
