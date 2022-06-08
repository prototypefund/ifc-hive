import { createApp } from 'vue'
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
import { applicationStore, storeHelper } from './store'
import { createRouter, createWebHashHistory } from 'vue-router'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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
    // create root component
    const app = createApp(App)
    const router = createRouter({
      // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
      history: createWebHashHistory(),
      routes, // short for `routes: routes`
    })
    const i18n = createI18n({
      legacy: false, // you must set `false`, to use Composition API
      globalInjection: true,
      locale: 'de', // set locale
      fallbackLocale: 'en', // set fallback locale
      messages, // set locale messages
      // If you need to specify other options, you can set other options
      // ...
    })


    const vuetify = createVuetify({
      locale: createVueI18nAdapter({
        i18n,
        useI18n,
      }),
      components,
      directives,
    })
    app.use(i18n)
    app.use(vuetify)
    app.use(router)
    //app.use(i18n)
    // add axios to all components
    app.config.globalProperties.$api = axios
    app.provide('$api', axios)
    app.provide('$applicationStore', applicationStore)
    app.provide('$storeHelper', storeHelper)
    app.provide('$t', i18n)
    router.beforeEach((to, from) => {
      // add default params to every route
      if (!to.params.locale) to.params.locale = 'de'
      if (!to.params.routeName) to.params.routeName = to.name
      if (!to.params.storeName) to.params.storeName = to.name.replace('.', '-')
      // set the new route to the store
      applicationStore.dispatch({
        type: 'updateRoute',
        payload: to
      });

    })
    // mount the app
    app.mount('#app')
  } catch (err) {
    console.error(err)
  }
}

sendTestRequest()
