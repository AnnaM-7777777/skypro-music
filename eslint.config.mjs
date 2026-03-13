import next from '@next/eslint-plugin-next';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        ignores: ['node_modules/**', '.next/**', 'out/**'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            '@next/next': next,
            '@typescript-eslint': typescriptEslintPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            '@next/next/no-html-link-for-pages': 'error',
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'react/react-in-jsx-scope': 'off',
        },
    },
];
