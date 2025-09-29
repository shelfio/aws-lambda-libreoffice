/**
 * @type {import('jest').Config}
 */
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(is-video|@shelf/is-audio-filepath|is-image)/)'],
  resetMocks: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
