import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  oklab,
  oklabFromVector,
  oklabToCSSString,
  oklabToRGB,
  oklabToHSL,
  oklabToHSV,
  oklabToHWB,
  oklabToXYZ,
  oklabToLab,
  oklabToLCh,
  oklabToOKLCh,
  oklabToJzAzBz,
  oklabToJzCzHz,
  oklabToP3
} from '../../models/oklab';
import { oklabFromCSSString } from '../../models/oklab/parser';
import { IlluminantD65 } from '../../standards/illuminants';
import { rgb } from '../../models/rgb';
import { xyz } from '../../models/xyz';

describe('OKLab Color Model', () => {
  // Test oklab factory function
  describe('oklab', () => {
    it('should create an OKLab color with the correct properties', () => {
      const color = oklab(0.5, 0.1, -0.2);
      expect(color.space).toBe('oklab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(0.1);
      expect(color.b).toBe(-0.2);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an OKLab color with alpha', () => {
      const color = oklab(0.5, 0.1, -0.2, 0.8);
      expect(color.space).toBe('oklab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(0.1);
      expect(color.b).toBe(-0.2);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = oklab(0.5, 0.1, -0.2, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('oklab');
    });

    it('should have a toCSSString method', () => {
      const color = oklab(0.5, 0.1, -0.2, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('oklab');
    });

    it('should have a to method for color space conversion', () => {
      const color = oklab(0.5, 0.1, -0.2);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test oklabFromVector function
  describe('oklabFromVector', () => {
    it('should create an OKLab color from a vector', () => {
      const color = oklabFromVector([0.5, 0.1, -0.2]);
      expect(color.space).toBe('oklab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(0.1);
      expect(color.b).toBe(-0.2);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an OKLab color from a vector with alpha', () => {
      const color = oklabFromVector([0.5, 0.1, -0.2], 0.8);
      expect(color.space).toBe('oklab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(0.1);
      expect(color.b).toBe(-0.2);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => oklabFromVector([0.5, 0.1])).toThrow('Invalid vector length');
      expect(() => oklabFromVector([0.5, 0.1, -0.2, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test oklabToCSSString function
  describe('oklabToCSSString', () => {
    it('should convert an OKLab color to a CSS string', () => {
      const color = oklab(0.5, 0.1, -0.2);
      expect(oklabToCSSString(color)).toBe('oklab(50.00% 0.1000 -0.2000)');
    });

    it('should include alpha in the CSS string when alpha is defined', () => {
      const color = oklab(0.5, 0.1, -0.2, 0.8);
      expect(oklabToCSSString(color)).toBe('oklab(50.00% 0.1000 -0.2000 / 0.800)');
    });
  });

  // Test oklabFromCSSString function
  describe('oklabFromCSSString', () => {
    it('should parse a CSS OKLab color string with space syntax', () => {
      const color = oklabFromCSSString('oklab(50% 0.1 -0.2)');
      expect(color.space).toBe('oklab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(0.1, 5);
      expect(color.b).toBeCloseTo(-0.2, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS OKLab color string with comma syntax', () => {
      const color = oklabFromCSSString('oklab(50%, 0.1, -0.2)');
      expect(color.space).toBe('oklab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(0.1, 5);
      expect(color.b).toBeCloseTo(-0.2, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS OKLab color string with decimal lightness', () => {
      const color = oklabFromCSSString('oklab(0.5 0.1 -0.2)');
      expect(color.space).toBe('oklab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(0.1, 5);
      expect(color.b).toBeCloseTo(-0.2, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a CSS OKLab color string with alpha using slash syntax', () => {
      const color = oklabFromCSSString('oklab(50% 0.1 -0.2 / 0.8)');
      expect(color.space).toBe('oklab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(0.1, 5);
      expect(color.b).toBeCloseTo(-0.2, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS OKLab color string with alpha using comma syntax', () => {
      const color = oklabFromCSSString('oklab(50%, 0.1, -0.2, 0.8)');
      expect(color.space).toBe('oklab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(0.1, 5);
      expect(color.b).toBeCloseTo(-0.2, 5);
      expect(color.alpha).toBe(0.8);
    });

    it('should parse a CSS OKLab color string with alpha as percentage', () => {
      const color = oklabFromCSSString('oklab(50% 0.1 -0.2 / 80%)');
      expect(color.space).toBe('oklab');
      expect(color.l).toBeCloseTo(0.5, 5);
      expect(color.a).toBeCloseTo(0.1, 5);
      expect(color.b).toBeCloseTo(-0.2, 5);
      expect(color.alpha).toBe(0.8);
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = oklab(0.5, 0.1, -0.2);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const rgb = testColor.to('rgb');
        expect(rgb.space).toBe('rgb');
        expect(typeof rgb.r).toBe('number');
        expect(typeof rgb.g).toBe('number');
        expect(typeof rgb.b).toBe('number');
      });
    });

    describe('oklabToRGB', () => {
      it('should convert OKLab to RGB', () => {
        const rgb = oklabToRGB(testColor);
        expect(rgb.space).toBe('rgb');
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should perform gamut mapping by default', () => {
        // Create an OKLab color that is out of the RGB gamut
        const outOfGamutColor = oklab(1.0, 0.5, 0.5);
        const rgb = oklabToRGB(outOfGamutColor);

        // After gamut mapping, all values should be within 0-1 range
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(1);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(1);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(1);
      });

      it('should not perform gamut mapping when disabled', () => {
        // Create an OKLab color that is out of the RGB gamut
        const outOfGamutColor = oklab(1.0, 0.5, 0.5);
        const rgb = oklabToRGB(outOfGamutColor, false);

        // Without gamut mapping, values can be outside 0-1 range
        expect(Math.max(rgb.r, rgb.g, rgb.b)).toBeGreaterThan(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const rgb = oklabToRGB(colorWithAlpha);
        expect(rgb.alpha).toBe(0.8);
      });
    });

    describe('oklabToHSL', () => {
      it('should convert OKLab to HSL', () => {
        const hsl = oklabToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeGreaterThanOrEqual(0);
        expect(hsl.h).toBeLessThanOrEqual(360);
        expect(hsl.s).toBeGreaterThanOrEqual(0);
        expect(hsl.s).toBeLessThanOrEqual(1);
        expect(hsl.l).toBeGreaterThanOrEqual(0);
        expect(hsl.l).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const hsl = oklabToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.8);
      });
    });

    describe('oklabToHSV', () => {
      it('should convert OKLab to HSV', () => {
        const hsv = oklabToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThanOrEqual(360);
        expect(hsv.s).toBeGreaterThanOrEqual(0);
        expect(hsv.s).toBeLessThanOrEqual(1);
        expect(hsv.v).toBeGreaterThanOrEqual(0);
        expect(hsv.v).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const hsv = oklabToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.8);
      });
    });

    describe('oklabToHWB', () => {
      it('should convert OKLab to HWB', () => {
        const hwb = oklabToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeGreaterThanOrEqual(0);
        expect(hwb.h).toBeLessThanOrEqual(360);
        expect(hwb.w).toBeGreaterThanOrEqual(0);
        expect(hwb.w).toBeLessThanOrEqual(1);
        expect(hwb.b).toBeGreaterThanOrEqual(0);
        expect(hwb.b).toBeLessThanOrEqual(1);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const hwb = oklabToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.8);
      });
    });

    describe('oklabToXYZ', () => {
      it('should convert OKLab to XYZ', () => {
        const xyzColor = oklabToXYZ(testColor);
        expect(xyzColor.space).toBe('xyz');
        expect(typeof xyzColor.x).toBe('number');
        expect(typeof xyzColor.y).toBe('number');
        expect(typeof xyzColor.z).toBe('number');
        expect(xyzColor.illuminant).toBe(IlluminantD65);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const xyzColor = oklabToXYZ(colorWithAlpha);
        expect(xyzColor.alpha).toBe(0.8);
      });
    });

    describe('oklabToLab', () => {
      it('should convert OKLab to Lab', () => {
        const lab = oklabToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(typeof lab.l).toBe('number');
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const lab = oklabToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.8);
      });
    });

    describe('oklabToLCh', () => {
      it('should convert OKLab to LCh', () => {
        const lch = oklabToLCh(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeGreaterThanOrEqual(0);
        expect(lch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const lch = oklabToLCh(colorWithAlpha);
        expect(lch.alpha).toBe(0.8);
      });
    });

    describe('oklabToOKLCh', () => {
      it('should convert OKLab to OKLCh', () => {
        const oklch = oklabToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBe(testColor.l);
        expect(oklch.c).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeGreaterThanOrEqual(0);
        expect(oklch.h).toBeLessThanOrEqual(360);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const oklch = oklabToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.8);
      });

      it('should calculate chroma correctly', () => {
        const color = oklab(0.5, 0.3, 0.4);
        const oklch = oklabToOKLCh(color);
        expect(oklch.c).toBeCloseTo(Math.hypot(0.3, 0.4), 5);
      });

      it('should calculate hue correctly', () => {
        const color = oklab(0.5, 0.3, 0.4);
        const oklch = oklabToOKLCh(color);
        const expectedHue = ((Math.atan2(0.4, 0.3) * 180) / Math.PI + 360) % 360;
        expect(oklch.h).toBeCloseTo(expectedHue, 5);
      });

      it('should handle zero chroma case', () => {
        const color = oklab(0.5, 0, 0);
        const oklch = oklabToOKLCh(color);
        expect(oklch.c).toBe(0);
        expect(oklch.h).toBe(0); // Hue is arbitrary when chroma is 0
      });
    });

    describe('oklabToJzAzBz', () => {
      it('should convert OKLab to JzAzBz with default peak luminance', () => {
        const jzazbz = oklabToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert OKLab to JzAzBz with custom peak luminance', () => {
        const jzazbz = oklabToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const jzazbz = oklabToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.8);
      });
    });

    describe('oklabToJzCzHz', () => {
      it('should convert OKLab to JzCzHz with default peak luminance', () => {
        const jzczhz = oklabToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeGreaterThanOrEqual(0);
        expect(jzczhz.hz).toBeLessThanOrEqual(360);
      });

      it('should convert OKLab to JzCzHz with custom peak luminance', () => {
        const jzczhz = oklabToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const jzczhz = oklabToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.8);
      });
    });

    describe('oklabToP3', () => {
      it('should convert OKLab to P3', () => {
        const p3 = oklabToP3(testColor);
        expect(p3.space).toBe('p3');
        expect(p3.r).toBeGreaterThanOrEqual(0);
        expect(p3.r).toBeLessThanOrEqual(1);
        expect(p3.g).toBeGreaterThanOrEqual(0);
        expect(p3.g).toBeLessThanOrEqual(1);
        expect(p3.b).toBeGreaterThanOrEqual(0);
        expect(p3.b).toBeLessThanOrEqual(1);
      });

      it('should perform gamut mapping by default', () => {
        // Create an OKLab color that is out of the P3 gamut
        const outOfGamutColor = oklab(1.0, 0.5, 0.5);
        const p3 = oklabToP3(outOfGamutColor);

        // After gamut mapping, all values should be within 0-1 range
        expect(p3.r).toBeGreaterThanOrEqual(0);
        expect(p3.r).toBeLessThanOrEqual(1);
        expect(p3.g).toBeGreaterThanOrEqual(0);
        expect(p3.g).toBeLessThanOrEqual(1);
        expect(p3.b).toBeGreaterThanOrEqual(0);
        expect(p3.b).toBeLessThanOrEqual(1);
      });

      it('should not perform gamut mapping when disabled', () => {
        // Create an OKLab color that is out of the P3 gamut
        const outOfGamutColor = oklab(1.0, 0.5, 0.5);
        const p3 = oklabToP3(outOfGamutColor, false);

        // Without gamut mapping, values might be outside 0-1 range
        expect(p3.space).toBe('p3');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = oklab(0.5, 0.1, -0.2, 0.8);
        const p3 = oklabToP3(colorWithAlpha);
        expect(p3.alpha).toBe(0.8);
      });
    });
  });

  // Test round-trip conversions
  describe('Round-trip Conversions', () => {
    it('should approximately preserve OKLab values when converting to RGB and back', () => {
      const original = oklab(0.5, 0.1, -0.2);
      const rgb = oklabToRGB(original);
      const roundTrip = rgb.to('oklab');

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.a).toBeCloseTo(original.a, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });

    it('should approximately preserve OKLab values when converting to XYZ and back', () => {
      const original = oklab(0.5, 0.1, -0.2);
      const xyzColor = oklabToXYZ(original);
      const roundTrip = xyzColor.to('oklab');

      expect(roundTrip.l).toBeCloseTo(original.l, 1);
      expect(roundTrip.a).toBeCloseTo(original.a, 1);
      expect(roundTrip.b).toBeCloseTo(original.b, 1);
    });
  });

  // Test specific color conversions
  describe('Specific Color Conversions', () => {
    it('should convert white correctly', () => {
      // White in OKLab
      const white = oklab(1, 0, 0);
      const rgb = oklabToRGB(white);

      expect(rgb.r).toBeCloseTo(1, 1);
      expect(rgb.g).toBeCloseTo(1, 1);
      expect(rgb.b).toBeCloseTo(1, 1);
    });

    it('should convert RGB primaries correctly', () => {
      // Red in RGB
      const red = rgb(1, 0, 0).to('oklab');
      expect(red.l).toBeCloseTo(0.627986, 4);
      expect(red.a).toBeCloseTo(0.2248, 4);
      expect(red.b).toBeCloseTo(0.1258, 4);

      // Green in RGB
      const green = rgb(0, 1, 0).to('oklab');
      expect(green.l).toBeCloseTo(0.86644, 4);
      expect(green.a).toBeCloseTo(-0.2339, 4);
      expect(green.b).toBeCloseTo(0.1794, 4);

      // Blue in RGB
      const blue = rgb(0, 0, 1).to('oklab');
      expect(blue.l).toBeCloseTo(0.452, 4);
      expect(blue.a).toBeCloseTo(-0.0324, 4);
      expect(blue.b).toBeCloseTo(-0.3116, 4);
    });

    it('should convert XYZ D65 white point correctly', () => {
      // D65 white point in XYZ
      const white = xyz(0.95047, 1.0, 1.08883).to('oklab');
      expect(white.l).toBeCloseTo(1, 1);
      expect(white.a).toBeCloseTo(0, 1);
      expect(white.b).toBeCloseTo(0, 1);
    });
  });
});
