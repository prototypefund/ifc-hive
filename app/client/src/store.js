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
        slots: {}
    },
    widget: {
        uuid: false,
        name: false
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
    notification: {

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
                // create a new page object based on the default page config
                const page = clone(mergeDeepRight(storePatterns.page, action.payload))
                page.pageName = action.routeName.replace('.', '-')
                page.routeName = action.routeName

                if (state[page.pageName]) {
                    // if the page already exists do nothing
                    return state
                }

                // if we have a widget config for this page we need to setup the widget states
                if (page.config && page.config.widgets) {
                    const widgets = []
                    page.config.widgets.forEach(widget => {
                        page.slots[widget.slot] = {
                            ...widget, uuid: uuidv4()
                        }
                        widgets.push({
                            uuid: page.slots[widget.slot].uuid,
                            name: page.slots[widget.slot].name,
                            ...page.slots[widget.slot].props
                        })
                    })
                    store.dispatch({
                        type: 'addWidgets',
                        payload: widgets
                    })

                }
                newPage = {}
                newPage[page.pageName] = page
                return mergeDeepRight(state, newPage)
            // update a configured page State usually called when current page changes
            case 'updatePage':
                newPage = {}
                if (state[action.stateName]) {
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
        switch (action.type) {
            case 'addWidgets':
                const newWidgets = {}
                action.payload.forEach(widget => {
                    newWidgets[widget.uuid] = mergeDeepRight(storePatterns.widget, widget)
                })

                return mergeDeepRight(state, newWidgets)
            default:
                return state;
        }
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
        console.log("pages subscribe called")
        pagesLookup = val
    })
}
if (widgetsLookup === false) {
    store.select(state => state.widgets).subscribe(val => {
        console.log("widgets subscribe called")
        widgetsLookup = val
    })
}