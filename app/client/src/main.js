import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import getEnvVariable from './lib/getEnvVariable'

const API_BASE_URL = getEnvVariable('VITE_API_BASE_URL')

// set default to accept all API endpoint version
axios.defaults.headers.common['Accept-Version'] = '1.0'
// @TODO change to API_BASE_URL
axios.defaults.baseURL = API_BASE_URL

console.log('API_BASE_URL', API_BASE_URL)
/*
 * Send test request just to make sure we can talk to the back-end.
 * Is the API online? Do we get CORS errors etc?
 */
const sendTestRequest = async () => {
  try {
    const res = await axios.get('/items/2', {
      headers: {
        'Accept-Version': '1.0'
      }
    })
    console.dir(res.data)
    // create root component
    const app = createApp(App)
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
