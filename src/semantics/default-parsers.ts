import { registerParser } from './parsing';
import { rgbFromCSSString } from '../models/rgb';
import { hslFromCSSString } from '../models/hsl';
import { hsvFromCSSString } from '../models/hsv';
import { hwbFromCSSString } from '../models/hwb';
import { labFromCSSString } from '../models/lab';
import { lchFromCSSString } from '../models/lch';
import { oklabFromCSSString } from '../models/oklab';
import { oklchFromCSSString } from '../models/oklch';
import { xyzFromCSSString } from '../models/xyz';
import { p3FromCSSString } from '../models/p3/parser';

/**
 * Registers the RGB color parser.
 */
export function registerSRGBParser(): void {
  registerParser(/^rgba?\s*\(/i, rgbFromCSSString);
}

/**
 * Registers the HSL color parser.
 */
export function registerHSLParser(): void {
  registerParser(/^hsla?\s*\(/i, hslFromCSSString);
}

/**
 * Registers the HSV color parser.
 */
export function registerHSVParser(): void {
  registerParser(/^hsv\s*\(/i, hsvFromCSSString);
}

/**
 * Registers the HWB color parser.
 */
export function registerHWBParser(): void {
  registerParser(/^hwb\s*\(/i, hwbFromCSSString);
}

/**
 * Registers the LAB color parser.
 */
export function registerLABParser(): void {
  registerParser(/^lab\s*\(/i, labFromCSSString);
}

/**
 * Registers the LCH color parser.
 */
export function registerLCHParser(): void {
  registerParser(/^lch\s*\(/i, lchFromCSSString);
}

/**
 * Registers the OKLAB color parser.
 */
export function registerOKLABParser(): void {
  registerParser(/^oklab\s*\(/i, oklabFromCSSString);
}

/**
 * Registers the OKLCH color parser.
 */
export function registerOKLCHParser(): void {
  registerParser(/^oklch\s*\(/i, oklchFromCSSString);
}

/**
 * Registers the CSS Color Level 4 parser.
 */
export function registerCSS4Parser(): void {
  registerParser(/^color\s*\(/i, (input: string) => {
    if (input.includes('xyz-')) {
      return xyzFromCSSString(input);
    } else if (input.includes('display-p3')) {
      return p3FromCSSString(input);
    }
    throw new SyntaxError('Generic CSS Color 4 parsing not implemented yet');
  });
}
