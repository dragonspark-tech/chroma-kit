import { describe, expect, it, vi, beforeEach } from 'vitest';
import { registerAllConversions } from '../../conversion/register-all-conversions';
import * as conversionModule from '../../conversion/conversion';
import { clearConversionRegistry } from '../../conversion/conversion';
import { rgb } from '../../models/rgb';
import { hsl } from '../../models/hsl';
import { hsv } from '../../models/hsv';

describe('Register Conversions', () => {
  // Spy on the registerConversion function
  const registerConversionSpy = vi.spyOn(conversionModule, 'registerConversion');

  // Spy on the buildConversionGraph function
  const buildConversionGraphSpy = vi.spyOn(conversionModule, 'buildConversionGraph');

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Clear the conversion registry
    clearConversionRegistry();

    // Call registerAllConversions to set up the conversion system
    registerAllConversions();
  });

  describe('registerAllConversions', () => {
    it('should register all color space conversions', () => {
      // Verify that registerConversion was called multiple times
      expect(registerConversionSpy).toHaveBeenCalled();

      // Check a few specific conversions to ensure they were registered
      expect(registerConversionSpy).toHaveBeenCalledWith('rgb', 'xyz', expect.any(Function));
      expect(registerConversionSpy).toHaveBeenCalledWith('rgb', 'hsl', expect.any(Function));
      expect(registerConversionSpy).toHaveBeenCalledWith('xyz', 'lab', expect.any(Function));
      expect(registerConversionSpy).toHaveBeenCalledWith('lab', 'lch', expect.any(Function));
      expect(registerConversionSpy).toHaveBeenCalledWith('oklab', 'oklch', expect.any(Function));
      expect(registerConversionSpy).toHaveBeenCalledWith('jzazbz', 'jzczhz', expect.any(Function));
    });

    it('should build the conversion graph', () => {
      // Verify that buildConversionGraph was called
      expect(buildConversionGraphSpy).toHaveBeenCalled();
    });
  });

  describe('Conversion Functionality', () => {
    it('should enable conversion between any two registered color spaces', () => {
      // Test conversion from RGB to Lab
      const rgbColor = rgb(1, 0, 0); // Red in RGB
      const labColor = rgbColor.to('lab');

      expect(labColor.space).toBe('lab');
      expect(typeof labColor.l).toBe('number');
      expect(typeof labColor.a).toBe('number');
      expect(typeof labColor.b).toBe('number');

      // Test conversion from Lab back to RGB
      const roundTripRgb = labColor.to('rgb');

      expect(roundTripRgb.space).toBe('rgb');
      expect(roundTripRgb.r).toBeCloseTo(1, 1);
      expect(roundTripRgb.g).toBeCloseTo(0, 1);
      expect(roundTripRgb.b).toBeCloseTo(0, 1);
    });

    it('should enable conversion between color spaces that require multiple steps', () => {
      // Test conversion from HSL to OKLab (requires multiple steps)
      const hslColor = hsl(120, 1, 0.5); // Green in HSL
      const oklabColor = hslColor.to('oklab');

      expect(oklabColor.space).toBe('oklab');
      expect(typeof oklabColor.l).toBe('number');
      expect(typeof oklabColor.a).toBe('number');
      expect(typeof oklabColor.b).toBe('number');

      // Test conversion from OKLab back to HSL
      const roundTripHsl = oklabColor.to('hsl');

      expect(roundTripHsl.space).toBe('hsl');
      expect(roundTripHsl.h).toBeCloseTo(120, 0);
      expect(roundTripHsl.s).toBeCloseTo(1, 1);
      expect(roundTripHsl.l).toBeCloseTo(0.5, 1);
    });

    it('should preserve alpha values during conversions', () => {
      // Test with alpha value
      const rgbColor = rgb(1, 0, 0, 0.5); // Red in RGB with 50% opacity
      const labColor = rgbColor.to('lab');

      expect(labColor.alpha).toBe(0.5);

      // Test round trip
      const roundTripRgb = labColor.to('rgb');
      expect(roundTripRgb.alpha).toBe(0.5);
    });
  });

  describe('Specific Color Space Conversions', () => {
    it('should correctly convert between RGB and HSL', () => {
      // Red in RGB
      const red = rgb(1, 0, 0);
      const redHsl = red.to('hsl');

      expect(redHsl.h).toBeCloseTo(0, 0);
      expect(redHsl.s).toBeCloseTo(1, 5);
      expect(redHsl.l).toBeCloseTo(0.5, 5);

      // Green in RGB
      const green = rgb(0, 1, 0);
      const greenHsl = green.to('hsl');

      expect(greenHsl.h).toBeCloseTo(120, 0);
      expect(greenHsl.s).toBeCloseTo(1, 5);
      expect(greenHsl.l).toBeCloseTo(0.5, 5);

      // Blue in RGB
      const blue = rgb(0, 0, 1);
      const blueHsl = blue.to('hsl');

      expect(blueHsl.h).toBeCloseTo(240, 0);
      expect(blueHsl.s).toBeCloseTo(1, 5);
      expect(blueHsl.l).toBeCloseTo(0.5, 5);
    });

    it('should correctly convert between RGB and HSV', () => {
      // Red in RGB
      const red = rgb(1, 0, 0);
      const redHsv = red.to('hsv');

      expect(redHsv.h).toBeCloseTo(0, 0);
      expect(redHsv.s).toBeCloseTo(1, 5);
      expect(redHsv.v).toBeCloseTo(1, 5);

      // Green in RGB
      const green = rgb(0, 1, 0);
      const greenHsv = green.to('hsv');

      expect(greenHsv.h).toBeCloseTo(120, 0);
      expect(greenHsv.s).toBeCloseTo(1, 5);
      expect(greenHsv.v).toBeCloseTo(1, 5);

      // Blue in RGB
      const blue = rgb(0, 0, 1);
      const blueHsv = blue.to('hsv');

      expect(blueHsv.h).toBeCloseTo(240, 0);
      expect(blueHsv.s).toBeCloseTo(1, 5);
      expect(blueHsv.v).toBeCloseTo(1, 5);
    });

    it('should correctly convert between HSL and HSV', () => {
      // Red in HSL
      const redHsl = hsl(0, 1, 0.5);
      const redHsv = redHsl.to('hsv');

      expect(redHsv.h).toBeCloseTo(0, 0);
      expect(redHsv.s).toBeCloseTo(1, 5);
      expect(redHsv.v).toBeCloseTo(1, 5);

      // Green in HSL
      const greenHsl = hsl(120, 1, 0.5);
      const greenHsv = greenHsl.to('hsv');

      expect(greenHsv.h).toBeCloseTo(120, 0);
      expect(greenHsv.s).toBeCloseTo(1, 5);
      expect(greenHsv.v).toBeCloseTo(1, 5);

      // Blue in HSL
      const blueHsl = hsl(240, 1, 0.5);
      const blueHsv = blueHsl.to('hsv');

      expect(blueHsv.h).toBeCloseTo(240, 0);
      expect(blueHsv.s).toBeCloseTo(1, 5);
      expect(blueHsv.v).toBeCloseTo(1, 5);
    });

    it('should correctly convert between HSV and HWB', () => {
      // Red in HSV
      const redHsv = hsv(0, 1, 1);
      const redHwb = redHsv.to('hwb');

      expect(redHwb.h).toBeCloseTo(0, 0);
      expect(redHwb.w).toBeCloseTo(0, 5);
      expect(redHwb.b).toBeCloseTo(0, 5);

      // White in HSV
      const whiteHsv = hsv(0, 0, 1);
      const whiteHwb = whiteHsv.to('hwb');

      expect(whiteHwb.w).toBeCloseTo(1, 5);
      expect(whiteHwb.b).toBeCloseTo(0, 5);

      // Black in HSV
      const blackHsv = hsv(0, 0, 0);
      const blackHwb = blackHsv.to('hwb');

      expect(blackHwb.w).toBeCloseTo(0, 5);
      expect(blackHwb.b).toBeCloseTo(1, 5);
    });
  });
});
