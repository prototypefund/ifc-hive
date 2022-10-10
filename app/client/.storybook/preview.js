

/*
@TODO Compile story book fails
[vue-docgen] A default value needs to be a function when your type is an object or array
file: /home/tower/vue/ifc-hive/app/client/src/components/utils/quicklist/handler.vue

ERR! Error: A default value needs to be a function when your type is an object or array

transforming (1482) node_modules/vuetify/lib/components/VItemGroup/VItemGroup.cssinfo => Manager built (20 s)
✓ 2118 modules transformed.
[vue-docgen] A default value needs to be a function when your type is an object or array
file: /home/tower/vue/ifc-hive/app/client/src/components/utils/quicklist/handler.vue
ERR! Error: A default value needs to be a function when your type is an object or array
ERR!     at describeDefault (/home/tower/vue/ifc-hive/app/client/node_modules/vue-docgen-api/dist/script-handlers/propHandler.js:332:27)

................................

ERR!   code: 'PLUGIN_ERROR',
ERR!   plugin: 'vue-docgen',
ERR!   hook: 'transform',
ERR!   id: '/home/tower/vue/ifc-hive/app/client/src/components/utils/quicklist/handler.vue',
*/


//import vuetify from '../src/setup/vuetify.js'

// https://github.com/kazupon/vue-i18n/blob/dev/examples/storybook/.storybook/config.js
/*


*/

Vue.use("i18n")
import { createApp, h, provide } from 'vue'
// ambiguous indirect export: use 
import i18n from '../src/setup/i18n.js'
import vuetify from '../src/setup/vuetify.js'
import store from '../src/store/index.js'
// use(i18n)
// provide('$store', store)
//export default store
//export default vuetify

// import { use } from "vue";

// export default {vuetify, i18n, store}
/*
import { addDecorator } from "@storybook/vue3";
import { withI18n } from "storybook-addon-i18n";

addDecorator(withI18n);*/


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}


/*
 * import App from '../src/App.vue'
 */

/* register plugins */

/*

const app = createApp({
  render: () => h(App)
});

app.use(i18n)
app.use(vuetify)
app.use(router)
app.use(Markdown)

// Make axios availabe in all components
app.config.globalProperties.$api = axios
app.provide('$api', axios)
// make store availble in all components
app.provide('$store', store)

// add global properties to app
app.config.globalProperties.$filters = filters*/

/*  
Vue.use(MyStore);
Vue.prototype.$store = store;

app.provide('$store', store)

import { configure } from '@storybook/vue'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadStories() {
  require('../src/stories')
}

configure(loadStories, module)*/

/*
import { createApp, h } from 'vue'
import App from './App.vue'
import axios from 'axios'
import Markdown from 'vue3-markdown-it'
import getEnvVariable from './lib/getEnvVariable'
import store from './store/index.js'
import i18n from './setup/i18n.js'
import vuetify from './setup/vuetify.js'
import router from './router/index.js'
import filters from './setup/filters.js'


ctag config
lsp server

const Vue = require('vue');
const MyStore = require('mini-rx-store');
const store = require('../src/store');

Vue.use(MyStore);
Vue.prototype.$store = store;*/
