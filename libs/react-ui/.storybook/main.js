const rootMain = require('../../../.storybook/main');
const assetFunctions = require('@benarnold/sass-asset-functions');
const path = require('path');

module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },
  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    ...rootMain.addons,
    '@nrwl/react/plugins/storybook',
    'storybook-addon-themes',
    'storybook-addon-theme-toggle',
  ],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    /* Load images within SCSS inline */

    const index = config.module.rules.findIndex(
      (item) =>
        item.test.toString() === '/\\.css$|\\.scss$|\\.sass$|\\.less$|\\.styl$/'
    );
    const newOneOf = config.module.rules[index].oneOf.map((item) => {
      if (item.test.toString().match('scss')) {
        const newUse = item.use.map((useItem) => {
          if (useItem.loader && useItem.loader.match('sass-loader')) {
            const sassOptions = useItem.options.sassOptions;
            const newUseItem = {
              ...useItem,
              options: {
                ...useItem.options,
                sassOptions: {
                  ...sassOptions,
                  functions: assetFunctions({
                    images_path: path.resolve(__dirname, '../src/'),
                  }),
                },
              },
            };
            return newUseItem;
          } else return useItem;
        });
        return { ...item, use: newUse };
      } else return item;
    });

    config.module.rules[index].oneOf = newOneOf;

    return config;
  },
};
