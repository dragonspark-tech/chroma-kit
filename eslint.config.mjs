import eslint from '@eslint/js';
import teseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default teseslint.config(
  eslint.configs.recommended,
  teseslint.configs.strictTypeChecked,
  teseslint.configs.stylisticTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    ignores: ['eslint.config.mjs']
  }
);
