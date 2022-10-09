// @ts-check

const jestConfig = {
  displayName: 'rebrickable-ts',
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/src/models/**',
    '!**/src/constants/**',
    '!**/src/config/**',
    '!**/src/structures/**',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFiles: ['dotenv/config'],
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = jestConfig;
