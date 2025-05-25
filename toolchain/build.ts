import { precomputeConeMatrixes } from './scripts/precompute-cone-matrixes';
import { gatherAndComputeTailwindColors } from './scripts/build-tailwind-colors';

precomputeConeMatrixes();
gatherAndComputeTailwindColors().then(() => console.log('Tailwind Colors compiled!'));
