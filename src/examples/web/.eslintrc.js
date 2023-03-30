module.exports = {
  extends: ['prettier', 'plugin:@typescript-eslint/recommended', 'plugin:destructuring/recommended'],
  plugins: ['prettier', '@typescript-eslint', 'destructuring'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
  },
};
