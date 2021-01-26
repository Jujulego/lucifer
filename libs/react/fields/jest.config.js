module.exports = {
  displayName: 'react-fields',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/react/fields',
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/*.stories.{ts,tsx}",
  ]
};
