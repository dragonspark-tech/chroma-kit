/**
 * Color parsing module for converting string representations to Color objects.
 *
 * This module provides functionality to parse various color string formats into
 * Color objects, with optimizations for performance.
 * - A hot cache for recently parsed colors (target-space aware)
 * - Fast paths for common formats like hex strings
 * - Support for CSS color formats and ChromaKit's own serialization format
 * - Robust error handling and validation
 */

import { Color, ColorSpace, CreatedColor } from '../foundation';
import { parseV1 } from './serialization';
import { hexTosRGB } from '../models/srgb';

/**
 * Type for a color parser function that converts a string to a Color object.
 */
export type ColorParserFn = (input: string) => Color;

/**
 * Interface for a color parser registry entry.
 * Each entry represents a parser for a specific color format.
 */
export interface ParserRegistryEntry {
  /** The pattern to match for this parser */
  pattern: RegExp;
  /** The function that performs the parsing */
  parse: ColorParserFn;
}

/**
 * A registry of all available color parsers.
 */
const parserRegistry: ParserRegistryEntry[] = [];

// Cache for recently parsed colors to improve performance on repeated calls
const HOT_CACHE_SIZE = 64; // Increased size for better hit rate
const cache = new Map<string, Color>();

// LRU eviction tracking
const accessOrder: string[] = [];

/* istanbul ignore next -- test helper */
/* @__TEST__ */
/**
 * An object used internally for testing purposes, exposing private utilities and methods.
 * This variable should not be accessed directly in production code.
 *
 * @property {Function} cacheSet - A function to set values in the cache.
 * @property {Function} cacheGet - A function to retrieve values from the cache.
 * @property {Object} cache - An object representing the current state of the cache.
 * @property {Array} accessOrder - An array that tracks the order in which cache keys are accessed.
 * @property {Function} isValidHexColor - A utility function to validate if a string is a valid hex color code.
 * @property {Function} isValidChromaKitV1 - A utility function to validate if input conforms to Chroma Kit V1 specifications.
 * @property {Object} parserRegistry - A registry object managing different parser implementations.
 *
 * @private
 */
export const __TEST_ONLY = { cacheSet, cacheGet, cache, accessOrder, isValidHexColor, isValidChromaKitV1, parserRegistry };

/**
 * Manages the hot cache with LRU eviction policy
 */
function cacheGet(key: string): Color | undefined {
  const color = cache.get(key);
  if (color) {
    // Move to end (most recently used)
    const index = accessOrder.indexOf(key);
    if (index > -1) {
      accessOrder.splice(index, 1);
    }
    accessOrder.push(key);
  }
  return color;
}

function cacheSet(key: string, color: Color): void {
  // Evict least recently used if cache is full
  if (cache.size >= HOT_CACHE_SIZE && !cache.has(key)) {
    const lru = accessOrder.shift();
    if (lru) {
      cache.delete(lru);
    }
  }

  cache.set(key, color);

  // Update access order
  const index = accessOrder.indexOf(key);
  if (index > -1) {
    accessOrder.splice(index, 1);
  }
  accessOrder.push(key);
}

/**
 * Registers a parser for a specific color format.
 * This adds the parser to the registry for later use.
 *
 * @param pattern - The pattern to match for this parser
 * @param parse - The parsing function
 */
export function registerParser(pattern: RegExp, parse: ColorParserFn): void {
  parserRegistry.push({ pattern, parse });
}

/**
 * Clears the parser registry.
 * This is primarily used for testing purposes.
 * @internal
 */
export function clearParserRegistry(): void {
  parserRegistry.length = 0;
}

/**
 * Validates hex color string format
 */
function isValidHexColor(hex: string): boolean {
  if (hex.length !== 4 && hex.length !== 7 && hex.length !== 9) {
    return false;
  }

  // Check if all characters after # are valid hex digits
  for (let i = 1; i < hex.length; i++) {
    const char = hex.charCodeAt(i);
    if (!((char >= 48 && char <= 57) || // 0-9
      (char >= 65 && char <= 70) || // A-F
      (char >= 97 && char <= 102))) { // a-f
      return false;
    }
  }

  return true;
}

/**
 * Validates ChromaKit v1 serialization format
 */
function isValidChromaKitV1(input: string): boolean {
  // Matches: ChromaKit|v1 <space> <coords> [ / <alpha>]
  // E.g.,   ChromaKit|v1 rgb 0.1 0.2 0.3 / 0.5
  //         ChromaKit|v1 oklch 0.6 0.2 40

  // Accepts at least 3 numeric coords, optional more, optional " / <alpha>"
  // <space> is captured as a word (\w+), e.g., rgb, oklch, etc.
  // Numbers can be int, float, or exponential

  const chromaKitV1Pattern = /^ChromaKit\|v1 (\w+)((?: -?\d*\.?\d+(?:e[+-]?\d+)?){3,})(?: \/ ([01](?:\.\d+)?))?$/i;
  //                 ^---space---^ ^--------coords--------^  ^---optional alpha---^

  // Now, check if it matches, and also make sure all coords are numbers (not just empty spaces)
  const match = input.match(chromaKitV1Pattern);
  if (!match) return false;

  // Ensure at least 3 coords are present (already enforced by regex, but double-check)
  const coords = match[2].trim().split(/\s+/);
  if (coords.length < 3) return false;
  if (!coords.every(s => !isNaN(Number(s)))) return false;

  // If alpha is present, validate it is a number in [0,1]
  if (match[3] !== undefined) {
    const alpha = Number(match[3]);
    if (!(alpha >= 0 && alpha <= 1)) return false;
  }
  return true;
}

