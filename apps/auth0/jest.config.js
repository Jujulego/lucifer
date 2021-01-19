module.exports = {
  displayName: 'auth0',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/auth0',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/*.test.ts"
  ]
};
