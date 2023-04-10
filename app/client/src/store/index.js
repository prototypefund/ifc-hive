/*
 * Configure and build application store
 *
 * The application store is the single source of truth for any data living
 * outside the scope and lifecycle of a component.
 */
import {
  configureStore,
  LoggerExtension,
  ReduxDevtoolsExtension,
  UndoExtension,
  ImmutableStateExtension
} from 'mini-rx-store'

import getEnvVariable from '../lib/getEnvVariable'
import { applicationState, loadingHold } from './state'
import createEvents from './events.js'  // we can specify event handler here
import createDataApi from './dataApi.js'

/* import feature reducers */
import createMetaReducer from './reducers/metaReducer.js'

/* applications reducers */
import widgetsReducers from './reducers/widgets/index.js'
import pagesReducers from './reducers/pages/index.js'
import uiReducers from './reducers/ui/index.js'
import notificationsReducers from './reducers/notifications/index.js'
import dataReducers from './reducers/data/index.js'
import uploaderReducers from './reducers/uploader/index.js'
import routeReducers from './reducers/route/index.js'
import userReducers from './reducers/user/index.js'
import organizationReducers from './reducers/organization/index.js'
import projectReducers from './reducers/project/index.js'
import socketReducers from './reducers/socket/index.js'
import navigationToolsReducers from './reducers/navigationTools/index.js'
import inspectorToolsReducers from './reducers/inspectorTools/index.js'
import queriesReducers from './reducers/queries/index.js'
import currentPageReducers from './reducers/currentPage/index.js'
import toolbarReducers from './reducers/toolbar/index.js' // @TODO remove

/* Apply different extensions depending on the environment */
const extensions = getEnvVariable('NODE_ENV') === 'production'
  ? [
    new ImmutableStateExtension()
  ]
  : [
    new LoggerExtension(),
    new ReduxDevtoolsExtension({
      name: 'pacifico applicationState',
      trace: true,
      traceLimit: 25
    }),
    new ImmutableStateExtension(),
    new UndoExtension(),
  ]

/*
 * createStore 
 *
 * @param {object} $eventbus - a global eventbus which is also available in all vue components
 */
function createStore($eventbus) {

  /*
   * register meta reducer
   * 
   * @TODO This is a temporary solution to which should solved via minirx-store effects
   * find out how actual effects work without ts support. This works the "same" way for now
   */
  const metaReducer = createMetaReducer($eventbus)

  /* register application reducers */
  const applicationReducers = {
    pages: pagesReducers,
    widgets: widgetsReducers,
    ui: uiReducers,
    notifications: notificationsReducers,
    toolbar: toolbarReducers, // TODO REMOVE
    navigationTools: navigationToolsReducers,
    inspectorTools: inspectorToolsReducers,
    data: dataReducers,
    uploader: uploaderReducers,
    route: routeReducers,
    user: userReducers,
    organization: organizationReducers,
    project: projectReducers,
    socket: socketReducers,
    queries: queriesReducers,
    currentPage: currentPageReducers,
  }

  /* create and configure the store */
  const store = configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState,
    metaReducers: metaReducer
  })

  /* create and register events */
  const events = createEvents(store, $eventbus)
  $eventbus.on('storeDispatch', events.dispatch) // generic store.dispatch
  $eventbus.on('widgetConfLoader', events.widgetConfLoaderHandler)
  $eventbus.on('widgetTypeConfLoader', events.widgetTypeConfLoaderHandler)

  /*
   * Temporary Data API
   * @TODO remove temporary data API once we have the real API
   * @TODO check after update on ticketboard.  
   * */
  store.$data = createDataApi(store)

  return store
}

export default createStore
export { createStore }
