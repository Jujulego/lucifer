module.exports = {
  displayName: 'react-basics',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/react/basics',
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ]
};
