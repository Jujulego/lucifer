module.exports = {
  displayName: 'react-api',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/react/api',
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/*.test.ts"
  ],
};
