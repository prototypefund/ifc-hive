// use `mergeConfig` to recursively merge Vite options
const { mergeConfig } = require('vite');

module.exports = {
  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: {
        alias: { foo: 'bar' },
      },
    });
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-vite",
    disableTelemetry: true
  },
  "features": {
    "storyStoreV7": true
  }
}
