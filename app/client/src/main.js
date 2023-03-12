import { createApp, h } from 'vue'
import App from './App.vue'
import Markdown from 'vue3-markdown-it'
import getEnvVariable from './lib/getEnvVariable'
import createStore from './store/index.js'
import i18n from './setup/i18n.js'
import vuetify from './setup/vuetify.js'
import createCustomRouter from './router/index.js'
import filters from './setup/filters.js'
import capacitor from './setup/capacitor'
import VueApexCharts from "vue3-apexcharts";
import { createSocket, registerSocketEvents } from './setup/socket.js'
import log from './setup/logger.js'
import httpClient, { configClient } from './lib/httpClient.js'
import EventEmitter  from '@lib/eventEmitter.js'

/*
 * get env variables to configure the app
 */
const API_BASE_URL = getEnvVariable('VITE_API_BASE_URL')
const SOCKET_URL = getEnvVariable('VITE_APP_SOCKET_URL')

/* Set up http API client */
configClient(httpClient, { baseURL: API_BASE_URL, })

 httpClient.get('http://localhost:8082/health').then((response) => log.api(response, 'healthcheck'))


/* set up socket client */
const socket = createSocket(SOCKET_URL)

/* create global event bus */
const eventbus = new EventEmitter()

/* set up store and pass dependencies like socket and api client */
const store = createStore(httpClient, socket, log, eventbus)

/* Create router */
const router = createCustomRouter(store)

/*
 * Now that we have all vital objects (store, socket, eventbus, httpclient)
 * register socket events, i.e. react with eventbus or dispatching
 * store actions
 */
registerSocketEvents(socket, store, eventbus, log)


/*
 *  create app and pass dependencies 
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
  app.config.globalProperties.$api = httpClient
  // provide http client
  app.provide('$api', httpClient)
  // provide socket client
  app.provide('$socket', socket)
  // provide custom logger instance
  app.provide('$log', log)
  // provide a global eventbus
  app.provide('$eventbus', eventbus)

  // TODO find out if this is a brainfart or not. I need $t in the components
  // functions but I don't have this in compose API. Is there another way to
  // get $t in compose api components script part?
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
