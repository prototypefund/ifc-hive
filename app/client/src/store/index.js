import {
    configureStore,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
    ImmutableStateExtension
} from 'mini-rx-store';
import getEnvVariable from '../lib/getEnvVariable'
import { mergeDeepRight, clone } from 'ramda'
import { v4 as uuidv4 } from 'uuid';
import { applicationState, storePatterns } from './state'
import helper from './helper.js'
/*
 * Apply different extensions depending on the environment
 */
const extensions = getEnvVariable('NODE_ENV') === 'production'
    ? [
        new LoggerExtension(),
        new ImmutableStateExtension()
    ]
    : [
        new LoggerExtension(),
        new ReduxDevtoolsExtension({ name: 'pacifico applicationState', trace: true, traceLimit: 25 }),
        new ImmutableStateExtension(),
        new UndoExtension(),
    ];
// TODO move this stup to seperate config and helper files
// helper functions and lookup maps

let pagesLookup = false
let widgetsLookup = false

// TODO find out how actual effects work without ts support. This works the "same" way for now
const metaReducer = [(reducer) => {
    return (state, action) => {
        let page, widgets
        // meta "effect like" reducer for widget add before page add
        if (action.type == "pages/add") {
            page = action.payload
            // if we have a widget config for this page we need to setup the widget states
            if (page.slots) {
                widgets = []
                page.slots.forEach(slot => {
                    const widget = slot.widget
                    if (widget) {
                        if (!widget.uuid) {
                            widget.uuid = uuidv4()
                        }
                        if (!state.widgets[widget.uuid]) {
                            // make a generic widget state map
                            widgets.push({
                                uuid: widget.uuid,
                                name: widget.name,
                                ...widget.props
                            })
                        }
                    }
                })

                // add page specific widget configs to state
                if (widgets.length > 0) {
                    store.dispatch({
                        type: 'widgets/add',
                        payload: widgets
                    })
                }

            }
        }
        return reducer(state, action)
    }
}]

