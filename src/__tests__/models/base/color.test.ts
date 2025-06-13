import { describe, expect, it } from 'vitest';
import { getColorChannels, type ColorBase } from '../../../models/base/color';
import { type ColorChannel } from '../../../models/base/channel';

describe('ColorBase', () => {
  describe('getColorChannels', () => {
    it('should extract numeric channel values from a color object', () => {
      // Create a mock color object implementing ColorBase
      const mockColor: ColorBase = {
        space: 'test',
        isPolar: false,
        dynamicRange: 'SDR',
        channels: {
          r: { name: 'red', min: 0, max: 1 } as ColorChannel,
          g: { name: 'green', min: 0, max: 1 } as ColorChannel,
          b: { name: 'blue', min: 0, max: 1 } as ColorChannel
        },
        r: 0.5,
        g: 0.6,
        b: 0.7,
        toString: () => 'test(0.5, 0.6, 0.7)',
        toCSSString: () => 'test(0.5, 0.6, 0.7)',
        to: <T>() => ({ space: 'test' } as any)
      };

      const channels = getColorChannels(mockColor);
      expect(channels).toHaveLength(3);
      expect(channels).toContain(0.5);
      expect(channels).toContain(0.6);
      expect(channels).toContain(0.7);
    });

    it('should skip non-numeric properties', () => {
      // Create a mock color object with non-numeric properties
      const mockColor: ColorBase = {
        space: 'test',
        isPolar: false,
        dynamicRange: 'SDR',
        channels: {
          r: { name: 'red', min: 0, max: 1 } as ColorChannel,
          g: { name: 'green', min: 0, max: 1 } as ColorChannel,
          nonNumeric: { name: 'nonNumeric', min: 0, max: 1 } as ColorChannel
        },
        r: 0.5,
        g: 0.6,
        nonNumeric: 'not a number',
        toString: () => 'test(0.5, 0.6)',
        toCSSString: () => 'test(0.5, 0.6)',
        to: <T>() => ({ space: 'test' } as any)
      };

      const channels = getColorChannels(mockColor);
      expect(channels).toHaveLength(2);
      expect(channels).toContain(0.5);
      expect(channels).toContain(0.6);
      expect(channels).not.toContain('not a number');
    });

    it('should handle color objects with no numeric channels', () => {
      // Create a mock color object with no numeric channels
      const mockColor: ColorBase = {
        space: 'test',
        isPolar: false,
        dynamicRange: 'SDR',
        channels: {
          nonNumeric1: { name: 'nonNumeric1', min: 0, max: 1 } as ColorChannel,
          nonNumeric2: { name: 'nonNumeric2', min: 0, max: 1 } as ColorChannel
        },
        nonNumeric1: 'not a number',
        nonNumeric2: 'also not a number',
        toString: () => 'test()',
        toCSSString: () => 'test()',
        to: <T>() => ({ space: 'test' } as any)
      };

      const channels = getColorChannels(mockColor);
      expect(channels).toHaveLength(0);
    });

    it('should handle color objects with alpha channel', () => {
      // Create a mock color object with alpha channel
      const mockColor: ColorBase = {
        space: 'test',
        isPolar: false,
        dynamicRange: 'SDR',
        channels: {
          r: { name: 'red', min: 0, max: 1 } as ColorChannel,
          g: { name: 'green', min: 0, max: 1 } as ColorChannel,
          b: { name: 'blue', min: 0, max: 1 } as ColorChannel
        },
        r: 0.5,
        g: 0.6,
        b: 0.7,
        alpha: 0.8,
        toString: () => 'test(0.5, 0.6, 0.7, 0.8)',
        toCSSString: () => 'test(0.5, 0.6, 0.7, 0.8)',
        to: <T>() => ({ space: 'test' } as any)
      };

      const channels = getColorChannels(mockColor);
      expect(channels).toHaveLength(3); // Alpha is not included in channels
      expect(channels).toContain(0.5);
      expect(channels).toContain(0.6);
      expect(channels).toContain(0.7);
      expect(channels).not.toContain(0.8); // Alpha should not be included
    });
  });
});
