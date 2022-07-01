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
const metaReducer = [(reducer) => {
    return function newReducer(state, action) {
        debugger
        const nextState = reducer(state, action);
        console.log('state', state);
        console.log('action', action);
        console.log('next state', nextState);
        return nextState;
    }
}]
const applicationReducers = {
    route: (state, action) => {
        switch (action.type) {
            case 'routeUpdate':
                return JSON.parse(JSON.stringify(action.payload))
            default:
                return state;
        }
    },
    user: (state, action) => {
        switch (action.type) {
            case 'userUpdate':
                return action.payload
            default:
                return state;
        }
    },
    notifications: (state, action) => {
        let items
        switch (action.type) {
            case 'notificationAdd':
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
            case 'notificationMarkAllRead':
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
            case 'notificationMarkRead':
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
            case 'notificationMarkUnread':
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
            case 'notificationToggle':
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
            case 'uiUpdate':
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
            case 'currentPageSet':
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
                        type: 'pageUpdate',
                        stateName: state.pageName,
                        payload: state
                    })
                }
                return currPage
            // simply let us update the state of the current page
            case 'currentPageUpdate':
                store.dispatch({
                    type: 'notificationAdd',
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
            case 'pageAdd':
                store.dispatch({
                    type: 'notificationAdd',
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
                        type: 'widgetAddForPage',
                        payload: widgets
                    })
                }
                newPage = {}
                newPage[page.pageName] = page
                return mergeDeepRight(state, newPage)
            // update a configured page State usually called when current page changes
            case 'pageUpdate':
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
            case 'widgetPreconfigure':
                configuredWidget = {}
                // merge widget config with widget state when we initially configure widget 
                configuredWidget[action.payload.uuid] = mergeDeepRight(action.payload.conf, state[action.payload.uuid])
                return mergeDeepRight(state, configuredWidget)

            case 'widgetConfigure':
                configuredWidget = {}
                // merge given config onto widget state
                configuredWidget[action.payload.uuid] = mergeDeepRight(state[action.payload.uuid], action.payload.conf)
                return mergeDeepRight(state, configuredWidget)
            case 'widgetUpdate':
                configuredWidget = {}
                // merge given payload onto widget state
                configuredWidget[action.payload.uuid] = mergeDeepRight(state[action.payload.uuid], action.payload)
                return mergeDeepRight(state, configuredWidget)
            case 'widgetAddForPage':
                newWidgets = {}
                if (action.payload.length > 0) {
                    action.payload.forEach(widget => {
                        // get the config file for the current widget
                        // TODO find out why we can't use vite alias here
                        import('./components/widgets/' + widget.name + '/conf.js').then(async conf => {
                            store.dispatch({
                                type: 'widgetPreconfigure',
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
    notificationAdd: () => {
        debugger
        store.dispatch({
            type: 'notificationAdd',
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
    initialState: applicationState,
    // metaReducers: metaReducer
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