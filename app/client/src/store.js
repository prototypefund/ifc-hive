import {
    configureStore,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
    ImmutableStateExtension,
    createFeatureStore
} from 'mini-rx-store';
import getEnvVariable from './lib/getEnvVariable'
import { mergeDeepRight } from 'ramda'

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
const storePatterns = {
    page: {
        loading: true,
        widgets: [],
        config: {}
    },
    widget: {
        uuid: false,
        config: {}
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
    currentPage: {

    },
    widgets: {

    },
    pages: {}
}


let pages = false
let widgets = false


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
                if (pages[pageName].pageName) {
                    // create a new currentPage object based on the url params merged ontop of the default page config
                    currPage = mergeDeepRight(pages[pageName], action.payload)
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
        let updatedOldPage = {}
        switch (action.type) {
            // initially add a new preconfigured page store. Will be handled in routes files in beforeEnter hook
            case 'addPage':
                // create a new page object based on the default page config
                const page = mergeDeepRight(storePatterns.page, action.payload)
                page.pageName = action.routeName.replace('.', '-')
                page.routeName = action.routeName

                updatedOldPage = {}
                updatedOldPage[page.pageName] = page
                return mergeDeepRight(state, updatedOldPage)
            // update a configured page State usually called when current page changes
            case 'updatePage':
                updatedOldPage = {}
                if (state[action.stateName]) {
                    // if we had the last current page already, just merge their states based on the latest version coming from currentPage
                    updatedOldPage[action.stateName] = mergeDeepRight(state[action.stateName], action.payload)
                } else {
                    debugger
                }
                return mergeDeepRight(state, updatedOldPage)
            default:
                return state;
        }
    },
    widgets: (state, action) => {
        switch (action.type) {
            case 'addWidget':

                debugger
                return action.payload
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
if (!pages) {
    store.select(state => state.pages).subscribe(val => {
        console.log("pages subscribe called")
        pages = val
    })
}
if (!widgets) {
    store.select(state => state.widgets).subscribe(val => {
        console.log("widgets subscribe called")
        widgets = val
    })
}
export const storeHelper = {
    createPageStore: (props, name) => {
        // create store name based on route name which must not include .
        const pageName = name.replace('.', '-')
        if (!createdFeatureStores[pageName]) {
            const store = createFeatureStore(pageName, {
                ...mergeDeepRight(featureStorePatterns.pages, props)
            })
            // TODO find out if that really is the only solution
            //remember that we created this store already
            createdFeatureStores[pageName] = store
        }
    },
    getFeatureStore: (pageName) => {
        return createdFeatureStores[pageName]
    }
}