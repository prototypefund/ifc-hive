const { mergeConfig } = require('vite');
//const { use } = require('vue');

config = {
  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: {
        // Get those from vite config file
        alias: {
          '@': '../src/components',
          '@w': '../src/components/widgets',
          '@p': '../src/components/pages',
          '@t': '../src/components/templates',
          '@u': '../src/components/utils',
          '@lib': '../src/lib'
        },
      }
    });
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [],
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
