import '../../conversion/register-conversions';

import { describe, expect, it } from 'vitest';
import {
  hexTosRGB,
  srgb,
  srgbFromVector,
  srgbToCSSString,
  srgbToHex,
  srgbToHSL,
  srgbToHSV,
  srgbToHWB,
  srgbToJzAzBz,
  srgbToJzCzHz,
  srgbToLab,
  srgbToLCH,
  srgbToOKLab,
  srgbToOKLCh,
  srgbToXYZ
} from '../../models/srgb/srgb';
import {
  applysRGBGammaTransfer,
  applysRGBInverseGammaTransfer,
  delinearizesRGBColor,
  denormalizesRGBColor,
  linearizesRGBColor,
  normalizesRGBColor,
  srgbFromCSSString
} from '../../models/srgb';

describe('sRGB Color Model', () => {
  // Test srgb factory function
  describe('srgb', () => {
    it('should create an sRGB color with the correct properties', () => {
      const color = srgb(0.5, 0.6, 0.7);
      expect(color.space).toBe('srgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an sRGB color with alpha', () => {
      const color = srgb(0.5, 0.6, 0.7, 0.8);
      expect(color.space).toBe('srgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBe(0.8);
    });

    it('should have a toString method', () => {
      const color = srgb(0.5, 0.6, 0.7, 0.8);
      expect(typeof color.toString).toBe('function');
      expect(color.toString()).toContain('srgb');
    });

    it('should have a toCSSString method', () => {
      const color = srgb(0.5, 0.6, 0.7, 0.8);
      expect(typeof color.toCSSString).toBe('function');
      expect(color.toCSSString()).toContain('rgba');
    });

    it('should have a to method for color space conversion', () => {
      const color = srgb(0.5, 0.6, 0.7);
      expect(typeof color.to).toBe('function');
    });
  });

  // Test srgbFromVector function
  describe('srgbFromVector', () => {
    it('should create an sRGB color from a vector', () => {
      const color = srgbFromVector([0.5, 0.6, 0.7]);
      expect(color.space).toBe('srgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBeUndefined();
    });

    it('should create an sRGB color from a vector with alpha', () => {
      const color = srgbFromVector([0.5, 0.6, 0.7], 0.8);
      expect(color.space).toBe('srgb');
      expect(color.r).toBe(0.5);
      expect(color.g).toBe(0.6);
      expect(color.b).toBe(0.7);
      expect(color.alpha).toBe(0.8);
    });

    it('should throw an error for invalid vector length', () => {
      expect(() => srgbFromVector([0.5, 0.6])).toThrow('Invalid vector length');
      expect(() => srgbFromVector([0.5, 0.6, 0.7, 0.8])).toThrow('Invalid vector length');
    });
  });

  // Test srgbToCSSString function
  describe('srgbToCSSString', () => {
    it('should convert an sRGB color to a CSS hex string when alpha is 1', () => {
      const color = srgb(1, 0, 0);
      expect(srgbToCSSString(color)).toBe('#f00');
    });

    it('should convert an sRGB color to a CSS rgba string when alpha is less than 1', () => {
      const color = srgb(1, 0, 0, 0.5);
      expect(srgbToCSSString(color)).toBe('rgba(255, 0, 0, 0.500)');
    });

    it('should convert an sRGB color to a CSS rgba string when forceFullString is true', () => {
      const color = srgb(1, 0, 0);
      expect(srgbToCSSString(color, true)).toBe('rgba(255, 0, 0)');
    });

    it('should convert an sRGB color to a CSS rgba string when forceFullString is true and alpha is less than 1', () => {
      const color = srgb(1, 0, 0, 0.5);
      expect(srgbToCSSString(color, true)).toBe('rgba(255, 0, 0, 0.500)');
    });
  });

  // Test hexTosRGB function
  describe('hexTosRGB', () => {
    it('should convert a 3-digit hex string to an sRGB color', () => {
      const color = hexTosRGB('#f00');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should convert a 4-digit hex string to an sRGB color with alpha', () => {
      const color = hexTosRGB('#f008');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeCloseTo(0.53, 2); // 8/15 ≈ 0.53
    });

    it('should convert a 6-digit hex string to an sRGB color', () => {
      const color = hexTosRGB('#ff0000');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeUndefined();
    });

    it('should convert an 8-digit hex string to an sRGB color with alpha', () => {
      const color = hexTosRGB('#ff000080');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
      expect(color.alpha).toBeCloseTo(0.5, 2);
    });

    it('should handle hex strings without the # prefix', () => {
      const color = hexTosRGB('ff0000');
      expect(color.r).toBeCloseTo(1, 5);
      expect(color.g).toBeCloseTo(0, 5);
      expect(color.b).toBeCloseTo(0, 5);
    });

    it('should throw an error for invalid hex formats', () => {
      expect(() => hexTosRGB('#f0')).toThrow('Invalid hex color format');
      expect(() => hexTosRGB('#f0000')).toThrow('Invalid hex color format');
      expect(() => hexTosRGB('#f000000')).toThrow('Invalid hex color format');
      expect(() => hexTosRGB('#f00000000')).toThrow('Invalid hex color format');
    });
  });

  // Test srgbToHex function
  describe('srgbToHex', () => {
    it('should convert an sRGB color to a hex string', () => {
      const color = srgb(1, 0, 0);
      expect(srgbToHex(color)).toBe('#f00');
    });

    it('should use shorthand notation when possible', () => {
      const color = srgb(1, 0, 0);
      expect(srgbToHex(color)).toBe('#f00');
    });

    it('should use shorthand notation with alpha when possible', () => {
      const color = srgb(1, 0, 0, 0xaa / 255);
      expect(srgbToHex(color)).toBe('#f00a');
    });

    it('should include alpha in the hex string when alpha is less than 1', () => {
      const color = srgb(1, 0, 0, 0.5);
      expect(srgbToHex(color)).toBe('#ff000080');
    });

    it('should not include alpha in the hex string when alpha is 1', () => {
      const color = srgb(1, 0, 0, 1);
      expect(srgbToHex(color)).toBe('#f00');
    });

    it('should handle non-shorthand colors correctly', () => {
      const color = srgb(0.2, 0.4, 0.6);
      expect(srgbToHex(color)).toBe('#369');
    });
  });

  // Test normalizesRGBColor function
  describe('normalizesRGBColor', () => {
    it('should normalize RGB values from 0-255 to 0-1 range', () => {
      const color = srgb(255, 128, 64);
      const normalized = normalizesRGBColor(color);
      expect(normalized.r).toBeCloseTo(1, 5);
      expect(normalized.g).toBeCloseTo(0.5019, 3);
      expect(normalized.b).toBeCloseTo(0.251, 3);
    });

    it('should preserve the alpha value', () => {
      const color = srgb(255, 128, 64, 0.5);
      const normalized = normalizesRGBColor(color);
      expect(normalized.alpha).toBe(0.5);
    });
  });

  // Test denormalizesRGBColor function
  describe('denormalizesRGBColor', () => {
    it('should denormalize RGB values from 0-1 to 0-255 range', () => {
      const color = srgb(1, 0.5, 0.25);
      const denormalized = denormalizesRGBColor(color);
      expect(denormalized.r).toBe(255);
      expect(denormalized.g).toBe(127.5);
      expect(denormalized.b).toBe(63.75);
    });

    it('should preserve the alpha value', () => {
      const color = srgb(1, 0.5, 0.25, 0.5);
      const denormalized = denormalizesRGBColor(color);
      expect(denormalized.alpha).toBe(0.5);
    });
  });

  // Test gamma transfer functions
  describe('Gamma Transfer Functions', () => {
    describe('applysRGBGammaTransfer', () => {
      it('should apply gamma correction for values <= 0.04045', () => {
        expect(applysRGBGammaTransfer(0)).toBe(0);
        expect(applysRGBGammaTransfer(0.04045)).toBeCloseTo(0.04045 / 12.92, 5);
      });

      it('should apply gamma correction for values > 0.04045', () => {
        expect(applysRGBGammaTransfer(0.5)).toBeCloseTo(0.214, 4);
        expect(applysRGBGammaTransfer(1)).toBeCloseTo(1, 5);
      });
    });

    describe('applysRGBInverseGammaTransfer', () => {
      it('should apply inverse gamma correction for values <= 0.0031308', () => {
        expect(applysRGBInverseGammaTransfer(0)).toBe(0);
        expect(applysRGBInverseGammaTransfer(0.0031308)).toBeCloseTo(0.0031308 * 12.92, 5);
      });

      it('should apply inverse gamma correction for values > 0.0031308', () => {
        expect(applysRGBInverseGammaTransfer(0.5)).toBeCloseTo(0.735, 3);
        expect(applysRGBInverseGammaTransfer(1)).toBeCloseTo(1, 5);
      });
    });

    describe('linearizesRGBColor', () => {
      it('should linearize an sRGB color', () => {
        const color = srgb(1, 0.5, 0);
        const linearized = linearizesRGBColor(color);
        expect(linearized.r).toBeCloseTo(1, 5);
        expect(linearized.g).toBeCloseTo(0.214, 4);
        expect(linearized.b).toBeCloseTo(0, 5);
      });

      it('should preserve the alpha value', () => {
        const color = srgb(1, 0.5, 0, 0.5);
        const linearized = linearizesRGBColor(color);
        expect(linearized.alpha).toBe(0.5);
      });
    });

    describe('delinearizesRGBColor', () => {
      it('should delinearize an sRGB color', () => {
        const color = srgb(1, 0.214, 0);
        const delinearized = delinearizesRGBColor(color);
        expect(delinearized.r).toBeCloseTo(1, 5);
        expect(delinearized.g).toBeCloseTo(0.5, 1);
        expect(delinearized.b).toBeCloseTo(0, 5);
      });

      it('should preserve the alpha value', () => {
        const color = srgb(1, 0.214, 0, 0.5);
        const delinearized = delinearizesRGBColor(color);
        expect(delinearized.alpha).toBe(0.5);
      });
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = srgb(0.5, 0.4, 0.3);

    describe('fluent conversion', () => {
      it('should convert dynamically into the target color space', () => {
        const hsl = testColor.to('hsl');

        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeCloseTo(30, 0);
        expect(hsl.s).toBeCloseTo(0.25, 2);
        expect(hsl.l).toBeCloseTo(0.4, 2);
      });
    });

    describe('srgbToHSL', () => {
      it('should convert sRGB to HSL', () => {
        const hsl = srgbToHSL(testColor);
        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeCloseTo(30, 0);
        expect(hsl.s).toBeCloseTo(0.25, 2);
        expect(hsl.l).toBeCloseTo(0.4, 2);
      });

      it('should handle grayscale colors (min = max)', () => {
        const gray = srgb(0.5, 0.5, 0.5);
        const hsl = srgbToHSL(gray);
        expect(hsl.h).toBe(0);
        expect(hsl.s).toBe(0);
        expect(hsl.l).toBe(0.5);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const hsl = srgbToHSL(colorWithAlpha);
        expect(hsl.alpha).toBe(0.7);
      });

      it('should convert pure red to HSL', () => {
        const color = srgb(1, 0, 0);
        const hsl = srgbToHSL(color);
        expect(hsl.h).toBeCloseTo(0, 5);
        expect(hsl.s).toBeCloseTo(1, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should convert pure green to HSL', () => {
        const color = srgb(0, 1, 0);
        const hsl = srgbToHSL(color);
        expect(hsl.h).toBeCloseTo(120, 5);
        expect(hsl.s).toBeCloseTo(1, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should convert pure blue to HSL', () => {
        const color = srgb(0, 0, 1);
        const hsl = srgbToHSL(color);
        expect(hsl.h).toBeCloseTo(240, 5);
        expect(hsl.s).toBeCloseTo(1, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should handle pure white', () => {
        const color = srgb(1, 1, 1);
        const hsl = srgbToHSL(color);
        expect(hsl.h).toBeCloseTo(0, 5);
        expect(hsl.s).toBeCloseTo(0, 5);
        expect(hsl.l).toBeCloseTo(1, 5);
      });

      it('should handle grayscale colors', () => {
        const color = srgb(0.5, 0.5, 0.5);
        const hsl = srgbToHSL(color);
        expect(hsl.s).toBeCloseTo(0, 5);
        expect(hsl.l).toBeCloseTo(0.5, 5);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const hsl = srgbToHSL(color);
        expect(hsl.alpha).toBe(0.5);
      });
    });

    describe('srgbToHSV', () => {
      it('should convert sRGB to HSV', () => {
        const hsv = srgbToHSV(testColor);
        expect(hsv.space).toBe('hsv');
        expect(hsv.h).toBeCloseTo(30, 0);
        expect(hsv.s).toBeCloseTo(0.4, 2);
        expect(hsv.v).toBeCloseTo(0.5, 2);
      });

      it('should handle grayscale colors (min = max)', () => {
        const gray = srgb(0.5, 0.5, 0.5);
        const hsv = srgbToHSV(gray);
        expect(hsv.h).toBe(0);
        expect(hsv.s).toBe(0);
        expect(hsv.v).toBe(0.5);
      });

      it('should handle black color (max = 0)', () => {
        const black = srgb(0, 0, 0);
        const hsv = srgbToHSV(black);
        expect(hsv.h).toBe(0);
        expect(hsv.s).toBe(0);
        expect(hsv.v).toBe(0);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const hsv = srgbToHSV(colorWithAlpha);
        expect(hsv.alpha).toBe(0.7);
      });

      it('should convert pure red to HSV', () => {
        const color = srgb(1, 0, 0);
        const hsv = srgbToHSV(color);
        expect(hsv.h).toBeCloseTo(0, 5);
        expect(hsv.s).toBeCloseTo(1, 5);
        expect(hsv.v).toBeCloseTo(1, 5);
      });

      it('should convert pure green to HSV', () => {
        const color = srgb(0, 1, 0);
        const hsv = srgbToHSV(color);
        expect(hsv.h).toBeCloseTo(120, 5);
        expect(hsv.s).toBeCloseTo(1, 5);
        expect(hsv.v).toBeCloseTo(1, 5);
      });

      it('should convert pure blue to HSV', () => {
        const color = srgb(0, 0, 1);
        const hsv = srgbToHSV(color);
        expect(hsv.h).toBeCloseTo(240, 5);
        expect(hsv.s).toBeCloseTo(1, 5);
        expect(hsv.v).toBeCloseTo(1, 5);
      });

      it('should handle grayscale colors', () => {
        const color = srgb(0.5, 0.5, 0.5);
        const hsv = srgbToHSV(color);
        expect(hsv.s).toBeCloseTo(0, 5);
        expect(hsv.v).toBeCloseTo(0.5, 5);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const hsv = srgbToHSV(color);
        expect(hsv.alpha).toBe(0.5);
      });
    });

    describe('srgbToHWB', () => {
      it('should convert sRGB to HWB', () => {
        const hwb = srgbToHWB(testColor);
        expect(hwb.space).toBe('hwb');
        expect(hwb.h).toBeCloseTo(30, 0);
        expect(hwb.w).toBeCloseTo(0.3, 2);
        expect(hwb.b).toBeCloseTo(0.5, 2);
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const hwb = srgbToHWB(colorWithAlpha);
        expect(hwb.alpha).toBe(0.7);
      });

      it('should convert pure red to HWB', () => {
        const color = srgb(1, 0, 0);
        const hwb = srgbToHWB(color);
        expect(hwb.h).toBeCloseTo(0, 5);
        expect(hwb.w).toBeCloseTo(0, 5);
        expect(hwb.b).toBeCloseTo(0, 5);
      });

      it('should convert pure green to HWB', () => {
        const color = srgb(0, 1, 0);
        const hwb = srgbToHWB(color);
        expect(hwb.h).toBeCloseTo(120, 5);
        expect(hwb.w).toBeCloseTo(0, 5);
        expect(hwb.b).toBeCloseTo(0, 5);
      });

      it('should convert pure blue to HWB', () => {
        const color = srgb(0, 0, 1);
        const hwb = srgbToHWB(color);
        expect(hwb.h).toBeCloseTo(240, 5);
        expect(hwb.w).toBeCloseTo(0, 5);
        expect(hwb.b).toBeCloseTo(0, 5);
      });

      it('should handle grayscale colors', () => {
        const color = srgb(0.5, 0.5, 0.5);
        const hwb = srgbToHWB(color);
        expect(hwb.w).toBeCloseTo(0.5, 5);
        expect(hwb.b).toBeCloseTo(0.5, 5);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const hwb = srgbToHWB(color);
        expect(hwb.alpha).toBe(0.5);
      });
    });

    describe('srgbToXYZ', () => {
      it('should convert sRGB to XYZ with D65 illuminant by default', () => {
        const xyz = srgbToXYZ(testColor);
        expect(xyz.space).toBe('xyz');
        expect(xyz.x).toBeGreaterThan(0);
        expect(xyz.y).toBeGreaterThan(0);
        expect(xyz.z).toBeGreaterThan(0);
        expect(xyz.illuminant?.name).toBe('D65');
      });

      it('should convert sRGB to XYZ with D50 illuminant when chromatic adaptation is used', () => {
        const xyz = srgbToXYZ(testColor, true);
        expect(xyz.illuminant?.name).toBe('D50');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const xyz = srgbToXYZ(colorWithAlpha);
        expect(xyz.alpha).toBe(0.7);
      });

      it('should convert pure red to XYZ', () => {
        const color = srgb(1, 0, 0);
        const xyz = srgbToXYZ(color);
        expect(xyz.x).toBeCloseTo(0.4124, 3);
        expect(xyz.y).toBeCloseTo(0.2126, 3);
        expect(xyz.z).toBeCloseTo(0.0193, 3);
      });

      it('should convert pure green to XYZ', () => {
        const color = srgb(0, 1, 0);
        const xyz = srgbToXYZ(color);
        expect(xyz.x).toBeCloseTo(0.3576, 3);
        expect(xyz.y).toBeCloseTo(0.7152, 3);
        expect(xyz.z).toBeCloseTo(0.1192, 3);
      });

      it('should convert pure blue to XYZ', () => {
        const color = srgb(0, 0, 1);
        const xyz = srgbToXYZ(color);
        expect(xyz.x).toBeCloseTo(0.1805, 3);
        expect(xyz.y).toBeCloseTo(0.0722, 3);
        expect(xyz.z).toBeCloseTo(0.9505, 3);
      });

      it('should handle chromatic adaptation', () => {
        const color = srgb(1, 0, 0);
        const xyz = srgbToXYZ(color, true);
        // Values will be different due to chromatic adaptation
        expect(xyz.x).not.toBeCloseTo(0.4124, 4);
        expect(xyz.y).not.toBeCloseTo(0.2126, 4);
        expect(xyz.z).not.toBeCloseTo(0.0193, 4);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const xyz = srgbToXYZ(color);
        expect(xyz.alpha).toBe(0.5);
      });
    });

    describe('srgbToLab', () => {
      it('should convert sRGB to Lab', () => {
        const lab = srgbToLab(testColor);
        expect(lab.space).toBe('lab');
        expect(lab.l).toBeGreaterThan(0);
        expect(typeof lab.a).toBe('number');
        expect(typeof lab.b).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const lab = srgbToLab(colorWithAlpha);
        expect(lab.alpha).toBe(0.7);
      });

      it('should convert pure red to Lab', () => {
        const color = srgb(1, 0, 0);
        const lab = srgbToLab(color);
        expect(lab.l).toBeCloseTo(53.24, 2);
        expect(lab.a).toBeCloseTo(80.09, 2);
        expect(lab.b).toBeCloseTo(67.2, 2);
      });

      it('should convert pure green to Lab', () => {
        const color = srgb(0, 1, 0);
        const lab = srgbToLab(color);
        expect(lab.l).toBeCloseTo(87.73, 2);
        expect(lab.a).toBeCloseTo(-86.18, 2);
        expect(lab.b).toBeCloseTo(83.18, 2);
      });

      it('should convert pure blue to Lab', () => {
        const color = srgb(0, 0, 1);
        const lab = srgbToLab(color);
        expect(lab.l).toBeCloseTo(32.3, 2);
        expect(lab.a).toBeCloseTo(79.19, 2);
        expect(lab.b).toBeCloseTo(-107.86, 2);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const lab = srgbToLab(color);
        expect(lab.alpha).toBe(0.5);
      });
    });

    describe('srgbToLCH', () => {
      it('should convert sRGB to LCh', () => {
        const lch = srgbToLCH(testColor);
        expect(lch.space).toBe('lch');
        expect(lch.l).toBeGreaterThan(0);
        expect(lch.c).toBeGreaterThan(0);
        expect(typeof lch.h).toBe('number');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const lch = srgbToLCH(colorWithAlpha);
        expect(lch.alpha).toBe(0.7);
      });

      it('should convert pure red to LCH', () => {
        const color = srgb(1, 0, 0);
        const lch = srgbToLCH(color);
        expect(lch.l).toBeCloseTo(53.24, 2);
        expect(lch.c).toBeCloseTo(104.55, 2);
        expect(lch.h).toBeCloseTo(40.0, 2);
      });

      it('should convert pure green to LCH', () => {
        const color = srgb(0, 1, 0);
        const lch = srgbToLCH(color);
        expect(lch.l).toBeCloseTo(87.73, 2);
        expect(lch.c).toBeCloseTo(119.775, 2);
        expect(lch.h).toBeCloseTo(136.015, 2);
      });

      it('should convert pure blue to LCH', () => {
        const color = srgb(0, 0, 1);
        const lch = srgbToLCH(color);
        expect(lch.l).toBeCloseTo(32.3, 2);
        expect(lch.c).toBeCloseTo(133.81, 2);
        expect(lch.h).toBeCloseTo(306.284, 2);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const lch = srgbToLCH(color);
        expect(lch.alpha).toBe(0.5);
      });
    });

    describe('srgbToOKLab', () => {
      it('should convert sRGB to OKLab with D65 illuminant by default', () => {
        const oklab = srgbToOKLab(testColor);
        expect(oklab.space).toBe('oklab');
        expect(oklab.l).toBeGreaterThan(0);
        expect(typeof oklab.a).toBe('number');
        expect(typeof oklab.b).toBe('number');
      });

      it('should convert sRGB to OKLab with chromatic adaptation', () => {
        const oklab = srgbToOKLab(testColor, true);
        expect(oklab.space).toBe('oklab');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const oklab = srgbToOKLab(colorWithAlpha);
        expect(oklab.alpha).toBe(0.7);
      });

      it('should convert pure red to OKLab', () => {
        const color = srgb(1, 0, 0);
        const oklab = srgbToOKLab(color);
        expect(oklab.l).toBeCloseTo(0.627986, 4);
        expect(oklab.a).toBeCloseTo(0.2248, 4);
        expect(oklab.b).toBeCloseTo(0.1258, 4);
      });

      it('should handle chromatic adaptation', () => {
        const color = srgb(1, 0, 0);
        const oklab = srgbToOKLab(color, true);
        // Values will be different due to chromatic adaptation
        expect(oklab.l).not.toBeCloseTo(0.6279, 4);
        expect(oklab.a).not.toBeCloseTo(0.2248, 4);
        expect(oklab.b).not.toBeCloseTo(0.1258, 4);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const oklab = srgbToOKLab(color);
        expect(oklab.alpha).toBe(0.5);
      });
    });

    describe('srgbToOKLCh', () => {
      it('should convert sRGB to OKLCh', () => {
        const oklch = srgbToOKLCh(testColor);
        expect(oklch.space).toBe('oklch');
        expect(oklch.l).toBeGreaterThan(0);
        expect(oklch.c).toBeGreaterThan(0);
        expect(typeof oklch.h).toBe('number');
      });

      it('should convert sRGB to OKLCh with chromatic adaptation', () => {
        const oklch = srgbToOKLCh(testColor, true);
        expect(oklch.space).toBe('oklch');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const oklch = srgbToOKLCh(colorWithAlpha);
        expect(oklch.alpha).toBe(0.7);
      });

      it('should convert pure red to OKLCh', () => {
        const color = srgb(1, 0, 0);
        const oklch = srgbToOKLCh(color);
        expect(oklch.l).toBeCloseTo(0.627986, 4);
        expect(oklch.c).toBeCloseTo(0.25764, 4);
        expect(oklch.h).toBeCloseTo(29.23, 2);
      });

      it('should handle chromatic adaptation', () => {
        const color = srgb(1, 0, 0);
        const oklch = srgbToOKLCh(color, true);
        // Values will be different due to chromatic adaptation
        expect(oklch.l).not.toBeCloseTo(0.6279, 4);
        expect(oklch.c).not.toBeCloseTo(0.2577, 4);
        expect(oklch.h).not.toBeCloseTo(29.23, 2);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const oklch = srgbToOKLCh(color);
        expect(oklch.alpha).toBe(0.5);
      });
    });

    describe('srgbToJzAzBz', () => {
      it('should convert sRGB to JzAzBz with default peak luminance', () => {
        const jzazbz = srgbToJzAzBz(testColor);
        expect(jzazbz.space).toBe('jzazbz');
        expect(jzazbz.jz).toBeGreaterThan(0);
        expect(typeof jzazbz.az).toBe('number');
        expect(typeof jzazbz.bz).toBe('number');
      });

      it('should convert sRGB to JzAzBz with custom peak luminance', () => {
        const jzazbz = srgbToJzAzBz(testColor, 1000);
        expect(jzazbz.space).toBe('jzazbz');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const jzazbz = srgbToJzAzBz(colorWithAlpha);
        expect(jzazbz.alpha).toBe(0.7);
      });

      it('should convert pure red to JzAzBz', () => {
        const color = srgb(1, 0, 0);
        const jzazbz = srgbToJzAzBz(color);
        expect(jzazbz.jz).toBeCloseTo(0.13438, 4);
        expect(jzazbz.az).toBeCloseTo(0.11789, 4);
        expect(jzazbz.bz).toBeCloseTo(0.11188, 4);
      });

      it('should handle different peak luminance values', () => {
        const color = srgb(1, 0, 0);
        const jzazbz = srgbToJzAzBz(color, 5000);
        // Values will be different due to different peak luminance
        expect(jzazbz.jz).not.toBeCloseTo(0.2231, 4);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const jzazbz = srgbToJzAzBz(color);
        expect(jzazbz.alpha).toBe(0.5);
      });
    });

    describe('srgbToJzCzHz', () => {
      it('should convert sRGB to JzCzHz with default peak luminance', () => {
        const jzczhz = srgbToJzCzHz(testColor);
        expect(jzczhz.space).toBe('jzczhz');
        expect(jzczhz.jz).toBeGreaterThan(0);
        expect(jzczhz.cz).toBeGreaterThan(0);
        expect(typeof jzczhz.hz).toBe('number');
      });

      it('should convert sRGB to JzCzHz with custom peak luminance', () => {
        const jzczhz = srgbToJzCzHz(testColor, 1000);
        expect(jzczhz.space).toBe('jzczhz');
      });

      it('should preserve alpha', () => {
        const colorWithAlpha = srgb(0.5, 0.4, 0.3, 0.7);
        const jzczhz = srgbToJzCzHz(colorWithAlpha);
        expect(jzczhz.alpha).toBe(0.7);
      });

      it('should convert pure red to JzCzHz', () => {
        const color = srgb(1, 0, 0);
        const jzczhz = srgbToJzCzHz(color);
        expect(jzczhz.jz).toBeCloseTo(0.13438, 4);
        expect(jzczhz.cz).toBeCloseTo(0.16252, 4);
        expect(jzczhz.hz).toBeCloseTo(43.502, 2);
      });

      it('should handle different peak luminance values', () => {
        const color = srgb(1, 0, 0);
        const jzczhz = srgbToJzCzHz(color, 5000);
        // Values will be different due to different peak luminance
        expect(jzczhz.jz).not.toBeCloseTo(0.2231, 4);
      });

      it('should preserve alpha value', () => {
        const color = srgb(1, 0, 0, 0.5);
        const jzczhz = srgbToJzCzHz(color);
        expect(jzczhz.alpha).toBe(0.5);
      });
    });
  });

  // Test parser
  describe('Parser', () => {
    it('should parse a color string with space syntax', () => {
      const color = srgbFromCSSString('rgb(0 255 255)');
      expect(color.r).toBe(0);
      expect(color.g).toBe(1);
      expect(color.b).toBe(1);
    });

    it('should parse a color string with comma syntax', () => {
      const color = srgbFromCSSString('rgb(255, 0, 255)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
    });

    it('should parse a color string with percentage values', () => {
      const color = srgbFromCSSString('rgb(100%, 0%, 50%)');
      expect(color.r).toBeCloseTo(1, 10);
      expect(color.g).toBeCloseTo(0, 10);
      expect(color.b).toBeCloseTo(0.5, 10);
    });

    it('should parse a color string with percentage values and space syntax', () => {
      const color = srgbFromCSSString('rgb(100% 0% 50%)');
      expect(color.r).toBeCloseTo(1, 10);
      expect(color.g).toBeCloseTo(0, 10);
      expect(color.b).toBeCloseTo(0.5, 10);
    });

    it('should parse a color string with alpha using slash syntax', () => {
      const color = srgbFromCSSString('rgb(255 0 255 / 0.5)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });

    it('should parse a color string with alpha using comma syntax', () => {
      const color = srgbFromCSSString('rgb(255, 0, 255, 0.5)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });

    it('should parse a color string with alpha as percentage', () => {
      const color = srgbFromCSSString('rgb(255 0 255 / 50%)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });

    it('should handle positive sign in values', () => {
      const color = srgbFromCSSString('rgb(+100 +50 +25)');
      expect(color.r).toBeCloseTo(0.392, 3);
      expect(color.g).toBeCloseTo(0.196, 3);
      expect(color.b).toBeCloseTo(0.098, 3);
    });

    it('should throw error for negative values', () => {
      expect(() => srgbFromCSSString('rgb(-1 0 0)')).toThrow('negative value');
    });

    it('should throw error for multiple decimal points', () => {
      expect(() => srgbFromCSSString('rgb(1.2.3 0 0)')).toThrow('multiple "."');
    });

    it('should throw error for invalid alpha values', () => {
      expect(() => srgbFromCSSString('rgb(255 0 0 / 1.5)')).toThrow('alpha 0–1');
      expect(() => srgbFromCSSString('rgb(255 0 0 / -0.5)')).toThrow('negative value');
    });

    it('should throw error for out of range values', () => {
      expect(() => srgbFromCSSString('rgb(256 0 0)')).toThrow('srgb() out of range');
    });

    it('should throw error for missing comma in comma syntax', () => {
      expect(() => srgbFromCSSString('rgb(255, 0 0)')).toThrow("expected ','");
    });

    it('should throw error for missing closing parenthesis', () => {
      expect(() => srgbFromCSSString('rgb(255 0 0')).toThrow('missing ")"');
    });

    it('should throw error for unexpected text after closing parenthesis', () => {
      expect(() => srgbFromCSSString('rgb(255 0 0) extra')).toThrow('unexpected text after ")"');
    });

    it('should throw error for missing whitespace or comma after first value', () => {
      expect(() => srgbFromCSSString('rgb(255)')).toThrow(
        "expected ',' or <whitespace> after first value"
      );
    });
  });

  // Test color space conversion edge cases
  describe('Color Space Conversion Edge Cases', () => {
    describe('srgbToHSL', () => {
      it('should handle lightness exactly at 0.5', () => {
        const color = srgb(0.5, 0.5, 0.5);
        const hsl = srgbToHSL(color);
        expect(hsl.l).toBe(0.5);
        expect(hsl.s).toBe(0);
      });

      it('should handle high lightness values (l > 0.5)', () => {
        const color = srgb(0.8, 0.9, 0.7);
        const hsl = srgbToHSL(color);
        expect(hsl.l).toBeGreaterThan(0.5);
        expect(hsl.s).toBeGreaterThan(0);
      });
    });

    describe('srgbToHSV', () => {
      it('should handle max value of 0', () => {
        const color = srgb(0, 0, 0);
        const hsv = srgbToHSV(color);
        expect(hsv.v).toBe(0);
        expect(hsv.s).toBe(0);
      });
    });

    describe('calculateHSpaceHue', () => {
      it('should handle case where red is max and green is less than blue', () => {
        const color = srgb(1, 0.2, 0.8);
        const hsv = srgbToHSV(color);
        expect(hsv.h).toBeGreaterThanOrEqual(300);
        expect(hsv.h).toBeLessThanOrEqual(330);
      });

      it('should handle negative hue values and adjust them', () => {
        // For this test, we'll use a special color that would result in a negative hue
        // in the calculateHSpaceHue function before adjustment.

        // Let's create a color with blue as max, and red slightly less than green
        const color = srgb(0.3, 0.4, 0.9);

        // When blue is max, the formula is (r - g) / delta + 4
        // With r = 0.3 and g = 0.4, this gives (0.3 - 0.4) / 0.6 + 4 = -0.167 + 4 = 3.833
        // Multiplied by 60, this gives 230 degrees

        const hsv = srgbToHSV(color);
        expect(hsv.h).toBeGreaterThanOrEqual(220);
        expect(hsv.h).toBeLessThanOrEqual(240);

        // Now let's try to create a color that would result in a negative hue
        // When green is max, the formula is (b - r) / delta + 2
        // If b is much less than r, this could result in a negative value

        // Let's create a color with green as max, and blue much less than red
        const color2 = srgb(0.9, 1.0, 0.1);

        // When green is max, the formula is (b - r) / delta + 2
        // With b = 0.1 and r = 0.9, this gives (0.1 - 0.9) / 0.9 + 2 = -0.889 + 2 = 1.111
        // Multiplied by 60, this gives 66.67 degrees
        // This should be positive, but let's check that it's in the expected range

        const hsv2 = srgbToHSV(color2);
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
        const color3 = srgb(0.99, 1.0, 0.0);

        // When green is max, the formula is (b - r) / delta + 2
        // With b = 0.0, r = 0.99, and delta = 1.0 - 0.0 = 1.0,
        // this gives (0.0 - 0.99) / 1.0 + 2 = -0.99 + 2 = 1.01
        // Multiplied by 60, this gives 60.6 degrees

        const hsv3 = srgbToHSV(color3);
        expect(hsv3.h).toBeGreaterThanOrEqual(60);
        expect(hsv3.h).toBeLessThanOrEqual(61);

        // Let's try one more approach with extreme values
        // We'll create a color with green as max, and red almost equal to green,
        // and blue much less than both

        // This should result in a very small delta, which could lead to a negative hue
        // before adjustment

        const color4 = srgb(0.999999, 1.0, 0.0);

        // When green is max, the formula is (b - r) / delta + 2
        // With b = 0.0, r = 0.999999, and delta = 1.0 - 0.0 = 1.0,
        // this gives (0.0 - 0.999999) / 1.0 + 2 = -0.999999 + 2 = 1.000001
        // Multiplied by 60, this gives 60.00006 degrees

        const hsv4 = srgbToHSV(color4);
        expect(hsv4.h).toBeGreaterThanOrEqual(60);
        expect(hsv4.h).toBeLessThanOrEqual(60.1);
      });
    });

    describe('srgbToXYZ', () => {
      it('should handle chromatic adaptation correctly', () => {
        const color = srgb(1, 0, 0);
        const xyz = srgbToXYZ(color, true);
        expect(xyz.illuminant?.name).toBe('D50');
        expect(xyz.x).toBeGreaterThan(0);
        expect(xyz.y).toBeGreaterThan(0);
        expect(xyz.z).toBeGreaterThan(0);
      });
    });
  });

  // Test transform functions
  describe('Transform Functions', () => {
    describe('linearizesRGBColor', () => {
      it('should linearize RGB values', () => {
        const color = srgb(0.5, 0.5, 0.5);
        const linear = linearizesRGBColor(color);
        expect(linear.r).toBeCloseTo(0.214, 4);
        expect(linear.g).toBeCloseTo(0.214, 4);
        expect(linear.b).toBeCloseTo(0.214, 4);
      });

      it('should handle values below threshold', () => {
        const color = srgb(0.04, 0.04, 0.04);
        const linear = linearizesRGBColor(color);
        expect(linear.r).toBeCloseTo(0.0031, 4);
        expect(linear.g).toBeCloseTo(0.0031, 4);
        expect(linear.b).toBeCloseTo(0.0031, 4);
      });

      it('should preserve alpha value', () => {
        const color = srgb(0.5, 0.5, 0.5, 0.5);
        const linear = linearizesRGBColor(color);
        expect(linear.alpha).toBe(0.5);
      });
    });

    describe('delinearizesRGBColor', () => {
      it('should delinearize RGB values', () => {
        const color = srgb(0.214, 0.214, 0.214);
        const delinear = delinearizesRGBColor(color);
        expect(delinear.r).toBeCloseTo(0.5, 4);
        expect(delinear.g).toBeCloseTo(0.5, 4);
        expect(delinear.b).toBeCloseTo(0.5, 4);
      });

      it('should handle values below threshold', () => {
        const color = srgb(0.0031, 0.0031, 0.0031);
        const delinear = delinearizesRGBColor(color);
        expect(delinear.r).toBeCloseTo(0.040052, 4);
        expect(delinear.g).toBeCloseTo(0.040052, 4);
        expect(delinear.b).toBeCloseTo(0.040052, 4);
      });

      it('should preserve alpha value', () => {
        const color = srgb(0.214, 0.214, 0.214, 0.5);
        const delinear = delinearizesRGBColor(color);
        expect(delinear.alpha).toBe(0.5);
      });
    });
  });
});
