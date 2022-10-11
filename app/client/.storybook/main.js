// use `mergeConfig` to recursively merge Vite options
// import { defineConfig } from 'vite'
const { mergeConfig } = require('vite');
//const { use } = require('vue');

config = {
  async viteFinal(config, { configType }) {
    // return the customized config
    function path_resolve(a,b) {return a + '/../' + b;}
    console.log((await import('../vite.config.mjs')).default.resolve)


    return mergeConfig(config, {
      // customize the Vite config here
      resolve: (await import('../vite.config.mjs')).default.resolve,
      /*
      resolve: {
        alias: {
            '@': path_resolve(__dirname, './src/components'),
            '@w': path_resolve(__dirname, './src/components/widgets'),
            '@p': path_resolve(__dirname, './src/components/pages'),
            '@t': path_resolve(__dirname, './src/components/templates'),
            '@u': path_resolve(__dirname, './src/components/utils'),
            '@lib': path_resolve(__dirname, './src/lib'),
        },
      },*/
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

// require('esm')(module);

/*
module.exports = config
require = require('esm')(module);
V = require('vue')
V2 = require('../src/setup/i18n.js')
require = require('esm')(module);
module.exports = require('./realMain.js');
*/

require = require('esm')(module);

require('../src/setup/i18n.js')
// require('../vite.config.mjs')


// import '../vite.config.mjs'
// i18n = (await import('../src/setup/i18n.js'))


module.exports = config
