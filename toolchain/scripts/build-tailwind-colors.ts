import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const blobUrl =
  'https://raw.githubusercontent.com/tailwindlabs/tailwindcss/refs/heads/main/packages/tailwindcss/src/compat/colors.ts';

async function downloadTailwindColors() {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    const content = await response.text();

    const outputPath = 'src/plugins/tailwind/src/assets/raw.ts';
    const dir = dirname(outputPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, content);
    console.log('Successfully downloaded and saved Tailwind colors');
  } catch (error) {
    console.error('Error downloading Tailwind colors:', error);
    process.exit(1);
  }
}

function parseOKLCH(input: string): [number, number, number] {
  const regex = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/i;
  const match = input.match(regex);

  if (!match) throw new Error('Invalid input');

  const l = parseFloat(match[1]) / 100;
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  return [Math.round(l * 1000) / 1000, c, h];
}

type ShadeDict = Record<string, [number, number, number]>;

function buildShadeDict(input: object): ShadeDict {
  const shades: ShadeDict = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      shades[key] = parseOKLCH(value);
    }
  }
  return shades;
}

type ChromaShadeDict = Record<string, ShadeDict>;

async function assembleChromaKitColors() {
  const twConstants = (await import('../../src/plugins/tailwind/src/assets/raw')).default;
  const exemptKeys = ['inherit', 'currentcolor', 'transparent', 'black', 'white'];

  const assembledKeys: ChromaShadeDict = {};

  for (const [name, value] of Object.entries(twConstants)) {
    if (exemptKeys.includes(name)) continue;
    if (typeof value !== 'object') continue;

    assembledKeys[name] = buildShadeDict(value);
  }

  return assembledKeys;
}

function toSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function assembleChromaKitColorAST(name: string, dict: ShadeDict) {
  const jsdoc = `/**
 * Tailwind's ${toSentenceCase(name)} color palette.
 *
 * Generated from Tailwind v4's official colors, parsed in the OKLCh color space
 * for perceptual uniformity and advanced color manipulation.
 *
 * Each key (e.g., 50, 100, 200...) represents a shade as defined by Tailwind, with the corresponding
 * value being an {@link OKLChColor} object.
 *
 * @see https://tailwindcss.com/docs/colors#default-color-palette-reference
 */\n`;

  let colorString = `export const TW_${name.toUpperCase()}: TailwindPalette = {`;
  for (const [shade, [l, c, h]] of Object.entries(dict)) {
    colorString += `\n  ${shade}: oklch(${l}, ${c}, ${h}),`;
  }
  colorString += '\n};\n\n';

  return jsdoc + colorString;
}

function assembleFullObjectAST(dict: ChromaShadeDict) {
  let individualStr = ``;

  const jsdoc = `/**
 * An index of all Tailwind color palettes in the OKLCh color space.
 *
 * Each property corresponds to a Tailwind color family (e.g., "SLATE", "GRAY", "RED"),
 * and its value is the associated color palette object (e.g., {@link TW_SLATE}), where each shade
 * is represented as an {@link OKLChColor} object.
 *
 * Generated from Tailwind v4’s official colors for perceptual uniformity and advanced manipulation.
 *
 * @see https://tailwindcss.com/docs/colors#default-color-palette-reference
 * @example
 * TailwindColors.Slate[500] // -> OKLChColor for Slate 500
 */\n`;

  let colorString = `export const TailwindColors = {`

  for (const [shade, shadeDict] of Object.entries(dict)) {
    colorString += `\n  ${toSentenceCase(shade)}: TW_${shade.toUpperCase()},`;
    individualStr += assembleChromaKitColorAST(shade, shadeDict);
  }
  colorString += '\n};';

  return individualStr + jsdoc + colorString;
}

async function buildChromaKitColorFile(dict: ChromaShadeDict) {
  const fileHeader = `import type { TailwindPalette, TailwindPalettes } from './tailwind.types';\nimport { oklch } from '../../../models/oklch';\n\n`;

  const basicColors =
    `/**
 * Tailwind’s White color.
 *
 * While it is present in the v4 official docs as #ffffff, it has been instead parsed
 * in the OKLCh color space for perceptual uniformity and advanced color manipulation.
 *
 * @see https://tailwindcss.com/docs/colors#default-color-palette-reference
 */\n` +
    `export const TW_WHITE = oklch(1, 0, 0);\n\n` +
    `/**
 * Tailwind’s Black color.
 *
 * While it is present in the v4 official docs as #000000, it has been instead parsed
 * in the OKLCh color space for perceptual uniformity and advanced color manipulation.
 *
 * @see https://tailwindcss.com/docs/colors#default-color-palette-reference
 */\n` +
    `export const TW_BLACK = oklch(0, 0, 0);\n\n`;

  const fullObjectString = assembleFullObjectAST(dict);

  const outputFile = `src/plugins/tailwind/src/colors.ts`;
  const output = fileHeader + basicColors + fullObjectString;

  writeFileSync(outputFile, output);
}

export const gatherAndComputeTailwindColors = async () => {
  await downloadTailwindColors();
  const chromaKitColors = await assembleChromaKitColors();

  await buildChromaKitColorFile(chromaKitColors)
};
