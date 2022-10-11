const { mergeConfig } = require('vite');
//const { use } = require('vue');

config = {
  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: (await import('../vite.config.js')).default.resolve,
    });
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": ['@storybook/addon-links', '@storybook/addon-essentials'
    //"@storybook/addon-links",
    // "@storybook/addon-essentials",
    // "@storybook/addon-interactions"
  ],
  "framework": "@storybook/vue3",
  "core": {
    builder: "@storybook/builder-vite",
    disableTelemetry: true
  },
  "features": {
    "storyStoreV7": true
  }
}
module.exports = config
