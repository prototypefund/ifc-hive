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
    router: {},
    user: {}
}

function routerReducer(state, action) {
    console.dir(applicationState)
    console.dir(state)
    console.log(action)

}

function userReducer(state, action) {
    console.dir(applicationState)
    console.dir(state)
    console.log(action)

}

export default configureStore({
    extensions,
    reducers: {
        user: userReducer,
        router: routerReducer
    }
});