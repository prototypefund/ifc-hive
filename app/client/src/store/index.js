import {
    configureStore,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
    ImmutableStateExtension
} from 'mini-rx-store'

import getEnvVariable from '../lib/getEnvVariable'
import { mergeDeepRight } from 'ramda'
import { applicationState, loadingHold } from './state'
import { basicStoreFilters } from '@lib/dataHelper.js'
import createEvents from './events.js'  // we can specify event handler here
import createTempDataApi from './tempDataApi.js'
/* import feature reducers */
import createMetaReducer from './reducers/metaReducer.js'

/* applications reducers */
import widgetsReducers from './reducers/widgets.js'
import pagesReducers from './reducers/pages.js'
import uiReducers from './reducers/ui.js'
import notificationsReducers from './reducers/notifications.js'
import toolbarReducers from './reducers/toolbar.js'
import dataReducers from './reducers/data.js'
import uploaderReducers from './reducers/uploader.js'
import routeReducers from './reducers/route.js'
import userReducers from './reducers/user.js'
import organizationReducers from './reducers/organization.js'
import projectRedcuers from './reducers/project.js'

/* Apply different extensions depending on the environment */
const extensions = getEnvVariable('NODE_ENV') === 'production'
  ? [
    new ImmutableStateExtension()
  ]
  : [
    new LoggerExtension(),
    new ReduxDevtoolsExtension({ name: 'pacifico applicationState', trace: true, traceLimit: 25 }),
    new ImmutableStateExtension(),
    new UndoExtension(),
  ]

/*
 * createStore 
 *
 * @param {object} $api - axios instance
 * @param {object} $socket - WebsocketClient (see lib/socket.js)
 * @param {object} $log - WebsocketClient (see lib/socket.js)
 * @param {object} $eventbus - a global eventbus which is also available in all vue components
 */
