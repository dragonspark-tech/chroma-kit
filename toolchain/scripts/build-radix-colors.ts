import { dirname } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { parseColor } from '../../src';
import { p3FromCSSString, p3ToXYZ, xyzToOKLCh } from '../../src/fn';

const baseUrl = 'https://raw.githubusercontent.com/radix-ui/colors/refs/heads/main/src/';

const targetBlobStubs = ['blackA.ts', 'whiteA.ts', 'dark.ts', 'light.ts'];
const targetBlobs = targetBlobStubs.map((stub) => baseUrl + stub);

async function downloadRadixColors() {
  try {
    const promises = targetBlobs.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const contents = await Promise.all(responses.map((response) => response.text()));

    const joinedData = contents.join('\n\n');
    const cleaned = joinedData.replace(
      /export const \w+ = \{[\s\S]+?};/g, // Find all exported objects
      (match) => (/display-p3/.test(match) ? match : '') // Keep only if "display-p3" is present
    );

    const cleanedAndTrimmed = cleaned.replace(/\n{3,}/g, '\n\n').trim();

    const outputPath = 'src/plugins/radix/src/assets/raw.ts';
    const dir = dirname(outputPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, cleanedAndTrimmed);
    console.log('Successfully downloaded and saved RadixUI colors');
  } catch (error) {
    console.error('Error downloading RadixUI colors:', error);
    process.exit(1);
  }
}

type ColorVector = [number, number, number, number?];

type DictItem = {
  light: ColorVector;
  dark: ColorVector;
  lightAlpha: ColorVector;
  darkAlpha: ColorVector;
};
type ShadeDict = Record<string, DictItem>;
type ChromaShadeDict = Record<string, ShadeDict>;

function extractShadeNumber(shadeKey: string): number | null {
  const match = shadeKey.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

async function assembleChromaKitColors() {
  const radixConstants = await import('../../src/plugins/radix/src/assets/raw');
  const assembledKeys: ChromaShadeDict = {};

  const cleanKeys = new Set(
    Object.keys(radixConstants).map((k) => k.replace(/(P3A?|Dark)+$/g, ''))
  );

  for (const key of cleanKeys) {
    assembledKeys[key] = {};
  }

  for (const [name, declaration] of Object.entries(radixConstants)) {
    const cleanName = name.replace(/(P3A?|Dark)+$/g, '');
    const isAlphaPalette = name.endsWith('A');
    const isDarkPalette = name.includes('Dark');

    const targetProperty = `${isDarkPalette ? 'dark' : 'light'}${isAlphaPalette ? 'Alpha' : ''}`;

    for (const [shade, value] of Object.entries(declaration)) {
      const targetKey = extractShadeNumber(shade);
      if (targetKey === null) continue;

      if (assembledKeys[cleanName][targetKey] === undefined) {
        assembledKeys[cleanName][targetKey] = {
          light: [0, 0, 0, 0],
          dark: [0, 0, 0, 0],
          lightAlpha: [0, 0, 0, 0],
          darkAlpha: [0, 0, 0, 0]
        };
      }

      const p3Color = p3FromCSSString(value);
      const oklchColor = xyzToOKLCh(p3ToXYZ(p3Color));

      const l = Math.round(oklchColor.l * 1000000) / 1000000;
      const c = Math.round(oklchColor.c * 1000000) / 1000000;
      const h = Math.round(oklchColor.h * 1000000) / 1000000;
      const a =
        oklchColor.alpha === undefined ? undefined : Math.round(oklchColor.alpha * 100000) / 100000;

      assembledKeys[cleanName][targetKey][targetProperty] = [l, c, h, a];
    }
  }

  return assembledKeys;
}

function toSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function assembleChromaKitColorAST(name: string, dict: ShadeDict) {
  const jsdoc = `/**
 * RadixUI's ${toSentenceCase(name)} color palette.
 *
 * Generated from RadixUI's official color repo, parsed in the OKLCh color space
 * for perceptual uniformity and advanced color manipulation.
 *
 * Each key (e.g., 1, 2, 3...) represents a shade as defined by RadixUI, with the corresponding
 * value being an {@link OKLChColor} object.
 *
 * @see https://www.radix-ui.com/colors
 * @see https://github.com/radix-ui/colors/tree/main/src
 */\n`;

  let colorString = `export const RDX_${name.toUpperCase()}: RadixPalette = {`;

  for (const [category, subDict] of Object.entries(dict)) {
    colorString += `\n  ${category}: {`;
    for (const [shade, [l, c, h, a]] of Object.entries(subDict)) {
      colorString += `\n    ${shade}: oklch(${l}, ${c}, ${h}${a === undefined ? '' : `, ${a}`}),`;
    }
    colorString += '\n  },';
  }
  colorString += '\n};\n\n';

  return jsdoc + colorString;
}

await assembleChromaKitColors();

function assembleFullObjectAST(dict: ChromaShadeDict) {
  let individualStr = ``;

  const jsdoc = `/**
 * An index of all RadixUI's color palettes in the OKLCh color space.
 *
 * Each property corresponds to a Radix color family (e.g., "Gray", "Mauve", "Tomato"),
 * and its value is the associated color palette object (e.g., {@link RDX_TOMATO}), where each shade
 * is represented as an {@link OKLChColor} object.
 *
 * Generated from RadixUI's official color repo, parsed in the OKLCh color space
 * for perceptual uniformity and advanced color manipulation.

 * @see https://github.com/radix-ui/colors/tree/main/src
 * @example
 * RadixColors.Tomato[5] // -> OKLChColor for Tomato 5
 */\n`;

  let colorString = `export const RadixColors = {`;

  for (const [shade, shadeDict] of Object.entries(dict)) {
    colorString += `\n  ${toSentenceCase(shade)}: RDX_${shade.toUpperCase()},`;
    individualStr += assembleChromaKitColorAST(shade, shadeDict);
  }
  colorString += '\n};';

  return individualStr + jsdoc + colorString;
}

async function buildChromaKitColorFile(dict: ChromaShadeDict) {
  const fileHeader = `import type { RadixPalette } from './radix.types';\nimport { oklch } from '../../../models/oklch';\n\n`;

  const fullObjectString = assembleFullObjectAST(dict);
  const outputFile = `src/plugins/radix/src/colors.ts`;
  const output = fileHeader + fullObjectString;

  writeFileSync(outputFile, output);
}

export const gatherAndComputeRadixColors = async () => {
  await downloadRadixColors();
  const chromaKitColors = await assembleChromaKitColors();

  await buildChromaKitColorFile(chromaKitColors);
};
