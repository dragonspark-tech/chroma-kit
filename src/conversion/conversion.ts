import { ColorBase } from '../foundation';

/**
 * This module provides a flexible color conversion system that allows for converting colors
 * between different color spaces. It uses a graph-based approach to find conversion paths
 * when direct conversions aren't available.
 *
 * The system works by:
 * 1. Registering direct conversion functions between color spaces
 * 2. Building a graph representation of available conversions
 * 3. Finding the shortest path between color spaces when needed
 * 4. Chaining conversion functions to convert between any supported color spaces
 */

/**
 * Type for a color conversion function that converts from one color space to another.
 *
 * @template TFrom - The source color space type
 * @template TTo - The target color space type
 * @param color - The color to convert
 * @param args - Additional arguments that might be needed for the conversion
 * @returns The converted color in the target color space
 */
export type ColorConversionFn<TFrom extends ColorBase, TTo extends ColorBase> = (
  color: TFrom,
  ...args: any[]
) => TTo;

/**
 * Interface for a color conversion registry entry.
 * Each entry represents a direct conversion between two color spaces.
 *
 * @template TFrom - The source color space type
 * @template TTo - The target color space type
 */
interface ConversionRegistryEntry<TFrom extends ColorBase, TTo extends ColorBase> {
  /** The source color space identifier */
  from: string;
  /** The target color space identifier */
  to: string;
  /** The function that performs the conversion */
  convert: ColorConversionFn<TFrom, TTo>;
}

/**
 * A registry of all available direct color conversions.
 * This is used to build conversion paths between color spaces.
 */
const conversionRegistry: ConversionRegistryEntry<any, any>[] = [];

/**
 * Clears the conversion registry.
 * This is primarily used for testing purposes.
 * @internal
 */
export function clearConversionRegistry(): void {
  conversionRegistry.length = 0;
}

/**
 * Registers a conversion function from one color space to another.
 * This adds the conversion to the registry for later use.
 *
 * @template TFrom - The source color space type
 * @template TTo - The target color space type
 * @param from - The source color space identifier
 * @param to - The target color space identifier
 * @param convert {ColorConversionFn} - The conversion function
 */
export function registerConversion<TFrom extends ColorBase, TTo extends ColorBase>(
  from: string,
  to: string,
  convert: ColorConversionFn<TFrom, TTo>
): void {
  conversionRegistry.push({ from, to, convert });
}

/**
 * A graph representation of the color conversion registry.
 * This is used to find the shortest path between color spaces.
 * Keys are source color spaces, values are arrays of target color spaces.
 */
const conversionGraph: Record<string, string[]> = {};

/**
 * Builds the conversion graph from the conversion registry.
 * This creates a directed graph where nodes are color spaces and edges are direct conversions.
 * This function should be called after all conversions are registered.
 */
export function buildConversionGraph(): void {
  // Clear the existing graph
  Object.keys(conversionGraph).forEach((key) => delete conversionGraph[key]);

  // Build the graph from the registry
  for (const entry of conversionRegistry) {
    if (!conversionGraph[entry.from]) {
      conversionGraph[entry.from] = [];
    }
    conversionGraph[entry.from].push(entry.to);
  }
}

/**
 * Finds the shortest path between two color spaces using breadth-first search.
 * This function implements a standard BFS algorithm to find the shortest sequence
 * of conversions needed to go from one color space to another.
 *
 * @param from - The source color space identifier
 * @param to - The target color space identifier
 * @returns An array of color space identifiers representing the conversion path, or null if no path exists
 */
function findConversionPath(from: string, to: string): string[] | null {
  const queue: { space: string; path: string[] }[] = [{ space: from, path: [from] }];
  const visited = new Set<string>([from]);

  while (queue.length > 0) {
    const { space, path } = queue.shift()!;

    const neighbors = conversionGraph[space] || [];
    for (const neighbor of neighbors) {
      if (neighbor === to) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ space: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null;
}

/**
 * Creates an error message for when a conversion path cannot be found.
 * The message includes helpful information about how to resolve the issue.
 *
 * @param from - The source color space identifier
 * @param to - The target color space identifier
 * @returns A formatted error message string
 */
const buildConversionError = (from: string, to: string): string =>
    `No conversion path could be found from ${from} to ${to}.` +
    `\nIf you're using the functional APIs, use direct conversions instead, like rgbToOKLCh().` +
    `\nIf you're using the to() methods, conversions must be manually registered.`;

/**
 * Gets a conversion function that converts from one color space to another.
 * This function tries to find the most efficient conversion path:
 * 1. First checks if a direct conversion exists
 * 2. If not, finds the shortest path through multiple conversions
 * 3. Creates a function that chains these conversions together
 *
 * @template TFrom - The source color space type
 * @template TTo - The target color space type
 * @param from - The source color space identifier
 * @param to - The target color space identifier
 * @returns {ColorConversionFn} A function that converts from the source color space to the target color space
 * @throws Error if no conversion path can be found
 */
export function getConversionFunction<TFrom extends ColorBase, TTo extends ColorBase>(
  from: string,
  to: string
): ColorConversionFn<TFrom, TTo> {

  if (from === to) {
    return (color: TFrom) => color as unknown as TTo;
  }

  const directConversion = conversionRegistry.find(
    (entry) => entry.from === from && entry.to === to
  );

  if (directConversion) {
    return directConversion.convert;
  }

  const path = findConversionPath(from, to);

  if (!path || path.length < 2)
    throw Error(buildConversionError(from, to));

  return (color: TFrom, ...args: any[]): TTo => {
    let result: any = color;

    for (let i = 0; i < path.length - 1; i++) {
      const fromSpace = path[i];
      const toSpace = path[i + 1];

      const conversion = conversionRegistry.find(
        (entry) => entry.from === fromSpace && entry.to === toSpace
      );

      if (!conversion)
        throw new Error(buildConversionError(fromSpace, toSpace));

      result = conversion.convert(result, ...args);
    }

    return result as TTo;
  };
}

/**
 * Converts a color from one color space to another.
 * This is the main entry point for color conversion. It:
 * 1. Ensures the conversion graph is built
 * 2. Handles the case where source and target spaces are the same
 * 3. Gets the appropriate conversion function and applies it
 *
 * @template TFrom - The source color space type
 * @template TTo - The target color space type
 * @param color - The color to convert
 * @param to - The target color space identifier
 * @param args - Additional arguments to pass to the conversion function
 * @returns The converted color in the target color space
 * @throws Error if no conversion path can be found
 */
export function convertColor<TFrom extends ColorBase, TTo extends ColorBase>(
  color: TFrom,
  to: string,
  ...args: any[]
): TTo {
  const from = color.space;

  if (Object.keys(conversionGraph).length === 0) {
    buildConversionGraph();
  }

  const conversionFn = getConversionFunction<TFrom, TTo>(from, to);
  return conversionFn(color, ...args);
}
