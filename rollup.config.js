import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: [
    // ESM bundle
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    // CommonJS bundle
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    // Minified ESM bundle (.min)np
    {
      file: 'dist/index.esm.min.js',
      format: 'esm',
      plugins: [terser({
        ecma: 6,
        module: true,
        toplevel: true,
        compress: { pure_getters: true, passes: 2 },
        format: { wrap_func_args: false },
        mangle: true
      })],
      sourcemap: true
    },
    // Minified CommonJS bundle (.min)
    {
      file: 'dist/index.cjs.min.js',
      format: 'cjs',
      plugins: [terser({
        ecma: 6,
        module: true,
        toplevel: true,
        compress: { pure_getters: true },
        format: { wrap_func_args: false },
      })],
      sourcemap: true
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      clean: true
    })
  ]
};

export default config;
