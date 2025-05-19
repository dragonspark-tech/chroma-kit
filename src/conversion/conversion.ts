import { ColorBase, ColorSpace } from '../foundation';

/**
 * Type for a color conversion function that converts from one color space to another.
 */
export type ColorConversionFn<TFrom extends ColorBase, TTo extends ColorBase> = (
  color: TFrom,
  ...args: any[]
) => TTo;

/**
 * Interface for a color conversion registry entry.
 */
interface ConversionRegistryEntry<TFrom extends ColorBase, TTo extends ColorBase> {
  from: string;
  to: string;
  convert: ColorConversionFn<TFrom, TTo>;
}

/**
 * A registry of all available direct color conversions.
 * This is used to build conversion paths between color spaces.
 */
const conversionRegistry: ConversionRegistryEntry<any, any>[] = [];

/**
 * Registers a conversion function from one color space to another.
 *
 * @param from The source color space
 * @param to The target color space
 * @param convert The conversion function
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
 */
const conversionGraph: Record<string, string[]> = {};

/**
 * Builds the conversion graph from the conversion registry.
 * This should be called after all conversions are registered.
 */
export function buildConversionGraph(): void {
  // Clear the existing graph
  Object.keys(conversionGraph).forEach((key) => delete conversionGraph[key]);

  // Build the conversion graph
  for (const entry of conversionRegistry) {
    if (!conversionGraph[entry.from]) {
      conversionGraph[entry.from] = [];
    }
    conversionGraph[entry.from].push(entry.to);
  }
}

/**
 * Finds the shortest path between two color spaces using breadth-first search.
 *
 * @param from The source color space
 * @param to The target color space
 * @returns An array of color spaces representing the path, or null if no path exists
 */
function findConversionPath(from: string, to: string): string[] | null {
  if (from === to) {
    return [from];
  }

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
 * Gets a conversion function that converts from one color space to another.
 * If a direct conversion exists, it is returned. Otherwise, a chain of conversions is created.
 *
 * @param from The source color space
 * @param to The target color space
 * @returns A function that converts from the source color space to the target color space, or null if no conversion path exists
 */
export function getConversionFunction<TFrom extends ColorBase, TTo extends ColorBase>(
  from: string,
  to: string
): ColorConversionFn<TFrom, TTo> {
  // Check for direct conversion
  const directConversion = conversionRegistry.find(
    (entry) => entry.from === from && entry.to === to
  );
  if (directConversion) {
    return directConversion.convert;
  }

  // Find a path between the color spaces
  const path = findConversionPath(from, to);
  if (!path || path.length < 2) {
    throw new Error(
      `No conversion found from ${from} to ${to}.\nPlease open an issue at https://github.com/dragonspark-tech/chroma-kit/issues`
    );
  }

  // Create a chain of conversions
  return (color: TFrom, ...args: any[]): TTo => {
    let result: any = color;

    for (let i = 0; i < path.length - 1; i++) {
      const fromSpace = path[i];
      const toSpace = path[i + 1];

      const conversion = conversionRegistry.find(
        (entry) => entry.from === fromSpace && entry.to === toSpace
      );

      if (!conversion) {
        throw new Error(
          `No conversion found from ${fromSpace} to ${toSpace}.\nPlease open an issue at https://github.com/dragonspark-tech/chroma-kit/issues`
        );
      }

      result = conversion.convert(result, ...args);
    }

    return result as TTo;
  };
}

/**
 * Converts a color from one color space to another.
 *
 * @param color The color to convert
 * @param to The target color space
 * @param args Additional arguments to pass to the conversion function
 * @returns The converted color, or null if no conversion path exists
 */
export function convertColor<TFrom extends ColorBase, TTo extends ColorBase>(
  color: TFrom,
  to: string,
  ...args: any[]
): TTo {
  // Ensure the conversion graph is built
  if (Object.keys(conversionGraph).length === 0) {
    buildConversionGraph();
  }

  const from = color.space;

  if (from === to) {
    return color as unknown as TTo;
  }

  const conversionFn = getConversionFunction<TFrom, TTo>(from, to);
  return conversionFn(color, ...args);
}
