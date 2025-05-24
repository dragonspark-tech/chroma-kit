/**
 * This module provides a convenient way to register all available color parsers.
 *
 * Import and call the registerParsers function to register all parsers at once:
 * ```
 * import { registerParsers } from './registerParsers';
 * registerParsers();
 * ```
 *
 * For better tree shaking, you can import and register only the parsers you need:
 * ```
 * import { registerSRGBParser } from './registerSRGB';
 * registerSRGBParser();
 * ```
 */

import {
  registerHSLParser,
  registerHSVParser,
  registerHWBParser,
  registerLABParser,
  registerLCHParser,
  registerOKLABParser,
  registerOKLCHParser,
  registerSRGBParser,
  registerXYZParser
} from './default-parsers';

/**
 * Registers all available color parsers.
 */
export function registerAllParsers(): void {
  registerSRGBParser();
  registerHSLParser();
  registerHSVParser();
  registerHWBParser();
  registerLABParser();
  registerLCHParser();
  registerOKLABParser();
  registerOKLCHParser();
  registerXYZParser();
}

registerAllParsers();
