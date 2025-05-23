import '../../conversion/register-conversions';

import { describe, expect, it } from 'vitest';
import {
  srgb,
  sRGBColor,
  srgbToCSSString,
  srgbFromVector,
  hexTosRGB,
  srgbToHex,
  srgbToHSL,
  srgbToHSV,
  srgbToHWB,
  srgbToXYZ,
  srgbToLab,
  srgbToLCH,
  srgbToOKLab,
  srgbToOKLCh,
  srgbToJzAzBz,
  srgbToJzCzHz
} from '../../models/srgb/srgb';
import {
  normalizesRGBColor,
  denormalizesRGBColor,
  applysRGBGammaTransfer,
  linearizesRGBColor,
  applysRGBInverseGammaTransfer,
  delinearizesRGBColor,
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
      const color = srgb(1, 0, 0, 0xAA / 255);
      expect(srgbToHex(color)).toBe('#f00a');
    })

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
        expect(applysRGBGammaTransfer(0.5)).toBeCloseTo(0.2140, 4);
        expect(applysRGBGammaTransfer(1)).toBeCloseTo(1, 5);
      });
    });

    describe('applysRGBInverseGammaTransfer', () => {
      it('should apply inverse gamma correction for values <= 0.0031308', () => {
        expect(applysRGBInverseGammaTransfer(0)).toBe(0);
        expect(applysRGBInverseGammaTransfer(0.0031308)).toBeCloseTo(0.0031308 * 12.92, 5);
      });

      it('should apply inverse gamma correction for values > 0.0031308', () => {
        expect(applysRGBInverseGammaTransfer(0.5)).toBeCloseTo(0.7350, 3);
        expect(applysRGBInverseGammaTransfer(1)).toBeCloseTo(1, 5);
      });
    });

    describe('linearizesRGBColor', () => {
      it('should linearize an sRGB color', () => {
        const color = srgb(1, 0.5, 0);
        const linearized = linearizesRGBColor(color);
        expect(linearized.r).toBeCloseTo(1, 5);
        expect(linearized.g).toBeCloseTo(0.2140, 4);
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
        const color = srgb(1, 0.2140, 0);
        const delinearized = delinearizesRGBColor(color);
        expect(delinearized.r).toBeCloseTo(1, 5);
        expect(delinearized.g).toBeCloseTo(0.5, 1);
        expect(delinearized.b).toBeCloseTo(0, 5);
      });

      it('should preserve the alpha value', () => {
        const color = srgb(1, 0.2140, 0, 0.5);
        const delinearized = delinearizesRGBColor(color);
        expect(delinearized.alpha).toBe(0.5);
      });
    });
  });

  // Test color space conversion functions
  describe('Color Space Conversions', () => {
    const testColor = srgb(0.5, 0.4, 0.3);

    describe('fluent conversion', () => {
      it ('should convert dynamically into the target color space', () => {
        const hsl = testColor.to('hsl');

        expect(hsl.space).toBe('hsl');
        expect(hsl.h).toBeCloseTo(30, 0);
        expect(hsl.s).toBeCloseTo(0.25, 2);
        expect(hsl.l).toBeCloseTo(0.4, 2);
      })
    })

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
        expect(lab.b).toBeCloseTo(67.20, 2);
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
        expect(lab.l).toBeCloseTo(32.30, 2);
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
        expect(lch.h).toBeCloseTo(40.00, 2);
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
        expect(lch.l).toBeCloseTo(32.30, 2);
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
        expect(oklch.c).toBeCloseTo(0.257640, 4);
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
    it('should parse a color string', () => {
      const color = srgbFromCSSString('rgb(0 255 255)');
      expect(color.r).toBe(0);
      expect(color.g).toBe(1);
      expect(color.b).toBe(1);
    })

    it('should parse a color string with alpha', () => {
      const color = srgbFromCSSString('rgb(255 0 255 / 0.5)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(1);
      expect(color.alpha).toBe(0.5);
    });
  })

  // Test transform functions
  describe('Transform Functions', () => {
    describe('linearizesRGBColor', () => {
      it('should linearize RGB values', () => {
        const color = srgb(0.5, 0.5, 0.5);
        const linear = linearizesRGBColor(color);
        expect(linear.r).toBeCloseTo(0.2140, 4);
        expect(linear.g).toBeCloseTo(0.2140, 4);
        expect(linear.b).toBeCloseTo(0.2140, 4);
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
        const color = srgb(0.2140, 0.2140, 0.2140);
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
        const color = srgb(0.2140, 0.2140, 0.2140, 0.5);
        const delinear = delinearizesRGBColor(color);
        expect(delinear.alpha).toBe(0.5);
      });
    });
  });
});
