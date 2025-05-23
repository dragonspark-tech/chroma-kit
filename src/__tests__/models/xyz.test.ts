import '../../conversion/register-conversions';

import { describe, expect, it } from 'vitest';
import {
  xyz,
  XYZColor,
  xyzFromVector,
  xyzToCSSString,
  xyzToHSL,
  xyzToHSV,
  xyzToHWB,
  xyzToJzAzBz,
  xyzToJzCzHz,
  xyzToLab,
  xyzToLCh,
  xyzToOKLab,
  xyzToOKLCh,
  xyzToRGB
} from '../../models/xyz';
import { xyzFromCSSString } from '../../models/xyz/parser';
import { IlluminantD50, IlluminantD65 } from '../../standards/illuminants';
import { srgb } from '../../models/srgb';

describe('XYZ Color Model', () => {
  // Test xyz factory function
  describe('xyz', () => {
    it('should create an XYZ color with the correct properties', () => {
      const color = xyz(0.5, 0.6, 0.7);
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.alpha).toBeUndefined();
      expect(color.illuminant).toBe(IlluminantD65);
    });

    it('should create an XYZ color with alpha', () => {
      const color = xyz(0.5, 0.6, 0.7, 0.8);
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.alpha).toBe(0.8);
      expect(color.illuminant).toBe(IlluminantD65);
    });

    it('should create an XYZ color with custom illuminant', () => {
      const color = xyz(0.5, 0.6, 0.7, undefined, IlluminantD50);
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.alpha).toBeUndefined();
      expect(color.illuminant).toBe(IlluminantD50);
    });

    it('should have a toString method', () => {
      const color = xyz(0.5, 0.6, 0.7, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('xyz');
    });

    it('should have a toCSSString method', () => {
      const color = xyz(0.5, 0.6, 0.7, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('xyz-d65');
    });

    it('should have a to method for color space conversion', () => {
      const color = xyz(0.5, 0.6, 0.7);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test xyzFromVector function
  describe('xyzFromVector', () => {
    it('should create an XYZ color from a vector', () => {
      const color = xyzFromVector([0.5, 0.6, 0.7]);
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.alpha).toBeUndefined();
      expect(color.illuminant).toBe(IlluminantD65);
    });

    it('should create an XYZ color from a vector with alpha', () => {
      const color = xyzFromVector([0.5, 0.6, 0.7], 0.8);
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.alpha).toBe(0.8);
      expect(color.illuminant).toBe(IlluminantD65);
    });

    it('should create an XYZ color from a vector with custom illuminant', () => {
      const color = xyzFromVector([0.5, 0.6, 0.7], undefined, IlluminantD50);
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.alpha).toBeUndefined();
      expect(color.illuminant).toBe(IlluminantD50);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => xyzFromVector([0.5, 0.6])).toThrow('Invalid vector length');
      expect(() => xyzFromVector([0.5, 0.6, 0.7, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test xyzToCSSString function
  describe('xyzToCSSString', () => {
    it('should convert an XYZ color to a CSS string', () => {
      const color = xyz(0.5, 0.6, 0.7);
      expect(xyzToCSSString(color)).toBe('color(xyz-d65 0.5 0.6 0.7)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = xyz(0.5, 0.6, 0.7, 0.8);
      expect(xyzToCSSString(color)).toBe('color(xyz-d65 0.5 0.6 0.7 / 0.8)');
    });

    it('should use the correct illuminant name in the CSS string', () => {
      const color = xyz(0.5, 0.6, 0.7, undefined, IlluminantD50);
      expect(xyzToCSSString(color)).toBe('color(xyz-d50 0.5 0.6 0.7)');
    });
  });

  // Test xyzFromCSSString function
  describe('xyzFromCSSString', () => {
    it('should parse a CSS XYZ color string with D65 illuminant', () => {
      const color = xyzFromCSSString('color(xyz-d65 0.5 0.6 0.7)');
      expect(color.space).toBe('xyz');
      expect(color.x).toBeCloseTo(0.5, 5);
      expect(color.y).toBeCloseTo(0.6, 5);
      expect(color.z).toBeCloseTo(0.7, 5);
      expect(color.alpha).toBeUndefined();
      expect(color.illuminant?.name).toBe('D65');
    });

    it('should parse a CSS XYZ color string with D50 illuminant', () => {
      const color = xyzFromCSSString('color(xyz-d50 0.5 0.6 0.7)');
      expect(color.space).toBe('xyz');
      expect(color.x).toBeCloseTo(0.5, 5);
      expect(color.y).toBeCloseTo(0.6, 5);
      expect(color.z).toBeCloseTo(0.7, 5);
      expect(color.alpha).toBeUndefined();
      expect(color.illuminant?.name).toBe('D50');
    });

    it('should parse a CSS XYZ color string with alpha', () => {
      const color = xyzFromCSSString('color(xyz-d65 0.5 0.6 0.7 / 0.8)');
      expect(color.space).toBe('xyz');
      expect(color.x).toBeCloseTo(0.5, 5);
      expect(color.y).toBeCloseTo(0.6, 5);
      expect(color.z).toBeCloseTo(0.7, 5);
      expect(color.alpha).toBe(0.8);
      expect(color.illuminant?.name).toBe('D65');
    });

    it('should throw an error for invalid XYZ color format', () => {
      expect(() => xyzFromCSSString('rgb(0, 0, 0)')).toThrow(
        'XYZ color string must start with "color(xyz-"'
      );
      expect(() => xyzFromCSSString('color(xyz-)')).toThrow('Invalid XYZ color format');
      expect(() => xyzFromCSSString('color(xyz-unknown 0.5 0.6 0.7)')).toThrow(
        'Unsupported illuminant: unknown'
      );
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = xyz(0.5, 0.6, 0.7);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('srgb');
        expect(rgb.space).toBe('srgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('xyzToRGB', () => {
      it('should convert XYZ to RGB', () => {
        const rgb = xyzToRGB(testColor);
        expect(rgb.space).toBe('srgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should perform gamut mapping by default', () => {
        // Create an XYZ color that is out of the sRGB gamut
        const outOfGamutColor = xyz(2.0, 0.0, 0.0);
        const rgb = xyzToRGB(outOfGamutColor);

        // After gamut mapping, all values should be within 0-1 range
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should not perform gamut mapping when disabled', () => {
        // Create an XYZ color that is out of the sRGB gamut
        const outOfGamutColor = xyz(2.0, 0.0, 0.0);
        const rgb = xyzToRGB(outOfGamutColor, false);

        // Without gamut mapping, values can be outside 0-1 range
        expect(Math.max(rgb.r, rgb.g, rgb.b)).toBeGreaterThan(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const rgb = xyzToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });

      it('should handle negative values correctly with gamut mapping', () => {
        // Create an XYZ color with negative components
        const negativeColor = xyz(-0.1, 0.5, 0.5);
        const rgb = xyzToRGB(negativeColor);

        // After gamut mapping, all values should be within 0-1 range
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });
    });

    describe('xyzToHSL', () => {
      it('should convert XYZ to HSL', () => {
        const hsl = xyzToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const hsl = xyzToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });
    });

    describe('xyzToHSV', () => {
      it('should convert XYZ to HSV', () => {
        const hsv = xyzToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const hsv = xyzToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });
    });

    describe('xyzToHWB', () => {
      it('should convert XYZ to HWB', () => {
        const hwb = xyzToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const hwb = xyzToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('xyzToLab', () => {
      it('should convert XYZ to Lab', () => {
        const lab = xyzToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should handle different illuminants', () => {
        const colorD50 = xyz(0.5, 0.6, 0.7, undefined, IlluminantD50);
        const lab = xyzToLab(colorD50);
        expect(lab.space).toBe('lab');
      });

      it('should use D65 illuminant by default when illuminant is undefined', () => {
        // Create an XYZ color with undefined illuminant
        const colorNoIlluminant = { space: 'xyz', x: 0.5, y: 0.6, z: 0.7 } as XYZColor;
        const lab = xyzToLab(colorNoIlluminant);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const lab = xyzToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.8);
      });

      it('should handle values below epsilon correctly', () => {
        const lowColor = xyz(0.001, 0.001, 0.001);
        const lab = xyzToLab(lowColor);
        expect(lab.space).toBe('lab');
        expect(lab.l).toBeGreaterThan(0);
      });
    });

    describe('xyzToLCh', () => {
      it('should convert XYZ to LCh', () => {
        const lch = xyzToLCh(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const lch = xyzToLCh(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });
    });

    describe('xyzToOKLab', () => {
      it('should convert XYZ to OKLab', () => {
        const oklab = xyzToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const oklab = xyzToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.8);
      });
    });

    describe('xyzToOKLCh', () => {
      it('should convert XYZ to OKLCh', () => {
        const oklch = xyzToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
        expect(oklch.c).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const oklch = xyzToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });
    });

    describe('xyzToJzAzBz', () => {
      it('should convert XYZ to JzAzBz with default peak luminance', () => {
        const jzazbz = xyzToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert XYZ to JzAzBz with custom peak luminance', () => {
        const jzazbz = xyzToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
      });

      it('should use D65 illuminant by default when illuminant is undefined', () => {
        // Create an XYZ color with undefined illuminant
        const colorNoIlluminant = { space: 'xyz', x: 0.5, y: 0.6, z: 0.7 } as XYZColor;
        const jzazbz = xyzToJzAzBz(colorNoIlluminant);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
      });

      it('should throw an error for non-D65 illuminant', () => {
        const colorD50 = xyz(0.5, 0.6, 0.7, undefined, IlluminantD50);
        expect(() => xyzToJzAzBz(colorD50)).toThrow(
          'JzAzBz is only defined for the D65 illuminant'
        );
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const jzazbz = xyzToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('xyzToJzCzHz', () => {
      it('should convert XYZ to JzCzHz with default peak luminance', () => {
        const jzczhz = xyzToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeLessThanOrEqual(360);
      });

      it('should convert XYZ to JzCzHz with custom peak luminance', () => {
        const jzczhz = xyzToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = xyz(0.5, 0.6, 0.7, 0.8);
        const jzczhz = xyzToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve XYZ values when converting to RGB and back', () => {
      const original = xyz(0.5, 0.6, 0.7);
      const rgb = xyzToRGB(original);
      const roundTrip = rgb.to('xyz') as XYZColor;

      expect(roundTrip.x).toBeCloseTo(original.x, 1);
      expect(roundTrip.y).toBeCloseTo(original.y, 1);
      expect(roundTrip.z).toBeCloseTo(original.z, 1);
    });

    it('should approximately preserve XYZ values when converting to Lab and back', () => {
      const original = xyz(0.5, 0.6, 0.7);
      const lab = xyzToLab(original);
      const roundTrip = lab.to('xyz') as XYZColor;

      expect(roundTrip.x).toBeCloseTo(original.x, 1);
      expect(roundTrip.y).toBeCloseTo(original.y, 1);
      expect(roundTrip.z).toBeCloseTo(original.z, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert D65 white point correctly', () => {
      const white = xyz(0.95047, 1.0, 1.08883); // D65 white point
      const rgb = xyzToRGB(white);

      expect(rgb.r).toBeCloseTo(1, 1);
      expect(rgb.g).toBeCloseTo(1, 1);
      expect(rgb.b).toBeCloseTo(1, 1);
    });

    it('should convert sRGB primaries correctly', () => {
      // Red in sRGB
      const red = srgb(1, 0, 0).to('xyz') as XYZColor;
      expect(red.x).toBeCloseTo(0.4124, 3);
      expect(red.y).toBeCloseTo(0.2126, 3);
      expect(red.z).toBeCloseTo(0.0193, 3);

      // Green in sRGB
      const green = srgb(0, 1, 0).to('xyz') as XYZColor;
      expect(green.x).toBeCloseTo(0.3576, 3);
      expect(green.y).toBeCloseTo(0.7152, 3);
      expect(green.z).toBeCloseTo(0.1192, 3);

      // Blue in sRGB
      const blue = srgb(0, 0, 1).to('xyz') as XYZColor;
      expect(blue.x).toBeCloseTo(0.1805, 3);
      expect(blue.y).toBeCloseTo(0.0722, 3);
      expect(blue.z).toBeCloseTo(0.9505, 3);
    });
  });
});
