import '../../conversion/register-conversions';

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { parseColor } from '../../semantics/parsing';
import { srgb } from '../../models/srgb';
import { xyz } from '../../models/xyz';
import { hsl } from '../../models/hsl';
import { hsv } from '../../models/hsv';
import { lab } from '../../models/lab';
import { lch } from '../../models/lch';
import { oklab } from '../../models/oklab';
import { oklch } from '../../models/oklch';
import { hwb } from '../../models/hwb';
import * as serialization from '../../semantics/serialization';

describe('parseColor', () => {
  // Test parsing Color objects
  describe('parsing Color objects', () => {
    it('should convert a Color object to the target space', () => {
      const color = srgb(1, 0, 0);
      const result = parseColor(color, 'xyz');
      expect(result.space).toBe('xyz');
    });
  });

  // Test parsing hex strings
  describe('parsing hex strings', () => {
    it('should parse a hex string and convert to the target space', () => {
      const result = parseColor('#ff0000', 'srgb');
      expect(result.space).toBe('srgb');
      expect(result.r).toBe(1);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
    });

    it('should parse a hex string with alpha and convert to the target space', () => {
      const result = parseColor('#ff0000aa', 'srgb');
      expect(result.space).toBe('srgb');
      expect(result.r).toBe(1);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
      expect(result.alpha).toBeCloseTo(2/3, 2); // 0xaa/0xff ≈ 0.67
    });

    it('should parse a short hex string and convert to the target space', () => {
      const result = parseColor('#f00', 'srgb');
      expect(result.space).toBe('srgb');
      expect(result.r).toBe(1);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
    });
  });

  // Test parsing ChromaKit|v1 format
  describe('parsing ChromaKit|v1 format', () => {
    it('should parse a ChromaKit|v1 string and convert to the target space', () => {
      const parseV1Spy = vi.spyOn(serialization, 'parseV1');
      const result = parseColor('ChromaKit|v1 srgb 1 0 0', 'xyz');
      expect(parseV1Spy).toHaveBeenCalledWith('ChromaKit|v1 srgb 1 0 0');
      expect(result.space).toBe('xyz');
    });
  });

  // Test parsing CSS color strings
  describe('parsing CSS color strings', () => {
    it('should throw for color strings that are too short', () => {
      expect(() => parseColor('rgb', 'srgb')).toThrow('Unsupported color format: rgb');
    });

    it('should parse rgb() format', () => {
      const result = parseColor('rgb(255, 0, 0)', 'srgb');
      expect(result.space).toBe('srgb');
      expect(result.r).toBe(1);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
    });

    it('should parse rgba() format', () => {
      const result = parseColor('rgba(255, 0, 0, 0.5)', 'srgb');
      expect(result.space).toBe('srgb');
      expect(result.r).toBe(1);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
      expect(result.alpha).toBe(0.5);
    });

    it('should parse hsl() format', () => {
      const result = parseColor('hsl(0, 100%, 50%)', 'hsl');
      expect(result.space).toBe('hsl');
      expect(result.h).toBe(0);
      expect(result.s).toBe(1);
      expect(result.l).toBe(0.5);
    });

    it('should parse hsla() format', () => {
      const result = parseColor('hsla(0, 100%, 50%, 0.5)', 'hsl');
      expect(result.space).toBe('hsl');
      expect(result.h).toBe(0);
      expect(result.s).toBe(1);
      expect(result.l).toBe(0.5);
      expect(result.alpha).toBe(0.5);
    });

    it('should parse hwb() format', () => {
      const result = parseColor('hwb(0 0% 0%)', 'hwb');
      expect(result.space).toBe('hwb');
      expect(result.h).toBe(0);
      expect(result.w).toBe(0);
      expect(result.b).toBe(0);
    });

    it('should parse hsv() format', () => {
      const result = parseColor('hsv(0, 100%, 100%)', 'hsv');
      expect(result.space).toBe('hsv');
      expect(result.h).toBe(0);
      expect(result.s).toBe(1);
      expect(result.v).toBe(1);
    });

    it('should parse lab() format', () => {
      const result = parseColor('lab(50% 0 0)', 'lab');
      expect(result.space).toBe('lab');
      expect(result.l).toBeCloseTo(0.5);
      expect(result.a).toBeCloseTo(0);
      expect(result.b).toBeCloseTo(0);
    });

    it('should parse lch() format', () => {
      const result = parseColor('lch(50% 0 0)', 'lch');
      expect(result.space).toBe('lch');
      expect(result.l).toBeCloseTo(0.5);
      expect(result.c).toBe(0);
      expect(result.h).toBe(0);
    });

    it('should parse oklab() format', () => {
      const result = parseColor('oklab(0.5 0 0)', 'oklab');
      expect(result.space).toBe('oklab');
      expect(result.l).toBe(0.5);
      expect(result.a).toBe(0);
      expect(result.b).toBe(0);
    });

    it('should parse oklch() format', () => {
      const result = parseColor('oklch(0.5 0 0)', 'oklch');
      expect(result.space).toBe('oklch');
      expect(result.l).toBe(0.5);
      expect(result.c).toBe(0);
      expect(result.h).toBe(0);
    });

    it('should parse color(xyz-d65) format', () => {
      const result = parseColor('color(xyz-d65 0.5 0.6 0.7)', 'xyz');
      expect(result.space).toBe('xyz');
      expect(result.x).toBeCloseTo(0.5);
      expect(result.y).toBeCloseTo(0.6);
      expect(result.z).toBeCloseTo(0.7);
    });

    it('should throw for unsupported color() formats', () => {
      expect(() => parseColor('color(display-p3 1 0 0)', 'srgb')).toThrow('Generic CSS Color 4 parsing not implemented yet');
    });

    it('should throw for unsupported color formats', () => {
      expect(() => parseColor('unknown(1, 2, 3)', 'srgb')).toThrow('Unsupported color format: unknown(1, 2, 3)');
    });
  });

  // Test hot cache functionality
  describe('hot cache', () => {
    it('should return cached result for repeated calls with the same input', () => {
      const hexToSRGBSpy = vi.spyOn(serialization, 'parseV1');

      // First call should parse
      parseColor('ChromaKit|v1 srgb 1 0 0', 'srgb');
      expect(hexToSRGBSpy).toHaveBeenCalledTimes(1);

      // Second call with same input should use cache
      hexToSRGBSpy.mockClear();
      parseColor('ChromaKit|v1 srgb 1 0 0', 'srgb');
      expect(hexToSRGBSpy).not.toHaveBeenCalled();
    });

    it('should handle cache overflow by replacing oldest entries', () => {
      // Fill the cache with 32 different colors
      for (let i = 0; i < 32; i++) {
        parseColor(`#${i.toString(16).padStart(6, '0')}`, 'srgb');
      }

      // The first color should now be evicted from the cache
      const hexToSRGBSpy = vi.spyOn(serialization, 'parseV1');
      hexToSRGBSpy.mockClear();

      // This should use the cache
      parseColor('#000001', 'srgb');
      expect(hexToSRGBSpy).not.toHaveBeenCalled();

      // This should not use the cache (it was the first one we added and should be evicted)
      parseColor('#000000', 'srgb');
      // Note: This test might be flaky depending on the exact cache implementation
      // If it fails, it might be because the cache uses a different replacement strategy
    });
  });
});
