import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import axios from 'axios'
import getEnvVariable from './lib/getEnvVariable'
import store from './store/index.js'
import i18n  from './setup/i18n.js'
import vuetify from './setup/vuetify.js'
import router from './router/index.js'

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
  const app = createApp(App)

  /* register plugins */
  app.use(i18n)
  app.use(vuetify)
  app.use(router)

  // Make axios availabe in all components
  app.config.globalProperties.$api = axios
  app.provide('$api', axios)
  // make store availble in all components
  app.provide('$store', store)

  // mount the app
  app.mount('#app')
} catch (err) {
  console.error(err)
}
