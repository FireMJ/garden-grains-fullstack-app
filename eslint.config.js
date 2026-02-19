import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'src/app/menu.current_backup/**',  // Ignore backup folder
      '**/*.d.ts'  // Ignore declaration files
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly'
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin
    },
    rules: {
      // Turn off rules that aren't needed in Next.js
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      
      // Enable Next.js recommended rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      
      // React rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      // Custom overrides
      'react/no-unescaped-entities': 'off', // Temporarily disable this
      '@next/next/no-img-element': 'warn', // Change to warning instead of error
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Special handling for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript-specific rules can go here
    }
  }
];
