import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'vuetify/styles' // Global CSS has to be imported
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import  'roboto-fontface/css/roboto/roboto-fontface.css'
import getEnvVariable from './lib/getEnvVariable'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const API_BASE_URL = getEnvVariable('VITE_API_BASE_URL')

// set default to accept all API endpoint version
axios.defaults.headers.common['Accept-Version'] = '*'
// @TODO change to API_BASE_URL
axios.defaults.baseURL = API_BASE_URL

console.log('API_BASE_URL', API_BASE_URL)
/*
 * Send test request just to make sure we can talk to the back-end.
 * Is the API online? Do we get CORS errors etc?
 */
const sendTestRequest = async () => {
  try {
    // create root component
    const app = createApp(App)
    const vuetify = createVuetify({
        components,
        directives,
      })
    app.use(vuetify)

    // add axios to all components
    app.config.globalProperties.$api = axios
    app.provide('$api', axios)
    // mount the app
    app.mount('#app')
  } catch (err) {
    console.error(err)
  }
}

sendTestRequest()
