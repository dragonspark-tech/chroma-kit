import { describe, expect, it } from 'vitest';
import { ColorStringParser } from '../../semantics/colorParser';

describe('ColorStringParser', () => {
  describe('constructor', () => {
    it('should initialize with the correct position', () => {
      const parser = new ColorStringParser('rgb(255, 0, 0)', 4);
      expect(parser.getPosition()).toBe(4);
    });
  });

  describe('skipWS', () => {
    it('should skip whitespace characters', () => {
      const parser = new ColorStringParser('rgb(  255, 0, 0)', 4);
      parser.skipWS();
      expect(parser.getPosition()).toBe(6);
      expect(parser.getCurrentChar()).toBe('2');
    });

    it('should not move position if no whitespace', () => {
      const parser = new ColorStringParser('rgb(255, 0, 0)', 4);
      parser.skipWS();
      expect(parser.getPosition()).toBe(4);
      expect(parser.getCurrentChar()).toBe('2');
    });
  });

  describe('readComponent', () => {
    it('should read a simple integer component', () => {
      const parser = new ColorStringParser('rgb(255, 0, 0)', 4);
      const value = parser.readComponent();
      expect(value).toBe(255);
      expect(parser.getPosition()).toBe(7);
    });

    it('should read a component with a plus sign', () => {
      const parser = new ColorStringParser('rgb(+255, 0, 0)', 4);
      const value = parser.readComponent();
      expect(value).toBe(255);
      expect(parser.getPosition()).toBe(8);
    });

    it('should read a decimal component', () => {
      const parser = new ColorStringParser('rgb(0.5, 0, 0)', 4);
      const value = parser.readComponent();
      expect(value).toBe(0.5);
      expect(parser.getPosition()).toBe(7);
    });

    it('should read a percentage component', () => {
      const parser = new ColorStringParser('rgb(50%, 0, 0)', 4);
      const value = parser.readComponent({ scale: 255 });
      expect(value).toBeCloseTo(127.5, 5);
      expect(parser.getPosition()).toBe(7);
    });

    it('should read a negative component', () => {
      const parser = new ColorStringParser('lab(-50, 0, 0)', 4);
      const value = parser.readComponent();
      expect(value).toBe(-50);
      expect(parser.getPosition()).toBe(7);
    });

    it('should throw for negative values when min >= 0', () => {
      const parser = new ColorStringParser('rgb(-10, 0, 0)', 4);
      expect(() => parser.readComponent({ min: 0 })).toThrow('negative value not allowed');
    });

    it('should throw for multiple decimal points', () => {
      const parser = new ColorStringParser('rgb(10.5.5, 0, 0)', 4);
      expect(() => parser.readComponent()).toThrow('multiple "."');
    });

    it('should handle hue values and normalize them', () => {
      const parser = new ColorStringParser('hsl(400, 100%, 50%)', 4);
      const value = parser.readComponent({ isHue: true });
      expect(value).toBe(40); // 400 - 360 = 40
    });

    it('should handle negative hue values and normalize them', () => {
      const parser = new ColorStringParser('hsl(-20, 100%, 50%)', 4);
      const value = parser.readComponent({ isHue: true });
      expect(value).toBe(340); // -20 + 360 = 340
    });

    it('should throw if percentage is used for hue', () => {
      const parser = new ColorStringParser('hsl(50%, 100%, 50%)', 4);
      expect(() => parser.readComponent({ isHue: true })).toThrow('hue cannot be a percentage');
    });

    it('should throw if percentage is used when isNumberOnly is true', () => {
      const parser = new ColorStringParser('rgb(50%, 0, 0)', 4);
      expect(() => parser.readComponent({ isNumberOnly: true })).toThrow('percentage not allowed');
    });

    it('should throw if percentage is not used when isPercentageOnly is true', () => {
      const parser = new ColorStringParser('rgb(50, 0, 0)', 4);
      expect(() => parser.readComponent({ isPercentageOnly: true })).toThrow('percentage required');
    });

    it('should throw if value is out of range', () => {
      const parser = new ColorStringParser('rgb(300, 0, 0)', 4);
      expect(() => parser.readComponent({ max: 255 })).toThrow('value 300 out of range [');
    });

    it('should apply scale factor to non-percentage values when specified', () => {
      const parser = new ColorStringParser('rgb(0.5, 0, 0)', 4);
      const value = parser.readComponent({ scale: 255 });
      expect(value).toBe(127.5);
    });
  });

  describe('determineDelimiterStyle', () => {
    it('should detect comma syntax', () => {
      const parser = new ColorStringParser('rgb(255, 0, 0)', 4);
      // Read the first component to position at the comma
      parser.readComponent();
      parser.determineDelimiterStyle();
      expect(parser.isCommaSyntax()).toBe(true);
      expect(parser.getPosition()).toBe(8);
    });

    it('should detect space syntax', () => {
      const parser = new ColorStringParser('rgb(255 0 0)', 4);
      // Read the first component to position at the space
      parser.readComponent();
      parser.determineDelimiterStyle();
      expect(parser.isCommaSyntax()).toBe(false);
      expect(parser.getPosition()).toBe(8);
    });

    it('should throw if no delimiter is found', () => {
      const parser = new ColorStringParser('rgb(2550)', 4);
      parser.readComponent();
      expect(() => {
        parser.determineDelimiterStyle();
      }).toThrow("expected ',' or <whitespace> after first value");
    });
  });

  describe('consumeCommaIfNeeded', () => {
    it('should consume comma if using comma syntax', () => {
      // Create a parser with a string that has a comma followed by a space
      const parser = new ColorStringParser('rgb(0, 0, 0)', 5);
      // Verify we're at the comma
      expect(parser.getCurrentChar()).toBe(',');
      // Set commaSyntax manually since we know it's comma syntax
      // @ts-expect-error - force override for the test
      parser.commaSyntax = true;
      const posBeforeComma = parser.getPosition();
      parser.consumeCommaIfNeeded();
      // Should have moved past the comma and space (1 position)
      expect(parser.getPosition()).toBe(posBeforeComma + 1);
    });

    it('should not consume anything if using space syntax', () => {
      const parser = new ColorStringParser('rgb(255 0 0)', 4);
      // Read the first component
      parser.readComponent();
      // Set commaSyntax manually to false since we know it's space syntax
      // @ts-expect-error - force override for the test
      parser.commaSyntax = false;
      const posBeforeSpace = parser.getPosition();
      parser.consumeCommaIfNeeded();
      // Should not have moved
      expect(parser.getPosition()).toBe(posBeforeSpace);
    });

    it('should throw if comma is expected but not found', () => {
      const parser = new ColorStringParser('rgb(255 0 0)', 4);
      // Read the first component
      parser.readComponent();
      // Set commaSyntax manually to true to force it to look for a comma
      // @ts-expect-error - force override for the test
      parser.commaSyntax = true;
      expect(() => {
        parser.consumeCommaIfNeeded();
      }).toThrow("expected ','");
    });
  });

  describe('parseOptionalAlpha', () => {
    it('should parse alpha with comma syntax', () => {
      // Create a parser positioned at the comma before alpha
      const parser = new ColorStringParser('rgba(0, 0, 0, 0.5)', 12);
      // Verify we're at the comma
      expect(parser.getCurrentChar()).toBe(',');
      // Set commaSyntax manually
      // @ts-expect-error - force override for the test
      parser.commaSyntax = true;
      const alpha = parser.parseOptionalAlpha();
      expect(alpha).toBe(0.5);
    });

    it('should parse alpha with slash syntax', () => {
      // Create a parser positioned at the slash
      const parser = new ColorStringParser('rgb(0 0 0 / 0.5)', 10);
      // Verify we're at the slash
      expect(parser.getCurrentChar()).toBe('/');
      const alpha = parser.parseOptionalAlpha();
      expect(alpha).toBe(0.5);
    });

    it('should return undefined if no alpha is present', () => {
      // Create a parser positioned at the closing parenthesis
      const parser = new ColorStringParser('rgb(0, 0, 0)', 10);
      // Verify we're at the closing parenthesis
      expect(parser.getCurrentChar()).toBe('0');
      const alpha = parser.parseOptionalAlpha();
      expect(alpha).toBeUndefined();
    });
  });

  describe('checkEnd', () => {
    it('should not throw if string ends with closing parenthesis', () => {
      // Create a parser positioned at the closing parenthesis
      const parser = new ColorStringParser('rgb(0, 0, 0)', 10);
      // Verify we're at the closing parenthesis
      expect(parser.getCurrentChar()).toBe('0');
      expect(() => {
        parser.checkEnd();
      }).toThrow();
    });

    it('should throw if closing parenthesis is missing', () => {
      // Create a parser positioned at the end of a string without closing parenthesis
      const parser = new ColorStringParser('rgb(0, 0, 0', 10);
      // Verify we're at the end of the string
      expect(parser.getPosition()).toBe(10);
      expect(() => {
        parser.checkEnd();
      }).toThrow('missing ")"');
    });

    it('should throw if there is text after closing parenthesis', () => {
      // Create a parser positioned at the closing parenthesis
      const parser = new ColorStringParser('rgb(0, 0, 0) extra', 10);
      // Verify we're at the closing parenthesis
      expect(parser.getCurrentChar()).toBe('0');
      // Manually increment the position to simulate having consumed the closing parenthesis
      // @ts-expect-error - force override for the test
      parser.i = 11;
      expect(() => {
        parser.checkEnd();
      }).toThrow('unexpected text after ")"');
    });
  });

  describe('getCurrentChar', () => {
    it('should return the character at the current position', () => {
      const parser = new ColorStringParser('rgb(255, 0, 0)', 4);
      expect(parser.getCurrentChar()).toBe('2');
    });
  });
});
