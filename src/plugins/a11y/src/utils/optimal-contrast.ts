import { sRGBColor, srgbToHSL, srgbToXYZ } from '../../../../models/srgb';
import { hsl, hslToRGB } from '../../../../models/hsl';
import { contrastAPCA, contrastWCAG21 } from '../../../../contrast';
import { parseColor } from '../../../../semantics/parsing';
import { type Color } from '../../../../foundation';

/**
 * Supported contrast calculation methods
 * - APCA: Advanced Perceptual Contrast Algorithm
 * - WCAG21: Web Content Accessibility Guidelines 2.1
 */
type OptimalContrastMethod = 'APCA' | "WCAG21";

/**
 * Function type for calculating contrast between two colors
 *
 * @param foreground - The foreground color in sRGB color space
 * @param background - The background color in sRGB color space
 * @returns The contrast value between the two colors
 */
type ContrastFunction = (foreground: sRGBColor, background: sRGBColor) => number;

/**
 * Generic function to find an optimal color for contrast by adjusting lightness
 * Uses binary search to find a color with the closest contrast to the target
 *
 * @param foreground - The foreground color in sRGB color space
 * @param background - The background color in sRGB color space
 * @param targetContrast - The desired contrast value
 * @param contrastFn - The function to use for calculating contrast
 * @param maxIterations - Maximum number of iterations for the binary search (default: 32)
 * @param epsilon - Precision threshold for the binary search (default: 0.001)
 * @returns A new color with optimal contrast while preserving hue and saturation
 */
const getOptimalColorForContrastGeneric = (
  foreground: sRGBColor,
  background: sRGBColor,
  targetContrast: number,
  contrastFn: ContrastFunction,
  maxIterations = 32,
  epsilon = 0.001
) => {
  const fgHSL = srgbToHSL(foreground);

  const hue = fgHSL.h;
  const saturation = fgHSL.s;

  let low = 0.0;
  let high = 1.0;
  let closestTone = low;
  let minDiff = Number.POSITIVE_INFINITY;

  for (let i = 0; i < maxIterations && (high - low) > epsilon; i++) {
    const mid = (low + high) / 2;

    const fgCurrent = hslToRGB(hsl(hue, saturation, mid));

    const currentContrast = contrastFn(fgCurrent, background);
    const Δ = Math.abs(Math.abs(targetContrast) - Math.abs(currentContrast));

    if (Δ < minDiff) {
      minDiff = Δ;
      closestTone = mid;
    }

    if (currentContrast < targetContrast) {
      const fgLow = hslToRGB(hsl(hue, saturation, low));
      const contrastLow = contrastFn(fgLow, background);
      if (contrastLow < targetContrast) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      const fgLow = hslToRGB(hsl(hue, saturation, low));
      const contrastLow = contrastFn(fgLow, background);
      if (contrastLow < targetContrast) {
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  return hslToRGB(hsl(hue, saturation, closestTone));
}

/**
 * Finds an optimal color for APCA contrast by adjusting lightness
 *
 * @param foreground - The foreground color in sRGB color space
 * @param background - The background color in sRGB color space
 * @param targetContrast - The desired APCA contrast value
 * @returns A new color with optimal APCA contrast while preserving hue and saturation
 */
export const getOptimalColorForContrastAPCA = (foreground: sRGBColor, background: sRGBColor, targetContrast: number) => {
  return getOptimalColorForContrastGeneric(foreground, background, targetContrast, contrastAPCA);
}

/**
 * Wrapper function for WCAG 2.1 contrast calculation that works with sRGB colors
 * Converts sRGB colors to XYZ before calculating contrast
 *
 * @param foreground - The foreground color in sRGB color space
 * @param background - The background color in sRGB color space
 * @returns The WCAG 2.1 contrast ratio between the two colors
 */
const wcagContrastWrapper = (foreground: sRGBColor, background: sRGBColor) =>
  contrastWCAG21(srgbToXYZ(foreground), srgbToXYZ(background));

/**
 * Finds an optimal color for WCAG 2.1 contrast by adjusting lightness
 *
 * @param foreground - The foreground color in sRGB color space
 * @param background - The background color in sRGB color space
 * @param targetContrast - The desired WCAG 2.1 contrast ratio
 * @returns A new color with optimal WCAG 2.1 contrast while preserving hue and saturation
 */
export const getOptimalColorForContrastWCAG21 = (foreground: sRGBColor, background: sRGBColor, targetContrast: number) => {
  return getOptimalColorForContrastGeneric(foreground, background, targetContrast, wcagContrastWrapper);
}

/**
 * Finds an optimal color for contrast using either APCA or WCAG 2.1 method
 * This is a convenience function that accepts various color formats
 *
 * @param foreground - The foreground color (text color) in any supported format
 * @param background - The background color in any supported format
 * @param targetContrast - The desired contrast value
 * @param method - The contrast calculation method to use (default: 'APCA')
 * @returns A new color with optimal contrast while preserving hue and saturation
 */
export const getOptimalColorForContrast = (foreground: Color | string, background: Color | string, targetContrast: number, method: OptimalContrastMethod = 'APCA') => {
  const fgRGB = parseColor(foreground, 'srgb');
  const bgRGB = parseColor(background, 'srgb');

  switch (method) {
    case 'APCA':
      return getOptimalColorForContrastAPCA(fgRGB, bgRGB, targetContrast);
    case 'WCAG21':
      return getOptimalColorForContrastWCAG21(fgRGB, bgRGB, targetContrast);
    default:
      throw new Error(`Unknown contrast algorithm: ${method}`);
  }
}
