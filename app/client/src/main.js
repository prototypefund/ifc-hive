import { createApp, h } from 'vue'
import App from './Index.vue'
import Markdown from 'vue3-markdown-it'
import getEnvVariable from './lib/getEnvVariable'
import createStore from './store/index.js'
import i18n from './setup/i18n.js'
import vuetify from './setup/vuetify.js'
import createCustomRouter from './router/index.js'
import filters from './setup/filters.js'
import capacitor from './setup/capacitor'
import VueApexCharts from "vue3-apexcharts";
import { createSocket } from './setup/socket.js'
import log from './lib/logger.js'
import { httpClient, configClient, apiHealthcheck } from './lib/httpClient.js'
import EventEmitter from './lib/eventEmitter.js'
import eventMap from './lib/eventMap.js'
import { registerApiHandlerEvents } from './setup/apiClient'
import { registerSocketClient } from './setup/socketClient'
import { registerSocketEvents } from './setup/socketEvents'
import sessionHandler from './setup/sessionHandler'
/*
 * get env variables to configure the app
 */
const API_BASE_URL = getEnvVariable('VITE_API_BASE_URL')
const SOCKET_URL = getEnvVariable('VITE_APP_SOCKET_URL')

/* Set up http API client */
configClient(httpClient, { baseURL: API_BASE_URL, })
/* are we in good shape so far? */
apiHealthcheck()
/* set up socket client */
const socket = createSocket(SOCKET_URL)
/* create global event bus */
const eventbus = new EventEmitter(eventMap)
/* set up store and pass dependencies like socket and api client */
// remove the socket and httpClient from the store, we communicate via the eventbus
const store = createStore(eventbus)
/* Create router */
const router = createCustomRouter(store)

/* We now have all vital objects (store, socket, eventbus, httpclient) */

/* Listen to events from the socket server */
registerSocketEvents(socket, store, eventbus)
/* listen so eventbus and send messages to the socket server */
registerSocketClient(socket, store, eventbus)
/* listen to the eventbus and submit requests to the RestAPI */
registerApiHandlerEvents(httpClient, store, eventbus)

const sessionHandlerInstance = sessionHandler(store, httpClient, eventbus, router)

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
  // provide session handler instance, e.g. for logout
  app.provide('$session', sessionHandlerInstance)

  //TODO move this into a setup file
  eventbus.on('routerPush', (target) => {
    router.push(target)
  })
  eventbus.on('setLastProjectId', (projectId) => {
    httpClient.patch(`/core/user/last-project/${projectId}`)
  })
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
