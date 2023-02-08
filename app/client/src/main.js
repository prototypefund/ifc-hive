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
import capacitor from './setup/capacitor'
import VueApexCharts from "vue3-apexcharts";

// get env variables
const API_BASE_URL = getEnvVariable('VITE_API_BASE_URL')

// set default to accept all API endpoint version
axios.defaults.headers.common['Accept-Version'] = '*'
// set base path for API from env file
axios.defaults.baseURL = API_BASE_URL

/*
 * Send test request just to make sure we can talk to the back-end.
 * Is the API online? Do we get CORS errors etc?
 */
try {
  // create Vue root component
  const app = createApp({
    render: () => h(App),
  });


  /* register plugins */
  app.use(i18n)
  app.use(vuetify)
  app.use(capacitor)
  app.use(router)
  app.use(Markdown)
  app.use(VueApexCharts);

  // Make axios availabe in all components
  app.config.globalProperties.$api = axios
  app.provide('$api', axios)

  // TODO find out if this is a brainfart or not. I need $t in the components functions but I don't have this in compose API. Is there another way to get $t in compose api components script part?
  app.provide('$t', i18n.global.t)

  // make store availble in all components
  app.provide('$store', store)
  // make capacitor availble in all components 
  app.provide('$mobile', capacitor || false)

  // add global properties to app
  app.config.globalProperties.$filters = filters
  app.provide('$filters', filters)
  // mount the app
  app.mount('#app')
} catch (err) {
  console.error(err)
}
