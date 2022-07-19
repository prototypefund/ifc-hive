import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import routes from './routes'
import axios from 'axios'
import messages from './i18n/messages'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'
import 'vuetify/styles' // Global CSS has to be imported
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import getEnvVariable from './lib/getEnvVariable'
import { store } from './store'
import { createRouter, createWebHistory } from 'vue-router'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { forEachHook, beforeResolveHook } from './lib/routerHooks.js'

const API_BASE_URL = getEnvVariable('VITE_API_BASE_URL')

// set default to accept all API endpoint version
axios.defaults.headers.common['Accept-Version'] = '*'
// @TODO change to API_BASE_URL
axios.defaults.baseURL = API_BASE_URL
/*
 * Send test request just to make sure we can talk to the back-end.
 * Is the API online? Do we get CORS errors etc?
 */
const sendTestRequest = async () => {
  try {

    // create Vue root component
    const app = createApp(App)
    // create router instance
    const router = createRouter({
      history: createWebHistory(),
      routes,
    })

    /*
     * configure i18n
     * @TODO allow for lazy loading and componen specific locale files
     */
    const i18n = createI18n({
      legacy: false, // you must set `false`, to use Composition API
      globalInjection: true,
      locale: 'de', // set locale
      fallbackLocale: 'en', // set fallback locale
      messages, // set locale messages
    })

    /*
     * Create vuetify instance
     * @TODO move to separate file, e.g. with dynamic theme configuration
     */
    const vuetify = createVuetify({
      locale: createVueI18nAdapter({
        i18n,
        useI18n,
      }),
      components,
      directives,
    })

    /*
     * register plugins
     */
    app.use(i18n)
    app.use(vuetify)
    app.use(router)

    // Make axios availabe in all components
    app.config.globalProperties.$api = axios
    app.provide('$api', axios)
    // make store availble in all components
    app.provide('$store', store)

    /* Rooter hooks */
    router.beforeEach(forEachHook(store))
    router.beforeResolve(beforeResolveHook(store))

    // mount the app
    app.mount('#app')
  } catch (err) {
    console.error(err)
  }
}

sendTestRequest()
