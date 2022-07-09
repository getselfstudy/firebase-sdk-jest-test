const parentConfig = require('@nrwl/react/plugins/webpack');
const nodeExternals = require('webpack-node-externals');

const ext = nodeExternals();
module.exports = (config, context) => {
  parentConfig(config, context);

  config.watchOptions = {
    ...config.watchOptions,
    ignored: ['**/node_modules/**', '**/.yarn/**'],
  };

  config.externals = [
    (...args) => {
      const [{ request }, callback] = args;
      // inline ESM js libs
      if (/stringify-object|strip-ansi|unist-util-visit/.test(request)) {
        return callback();
      }
      // use the rest as external deps
      return ext(...args);
    },
  ];

  return {
    ...config,
    target: 'node',
  };
};
