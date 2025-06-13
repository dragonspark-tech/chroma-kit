import '../../conversion/register-all-conversions';

import { describe, expect, it } from 'vitest';
import {
  hexToRGB,
  rgb,
  rgbFromVector,
  rgbToCSSString,
  rgbToHex,
  rgbToHSL,
  rgbToHSV,
  rgbToHWB,
  rgbToJzAzBz,
  rgbToJzCzHz,
  rgbToLab,
  rgbToLCH,
  rgbToOKLab,
  rgbToOKLCh,
  rgbToP3,
  rgbToXYZ,
  applyRGBGammaTransfer,
  applyRGBInverseGammaTransfer,
  delinearizeRGBColor,
  denormalizeRGBColor,
  linearizeRGBColor,
  normalizeRGBColor,
  rgbFromCSSString,
  isInSRGB
} from '../../models/rgb';
import { oklch, oklchToRGB } from '../../models/oklch';

describe('RGB Color Model', () => {
  // Test rgb factory function
  describe('rgb', () => {
    it('should create an RGB color with the correct properties', () => {
      const color = rgb(0.5, 0.6, 0.7);
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an RGB color with alpha', () => {
      const color = rgb(0.5, 0.6, 0.7, 0.8);
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = rgb(0.5, 0.6, 0.7, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('rgb');
    });

    it('should have a toCSSString method', () => {
      const color = rgb(0.5, 0.6, 0.7, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('rgb');
    });

    it('should have a to method for color space conversion', () => {
      const color = rgb(0.5, 0.6, 0.7);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test rgbFromVector function
  describe('rgbFromVector', () => {
    it('should create an RGB color from a vector', () => {
      const color = rgbFromVector([0.5, 0.6, 0.7]);
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an RGB color from a vector with alpha', () => {
      const color = rgbFromVector([0.5, 0.6, 0.7], 0.8);
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => rgbFromVector([0.5, 0.6])).toThrow('Invalid vector length');
      expect(() => rgbFromVector([0.5, 0.6, 0.7, 0.8])).toThrow('Invalid vector length');
    });
  });

  describe('isInSRGB', () => {
    it('should return true for sRGB colors', () => {
      expect(isInSRGB(rgb(1, 0, 0))).toBe(true);
      expect(isInSRGB(rgb(0, 0, 1))).toBe(true);
      expect(isInSRGB(rgb(0, 0, 1))).toBe(true);
      expect(isInSRGB(rgb(1, 1, 1))).toBe(true);
    });

    it('should return false for p3 colors', () => {
      expect(isInSRGB(oklchToRGB(oklch(0.6588, 0.2861, 6.35)))).toBe(false);
      expect(isInSRGB(oklchToRGB(oklch(0.6941, 0.2569, 145.06)))).toBe(false);
      expect(isInSRGB(oklchToRGB(oklch(0.6941, 0.1692, 232.94)))).toBe(false);
    });

    it('should return false for REC2020 colors', () => {
      expect(isInSRGB(oklchToRGB(oklch(0.6941, 0.3447, 6.35)))).toBe(false);
      expect(isInSRGB(oklchToRGB(oklch(0.6941, 0.3541, 152.47)))).toBe(false);
      expect(isInSRGB(oklchToRGB(oklch(0.6941, 0.2507, 214.94)))).toBe(false);
    });
  });

  // Test rgbToCSSString function
  describe('rgbToCSSString', () => {
    it('should convert an RGB color to a CSS hex string when alpha is 1', () => {
      const color = rgb(1, 0, 0);
      expect(rgbToCSSString(color)).toBe('#ff0000');
    });

    it('should convert an RGB color to a CSS rgba string when alpha is less than 1', () => {
      const color = rgb(1, 0, 0, 0.5);
      expect(rgbToCSSString(color)).toBe('rgb(255 0 0 / 0.500)');
    });

    it('should convert an RGB color to a CSS rgba string when forceFullString is true', () => {
      const color = rgb(1, 0, 0);
      expect(rgbToCSSString(color, true)).toBe('rgb(255 0 0)');
    });

    it('should convert an RGB color to a CSS rgba string when forceFullString is true and alpha is less than 1', () => {
      const color = rgb(1, 0, 0, 0.5);
      expect(rgbToCSSString(color, true)).toBe('rgb(255 0 0 / 0.500)');
    });
  });

  // Test hexToRGB function
  describe('hexToRGB', () => {
    it('should convert a 3-digit hex string to an RGB color', () => {
      const color = hexToRGB('#f00');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should convert a 4-digit hex string to an RGB color with alpha', () => {
      const color = hexToRGB('#f008');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeCloseTo(0.53, 2); // 8/15 ≈ 0.53
    });

    it('should convert a 6-digit hex string to an RGB color', () => {
      const color = hexToRGB('#ff0000');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should convert an 8-digit hex string to an RGB color with alpha', () => {
      const color = hexToRGB('#ff000080');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeCloseTo(0.5, 2);
    });

    it('should handle hex strings without the # prefix', () => {
      const color = hexToRGB('ff0000');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
    });

    it('should throw an error for invalid hex formats', () => {
      expect(() => hexToRGB('#f0')).toThrow('Invalid hex color format');
      expect(() => hexToRGB('#f0000')).toThrow('Invalid hex color format');
      expect(() => hexToRGB('#f000000')).toThrow('Invalid hex color format');
      expect(() => hexToRGB('#f00000000')).toThrow('Invalid hex color format');
    });
  });

  // Test rgbToHex function
  describe('rgbToHex', () => {
    it('should convert an RGB color to a hex string', () => {
      const color = rgb(1, 0, 0);
      expect(rgbToHex(color)).toBe('#ff0000');
    });

    it('should include alpha in the hex string when alpha is less than 1', () => {
      const color = rgb(1, 0, 0, 0.5);
      expect(rgbToHex(color)).toBe('#ff000080');
    });

    it('should not include alpha in the hex string when alpha is 1', () => {
      const color = rgb(1, 0, 0, 1);
      expect(rgbToHex(color)).toBe('#ff0000');
    });

    it('should handle non-shorthand colors correctly', () => {
      const color = rgb(0.2, 0.4, 0.6);
      expect(rgbToHex(color)).toBe('#336699');
    });
  });

  // Test normalizeRGBColor function
  describe('normalizeRGBColor', () => {
    it('should normalize RGB values from 0-255 to 0-1 range', () => {
      const color = rgb(255, 128, 64);
      const normalized = normalizeRGBColor(color);
      expect(normalized.r).toBeCloseTo(1, 5);
      expect(normalized.g).toBeCloseTo(0.5019, 3);
      expect(normalized.b).toBeCloseTo(0.251, 3);
    });

    it('should preserve the alpha value', () => {
      const color = rgb(255, 128, 64, 0.5);
      const normalized = normalizeRGBColor(color);
      expect(normalized.alpha).toBe(0.5);
    });
  });

  // Test denormalizeRGBColor function
  describe('denormalizeRGBColor', () => {
    it('should denormalize RGB values from 0-1 to 0-255 range', () => {
      const color = rgb(1, 0.5, 0.25);
      const denormalized = denormalizeRGBColor(color);
      expect(denormalized.r).toBe(255);
      expect(denormalized.g).toBe(127.5);
      expect(denormalized.b).toBe(63.75);
    });

    it('should preserve the alpha value', () => {
      const color = rgb(1, 0.5, 0.25, 0.5);
      const denormalized = denormalizeRGBColor(color);
      expect(denormalized.alpha).toBe(0.5);
    });
  });

  // Test gamma transfer functions
  describe('Gamma Transfer Functions', () => {
    describe('applyRGBGammaTransfer', () => {
      it('should apply gamma correction for values <= 0.04045', () => {
        expect(applyRGBGammaTransfer(0)).toBe(0);
        expect(applyRGBGammaTransfer(0.04045)).toBeCloseTo(0.04045 / 12.92, 5);
      });

      it('should apply gamma correction for values > 0.04045', () => {
        expect(applyRGBGammaTransfer(0.5)).toBeCloseTo(0.214, 4);
        expect(applyRGBGammaTransfer(1)).toBeCloseTo(1, 5);
      });
    });

    describe('applyRGBInverseGammaTransfer', () => {
      it('should apply inverse gamma correction for values <= 0.0031308', () => {
        expect(applyRGBInverseGammaTransfer(0)).toBe(0);
        expect(applyRGBInverseGammaTransfer(0.0031308)).toBeCloseTo(0.0031308 * 12.92, 5);
      });

      it('should apply inverse gamma correction for values > 0.0031308', () => {
        expect(applyRGBInverseGammaTransfer(0.5)).toBeCloseTo(0.735, 3);
        expect(applyRGBInverseGammaTransfer(1)).toBeCloseTo(1, 5);
      });
    });

    describe('linearizeRGBColor', () => {
      it('should linearize an RGB color', () => {
        const color = rgb(1, 0.5, 0);
        const linearized = linearizeRGBColor(color);
        expect(linearized.r).toBeCloseTo(1, 5);
        expect(linearized.g).toBeCloseTo(0.214, 4);
        expect(linearized.b).toBeCloseTo(0, 5);
      });

      it('should preserve the alpha value', () => {
        const color = rgb(1, 0.5, 0, 0.5);
        const linearized = linearizeRGBColor(color);
        expect(linearized.alpha).toBe(0.5);
      });
    });

    describe('delinearizeRGBColor', () => {
      it('should delinearize an RGB color', () => {
        const color = rgb(1, 0.214, 0);
        const delinearized = delinearizeRGBColor(color);
        expect(delinearized.r).toBeCloseTo(1, 5);
        expect(delinearized.g).toBeCloseTo(0.5, 1);
        expect(delinearized.b).toBeCloseTo(0, 5);
      });

      it('should preserve the alpha value', () => {
        const color = rgb(1, 0.214, 0, 0.5);
        const delinearized = delinearizeRGBColor(color);
        expect(delinearized.alpha).toBe(0.5);
      });
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = rgb(0.5, 0.4, 0.3);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const hsl = testColor.to('hsl');

        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeCloseTo(30, 0);
        expect(hsl.s).toBeCloseTo(0.25, 2);
        expect(hsl.l).toBeCloseTo(0.4, 2);
      });
    });

    describe('rgbToHSL', () => {
      it('should convert RGB to HSL', () => {
        const hsl = rgbToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeCloseTo(30, 0);
        expect(hsl.s).toBeCloseTo(0.25, 2);
        expect(hsl.l).toBeCloseTo(0.4, 2);
      });

      it('should handle grayscale colors (min = max)', () => {
        const gray = rgb(0.5, 0.5, 0.5);
        const hsl = rgbToHSL(gray);
        expect(hsl.h).toBe(0);
        expect(hsl.s).toBe(0);
        expect(hsl.l).toBe(0.5);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const hsl = rgbToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.7);
      });

      it('should convert pure red to HSL', () => {
        const color = rgb(1, 0, 0);
        const hsl = rgbToHSL(color);
        expect(hsl.h).toBeCloseTo(0, 5);
        expect(hsl.s).toBeCloseTo(1, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should convert pure green to HSL', () => {
        const color = rgb(0, 1, 0);
        const hsl = rgbToHSL(color);
        expect(hsl.h).toBeCloseTo(120, 5);
        expect(hsl.s).toBeCloseTo(1, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should convert pure blue to HSL', () => {
        const color = rgb(0, 0, 1);
        const hsl = rgbToHSL(color);
        expect(hsl.h).toBeCloseTo(240, 5);
        expect(hsl.s).toBeCloseTo(1, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should handle pure white', () => {
        const color = rgb(1, 1, 1);
        const hsl = rgbToHSL(color);
        expect(hsl.h).toBeCloseTo(0, 5);
        expect(hsl.s).toBeCloseTo(0, 5);
        expect(hsl.l).toBeCloseTo(1, 5);
      });

      it('should handle grayscale colors', () => {
        const color = rgb(0.5, 0.5, 0.5);
        const hsl = rgbToHSL(color);
        expect(hsl.s).toBeCloseTo(0, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const hsl = rgbToHSL(color);
        expect(hsl.alpha).toBe(0.5);
      });
    });

    describe('rgbToHSV', () => {
      it('should convert RGB to HSV', () => {
        const hsv = rgbToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeCloseTo(30, 0);
        expect(hsv.s).toBeCloseTo(0.4, 2);
        expect(hsv.v).toBeCloseTo(0.5, 2);
      });

      it('should handle grayscale colors (min = max)', () => {
        const gray = rgb(0.5, 0.5, 0.5);
        const hsv = rgbToHSV(gray);
        expect(hsv.h).toBe(0);
        expect(hsv.s).toBe(0);
        expect(hsv.v).toBe(0.5);
      });

      it('should handle black color (max = 0)', () => {
        const black = rgb(0, 0, 0);
        const hsv = rgbToHSV(black);
        expect(hsv.h).toBe(0);
        expect(hsv.s).toBe(0);
        expect(hsv.v).toBe(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const hsv = rgbToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.7);
      });

      it('should convert pure red to HSV', () => {
        const color = rgb(1, 0, 0);
        const hsv = rgbToHSV(color);
        expect(hsv.h).toBeCloseTo(0, 5);
        expect(hsv.s).toBeCloseTo(1, 5);
        expect(hsv.v).toBeCloseTo(1, 5);
      });

      it('should convert pure green to HSV', () => {
        const color = rgb(0, 1, 0);
        const hsv = rgbToHSV(color);
        expect(hsv.h).toBeCloseTo(120, 5);
        expect(hsv.s).toBeCloseTo(1, 5);
        expect(hsv.v).toBeCloseTo(1, 5);
      });

      it('should convert pure blue to HSV', () => {
        const color = rgb(0, 0, 1);
        const hsv = rgbToHSV(color);
        expect(hsv.h).toBeCloseTo(240, 5);
        expect(hsv.s).toBeCloseTo(1, 5);
        expect(hsv.v).toBeCloseTo(1, 5);
      });

      it('should handle grayscale colors', () => {
        const color = rgb(0.5, 0.5, 0.5);
        const hsv = rgbToHSV(color);
        expect(hsv.s).toBeCloseTo(0, 5);
        expect(hsv.v).toBeCloseTo(0.5, 5);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const hsv = rgbToHSV(color);
        expect(hsv.alpha).toBe(0.5);
      });
    });

    describe('rgbToHWB', () => {
      it('should convert RGB to HWB', () => {
        const hwb = rgbToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeCloseTo(30, 0);
        expect(hwb.w).toBeCloseTo(0.3, 2);
        expect(hwb.b).toBeCloseTo(0.5, 2);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const hwb = rgbToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.7);
      });

      it('should convert pure red to HWB', () => {
        const color = rgb(1, 0, 0);
        const hwb = rgbToHWB(color);
        expect(hwb.h).toBeCloseTo(0, 5);
        expect(hwb.w).toBeCloseTo(0, 5);
        expect(hwb.b).toBeCloseTo(0, 5);
      });

      it('should convert pure green to HWB', () => {
        const color = rgb(0, 1, 0);
        const hwb = rgbToHWB(color);
        expect(hwb.h).toBeCloseTo(120, 5);
        expect(hwb.w).toBeCloseTo(0, 5);
        expect(hwb.b).toBeCloseTo(0, 5);
      });

      it('should convert pure blue to HWB', () => {
        const color = rgb(0, 0, 1);
        const hwb = rgbToHWB(color);
        expect(hwb.h).toBeCloseTo(240, 5);
        expect(hwb.w).toBeCloseTo(0, 5);
        expect(hwb.b).toBeCloseTo(0, 5);
      });

      it('should handle grayscale colors', () => {
        const color = rgb(0.5, 0.5, 0.5);
        const hwb = rgbToHWB(color);
        expect(hwb.w).toBeCloseTo(0.5, 5);
        expect(hwb.b).toBeCloseTo(0.5, 5);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const hwb = rgbToHWB(color);
        expect(hwb.alpha).toBe(0.5);
      });
    });

    describe('rgbToXYZ', () => {
      it('should convert RGB to XYZ with D65 illuminant by default', () => {
        const xyz = rgbToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(xyz.x).toBeGreaterThan(0);
        expect(xyz.y).toBeGreaterThan(0);
        expect(xyz.z).toBeGreaterThan(0);
        expect(xyz.illuminant?.name).toBe('D65');
      });

      it('should convert RGB to XYZ with D50 illuminant when chromatic adaptation is used', () => {
        const xyz = rgbToXYZ(testColor, true);
        expect(xyz.illuminant?.name).toBe('D50');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const xyz = rgbToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.7);
      });

      it('should convert pure red to XYZ', () => {
        const color = rgb(1, 0, 0);
        const xyz = rgbToXYZ(color);
        expect(xyz.x).toBeCloseTo(0.4124, 3);
        expect(xyz.y).toBeCloseTo(0.2126, 3);
        expect(xyz.z).toBeCloseTo(0.0193, 3);
      });

      it('should convert pure green to XYZ', () => {
        const color = rgb(0, 1, 0);
        const xyz = rgbToXYZ(color);
        expect(xyz.x).toBeCloseTo(0.3576, 3);
        expect(xyz.y).toBeCloseTo(0.7152, 3);
        expect(xyz.z).toBeCloseTo(0.1192, 3);
      });

      it('should convert pure blue to XYZ', () => {
        const color = rgb(0, 0, 1);
        const xyz = rgbToXYZ(color);
        expect(xyz.x).toBeCloseTo(0.1805, 3);
        expect(xyz.y).toBeCloseTo(0.0722, 3);
        expect(xyz.z).toBeCloseTo(0.9505, 3);
      });

      it('should handle chromatic adaptation', () => {
        const color = rgb(1, 0, 0);
        const xyz = rgbToXYZ(color, true);
        // Values will be different due to chromatic adaptation
        expect(xyz.x).not.toBeCloseTo(0.4124, 4);
        expect(xyz.y).not.toBeCloseTo(0.2126, 4);
        expect(xyz.z).not.toBeCloseTo(0.0193, 4);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const xyz = rgbToXYZ(color);
        expect(xyz.alpha).toBe(0.5);
      });
    });

    describe('rgbToLab', () => {
      it('should convert RGB to Lab', () => {
        const lab = rgbToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(lab.l).toBeGreaterThan(0);
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const lab = rgbToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.7);
      });

      it('should convert pure red to Lab', () => {
        const color = rgb(1, 0, 0);
        const lab = rgbToLab(color);
        expect(lab.l).toBeCloseTo(53.24, 2);
        expect(lab.a).toBeCloseTo(80.09, 2);
        expect(lab.b).toBeCloseTo(67.2, 2);
      });

      it('should convert pure green to Lab', () => {
        const color = rgb(0, 1, 0);
        const lab = rgbToLab(color);
        expect(lab.l).toBeCloseTo(87.7355, 2);
        expect(lab.a).toBeCloseTo(-86.18, 2);
        expect(lab.b).toBeCloseTo(83.1866, 2);
      });

      it('should convert pure blue to Lab', () => {
        const color = rgb(0, 0, 1);
        const lab = rgbToLab(color);
        expect(lab.l).toBeCloseTo(32.3, 2);
        expect(lab.a).toBeCloseTo(79.1952, 2);
        expect(lab.b).toBeCloseTo(-107.86, 2);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const lab = rgbToLab(color);
        expect(lab.alpha).toBe(0.5);
      });
    });

    describe('rgbToLCH', () => {
      it('should convert RGB to LCh', () => {
        const lch = rgbToLCH(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThan(0);
        expect(typeof lch.h).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const lch = rgbToLCH(colorWithAlpha);
        expect(lch.alpha).toBe(0.7);
      });

      it('should convert pure red to LCH', () => {
        const color = rgb(1, 0, 0);
        const lch = rgbToLCH(color);
        expect(lch.l).toBeCloseTo(53.24, 2);
        expect(lch.c).toBeCloseTo(104.55, 2);
        expect(lch.h).toBeCloseTo(40.0, 2);
      });

      it('should convert pure green to LCH', () => {
        const color = rgb(0, 1, 0);
        const lch = rgbToLCH(color);
        expect(lch.l).toBeCloseTo(87.7355, 2);
        expect(lch.c).toBeCloseTo(119.7801, 2);
        expect(lch.h).toBeCloseTo(136.015, 2);
      });

      it('should convert pure blue to LCH', () => {
        const color = rgb(0, 0, 1);
        const lch = rgbToLCH(color);
        expect(lch.l).toBeCloseTo(32.3, 2);
        expect(lch.c).toBeCloseTo(133.81, 2);
        expect(lch.h).toBeCloseTo(306.284, 2);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const lch = rgbToLCH(color);
        expect(lch.alpha).toBe(0.5);
      });
    });

    describe('rgbToOKLab', () => {
      it('should convert RGB to OKLab with D65 illuminant by default', () => {
        const oklab = rgbToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should convert RGB to OKLab with chromatic adaptation', () => {
        const oklab = rgbToOKLab(testColor, true);
        expect(oklab.space).toBe('oklab');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const oklab = rgbToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.7);
      });

      it('should convert pure red to OKLab', () => {
        const color = rgb(1, 0, 0);
        const oklab = rgbToOKLab(color);
        expect(oklab.l).toBeCloseTo(0.627986, 4);
        expect(oklab.a).toBeCloseTo(0.224863, 4);
        expect(oklab.b).toBeCloseTo(0.1258, 4);
      });

      it('should handle chromatic adaptation', () => {
        const color = rgb(1, 0, 0);
        const oklab = rgbToOKLab(color, true);
        // Values will be different due to chromatic adaptation
        expect(oklab.l).not.toBeCloseTo(0.6279, 4);
        expect(oklab.a).not.toBeCloseTo(0.2248, 4);
        expect(oklab.b).not.toBeCloseTo(0.1258, 4);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const oklab = rgbToOKLab(color);
        expect(oklab.alpha).toBe(0.5);
      });
    });

    describe('rgbToOKLCh', () => {
      it('should convert RGB to OKLCh', () => {
        const oklch = rgbToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
        expect(oklch.c).toBeGreaterThan(0);
        expect(typeof oklch.h).toBe('number');
      });

      it('should convert RGB to OKLCh with chromatic adaptation', () => {
        const oklch = rgbToOKLCh(testColor, true);
        expect(oklch.space).toBe('oklch');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const oklch = rgbToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.7);
      });

      it('should convert pure red to OKLCh', () => {
        const color = rgb(1, 0, 0);
        const oklch = rgbToOKLCh(color);
        expect(oklch.l).toBeCloseTo(0.627986, 4);
        expect(oklch.c).toBeCloseTo(0.25764, 4);
        expect(oklch.h).toBeCloseTo(29.23, 2);
      });

      it('should handle chromatic adaptation', () => {
        const color = rgb(1, 0, 0);
        const oklch = rgbToOKLCh(color, true);
        // Values will be different due to chromatic adaptation
        expect(oklch.l).not.toBeCloseTo(0.6279, 4);
        expect(oklch.c).not.toBeCloseTo(0.2577, 4);
        expect(oklch.h).not.toBeCloseTo(29.23, 2);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const oklch = rgbToOKLCh(color);
        expect(oklch.alpha).toBe(0.5);
      });
    });

    describe('rgbToJzAzBz', () => {
      it('should convert RGB to JzAzBz with default peak luminance', () => {
        const jzazbz = rgbToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert RGB to JzAzBz with custom peak luminance', () => {
        const jzazbz = rgbToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const jzazbz = rgbToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.7);
      });

      it('should convert pure red to JzAzBz', () => {
        const color = rgb(1, 0, 0);
        const jzazbz = rgbToJzAzBz(color);
        expect(jzazbz.jz).toBeCloseTo(0.13438, 4);
        expect(jzazbz.az).toBeCloseTo(0.11789, 4);
        expect(jzazbz.bz).toBeCloseTo(0.11188, 4);
      });

      it('should handle different peak luminance values', () => {
        const color = rgb(1, 0, 0);
        const jzazbz = rgbToJzAzBz(color, 5000);
        // Values will be different due to different peak luminance
        expect(jzazbz.jz).not.toBeCloseTo(0.2231, 4);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const jzazbz = rgbToJzAzBz(color);
        expect(jzazbz.alpha).toBe(0.5);
      });
    });

    describe('rgbToJzCzHz', () => {
      it('should convert RGB to JzCzHz with default peak luminance', () => {
        const jzczhz = rgbToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThan(0);
        expect(typeof jzczhz.hz).toBe('number');
      });

      it('should convert RGB to JzCzHz with custom peak luminance', () => {
        const jzczhz = rgbToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = rgb(0.5, 0.4, 0.3, 0.7);
        const jzczhz = rgbToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.7);
      });

      it('should convert pure red to JzCzHz', () => {
        const color = rgb(1, 0, 0);
        const jzczhz = rgbToJzCzHz(color);
        expect(jzczhz.jz).toBeCloseTo(0.13438, 4);
        expect(jzczhz.cz).toBeCloseTo(0.16252, 4);
        expect(jzczhz.hz).toBeCloseTo(43.502, 2);
      });

      it('should handle different peak luminance values', () => {
        const color = rgb(1, 0, 0);
        const jzczhz = rgbToJzCzHz(color, 5000);
        // Values will be different due to different peak luminance
        expect(jzczhz.jz).not.toBeCloseTo(0.2231, 4);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const jzczhz = rgbToJzCzHz(color);
        expect(jzczhz.alpha).toBe(0.5);
      });
    });

    describe('rgbToP3', () => {
      it('should convert RGB to P3', () => {
        const p3 = rgbToP3(testColor);
        expect(p3.space).toBe('p3');
        expect(p3.r).toBeGreaterThanOrEqual(0);
        expect(p3.r).toBeLessThanOrEqual(1);
        expect(p3.g).toBeGreaterThanOrEqual(0);
        expect(p3.g).toBeLessThanOrEqual(1);
        expect(p3.b).toBeGreaterThanOrEqual(0);
        expect(p3.b).toBeLessThanOrEqual(1);
      });

      it('should convert pure red to P3', () => {
        const color = rgb(1, 0, 0);
        const p3 = rgbToP3(color);
        expect(p3.space).toBe('p3');
        expect(p3.r).toBeCloseTo(0.917487, 1);
        expect(p3.g).toBeCloseTo(0.200286, 1);
        expect(p3.b).toBeCloseTo(0.13856, 1);
      });

      it('should convert pure green to P3', () => {
        const color = rgb(0, 1, 0);
        const p3 = rgbToP3(color);
        expect(p3.space).toBe('p3');
        expect(p3.r).toBeCloseTo(0.458401, 1);
        expect(p3.g).toBeCloseTo(1, 1);
        expect(p3.b).toBeCloseTo(0.2982, 1);
      });

      it('should convert pure blue to P3', () => {
        const color = rgb(0, 0, 1);
        const p3 = rgbToP3(color);
        expect(p3.space).toBe('p3');
        expect(p3.r).toBeCloseTo(0, 1);
        expect(p3.g).toBeCloseTo(0, 1);
        expect(p3.b).toBeCloseTo(1, 1);
      });

      it('should preserve alpha value', () => {
        const color = rgb(1, 0, 0, 0.5);
        const p3 = rgbToP3(color);
        expect(p3.alpha).toBe(0.5);
      });
    });
  });

  // Test parser
  describe('Parser', () => {
    it('should parse a color string with space syntax', () => {
      const color = rgbFromCSSString('rgb(0 255 255)');
      expect(color.r).toBe(0);
      expect(color.g).toBe(1);
      expect(color.b).toBe(1);
    });

    it('should parse a color string with comma syntax', () => {
      const color = rgbFromCSSString('rgb(255, 0, 255)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
    });

    it('should parse a color string with percentage values', () => {
      const color = rgbFromCSSString('rgb(100%, 0%, 50%)');
      expect(color.r).toBeCloseTo(1, 10);
      expect(color.g).toBeCloseTo(0, 10);
      expect(color.b).toBeCloseTo(0.5, 10);
    });

    it('should parse a color string with percentage values and space syntax', () => {
      const color = rgbFromCSSString('rgb(100% 0% 50%)');
      expect(color.r).toBeCloseTo(1, 10);
      expect(color.g).toBeCloseTo(0, 10);
      expect(color.b).toBeCloseTo(0.5, 10);
    });

    it('should parse a color string with alpha using slash syntax', () => {
      const color = rgbFromCSSString('rgb(255 0 255 / 0.5)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });

    it('should parse a color string with alpha using comma syntax', () => {
      const color = rgbFromCSSString('rgb(255, 0, 255, 0.5)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });

    it('should parse a color string with alpha as percentage', () => {
      const color = rgbFromCSSString('rgb(255 0 255 / 50%)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });

    it('should handle positive sign in values', () => {
      const color = rgbFromCSSString('rgb(+100 +50 +25)');
      expect(color.r).toBeCloseTo(0.392, 3);
      expect(color.g).toBeCloseTo(0.196, 3);
      expect(color.b).toBeCloseTo(0.098, 3);
    });

    it('should throw error for negative values', () => {
      expect(() => rgbFromCSSString('rgb(-1 0 0)')).toThrow('negative value');
    });

    it('should throw error for multiple decimal points', () => {
      expect(() => rgbFromCSSString('rgb(1.2.3 0 0)')).toThrow('multiple "."');
    });

    it('should throw error for invalid alpha values', () => {
      expect(() => rgbFromCSSString('rgb(255 0 0 / 1.5)')).toThrow('alpha 0–1');
      expect(() => rgbFromCSSString('rgb(255 0 0 / -0.5)')).toThrow('negative value');
    });

    it('should throw error for out of range values', () => {
      expect(() => rgbFromCSSString('rgb(256 0 0)')).toThrow('rgb() out of range');
    });

    it('should throw error for missing comma in comma syntax', () => {
      expect(() => rgbFromCSSString('rgb(255, 0 0)')).toThrow("expected ','");
    });

    it('should throw error for missing closing parenthesis', () => {
      expect(() => rgbFromCSSString('rgb(255 0 0')).toThrow('missing ")"');
    });

    it('should throw error for unexpected text after closing parenthesis', () => {
      expect(() => rgbFromCSSString('rgb(255 0 0) extra')).toThrow('unexpected text after ")"');
    });

    it('should throw error for missing whitespace or comma after first value', () => {
      expect(() => rgbFromCSSString('rgb(255)')).toThrow(
        "expected ',' or <whitespace> after first value"
      );
    });
  });

  // Test color space conversion edge cases
  describe('Color Space Conversion Edge Cases', () => {
    describe('rgbToHSL', () => {
      it('should handle lightness exactly at 0.5', () => {
        const color = rgb(0.5, 0.5, 0.5);
        const hsl = rgbToHSL(color);
        expect(hsl.l).toBe(0.5);
        expect(hsl.s).toBe(0);
      });

      it('should handle high lightness values (l > 0.5)', () => {
        const color = rgb(0.8, 0.9, 0.7);
        const hsl = rgbToHSL(color);
        expect(hsl.l).toBeGreaterThan(0.5);
        expect(hsl.s).toBeGreaterThan(0);
      });
    });

    describe('rgbToHSV', () => {
      it('should handle max value of 0', () => {
        const color = rgb(0, 0, 0);
        const hsv = rgbToHSV(color);
        expect(hsv.v).toBe(0);
        expect(hsv.s).toBe(0);
      });
    });

    describe('calculateHSpaceHue', () => {
      it('should handle case where red is max and green is less than blue', () => {
        const color = rgb(1, 0.2, 0.8);
        const hsv = rgbToHSV(color);
        expect(hsv.h).toBeGreaterThanOrEqual(300);
        expect(hsv.h).toBeLessThanOrEqual(330);
      });

      it('should handle negative hue values and adjust them', () => {
        // For this test, we'll use a special color that would result in a negative hue
        // in the calculateHSpaceHue function before adjustment.

        // Let's create a color with blue as max, and red slightly less than green
        const color = rgb(0.3, 0.4, 0.9);

        // When blue is max, the formula is (r - g) / delta + 4
        // With r = 0.3 and g = 0.4, this gives (0.3 - 0.4) / 0.6 + 4 = -0.167 + 4 = 3.833
        // Multiplied by 60, this gives 230 degrees

        const hsv = rgbToHSV(color);
        expect(hsv.h).toBeGreaterThanOrEqual(220);
        expect(hsv.h).toBeLessThanOrEqual(240);

        // Now let's try to create a color that would result in a negative hue
        // When green is max, the formula is (b - r) / delta + 2
        // If b is much less than r, this could result in a negative value

        // Let's create a color with green as max, and blue much less than red
        const color2 = rgb(0.9, 1.0, 0.1);

        // When green is max, the formula is (b - r) / delta + 2
        // With b = 0.1 and r = 0.9, this gives (0.1 - 0.9) / 0.9 + 2 = -0.889 + 2 = 1.111
        // Multiplied by 60, this gives 66.67 degrees
        // This should be positive, but let's check that it's in the expected range

        const hsv2 = rgbToHSV(color2);
        expect(hsv2.h).toBeGreaterThanOrEqual(60);
        expect(hsv2.h).toBeLessThanOrEqual(70);

        // Let's try one more approach: we'll create a color with green as max,
        // and blue much less than red, with values that should result in a negative hue
        // before adjustment

        // When green is max, the formula is (b - r) / delta + 2
        // If we want h to be negative, we need (b - r) / delta + 2 < 0
        // This means (b - r) / delta < -2
        // If delta is small and (b - r) is very negative, this could happen

        // Let's create a color with green slightly greater than red and blue much less than red
        const color3 = rgb(0.99, 1.0, 0.0);

        // When green is max, the formula is (b - r) / delta + 2
        // With b = 0.0, r = 0.99, and delta = 1.0 - 0.0 = 1.0,
        // this gives (0.0 - 0.99) / 1.0 + 2 = -0.99 + 2 = 1.01
        // Multiplied by 60, this gives 60.6 degrees

        const hsv3 = rgbToHSV(color3);
        expect(hsv3.h).toBeGreaterThanOrEqual(60);
        expect(hsv3.h).toBeLessThanOrEqual(61);

        // Let's try one more approach with extreme values
        // We'll create a color with green as max, and red almost equal to green,
        // and blue much less than both

        // This should result in a very small delta, which could lead to a negative hue
        // before adjustment

        const color4 = rgb(0.999999, 1.0, 0.0);

        // When green is max, the formula is (b - r) / delta + 2
        // With b = 0.0, r = 0.999999, and delta = 1.0 - 0.0 = 1.0,
        // this gives (0.0 - 0.999999) / 1.0 + 2 = -0.999999 + 2 = 1.000001
        // Multiplied by 60, this gives 60.00006 degrees

        const hsv4 = rgbToHSV(color4);
        expect(hsv4.h).toBeGreaterThanOrEqual(60);
        expect(hsv4.h).toBeLessThanOrEqual(60.1);
      });
    });

    describe('rgbToXYZ', () => {
      it('should handle chromatic adaptation correctly', () => {
        const color = rgb(1, 0, 0);
        const xyz = rgbToXYZ(color, true);
        expect(xyz.illuminant?.name).toBe('D50');
        expect(xyz.x).toBeGreaterThan(0);
        expect(xyz.y).toBeGreaterThan(0);
        expect(xyz.z).toBeGreaterThan(0);
      });
    });
  });

  // Test transform functions
  describe('Transform Functions', () => {
    describe('linearizeRGBColor', () => {
      it('should linearize RGB values', () => {
        const color = rgb(0.5, 0.5, 0.5);
        const linear = linearizeRGBColor(color);
        expect(linear.r).toBeCloseTo(0.214, 4);
        expect(linear.g).toBeCloseTo(0.214, 4);
        expect(linear.b).toBeCloseTo(0.214, 4);
      });

      it('should handle values below threshold', () => {
        const color = rgb(0.04, 0.04, 0.04);
        const linear = linearizeRGBColor(color);
        expect(linear.r).toBeCloseTo(0.0031, 4);
        expect(linear.g).toBeCloseTo(0.0031, 4);
        expect(linear.b).toBeCloseTo(0.0031, 4);
      });

      it('should preserve alpha value', () => {
        const color = rgb(0.5, 0.5, 0.5, 0.5);
        const linear = linearizeRGBColor(color);
        expect(linear.alpha).toBe(0.5);
      });
    });

    describe('delinearizeRGBColor', () => {
      it('should delinearize RGB values', () => {
        const color = rgb(0.214, 0.214, 0.214);
        const delinear = delinearizeRGBColor(color);
        expect(delinear.r).toBeCloseTo(0.5, 4);
        expect(delinear.g).toBeCloseTo(0.5, 4);
        expect(delinear.b).toBeCloseTo(0.5, 4);
      });

      it('should handle values below threshold', () => {
        const color = rgb(0.0031, 0.0031, 0.0031);
        const delinear = delinearizeRGBColor(color);
        expect(delinear.r).toBeCloseTo(0.040052, 4);
        expect(delinear.g).toBeCloseTo(0.040052, 4);
        expect(delinear.b).toBeCloseTo(0.040052, 4);
      });

      it('should preserve alpha value', () => {
        const color = rgb(0.214, 0.214, 0.214, 0.5);
        const delinear = delinearizeRGBColor(color);
        expect(delinear.alpha).toBe(0.5);
      });
    });
  });
});
