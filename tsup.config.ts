import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    '!src/__tests__/**', '!src/**/*.test.*',

    'src/index.ts',
    'src/fn.ts',

    'src/plugins/a11y/index.ts',
    'src/plugins/a11y/fn.ts',

    'src/plugins/harmonies/index.ts',
    'src/plugins/harmonies/fn.ts',

    'src/plugins/tailwind/index.ts'
  ],
  format: ['esm'],
  external: ['vitest', '@vitest/ui', '@types/node'],
  target: 'es6',
  dts: true,
  experimentalDts: false,
  minify: true
});
