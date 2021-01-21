const NrwlWebpack = require('@nrwl/react/plugins/webpack');

module.exports = (config, context) => {
  NrwlWebpack(config);

  config.module.rules.push({
    test: /\.(js|ts)x?$/,
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true },
    enforce: 'post',
    include: require('path').join(__dirname, '..', 'src'),
    exclude: [
      /\.(e2e|test)\.ts$/,
      /node_modules/
    ]
  });

  return config;
};
