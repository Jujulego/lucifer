const fs = require('fs/promises');
const path = require('path');

/**
 * Add all .ts files under the source root as entrypoints
 * @param {Required<import('webpack').webpack.Configuration>} config
 * @param context
 * @return {import('webpack').webpack.Configuration}
 */
module.exports = (config, context) => {
  const { root, sourceRoot } = context.options;

  // Build entrypoints
  config.entry = () => fs.readdir(sourceRoot)
    .then((rules) => rules
      .filter((rule) => rule.endsWith('.ts'))
      .reduce((entries, rule) => {
        const name = rule.split('.')[0];
        entries[name] = path.join(root, sourceRoot, rule);

        return entries;
      }, {})
    );

  config.output.filename = '[name].js';

  return config;
}
