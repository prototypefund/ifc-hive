import {
    configureStore,
    ImmutableStateExtension,
    LoggerExtension,
    ReduxDevtoolsExtension,
    UndoExtension,
} from 'mini-rx-store';
import getEnvVariable from './lib/getEnvVariable'

const extensions = getEnvVariable('NODE_ENV') === 'production'
    ? [new ReduxDevtoolsExtension({}), new UndoExtension()] // Keep DevTools for Demo purposes
    : [
        new LoggerExtension(),
        new ImmutableStateExtension(),
        new ReduxDevtoolsExtension({}),
        new UndoExtension(),
    ];
const applicationState = {
    router: { test: 'bla' },
    user: {
        test: 'blub'
    },
    uiState: {
        test: 'ble'
    }
}
const applicationReducers = {
    router: (state, action) => {
        console.log('router reducer')
        console.dir(state, action)
        debugger
    },
    user: (state, action) => {
        console.log('user reducer')
        console.dir(state, action)
        debugger
    },
    uiState: (state, action) => {
        console.log('uiState reducer')
        console.dir(state, action)
        debugger
    }
}


export default configureStore({
    extensions,
    reducers: applicationReducers,
    initialState: applicationState
});