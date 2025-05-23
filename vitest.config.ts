import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['toolchain'],
    coverage: {
      provider: 'istanbul'
    }
  }
});