export function createStore ($api, $socket, $log, $eventbus) {

  // TODO move this stup to seperate config and helper files
  // helper functions and lookup maps

  let pagesLookup = false
  let widgetsLookup = false
  let uiLookup = false
  // TODO remove dataLookup once the api is ready
  let dataLookup = false

  /*
   * register meta reducer
   * 
   * @TODO This is a temporary solution to which should solved via minirx-store effects
   * find out how actual effects work without ts support. This works the "same" way for now
   */
  const metaReducer = createMetaReducer($eventbus)

  /*
   * register application reducers
   */
  const applicationReducers = {
    pages: pagesReducers($eventbus),
    widgets: widgetsReducers($eventbus),
    ui: uiReducers($eventbus),
    notifications: notificationsReducers($eventbus),
    toolbar: toolbarReducers($eventbus, widgetsLookup),
    data: dataReducers($eventbus),
    uploader: uploaderReducers($eventbus),
    route: routeReducers($eventbus),
    user: userReducers($eventbus),
    organization: organizationReducers($eventbus),
    project: projectRedcuers($eventbus),

    queries: (state, action) => {
      let queries, items, query
      if (state) {
        switch (action.type) {
          case 'init':
            return applicationState.queries
          case 'queries/execute':
            queries = JSON.parse(JSON.stringify(state))
            if (action.actionId) {
              query = JSON.parse(JSON.stringify(queries[action.actionId]))
              query.data = basicStoreFilters(query.query, query.params || false, dataLookup)

              query.uuids = Object.keys(query.data)
              queries[action.actionId] = query
              return queries
            } else {
              Object.values(queries).forEach(query => {
                query.data = basicStoreFilters(query.query, query.params || false, dataLookup)
                query.uuids = Object.keys(query.data)
              })
            }
            return queries
          case 'queries/add':
            if (action.payload.actionId) {
              queries = {}
              queries[action.payload.actionId] = {
                query: action.payload.query,
                params: action.payload.params || false
              }
              store.dispatch({
                type: 'queries/execute',
                actionId: action.payload.actionId,

              })
            }
            return { ...state, ...queries }
          case 'queries/remove':
            queries = JSON.parse(JSON.stringify(state))
            if (action.actionId) {
              delete queries[action.actionId]
            }
            return queries || {}
          default:
            return state
        }
      }
    },
    currentPage: (state, action) => {
      if (state) {
        switch (action.type) {
          case 'init':
            return applicationState.currentPage
            // used in beforeResolve router hook, will trigger before each route change including param changes
          case 'currentPage/set':
            if (!action.routeName) return state
            // create our json friendly uuid
            let currPage = {}
            let scrollY = false
            // get current scroll position to apply it to the memory of page

            const uuid = action.routeName.replace('.', '-')
            // check if that requested page has already been preconfigured (should always be the case)
            if (pagesLookup && pagesLookup[uuid] && pagesLookup[uuid].uuid) {
              // create a new currentPage object based on the url params merged ontop of the default page config
              currPage = JSON.parse(JSON.stringify(mergeDeepRight(pagesLookup[uuid], action.payload)))
              if (uiLookup.mobile) {
                // TODO find a way to decouple this
                if (currPage.slots) {
                  currPage.grid.columns_bak = currPage.grid.columns
                  currPage.grid.columns = 1
                  currPage.slots.forEach(slot => {
                    slot.column_bak = slot.column
                    slot.column = 12
                  })
                }
              }
            } else {
              console.error("race condition? a currentpage without a uuid? dafuq? bruder? alter?")
              console.dir(pagesLookup)
              console.dir(action)
              currPage = action.payload
            }

            if (!currPage.scrollTop) {
              // TODO find a way to decouple this
              scrollY = document.getElementById("appComponent") ? document.getElementById("appComponent").scrollTop : 0
            }
            if (state.routeName) {
              // update our memorized preconfigured page with the new version which includes url params and user data
              store.dispatch({
                type: 'pages/update',
                stateName: state.uuid,
                payload: {
                  ...state,
                  scrollY
                }
              })
            }
            // apply last scroll position to currentPage
            // TODO find a way to decouple this
            setTimeout(() => {
              if (currPage.scrollY) {
                for (let i = 0; i < currPage.scrollY; i++) {
                  setTimeout(() => {
                    document.getElementById("appComponent").scrollTo(0, i)
                  }, 50)
                }
              }
            }, loadingHold * 2)

            return currPage
            // simply let us update the state of the current page
          case 'currentPage/update':
            return mergeDeepRight(state, action.payload)
          default:
            return state
        }
      }
    },
  }

  /*
   * create and configure the store
   */
  const store = configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState,
    metaReducers: metaReducer
  })

  /*
   * create and register events
   * @TODO pseudo effect as events
   */
  const events = createEvents(store, $log)

  $eventbus.on('store/dispatch', events.dispatch) // generic store.dispatch
  $eventbus.on('widgetConfLoader', events.widgetConfLoaderHandler)
  $eventbus.on('widgetTypeConfLoader', events.widgetTypeConfLoaderHandler)

  /*
   * Some default subscribers  
   * @TODO move to its own file e.g. defaultSubscribers.js and import
   */

  // subscribe to page and widget changes so we can lookup those maps via pages/widgets variables
  if (pagesLookup === false) {
    store.select(state => state.pages).subscribe(val => {
      pagesLookup = val
    })
  }
  if (widgetsLookup === false) {
    store.select(state => state.widgets).subscribe(val => {
      widgetsLookup = val
    })
  }
  if (uiLookup === false) {
    store.select(state => state.ui).subscribe(val => {
      uiLookup = val
    })
  }

  // TODO remove dataLookup once the api is ready
  if (dataLookup === false) {
    store.select(state => state.data).subscribe(val => {
      dataLookup = val
    })
  }

  /*
   * Temporary Data API
   * @TODO remove temporary data API once we have the real API
   * @TODO check after update on ticketboard.  
   * */
  store.$data = createTempDataApi(store, dataLookup)

  return store
}

export default createStore
