module.exports = {
  expand: true,
  notify: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  moduleFileExtensions: [
    'js', 'json', 'ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/specs/**/*.spec.ts'
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/dist',
    '<rootDir>/coverage',
    '<rootDir>/playground',
    '<rootDir>/node_modules'
  ],
  globals: {
    describe: true,
    it: true,
    expect: true,
    'ts-jest': {
      babelConfig: true
    }
  }
};
