const rootMain = require('../../../.storybook/main');

rootMain.stories.push(
  '../../../libs/**/src/lib/**/*.stories.mdx',
  '../../../libs/**/src/lib/**/*.stories.@(js|jsx|ts|tsx)'
);

module.exports = rootMain;
