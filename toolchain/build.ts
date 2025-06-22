import { precomputeConeMatrixes } from './scripts/precompute-cone-matrixes';
import { gatherAndComputeTailwindColors } from './scripts/build-tailwind-colors';
import { buildTailwindContrastFile } from './scripts/build-tailwind-contrasts';
import { gatherAndComputeRadixColors } from './scripts/build-radix-colors';

// precomputeConeMatrixes();
gatherAndComputeTailwindColors().then(() => console.log('Tailwind Colors compiled!'));
buildTailwindContrastFile();

gatherAndComputeRadixColors().then(() => console.log('Radix Colors compiled!'));
buildRadixContrastFile();
