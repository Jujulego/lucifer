module.exports = {
  displayName: 'react-utils',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/react/utils',
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/*.stories.{ts,tsx}",
  ],
};
