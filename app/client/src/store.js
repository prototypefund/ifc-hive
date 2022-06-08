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
const createdFeatureStores = {}
const featureStorePatterns = {
    pages: {
        loading: true,
        widgets: [],
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
    }
}
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
    }
}


export const applicationStore = configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState
});
export const featureStores = {
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