/**
 * Determines the appropriate parser for a CSS color string
 */
function getCSSColorParser(input: string): ColorParserFn | null {
  const trimmed = input.trim().toLowerCase();

  for (const entry of parserRegistry) {
    if (entry.pattern.test(trimmed)) {
      return entry.parse;
    }
  }

  return null;
}

/**
 * Parses a color string or converts a Color object to the specified color space.
 *
 * This function handles multiple input formats with optimized paths:
 * 1. If input is already a Color object, it's converted to the target space
 * 2. Recently parsed strings are retrieved from a target-space-aware hot cache
 * 3. Hex strings (e.g., "#FF0000") are validated and parsed via a fast path
 * 4. ChromaKit's own serialization format is validated and handled efficiently
 * 5. CSS color strings are parsed based on registered parsers
 *
 * Note: Before parsing CSS color strings, you must register the appropriate parsers.
 * You can either register all parsers at once:
 * ```
 * import { registerParsers } from './semantics/registerParsers';
 * registerParsers();
 * ```
 *
 * Or register only the parsers you need for better tree shaking:
 * ```
 * import { registerSRGBParser, registerHSLParser } from './semantics/registerParsers';
 * registerSRGBParser();
 * registerHSLParser();
 * ```
 *
 * @param input A color string or Color object to parse/convert
 * @param targetSpace The destination color space
 * @returns {CreatedColor} A Color object in the specified target space
 * @throws {TypeError} If input is null, undefined, or invalid type
 * @throws {SyntaxError} If the input string format is invalid or unsupported
 * @throws {Error} If no parsers are registered when trying to parse a CSS color string
 */
export function parseColor<T extends ColorSpace>(
  input: string | Color,
  targetSpace: T
): CreatedColor<T> {
  // Input validation
  if (input == null) {
    throw new TypeError('Color input cannot be null or undefined');
  }

  // Handle Color object input
  if (typeof input !== 'string') {
    if (typeof input === 'object' && 'to' in input) {
      return input.to(targetSpace);
    }
    throw new TypeError('Input must be a string or Color object');
  }

  // Handle empty or whitespace-only strings
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    throw new SyntaxError('Color string cannot be empty');
  }

  // Create cache key that includes target space
  const cacheKey = `${trimmedInput}:${targetSpace}`;

  // Check cache for recently parsed colors
  const cachedColor = cacheGet(cacheKey);
  if (cachedColor) {
    return cachedColor as CreatedColor<T>;
  }

  let parsedColor: Color;

  try {
    // Fast path for hex strings (starting with '#')
    if (trimmedInput[0] === '#') {
      if (!isValidHexColor(trimmedInput)) {
        throw new SyntaxError(`Invalid hex color format: ${trimmedInput}`);
      }
      parsedColor = hexTosRGB(trimmedInput);
    }
    // Fast path for ChromaKit v1 format
    else if (trimmedInput.startsWith('ChromaKit|v1')) {
      if (!isValidChromaKitV1(trimmedInput)) {
        throw new SyntaxError(`Invalid ChromaKit v1 format: ${trimmedInput}`);
      }
      parsedColor = parseV1(trimmedInput);
    }
    // CSS color string parsing
    else {
      if (parserRegistry.length === 0) {
        throw new Error(
          `No valid parser was found for the supplied input.` +
          `\nIf you're using the functional APIs, use direct parsers instead, like parseLabFromCSSString().` +
          `\nIf you're using the parseColor() method, parsers must be manually registered.`
        );
      }

      const parser = getCSSColorParser(trimmedInput);
      if (!parser) {
        throw new SyntaxError(`Unsupported color format: ${trimmedInput}`);
      }
      parsedColor = parser(trimmedInput);
    }

    // Convert to target space
    const result = parsedColor.to(targetSpace);

    // Cache the result
    cacheSet(cacheKey, result);

    return result;

  } catch (error) {
    // Re-throw with more context if it's not already a TypeError or SyntaxError
    if (error instanceof TypeError || error instanceof SyntaxError) {
      throw error;
    }
    throw new SyntaxError(`Failed to parse color "${trimmedInput}": ${(error as any).message || error}`);
  }
}

/**
 * Clears the color parsing cache
 * Useful for memory management in long-running applications
 */
export function clearColorCache(): void {
  cache.clear();
  accessOrder.length = 0;
}

/**
 * Gets current cache statistics for debugging/monitoring
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  hitRate?: number;
} {
  return {
    size: cache.size,
    maxSize: HOT_CACHE_SIZE,
    // TODO: Would need to track hits/misses to calculate hit rate
  };
}
