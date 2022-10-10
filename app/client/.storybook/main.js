// use `mergeConfig` to recursively merge Vite options

const { mergeConfig } = require('vite');
//const { use } = require('vue');

config = {
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

/*

const { createI18n, useI18n } = require('vue-i18n')
const { createVueI18nAdapter } = require('vuetify/locale/adapters/vue-i18n')
const { messages } =  require('../i18n/messages')
// import messages from '../i18n/messages'

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  globalInjection: true,
  locale: 'de', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
})

const locale = createVueI18nAdapter({
  i18n,
  useI18n,
})
*/

// require('esm')(module);



/*
module.exports = config
require = require('esm')(module);
V = require('vue')
V2 = require('../src/setup/i18n.js')
//V.use("");
require = require('esm')(module);
module.exports = require('./realMain.js');
*/
module.exports = config
