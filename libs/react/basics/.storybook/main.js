const rootMain = require('../../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(...['../src/stories/**/*.stories.mdx', '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'])

module.exports = rootMain;
