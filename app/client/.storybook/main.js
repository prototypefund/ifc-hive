// use `mergeConfig` to recursively merge Vite options
const { mergeConfig } = require('vite');

/*
const Vue = require('vue');
const MyStore = require('mini-rx-store');
const store = require('../src/store');

Vue.use(MyStore);
Vue.prototype.$store = store;*/



module.exports = {
  async viteFinal(config, { configType }) {
    // return the customized config
    function path_resolve(a,b) {return a + '/../' + b;}
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: {
        alias: {
            '@': path_resolve(__dirname, './src/components'),
            '@w': path_resolve(__dirname, './src/components/widgets'),
            '@p': path_resolve(__dirname, './src/components/pages'),
            '@t': path_resolve(__dirname, './src/components/templates'),
            '@u': path_resolve(__dirname, './src/components/utils'),
            '@lib': path_resolve(__dirname, './src/lib'),
        },
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
