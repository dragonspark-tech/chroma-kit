import { computeAdaptationMatrix } from '../../src/adaptation/chromatic-adaptation';
import { IlluminantD50, IlluminantD65 } from '../../src/standards/illuminants';
import { BradfordConeModel } from '../../src/adaptation/cone-response';
import { writeFileSync } from 'node:fs';
import type { Matrix3x3 } from '../../src/utils/linear';

export const precomputeConeMatrixes = () => {
  const BRADFORD_D50_TO_D65 = computeAdaptationMatrix(IlluminantD50, IlluminantD65, BradfordConeModel);
  const BRADFORD_D65_TO_D50 = computeAdaptationMatrix(IlluminantD65, IlluminantD50, BradfordConeModel);

  const makeMatrixCode = (variableName: string, matrix: Matrix3x3): string =>
    `\nexport const ${variableName}: Matrix3x3 = ${JSON.stringify(matrix, null, 2)};\n`;

  const preflight = `import type { Matrix3x3 } from '../utils/linear';\n`;

  const packageNames = `\nexport const coneMatrixes: {[key: string]: Matrix3x3} = {
  'BRADFORD_D50_TO_D65': BRADFORD_D50_TO_D65,
  'BRADFORD_D65_TO_D50': BRADFORD_D65_TO_D50
};`;

  const outputRoute = './src/adaptation/_cone-matrixes.ts';

  const fileContent = preflight + makeMatrixCode('BRADFORD_D50_TO_D65', BRADFORD_D50_TO_D65) + makeMatrixCode('BRADFORD_D65_TO_D50', BRADFORD_D65_TO_D50) + packageNames;

  writeFileSync(outputRoute, fileContent);
}
