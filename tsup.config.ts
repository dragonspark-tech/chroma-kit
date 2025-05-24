import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/fn.ts', '!src/__tests__/**', '!src/**/*.test.*'],
  format: ['esm'],
  external: ['vitest', '@vitest/ui', '@types/node'],
  target: 'es6',
  dts: false,
  experimentalDts: true,
  minify: true
});
