import { precomputeConeMatrixes } from './scripts/precompute-cone-matrixes';
import { gatherAndComputeTailwindColors } from './scripts/build-tailwind-colors';
import { buildContrastFile } from './scripts/build-tailwind-contrasts';

// precomputeConeMatrixes();
gatherAndComputeTailwindColors().then(() => console.log('Tailwind Colors compiled!'));
buildContrastFile();
