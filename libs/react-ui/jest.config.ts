export default {
  displayName: 'react-ui',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/../../jest.helpers/fileTransformer.cjs',
    '\\.[jt]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|uuid|yaml|stringify-object|is-regexp|is-obj|unist-util-(.+?)|strip-ansi|ansi-regex)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'png', 'jpg', 'jpeg'],
  coverageDirectory: '../../coverage/libs/react-ui',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'react-ui.junit.xml',
      },
    ],
  ],
  preset: '../../jest.preset.js',
};
