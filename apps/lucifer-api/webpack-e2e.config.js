const path = require('path');

module.exports = (config, context) => {
  const options = context.buildOptions || context.options;

  config.module.rules.push({
    test: /\.(js|ts)x?$/,
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true },
    enforce: 'post',
    include: [
      path.join(__dirname, 'src'),
      path.join(options.root, 'libs'),
    ],
    exclude: [
      /\.(e2e|test)\.ts$/,
      /node_modules/
    ]
  });

  return config;
};
