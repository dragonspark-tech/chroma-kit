import { writeFileSync } from 'node:fs';
import { contrastAPCA, rgb } from '../../src';
import { OKLChColor } from '../../src/models/oklch/oklch';
import { RadixColors } from '../../src/plugins/radix/src/colors';
import { RadixShade } from '../../src/plugins/radix/src/radix.types';

type ShadeContrasts = {
  shade: number;
  colorOnWhite: number;
  colorOnBlack: number;
};

type ContrastSet = {
  light: ShadeContrasts[];
  dark: ShadeContrasts[];
  lightAlpha: ShadeContrasts[];
  darkAlpha: ShadeContrasts[];
};

type ContrastMap = {
  [color: string]: ContrastSet;
};

function buildRadixContrasts() {
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);

  const contrastMap: ContrastMap = {};

  for (const [color, palette] of Object.entries(RadixColors)) {
    const contrastSet = {} as ContrastSet;
    for (const [shade, colorSystem] of Object.entries(palette)) {
      const sys = colorSystem as RadixShade;
      for (const [set, colorOb] of Object.entries(sys)) {
        if (!contrastSet[set]) {
          contrastSet[set] = [];
        }

        const colorObj = colorOb as OKLChColor;
        const onWhite = contrastAPCA(colorObj.to('rgb'), white);
        const onBlack = contrastAPCA(colorObj.to('rgb'), black);

        const shadeContrasts: ShadeContrasts = {
          shade: parseInt(shade),
          colorOnWhite: onWhite,
          colorOnBlack: onBlack
        };

        contrastSet[set].push(shadeContrasts);
      }
      contrastMap[color] = contrastSet;
    }
  }

  return contrastMap;
}

function averageShadeContrasts(): ContrastSet {
  const contrastMap = buildRadixContrasts();
  const categories = ['light', 'dark', 'lightAlpha', 'darkAlpha'] as (keyof ContrastMap)[];
  const bannedColors = ['Black', 'White', 'Slate'];
  const set: ContrastSet = {} as ContrastSet;

  for (const category of categories) {
    const shadeSums: {
      [shade: number]: { totalOnWhite: number; totalOnBlack: number; count: number };
    } = {};

    for (const color in contrastMap) {
      if (bannedColors.includes(color)) continue;

      for (const shadeContrast of contrastMap[color][category]) {
        const { shade, colorOnWhite, colorOnBlack } = shadeContrast;
        if (!shadeSums[shade]) {
          shadeSums[shade] = { totalOnWhite: 0, totalOnBlack: 0, count: 0 };
        }
        shadeSums[shade].totalOnWhite += colorOnWhite;
        shadeSums[shade].totalOnBlack += colorOnBlack;
        shadeSums[shade].count += 1;
      }
    }

    const result: ShadeContrasts[] = [];
    for (const shade in shadeSums) {
      const { totalOnWhite, totalOnBlack, count } = shadeSums[shade];
      result.push({
        shade: Number(shade),
        colorOnWhite: totalOnWhite / count,
        colorOnBlack: totalOnBlack / count
      });
    }

    result.sort((a, b) => a.shade - b.shade);
    set[category] = result;
  }

  return set;
}

function buildAST() {
  const type1 = `export type ShadeContrastAverage = {
        shade: number;
        onWhite: number;
        onBlack: number;
      }\n\n`;

  const type2 = `export type ShadeContrastMap = {
        light: ShadeContrastAverage[];
        dark: ShadeContrastAverage[];
        lightAlpha: ShadeContrastAverage[];
        darkAlpha: ShadeContrastAverage[];
      }\n`;

  const contrasts = averageShadeContrasts();
  let baseDec = `export const ShadeContrastAverages: ShadeContrastMap = {\n`;
  for (const [category, contrastSet] of Object.entries(contrasts)) {
    baseDec += `  ${category}: [\n`;
    for (const contrast of contrastSet) {
      baseDec += `    { shade: ${contrast.shade}, onWhite: ${contrast.colorOnWhite}, onBlack: ${contrast.colorOnBlack} },\n`;
    }
    baseDec += `  ],\n`;
  }
  baseDec += `};\n`;

  return type1 + type2 + baseDec;
}

export function buildRadixContrastFile() {
  const baseDoc = buildAST();
  const outputFile = `src/plugins/palettes/src/support/radix-contrast-averages.ts`;

  writeFileSync(outputFile, baseDoc);
}
