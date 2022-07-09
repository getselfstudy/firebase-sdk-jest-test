export default {
  displayName: 'functions',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|uuid|yaml|stringify-object|is-regexp|is-obj|unist-util-(.+?)|strip-ansi|ansi-regex)/)',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../../coverage/apps/functions',
  setupFilesAfterEnv: ['jest-extended/all'],
  preset: '../../jest.preset.js',
};
