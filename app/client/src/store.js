import {
    configureStore,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
    ImmutableStateExtension
} from 'mini-rx-store';
import getEnvVariable from './lib/getEnvVariable'
import { mergeDeepRight, clone } from 'ramda'
import { v4 as uuidv4 } from 'uuid';

const extensions = getEnvVariable('NODE_ENV') === 'production'
    ? [
        new LoggerExtension(),
        new ImmutableStateExtension()
    ]
    : [
        new LoggerExtension(),
        new ReduxDevtoolsExtension({ name: 'pacifico applicationState' }),
        new ImmutableStateExtension(),
        new UndoExtension(),
    ];
// TODO move this stup to seperate config and helper files
// helper functions and lookup maps
const storePatterns = {
    page: {
        loading: true,
        slots: []
    }
}
const applicationState = {
    route: {},
    user: {
        name: false,
        email: false,
        permissions: []
    },
    ui: {
        navigationOpen: false,
        inspectorOpen: false,
    },
    notifications: {
        unreadCount: 0,
        toggled: false,
        history: [],
        items: []
    },
    currentPage: {},
    widgets: {},
    pages: {}
}
let pagesLookup = false
let widgetsLookup = false

const applicationReducers = {
    route: (state, action) => {
        switch (action.type) {
            case 'updateRoute':
                return JSON.parse(JSON.stringify(action.payload))
            default:
                return state;
        }
    },
    user: (state, action) => {
        switch (action.type) {
            case 'updateUser':
                return action.payload
            default:
                return state;
        }
    },
    notifications: (state, action) => {
        let items
        switch (action.type) {
            case 'addNotification':
                items = JSON.parse(JSON.stringify(state.items))
                action.payload.time = Date.now()
                action.payload.state = 'unread'
                store.dispatch({
                    type: 'updateNotifications',
                    payload: {
                        unreadCount: state.unreadCount + 1
                    }
                })
                items.unshift(action.payload)
                return {
                    ...state, items
                }
            case 'markAllNotificationsAsRead':
                items = JSON.parse(JSON.stringify(state.items))
                items.forEach(item => {
                    if (item.state === 'unread') {
                        item.state = 'read'
                        store.dispatch({
                            type: 'updateNotifications',
                            payload: {
                                unreadCount: 0
                            }
                        })
                    }
                })

                return {
                    ...state, items
                }
            case 'markNotificationAsRead':
                items = JSON.parse(JSON.stringify(state.items))
                items[action.payload.index].state = 'read'
                store.dispatch({
                    type: 'updateNotifications',
                    payload: {
                        unreadCount: state.unreadCount - 1
                    }
                })
                return {
                    ...state, items: items
                }
            case 'markNotificationAsUnRead':
                items = JSON.parse(JSON.stringify(state.items))
                items[action.payload.index].state = 'unread'
                store.dispatch({
                    type: 'updateNotifications',
                    payload: {
                        unreadCount: state.unreadCount + 1
                    }
                })
                return {
                    ...state, items: items
                }
            case 'toggleNotification':
                if (action.payload.toggled === false && state.toggled === true) {
                    store.dispatch({
                        type: 'updateNotifications',
                        payload: {
                            unreadCount: 0
                        }
                    })
                }
                return {
                    ...state, ...action.payload
                }
            case 'updateNotifications':
                return mergeDeepRight(state, action.payload)
            default:
                return state;
        }
    },
    ui: (state, action) => {
        switch (action.type) {
            case 'updateUi':
                return {
                    ...state, ...action.payload
                }
            default:
                return state;
        }
    },
    currentPage: (state, action) => {
        switch (action.type) {
            // used in beforeResolve router hook, will trigger before each route change including param changes
            case 'setCurrentPage':
                // create our json friendly pageName
                let currPage = {}
                const pageName = action.routeName.replace('.', '-')
                // check if that requested page has already been preconfigured (should always be the case)
                if (pagesLookup[pageName].pageName) {
                    // create a new currentPage object based on the url params merged ontop of the default page config
                    currPage = mergeDeepRight(pagesLookup[pageName], action.payload)
                }

                if (state.routeName) {
                    // update our memorized preconfigured page with the new version which includes url params and user data
                    store.dispatch({
                        type: 'updatePage',
                        stateName: state.pageName,
                        payload: state
                    })
                }
                return currPage
            // simply let us update the state of the current page
            case 'updateCurrentPage':
                store.dispatch({
                    type: 'addNotification',
                    payload: {
                        action: action.type,
                        type: 'log'
                    }
                })
                return mergeDeepRight(state, action.payload)

            default:
                return state;
        }
    },
    pages: (state, action) => {
        let newPage

        switch (action.type) {
            // initially add a new preconfigured page store. Will be handled in routes files in beforeEnter hook
            case 'addPage':
                store.dispatch({
                    type: 'addNotification',
                    payload: {
                        action: action.type,
                        type: 'log'
                    }
                })
                // create a new page object based on the default page config
                const page = clone(mergeDeepRight(storePatterns.page, action.payload))
                page.pageName = action.routeName.replace('.', '-')
                page.routeName = action.routeName

                if (state[page.pageName]) {
                    // if the page already exists do nothing
                    return state
                }

                // if we have a widget config for this page we need to setup the widget states
                if (page.slots) {
                    const widgets = []
                    page.slots.forEach(slot => {
                        const widget = slot.widget
                        if (!widget.uuid) {
                            widget.uuid = uuidv4()
                        }
                        //TODO move this into either a side effect function or into the widgets state reducer
                        // make a generic widget state map
                        widgets.push({
                            uuid: widget.uuid,
                            name: widget.name,
                            ...widget.props
                        })
                    })
                    // add page specific widget configs to state
                    store.dispatch({
                        type: 'addPageWidgets',
                        payload: widgets
                    })
                }
                newPage = {}
                newPage[page.pageName] = page
                return mergeDeepRight(state, newPage)
            // update a configured page State usually called when current page changes
            case 'updatePage':
                if (state[action.stateName]) {
                    newPage = {}
                    // if we had the last current page already, just merge their states based on the latest version coming from currentPage
                    newPage[action.stateName] = mergeDeepRight(state[action.stateName], action.payload)
                } else {
                    debugger
                }
                return mergeDeepRight(state, newPage)
            default:
                return state;
        }
    },
    widgets: (state, action) => {
        let newWidgets, configuredWidget
        switch (action.type) {
            case 'preconfigureWidget':
                configuredWidget = {}
                // merge widget config with widget state when we initially configure widget 
                configuredWidget[action.payload.uuid] = mergeDeepRight(action.payload.conf, state[action.payload.uuid])
                return mergeDeepRight(state, configuredWidget)

            case 'configureWidget':
                configuredWidget = {}
                // merge given config onto widget state
                configuredWidget[action.payload.uuid] = mergeDeepRight(state[action.payload.uuid], action.payload.conf)
                return mergeDeepRight(state, configuredWidget)

            case 'addPageWidgets':
                newWidgets = {}
                if (action.payload.length > 0) {
                    action.payload.forEach(widget => {
                        // get the config file for the current widget
                        // TODO find out why we can't use vite alias here
                        import('./components/widgets/' + widget.name + '/conf.js').then(async conf => {
                            store.dispatch({
                                type: 'preconfigureWidget',
                                payload: {
                                    conf: conf.default,
                                    uuid: widget.uuid
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
                return state;
        }
    }
}
const effects = {
    addNotification: () => {
        debugger
        store.dispatch({
            type: 'addNotification',
            payload: {
                action: action.type,
                type: 'log'
            }
        })
    }
}

export const store = configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState
});
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