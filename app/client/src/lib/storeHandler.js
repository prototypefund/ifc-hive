import { createFeatureStore } from 'mini-rx-store';
import store from '../store'
export default {
    storePerPage: (props, name) => {
        const pageName = name.replace('.', '-')
        //const state = store.select(state => state[pageName]);
        const state = createFeatureStore(pageName, {
            ...props
        })
        return state
    }
}