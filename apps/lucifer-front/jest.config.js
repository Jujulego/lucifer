module.exports = {
  displayName: 'lucifer-front',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/lucifer-front',
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ]
};
