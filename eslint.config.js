import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import stylisticJs from '@stylistic/eslint-plugin-js'
import pluginReact from 'eslint-plugin-react';
import unusedImports from "eslint-plugin-unused-imports";
import reactCompiler from 'eslint-plugin-react-compiler'

// export default [
//   {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ];

export default tseslint.config({
  extends: [
    // js.configs.recommended,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,

  ],
  files: ['**/*.{ts,tsx}'],
  ignores: [
    'node_modules',
    'dist',
    'postcss.config.mjs'
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    '@stylistic/js': stylisticJs,
    react: pluginReact,
    "unused-imports": unusedImports,
    'react-compiler': reactCompiler
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-compiler/react-compiler': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off",
    semi: ['warn', 'always'],
    'react/jsx-max-props-per-line': [
      'warn',
      {
        maximum: 2
      }
    ],
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
      },
    ],
    "@typescript-eslint/no-empty-object-type": "off",
    "indent": ["warn", 2],
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'no-promise-executor-return': 'off',
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    '@typescript-eslint/no-use-before-define': [
      'error'
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variableLike",
        "format": ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
        "leadingUnderscore": "allow"
      }
    ],
    "react-refresh/only-export-components": "off",
    "no-restricted-imports": "off",
    "@typescript-eslint/no-restricted-imports": [
      "warn",
      {
        "name": "react-redux",
        "importNames": ["useSelector", "useDispatch"],
        "message": "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
      }
    ],
  },
})
