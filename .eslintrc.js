module.exports = {
  env: {
    'browser': true,
    'es2021': true,
    'node': true,
    'vue/setup-compiler-macros': true,
  },

  extends: [
    'plugin:vue/vue3-recommended', //
    'airbnb-base',
    'airbnb-typescript/base',
  ],

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaVersion: 2021,
    extraFileExtensions: ['.mjs', '.vue'],
    parser: {
      'js': '@typescript-eslint/parser',
      'mjs': '@typescript-eslint/parser',
      'ts': '@typescript-eslint/parser',
      '<template>': 'espree',
    },
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },

  plugins: [
    'vue', //
    'import',
    '@typescript-eslint',
  ],

  rules: {
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'indent': 'off',
    'max-len': [1, { code: 120 }],
    'no-console': 'off',
    'no-debugger': 'off',
    'no-shadow': 'off',
    'no-spaced-func': 'off',
    'no-unused-vars': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'vue/no-unused-vars': ['warn', { ignorePattern: '^_' }],
    'vue/script-setup-uses-vars': 'error',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'], //
        ],
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
      },
    },
  },
};
