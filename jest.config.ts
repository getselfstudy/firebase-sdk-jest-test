const { getJestProjects } = require('@nrwl/jest');
const preset = require('ts-jest/jest-preset');

export default {
  ...preset,
  projects: getJestProjects(),
};
