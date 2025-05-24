import '../../conversion/register-all-conversions';

import { describe, expect, it, vi, afterEach } from 'vitest';
import { deltaE, type DeltaEAlgorithm } from '../../deltae/auto-deltae';
import * as deltaE76Module from '../../deltae/deltae-76';
import * as deltaE2000Module from '../../deltae/deltae-2000';
import * as deltaECMCModule from '../../deltae/deltae-cmc';
import * as deltaEJZModule from '../../deltae/deltae-jz';
import * as deltaEOKModule from '../../deltae/deltae-ok';
import * as deltaEOKScaledModule from '../../deltae/deltae-ok-scaled';
import * as parsingModule from '../../semantics/parsing';
import { srgb } from '../../models/srgb';

describe('Auto Delta E', () => {
  describe('Basic functionality', () => {
    it('should use the default algorithm (2000) when not specified', () => {
      const spy = vi.spyOn(deltaE2000Module, 'deltaE2000');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'lab');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'lab');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should accept Color objects as input', () => {
      const spy = vi.spyOn(deltaE2000Module, 'deltaE2000');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      // Create mock Color objects
      const color1 = srgb(1, 0, 0);
      const color2 = srgb(0, 1, 0);

      deltaE(color1, color2);

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith(color1, 'lab');
      expect(parseSpy).toHaveBeenCalledWith(color2, 'lab');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Algorithm selection', () => {
    it('should use deltaE76 for "Euclidean" algorithm', () => {
      const spy = vi.spyOn(deltaE76Module, 'deltaE76');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00', 'Euclidean');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'lab');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'lab');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use deltaECMC for "CMC" algorithm', () => {
      const spy = vi.spyOn(deltaECMCModule, 'deltaECMC');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00', 'CMC');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'lch');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'lch');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use deltaE2000 for "2000" algorithm', () => {
      const spy = vi.spyOn(deltaE2000Module, 'deltaE2000');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00', '2000');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'lab');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'lab');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use deltaEOK for "OKLab" algorithm', () => {
      const spy = vi.spyOn(deltaEOKModule, 'deltaEOK');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00', 'OKLab');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'oklab');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'oklab');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use deltaEOKScaled for "ScaledOKLab" algorithm', () => {
      const spy = vi.spyOn(deltaEOKScaledModule, 'deltaEOKScaled');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00', 'ScaledOKLab');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'oklab');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'oklab');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use deltaEJZ for "Jz" algorithm', () => {
      const spy = vi.spyOn(deltaEJZModule, 'deltaEJZ');
      const parseSpy = vi.spyOn(parsingModule, 'parseColor');

      deltaE('#ff0000', '#00ff00', 'Jz');

      expect(parseSpy).toHaveBeenCalledTimes(2);
      expect(parseSpy).toHaveBeenCalledWith('#ff0000', 'jzczhz');
      expect(parseSpy).toHaveBeenCalledWith('#00ff00', 'jzczhz');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error for unknown algorithm', () => {
      expect(() => {
        // @ts-ignore - Testing runtime behavior with invalid input
        deltaE('#ff0000', '#00ff00', 'Unknown');
      }).toThrow('Unknown algorithm: Unknown');
    });
  });

  describe('Integration tests', () => {
    it('should return a numeric result for each algorithm', () => {
      const algorithms: DeltaEAlgorithm[] = [
        'Euclidean',
        'CMC',
        '2000',
        'OKLab',
        'ScaledOKLab',
        'Jz'
      ];

      for (const algorithm of algorithms) {
        const result = deltaE('#ff0000', '#00ff00', algorithm);
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThan(0);
      }
    });

    it('should return 0 for identical colors with each algorithm', () => {
      const algorithms: DeltaEAlgorithm[] = [
        'Euclidean',
        'CMC',
        '2000',
        'OKLab',
        'ScaledOKLab',
        'Jz'
      ];

      for (const algorithm of algorithms) {
        const result = deltaE('#ff0000', '#ff0000', algorithm);
        expect(result).toBe(0);
      }
    });
  });

  // Reset all mocks after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });
});
