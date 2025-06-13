import { describe, expect, it } from 'vitest';
import { channel, ChannelAttribute } from '../../../models/base/channel';

describe('ColorChannel', () => {
  describe('channel', () => {
    it('should create a channel with the specified accessor and name', () => {
      const testChannel = channel('r', 'red', [0, 1]);
      expect(testChannel.accessor).toBe('r');
      expect(testChannel.name).toBe('red');
    });

    it('should create a channel with the specified range', () => {
      const testChannel = channel('r', 'red', [0, 1]);
      expect(testChannel.range).toEqual([0, 1]);
    });

    it('should create a channel with the default range when not provided', () => {
      // This test specifically targets the default parameter value on line 66
      const testChannel = channel('r', 'red');
      expect(testChannel.range).toEqual([null, null]);
    });

    it('should create a channel with the specified attributes', () => {
      const testChannel = channel(
        'h',
        'hue',
        [0, 360],
        [ChannelAttribute.ANGLE]
      );
      expect(testChannel.attributes).toBe(ChannelAttribute.ANGLE);
    });

    it('should create a channel with multiple attributes combined using bitwise OR', () => {
      const testChannel = channel(
        's',
        'saturation',
        [0, 1],
        [ChannelAttribute.PERCENTAGE, ChannelAttribute.OPTIONAL_PERCENTAGE]
      );
      expect(testChannel.attributes).toBe(
        ChannelAttribute.PERCENTAGE | ChannelAttribute.OPTIONAL_PERCENTAGE
      );
    });

    it('should create a channel with default attributes when not provided', () => {
      const testChannel = channel('r', 'red', [0, 1]);
      expect(testChannel.attributes).toBe(0);
    });

    it('should create a channel with both default range and default attributes when not provided', () => {
      const testChannel = channel('r', 'red');
      expect(testChannel.range).toEqual([null, null]);
      expect(testChannel.attributes).toBe(0);
    });
  });
});
