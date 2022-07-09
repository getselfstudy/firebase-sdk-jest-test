export default {
  displayName: 'bigquery',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|uuid|yaml|stringify-object|is-regexp|is-obj|unist-util-(.+?)|strip-ansi|ansi-regex)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/bigquery',
};
