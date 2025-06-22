import { TailwindColors } from '../../src/plugins/tailwind';
import { contrastAPCA, rgb } from '../../src';
import { writeFileSync } from 'node:fs';

type ShadeContrasts = {
  shade: number;
  colorOnWhite: number;
  colorOnBlack: number;
};

type ContrastMap = {
  [color: string]: ShadeContrasts[];
};

function buildTailwindContrasts() {
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);

  const contrastMap: ContrastMap = {};

  for (const [color, palette] of Object.entries(TailwindColors)) {
    contrastMap[color] = [];
    for (const [shade, colorObj] of Object.entries(palette)) {
      const onWhite = contrastAPCA(colorObj.to('rgb'), white);
      const onBlack = contrastAPCA(colorObj.to('rgb'), black);

      const shadeContrasts: ShadeContrasts = {
        shade: parseInt(shade),
        colorOnWhite: onWhite,
        colorOnBlack: onBlack
      };

      contrastMap[color].push(shadeContrasts);
    }
  }

  return contrastMap;
}

function averageShadeContrasts(): ShadeContrasts[] {
  const contrastMap = buildTailwindContrasts();
  const shadeSums: {
    [shade: number]: { totalOnWhite: number; totalOnBlack: number; count: number };
  } = {};

  for (const color in contrastMap) {
    const bannedColors = ['Slate', 'Gray', 'Zinc', 'Neutral', 'Stone'];
    if (bannedColors.includes(color)) continue;

    for (const shadeContrast of contrastMap[color]) {
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
  return result;
}

function buildAST() {
  const type = `export type ShadeContrastAverage = {
  shade: number;
  onWhite: number;
  onBlack: number;
}\n`;

  const contrasts = averageShadeContrasts();
  let baseDec = `export const ShadeContrastAverages: ShadeContrastAverage[] = [\n`;
  for (const contrast of contrasts) {
    baseDec += `  { shade: ${contrast.shade}, onWhite: ${contrast.colorOnWhite}, onBlack: ${contrast.colorOnBlack} },\n`;
  }
  baseDec += `];\n`;

  return type + '\n' + baseDec;
}

export function buildTailwindContrastFile() {
  const baseDoc = buildAST();
  const outputFile = `src/plugins/palettes/src/support/tw-contrast-averages.ts`;

  writeFileSync(outputFile, baseDoc);
}
