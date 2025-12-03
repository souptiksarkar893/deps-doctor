module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    'bin/**/*.js',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/test/**/*.test.js'
  ],
  verbose: true
};
