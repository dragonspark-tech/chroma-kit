import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'istanbul',
      exclude: ['toolchain/**/*.ts']
    }
  }
});
