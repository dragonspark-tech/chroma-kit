import '../../conversion/register-conversions';

import { describe, expect, it } from 'vitest';
import {
  lab,
  LabColor,
  labFromVector,
  labToCSSString,
  labToHSL,
  labToHSV,
  labToHWB,
  labToJzAzBz,
  labToJzCzHz,
  labToLCH,
  labToOKLab,
  labToOKLCh,
  labToRGB,
  labToXYZ
} from '../../models/lab';
import { labFromCSSString } from '../../models/lab/parser';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { srgb, srgbToXYZ } from '../../models/srgb';
import { xyz } from '../../models/xyz';

describe('Lab Color Model', () => {
  // Test lab factory function
  describe('lab', () => {
    it('should create a Lab color with the correct properties', () => {
      const color = lab(0.5, 10, -20);
      expect(color.space).toBe('lab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(10);
      expect(color.b).toBe(-20);
      expect(color.alpha).toBeUndefined();
    });

    it('should create a Lab color with alpha', () => {
      const color = lab(0.5, 10, -20, 0.8);
      expect(color.space).toBe('lab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(10);
      expect(color.b).toBe(-20);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = lab(0.5, 10, -20, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('lab');
    });

    it('should have a toCSSString method', () => {
      const color = lab(0.5, 10, -20, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('lab');
    });

    it('should have a to method for color space conversion', () => {
      const color = lab(0.5, 10, -20);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test labFromVector function
  describe('labFromVector', () => {
    it('should create a Lab color from a vector', () => {
      const color = labFromVector([0.5, 10, -20]);
      expect(color.space).toBe('lab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(10);
      expect(color.b).toBe(-20);
      expect(color.alpha).toBeUndefined();
    });

    it('should create a Lab color from a vector with alpha', () => {
      const color = labFromVector([0.5, 10, -20], 0.8);
      expect(color.space).toBe('lab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(10);
      expect(color.b).toBe(-20);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => labFromVector([0.5, 10])).toThrow('Invalid vector length');
      expect(() => labFromVector([0.5, 10, -20, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test labToCSSString function
  describe('labToCSSString', () => {
    it('should convert a Lab color to a CSS string', () => {
      const color = lab(0.5, 10, -20);
      expect(labToCSSString(color)).toBe('lab(50.00% 10.0000 -20.0000)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = lab(0.5, 10, -20, 0.8);
      expect(labToCSSString(color)).toBe('lab(50.00% 10.0000 -20.0000 / 0.800)');
    });
  });

  // Test labFromCSSString function
  describe('labFromCSSString', () => {
    it('should parse a CSS Lab color string with comma syntax', () => {
      const color = labFromCSSString('lab(50%, 10, -20)');
      expect(color.space).toBe('lab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(10, 5);
      expect(color.b).toBeCloseTo(-20, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS Lab color string with space syntax', () => {
      const color = labFromCSSString('lab(50% 10 -20)');
      expect(color.space).toBe('lab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(10, 5);
      expect(color.b).toBeCloseTo(-20, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS Lab color string with alpha using comma syntax', () => {
      const color = labFromCSSString('lab(50%, 10, -20, 0.8)');
      expect(color.space).toBe('lab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(10, 5);
      expect(color.b).toBeCloseTo(-20, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS Lab color string with alpha using slash syntax', () => {
      const color = labFromCSSString('lab(50% 10 -20 / 0.8)');
      expect(color.space).toBe('lab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(10, 5);
      expect(color.b).toBeCloseTo(-20, 5);
      expect(color.alpha).toBe(0.8);
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = lab(0.5, 10, -20);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('srgb');
        expect(rgb.space).toBe('srgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('labToXYZ', () => {
      it('should convert Lab to XYZ with default illuminant', () => {
        const xyzColor = labToXYZ(testColor);
        expect(xyzColor.space).toBe('xyz');
        expect(typeof xyzColor.x).toBe('number');
        expect(typeof xyzColor.y).toBe('number');
        expect(typeof xyzColor.z).toBe('number');
        expect(xyzColor.illuminant).toBe(IlluminantD65);
      });

      it('should convert Lab to XYZ with custom illuminant', () => {
        const xyzColor = labToXYZ(testColor, IlluminantD50);
        expect(xyzColor.space).toBe('xyz');
        expect(xyzColor.illuminant).toBe(IlluminantD50);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const xyzColor = labToXYZ(colorWithAlpha);
        expect(xyzColor.alpha).toBe(0.8);
      });

      it('should handle edge cases correctly', () => {
        // Test with L=0 (black)
        const black = lab(0, 0, 0);
        const blackXYZ = labToXYZ(black);
        expect(blackXYZ.x).toBeCloseTo(0, 5);
        expect(blackXYZ.y).toBeCloseTo(0, 5);
        expect(blackXYZ.z).toBeCloseTo(0, 5);

        // Test with L=1 (white)
        const white = lab(100, 0, 0);
        const whiteXYZ = labToXYZ(white);
        expect(whiteXYZ.x).toBeCloseTo(IlluminantD65.xR, 5);
        expect(whiteXYZ.y).toBeCloseTo(IlluminantD65.yR, 5);
        expect(whiteXYZ.z).toBeCloseTo(IlluminantD65.zR, 5);
      });
    });

    describe('labToRGB', () => {
      it('should convert Lab to RGB', () => {
        const rgb = labToRGB(testColor);
        expect(rgb.space).toBe('srgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should perform gamut mapping by default', () => {
        // Create a Lab color that is out of the sRGB gamut
        const outOfGamutColor = lab(0.5, 100, -100);
        const rgb = labToRGB(outOfGamutColor);

        // After gamut mapping, all values should be within 0-1 range
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should not perform gamut mapping when disabled', () => {
        // Create a Lab color that is out of the sRGB gamut
        const outOfGamutColor = lab(0.5, 100, -100);
        const rgb = labToRGB(outOfGamutColor, false);

        // Without gamut mapping, values can be outside 0-1 range
        expect(Math.max(rgb.r, rgb.g, rgb.b) > 1 || Math.min(rgb.r, rgb.g, rgb.b) < 0).toBe(true);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const rgb = labToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });
    });

    describe('labToHSL', () => {
      it('should convert Lab to HSL', () => {
        const hsl = labToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const hsl = labToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });
    });

    describe('labToHSV', () => {
      it('should convert Lab to HSV', () => {
        const hsv = labToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const hsv = labToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });
    });

    describe('labToHWB', () => {
      it('should convert Lab to HWB', () => {
        const hwb = labToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const hwb = labToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('labToLCH', () => {
      it('should convert Lab to LCh', () => {
        const lch = labToLCH(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeCloseTo(testColor.l, 5);
        expect(lch.c).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const lch = labToLCH(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });

      it('should calculate chroma and hue correctly', () => {
        const testLab = lab(0.5, 3, 4);
        const lch = labToLCH(testLab);
        expect(lch.c).toBeCloseTo(5, 5); // sqrt(3^2 + 4^2) = 5
        expect(lch.h).toBeCloseTo(53.13, 1); // atan2(4, 3) * 180/PI = 53.13 degrees
      });

      it('should handle zero chroma correctly', () => {
        const grayLab = lab(0.5, 0, 0);
        const lch = labToLCH(grayLab);
        expect(lch.c).toBeCloseTo(0, 5);
        expect(lch.h).toBeCloseTo(0, 5); // Hue is arbitrary when chroma is 0
      });
    });

    describe('labToOKLab', () => {
      it('should convert Lab to OKLab', () => {
        const oklab = labToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(typeof oklab.l).toBe('number');
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const oklab = labToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });
    });

    describe('labToOKLCh', () => {
      it('should convert Lab to OKLCh', () => {
        const oklch = labToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(typeof oklch.l).toBe('number');
        expect(oklch.c).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const oklch = labToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });
    });

    describe('labToJzAzBz', () => {
      it('should convert Lab to JzAzBz with default peak luminance', () => {
        const jzazbz = labToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(typeof jzazbz.jz).toBe('number');
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert Lab to JzAzBz with custom peak luminance', () => {
        const jzazbz = labToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
        expect(typeof jzazbz.jz).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const jzazbz = labToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('labToJzCzHz', () => {
      it('should convert Lab to JzCzHz with default peak luminance', () => {
        const jzczhz = labToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(typeof jzczhz.jz).toBe('number');
        expect(jzczhz.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeLessThanOrEqual(360);
      });

      it('should convert Lab to JzCzHz with custom peak luminance', () => {
        const jzczhz = labToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
        expect(typeof jzczhz.jz).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = lab(0.5, 10, -20, 0.8);
        const jzczhz = labToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve Lab values when converting to XYZ and back', () => {
      const original = lab(50, 10, -20);
      const xyzColor = labToXYZ(original);
      const roundTrip = xyzColor.to('lab') as LabColor;

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.a).toBeCloseTo(original.a, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });

    it('should approximately preserve Lab values when converting to RGB and back', () => {
      const original = lab(50, 10, -20);
      const rgb = labToRGB(original);
      const roundTrip = rgb.to('lab') as LabColor;

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.a).toBeCloseTo(original.a, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert white correctly', () => {
      const white = lab(100, 0, 0);
      const rgb = labToRGB(white);

      expect(rgb.r).toBeCloseTo(1, 1);
      expect(rgb.g).toBeCloseTo(1, 1);
      expect(rgb.b).toBeCloseTo(1, 1);
    });

    it('should convert black correctly', () => {
      const black = lab(0, 0, 0);
      const rgb = labToRGB(black);

      expect(rgb.r).toBeCloseTo(0, 1);
      expect(rgb.g).toBeCloseTo(0, 1);
      expect(rgb.b).toBeCloseTo(0, 1);
    });

    it('should convert sRGB primaries correctly through D65 Illuminant', () => {
      // Red in sRGB
      const red = srgb(1, 0, 0).to('lab');
      expect(red.l).toBeCloseTo(53.2371);
      expect(red.a).toBeCloseTo(80.0901);
      expect(red.b).toBeCloseTo(67.2032);

      // Green in sRGB
      const green = srgb(0, 1, 0).to('lab');
      expect(green.l).toBeCloseTo(87.7355)
      expect(green.a).toBeCloseTo(-86.1815);
      expect(green.b).toBeCloseTo(83.1866);

      // Blue in sRGB
      const blue = srgb(0, 0, 1).to('lab');
      expect(blue.l).toBeCloseTo(32.3008);
      expect(blue.a).toBeCloseTo(79.1952);
      expect(blue.b).toBeCloseTo(-107.8554);
    });

    it('should convert sRGB primaries correctly through D50 Illuminant', () => {
      const rgbRed = srgb(1, 0, 0);
      const red = srgbToXYZ(rgbRed, true).to('lab');
      expect(red.l).toBeCloseTo(54.2905);
      expect(red.a).toBeCloseTo(80.8049);
      expect(red.b).toBeCloseTo(69.8909);
    });
  });
});