const applicationReducers = {
    data: (state, action) => {
        let data, items
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.data
                case 'data/add':
                    if (action.payload.data) {
                        data = JSON.parse(JSON.stringify(state))
                        items = {}
                        action.payload.data.forEach(item => {
                            if (item._id) {
                                if (data[item._id]) {
                                    // TODO either put a configurable merge dialogue or remove this section
                                    // apparently we received an update for an existing data, so let's send a notification
                                    /*store.dispatch({
                                        type: 'notifications/add',
                                        payload: {
                                            type: 'itemUpdate',
                                            uuid: item._id
                                        }
                                    })*/
                                    // items[item._id] = data[item._id]
                                    if (!action.dummy) {
                                        items[item._id] = item
                                    }
                                    /*items[item._id]._updated = {
                                        item: JSON.stringify(item),
                                        updatedAt: new Date()
                                    }*/
                                } else {
                                    // its new data
                                    items[item._id] = item
                                }
                            }
                        })
                        return {
                            ...state, ...items
                        }
                    }
                    return state

                case 'data/update':
                    console.error("data/update not implemented")
                    return state
                case 'data/delete':
                    console.error("data/delete not implemented")
                    return state
                case 'data/clear':
                    console.error("data/clear not implemented")
                    return state
                default:
                    return state
            }
        }
    },
    toolbar: (state, action) => {
        let tool, widget
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.toolbar
                case 'toolbar/add':
                    tool = {}
                    if (action.payload && action.payload.widget && action.payload.uuid) {
                        widget = action.payload.widget
                        if (!widget.uuid) {
                            widget.uuid = action.payload.uuid
                        }
                        if (!widgetsLookup[widget.uuid]) {
                            // make a generic widget state map
                            store.dispatch({
                                type: 'widgets/add',
                                payload: [{
                                    uuid: widget.uuid,
                                    name: widget.name,
                                    ...widget.props
                                }]
                            })
                        }
                        tool[action.payload.uuid] = action.payload
                    } else {
                        // something went wrong so lets not do anything
                        return state
                    }
                    return {
                        ...state, ...tool
                    }
                case 'toolbar/update':
                    return mergeDeepRight(state, action.payload)
                default:
                    return state
            }
        }
    },
    route: (state, action) => {
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.route
                case 'route/update':
                    return JSON.parse(JSON.stringify(action.payload))
                default:
                    return state
            }
        }
    },
    user: (state, action) => {
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.user
                case 'user/update':
                    return action.payload
                default:
                    return state
            }
        }
    },
    notifications: (state, action) => {
        if (state) {
            let items
            switch (action.type) {
                case 'init':
                    return applicationState.notifications
                case 'notifications/add':
                    items = JSON.parse(JSON.stringify(state.items))
                    action.payload.time = Date.now()
                    action.payload.state = 'unread'

                    items.unshift(action.payload)
                    return {
                        ...state, items, unreadCount: state.unreadCount + 1
                    }
                case 'notifications/clear':
                    return applicationState.notifications

                case 'notifications/markAllAsSeen':
                    items = JSON.parse(JSON.stringify(state.items))
                    items.forEach(item => {
                        if (item.state !== 'read') {
                            item.state = 'seen'
                        }
                    })
                    store.dispatch({
                        type: 'notifications/update',
                        payload: {
                            unreadCount: 0
                        }
                    })
                    return {
                        ...state, items
                    }
                case 'notifications/markAllAsRead':
                    items = JSON.parse(JSON.stringify(state.items))
                    items.forEach(item => {
                        if (item.state === 'unread') {
                            item.state = 'read'
                        }
                    })
                    store.dispatch({
                        type: 'notifications/update',
                        payload: {
                            unreadCount: 0
                        }
                    })
                    return {
                        ...state, items
                    }
                case 'notifications/markAsRead':
                    items = JSON.parse(JSON.stringify(state.items))
                    if (items[action.payload.index].state !== 'read') {
                        items[action.payload.index].state = 'read'
                        if (state.unreadCount > 0) {
                            store.dispatch({
                                type: 'notifications/update',
                                payload: {
                                    unreadCount: state.unreadCount - 1
                                }
                            })
                        }

                    }

                    return {
                        ...state, items: items
                    }
                case 'notifications/markUnread':
                    items = JSON.parse(JSON.stringify(state.items))
                    if (items[action.payload.index].state !== 'unread') {
                        items[action.payload.index].state = 'unread'
                        store.dispatch({
                            type: 'notifications/update',
                            payload: {
                                unreadCount: state.unreadCount + 1
                            }
                        })
                    }
                    return {
                        ...state, items: items
                    }
                case 'notifications/toggle':
                    if (action.payload.toggled === false && state.toggled === true) {
                        store.dispatch({
                            type: 'notifications/update',
                            payload: {
                                unreadCount: 0
                            }
                        })
                        store.dispatch({
                            type: 'notifications/markAllAsSeen',
                        })

                    }
                    return {
                        ...state, ...action.payload
                    }
                case 'notifications/update':
                    return mergeDeepRight(state, action.payload)
                default:
                    return state
            }
        }
    },
    ui: (state, action) => {
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.ui
                case 'ui/update':
                    if (action.payload.navigationOpen === true && state.currentTool !== false) {
                        action.payload.currentTool = false
                    }
                    if (action.payload.currentTool !== true && state.navigationOpen !== false) {
                        action.payload.navigationOpen = false
                    }
                    return {
                        ...state, ...action.payload
                    }
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
                    const uuid = action.routeName.replace('.', '-')
                    // check if that requested page has already been preconfigured (should always be the case)
                    if (pagesLookup && pagesLookup[uuid].uuid) {
                        // create a new currentPage object based on the url params merged ontop of the default page config
                        currPage = mergeDeepRight(pagesLookup[uuid], action.payload)
                    }
                    if (state.routeName) {
                        // update our memorized preconfigured page with the new version which includes url params and user data
                        store.dispatch({
                            type: 'pages/update',
                            stateName: state.uuid,
                            payload: state
                        })
                    }
                    return currPage
                // simply let us update the state of the current page
                case 'currentPage/update':
                    return mergeDeepRight(state, action.payload)
                default:
                    return state
            }
        }
    },
    pages: (state, action) => {
        if (state) {
            let newPage, pageUUID
            switch (action.type) {
                case 'init':
                    return applicationState.pages
                // initially add a new preconfigured page store. Will be handled in routes files in beforeEnter hook
                case 'pages/add':
                    pageUUID = action.payload.uuid || action.routeName.replace('.', '-')
                    if (state[pageUUID]) {
                        // if the page already exists do nothing
                        return state
                    }
                    // create a new page object based on the default page config
                    const page = clone(mergeDeepRight(storePatterns.page, action.payload))
                    page.uuid = pageUUID
                    page.routeName = action.routeName

                    newPage = {}
                    newPage[page.uuid] = page
                    return mergeDeepRight(state, newPage)
                // update a configured page State usually called when current page changes
                case 'pages/update':
                    if (state[action.stateName]) {
                        newPage = {}
                        // if we had the last current page already, just merge their states based on the latest version coming from currentPage
                        newPage[action.stateName] = mergeDeepRight(state[action.stateName], action.payload)
                    } else {
                        console.error("pages/update no state for query")
                    }
                    return mergeDeepRight(state, newPage)
                default:
                    return state
            }
        }
    },
    widgets: (state, action) => {
        if (state) {
            let newWidgets, configuredWidget
            switch (action.type) {
                case 'init':
                    return applicationState.widgets
                case 'widgets/preconfigure':
                    configuredWidget = {}
                    // merge widget config with widget state when we initially configure widget 
                    configuredWidget[action.uuid] = mergeDeepRight(action.payload.conf, state[action.uuid])
                    return mergeDeepRight(state, configuredWidget)
                case 'widgets/configure':
                    configuredWidget = {}
                    // merge given config onto widget state
                    configuredWidget[action.uuid] = mergeDeepRight(state[action.uuid], action.conf)
                    return mergeDeepRight(state, configuredWidget)
                case 'widgets/update':
                    configuredWidget = {}
                    // merge given payload onto widget state
                    configuredWidget[action.uuid] = mergeDeepRight(state[action.uuid], action.payload)
                    return mergeDeepRight(state, configuredWidget)
                case 'widgets/add':
                    newWidgets = {}
                    if (action.payload.length > 0) {
                        action.payload.forEach(widget => {
                            // get the config file for the current widget
                            // TODO find out why we can't use vite alias here
                            import(`../components/widgets/${widget.name}/conf.js`).then(conf => {
                                store.dispatch({
                                    type: 'widgets/preconfigure',
                                    uuid: widget.uuid,
                                    payload: {
                                        conf: conf.default

                                    }
                                })
                            }).catch(err => {
                                store.dispatch({
                                    type: 'widgets/preconfigure',
                                    uuid: widget.uuid,
                                    payload: {
                                        conf: {},

                                    }
                                })
                            })
                            // add page specific config to widget instance state
                            if (!newWidgets[widget.uuid]) {
                                newWidgets[widget.uuid] = mergeDeepRight(storePatterns.widget, widget)
                            }
                        })
                        return mergeDeepRight(state, newWidgets)
                    }
                default:
                    return state
            }
        }
    },
}

export const store = configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState,
    metaReducers: metaReducer
})

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
// add helper functions to store
store.helper = helper
export default store
