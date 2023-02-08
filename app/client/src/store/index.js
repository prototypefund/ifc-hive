import {
    configureStore,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
    ImmutableStateExtension
} from 'mini-rx-store';
import {
    ref,
} from "vue";
import getEnvVariable from '../lib/getEnvVariable'
import { mergeDeepRight, clone } from 'ramda'
import { v4 as uuidv4 } from 'uuid';
import { applicationState, storePatterns, loadingHold } from './state'
import { basicStoreFilters } from './dataHelper.js'
import { widgetConfLoader, widgetTypeConfLoader } from "@lib/widgetLoader";

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
let uiLookup = false
// TODO remove dataLookup once the api is ready
let dataLookup = false
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
    queries: (state, action) => {
        let queries, items
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.queries
                case 'queries/execute':
                    queries = JSON.parse(JSON.stringify(state))
                    if (action.actionId) {
                        state[action.actionId]
                    } else {
                        Object.values(queries).forEach(query => {
                            items = basicStoreFilters(query.query, query.params || false, dataLookup)
                            query.uuids = Object.keys(items)
                            query.data = items
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
                        items = basicStoreFilters(action.payload.query, action.payload.params || false, dataLookup)
                        queries[action.payload.actionId].uuids = Object.keys(items)
                        queries[action.payload.actionId].data = items
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
    data: (state, action) => {
        let data, items
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.data
                case 'data/push':
                    if (action.payload.data) {
                        store.dispatch({
                            type: 'notifications/add',
                            payload: {
                                event: 'push',
                                message: `we've received ${action.payload.data.length} new Items for you!`
                            }
                        })
                        data = JSON.parse(JSON.stringify(state))
                        action.payload.data.forEach(item => {
                            if (item._type === 'delete') {
                                delete data[item._id]
                            } else {
                                data[item._id] = JSON.parse(JSON.stringify(item))
                            }
                        })
                        if (Object.keys(state).length !== Object.keys(data).length) {
                            store.dispatch({
                                type: 'queries/execute',
                                actionId: false
                            })
                        }
                        return data
                    }
                    return state
                case 'data/add':
                    if (action.docUUID && action.objectDefinition) {
                        store.dispatch({
                            type: 'notifications/add',
                            payload: {
                                event: 'newItem',
                                message: `a new Item with Id ${action.docUUID} of type ${action.objectDefinition._type} was created`
                            }
                        })
                        //TODO change this to api usage once it's available
                        if (state[action.docUUID]) {
                            console.error("we have a data/add but we have the item already in the dataStore, this should not happen!")
                            // if we have the given doUUID in store already, we already created it so lets redirect this call to the update function
                            store.dispatch({
                                type: "data/update",
                                docUUID: action.docUUID,
                                payload: action.payload,
                            })
                            return state
                        }
                        const newItem = JSON.parse(JSON.stringify(action.objectDefinition))
                        newItem._source = mergeDeepRight(newItem._source, action.payload)
                        newItem._title = "Ich komme bald so richtig vom backend und mache sinn"
                        newItem._disId = "0123"
                        newItem._created = new Date()
                        newItem._modified = newItem._created
                        newItem._source.modified = newItem._created
                        newItem._source.created = newItem._created
                        store.dispatch({
                            type: "data/push",
                            payload: {
                                data: [newItem]
                            },
                        })
                        return state
                    }
                    return state
                case 'data/update':
                    //TODO change this to api usage once it's available
                    data = { _source: {} }
                    if (action.docUUID) {
                        if (state[action.docUUID]) {
                            store.dispatch({
                                type: 'notifications/add',
                                payload: {
                                    event: 'updateItem',
                                    message: `a Item with Id ${action.docUUID} of type ${state[action.docUUID]._type} was edited!`
                                }
                            })
                            data = JSON.parse(JSON.stringify(state))
                            data[action.docUUID]._source = mergeDeepRight(data[action.docUUID]._source, action.payload)
                        } else {
                            console.error("We try to update something we don't have in the dataStore")

                        }

                    }
                    if (!action.docUUID) {
                        console.error("no docUUID given")
                    }
                    return {
                        ...state, ...data
                    }
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
                                    ...widget
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
    uploader: (state, action) => {
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.uploader
                case 'uploader/add':
                    return mergeDeepRight(state, action.payload)
                case 'uploader/remove':
                    debugger
                    return JSON.parse(JSON.stringify(action.payload))
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
    organization: (state, action) => {
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.organization
                case 'organization/update':
                    return action.payload
                default:
                    return state
            }
        }
    },
    project: (state, action) => {
        if (state) {
            switch (action.type) {
                case 'init':
                    return applicationState.project
                case 'project/update':
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
                case 'currentPage/set':
                    return {
                        ...state, navigationOpen: false
                    }
                case 'ui/update':
                    if (state.mobile && (action.payload.navigationOpen || action.payload.currentTool)) {
                        if (action.payload.navigationOpen === true && state.currentTool !== false) {
                            action.payload.currentTool = false
                        }
                        if (action.payload.currentTool !== true && state.navigationOpen !== false) {
                            action.payload.navigationOpen = false
                        }
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
                        console.error("race condition? a currentpage without a uuid? dafuq? bruder? alter? junge alter bruder diggi alter bruder diggi junge bruder?")
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
                                    document.getElementById("appComponent").scrollTo(0, i);
                                }, 50)
                            }
                        }
                    }, loadingHold * 2);

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
                            if (widget.type) {
                                widgetTypeConfLoader(widget)
                            } else {
                                widgetConfLoader(widget)
                            }
                            // add page specific config to widget instance state
                            if (!newWidgets[widget.uuid]) {
                                newWidgets[widget.uuid] = mergeDeepRight(storePatterns.widget, widget)
                            }
                        })
                        return mergeDeepRight(state, newWidgets)
                    }
                    return state
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
store.$data = {
    queryObjects: {},
    update: (actionId, docUUID, doc) => {

    },
    get: (actionId, query, params = {}) => {
        // create a deep ref object which will contain the query data as well as the items
        const queryObj = ref({})
        store.dispatch({
            type: "queries/add",
            payload: {
                actionId,
                query,
                params
            },
        })
        const subscriber$ = store.select((state) => state.queries[actionId])
            .subscribe((val) => {
                // this will fire whenever we have changes to our query
                if (queryObj.value !== val) {
                    queryObj.value = val;
                }

            })
        // add a unsubscribe function to our object so that we can trigger it easily on dismount
        queryObj.unsubscribe = () => {
            subscriber$.unsubscribe()
            store.dispatch({
                type: "queries/remove",
                actionId
            })
        }
        return queryObj
    }
}
window.debug = store
export default store
