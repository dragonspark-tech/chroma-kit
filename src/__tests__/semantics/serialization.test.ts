import { describe, expect, it } from 'vitest';
import { parseV1, serializeV1 } from '../../semantics/serialization';
import { rgb, type RGBColor } from '../../models/rgb';
import { xyz, type XYZColor } from '../../models/xyz';
import { hsl, type HSLColor } from '../../models/hsl';
import { hsv, type HSVColor } from '../../models/hsv';
import { lab, type LabColor } from '../../models/lab';
import { lch, type LChColor } from '../../models/lch';
import { oklab, type OKLabColor } from '../../models/oklab';
import { oklch, type OKLChColor } from '../../models/oklch';
import { jzazbz, type JzAzBzColor } from '../../models/jzazbz';
import { jzczhz, type JzCzHzColor } from '../../models/jzczhz';
import { hwb, type HWBColor } from '../../models/hwb';
import { IlluminantD65 } from '../../standards/illuminants';

describe('Serialization', () => {
  describe('parseV1', () => {
    it('should parse a valid RGB ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 rgb 1 0 0') as RGBColor;
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
      expect(color.alpha).toBeUndefined();
    });

    it('should parse a valid RGB ChromaKit|v1 string with alpha', () => {
      const color = parseV1('ChromaKit|v1 rgb 1 0 0 / 0.5') as RGBColor;
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
      expect(color.alpha).toBe(0.5);
    });

    it('should parse a valid HSL ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 hsl 0 1 0.5') as HSLColor;
      expect(color.space).toBe('hsl');
      expect(color.h).toBe(0);
      expect(color.s).toBe(1);
      expect(color.l).toBe(0.5);
    });

    it('should parse a valid HSV ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 hsv 0 1 1') as HSVColor;
      expect(color.space).toBe('hsv');
      expect(color.h).toBe(0);
      expect(color.s).toBe(1);
      expect(color.v).toBe(1);
    });

    it('should parse a valid HWB ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 hwb 0 0 0') as HWBColor;
      expect(color.space).toBe('hwb');
      expect(color.h).toBe(0);
      expect(color.w).toBe(0);
      expect(color.b).toBe(0);
    });

    it('should parse a valid XYZ ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 xyz 0.5 0.6 0.7') as XYZColor;
      expect(color.space).toBe('xyz');
      expect(color.x).toBe(0.5);
      expect(color.y).toBe(0.6);
      expect(color.z).toBe(0.7);
      expect(color.illuminant).toBe(IlluminantD65);
    });

    it('should parse a valid LAB ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 lab 50 10 20') as LabColor;
      expect(color.space).toBe('lab');
      expect(color.l).toBe(50);
      expect(color.a).toBe(10);
      expect(color.b).toBe(20);
    });

    it('should parse a valid LCh ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 lch 50 30 40') as LChColor;
      expect(color.space).toBe('lch');
      expect(color.l).toBe(50);
      expect(color.c).toBe(30);
      expect(color.h).toBe(40);
    });

    it('should parse a valid OKLAB ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 oklab 0.5 0.1 0.2') as OKLabColor;
      expect(color.space).toBe('oklab');
      expect(color.l).toBe(0.5);
      expect(color.a).toBe(0.1);
      expect(color.b).toBe(0.2);
    });

    it('should parse a valid OKLCh ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 oklch 0.5 0.1 40') as OKLChColor;
      expect(color.space).toBe('oklch');
      expect(color.l).toBe(0.5);
      expect(color.c).toBe(0.1);
      expect(color.h).toBe(40);
    });

    it('should parse a valid JzAzBz ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 jzazbz 0.5 0.1 0.2') as JzAzBzColor;
      expect(color.space).toBe('jzazbz');
      expect(color.jz).toBe(0.5);
      expect(color.az).toBe(0.1);
      expect(color.bz).toBe(0.2);
    });

    it('should parse a valid JzCzHz ChromaKit|v1 string', () => {
      const color = parseV1('ChromaKit|v1 jzczhz 0.5 0.1 40') as JzCzHzColor;
      expect(color.space).toBe('jzczhz');
      expect(color.jz).toBe(0.5);
      expect(color.cz).toBe(0.1);
      expect(color.hz).toBe(40);
    });

    it('should throw for invalid format', () => {
      expect(() => parseV1('Not a ChromaKit string')).toThrow('Not a ChromaKit v1 string');
    });

    it('should throw for unsupported color space', () => {
      expect(() => parseV1('ChromaKit|v1 unknown 1 2 3')).toThrow('Unhandled colorspace');
    });

    it('should handle extra whitespace', () => {
      const color = parseV1('  ChromaKit|v1   rgb   1   0   0  ') as RGBColor;
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
    });

    it('should be case-insensitive for the tag', () => {
      const color = parseV1('chromakit|v1 rgb 1 0 0') as RGBColor;
      expect(color.space).toBe('rgb');
      expect(color.r).toBe(1);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
    });
  });

  describe('serializeV1', () => {
    it('should serialize an RGB color', () => {
      const color = rgb(1, 0, 0);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 rgb 1 0 0');
    });

    it('should serialize an RGB color with alpha', () => {
      const color = rgb(1, 0, 0, 0.5);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 rgb 1 0 0 / 0.5');
    });

    it('should serialize an HSL color', () => {
      const color = hsl(0, 1, 0.5);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 hsl 0 1 0.5');
    });

    it('should serialize an HSV color', () => {
      const color = hsv(0, 1, 1);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 hsv 0 1 1');
    });

    it('should serialize an HWB color', () => {
      const color = hwb(0, 0, 0);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 hwb 0 0 0');
    });

    it('should serialize an XYZ color', () => {
      const color = xyz(0.5, 0.6, 0.7);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 xyz 0.5 0.6 0.7');
    });

    it('should serialize a LAB color', () => {
      const color = lab(50, 10, 20);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 lab 50 10 20');
    });

    it('should serialize a LCh color', () => {
      const color = lch(50, 30, 40);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 lch 50 30 40');
    });

    it('should serialize an OKLAB color', () => {
      const color = oklab(0.5, 0.1, 0.2);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 oklab 0.5 0.1 0.2');
    });

    it('should serialize an OKLCh color', () => {
      const color = oklch(0.5, 0.1, 40);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 oklch 0.5 0.1 40');
    });

    it('should serialize a JzAzBz color', () => {
      const color = jzazbz(0.5, 0.1, 0.2);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 jzazbz 0.5 0.1 0.2');
    });

    it('should serialize a JzCzHz color', () => {
      const color = jzczhz(0.5, 0.1, 40);
      const serialized = serializeV1(color);
      expect(serialized).toBe('ChromaKit|v1 jzczhz 0.5 0.1 40');
    });

    it('should round-trip correctly', () => {
      const original = rgb(1, 0, 0, 0.5);
      const serialized = serializeV1(original);
      const parsed = parseV1(serialized) as RGBColor;

      expect(parsed.space).toBe(original.space);
      expect(parsed.r).toBe(original.r);
      expect(parsed.g).toBe(original.g);
      expect(parsed.b).toBe(original.b);
      expect(parsed.alpha).toBe(original.alpha);
    });
  });
});
