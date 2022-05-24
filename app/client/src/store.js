import {
    configureStore,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
    ImmutableStateExtension
} from 'mini-rx-store';
import getEnvVariable from './lib/getEnvVariable'

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
const applicationState = {
    router: {},
    user: {
        test: 'blub'
    },
    uiState: {
        test: 'ble'
    }
}
const applicationReducers = {
    router: (state, action) => {
        switch (action.type) {
            case 'updateRouter':
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
    uiState: (state, action) => {
        switch (action.type) {
            case 'updateUi':
                return action.payload
            default:
                return state;
        }
    }
}


export default configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState
});