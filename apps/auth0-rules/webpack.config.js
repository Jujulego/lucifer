const fs = require('fs/promises');
const path = require('path');

/**
 * Add all .ts files under the "rules" directory as entrypoints
 * @param {Required<import('webpack').webpack.Configuration>} config
 * @param context
 * @return {import('webpack').webpack.Configuration}
 */
module.exports = (config, context) => {
  const { root, sourceRoot } = context.options;

  // Build entrypoints
  config.entry = () => fs.readdir(path.join(sourceRoot, 'rules'))
    .then((rules) => rules
      .filter((rule) => rule.endsWith('.ts'))
      .reduce((entries, rule) => {
        const name = rule.split('.')[0];
        entries[name] = path.join(root, sourceRoot, 'rules', rule);

        return entries;
      }, {})
    );

  config.output.filename = '[name].js';

  return config;
}
