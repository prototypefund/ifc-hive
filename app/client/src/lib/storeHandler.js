import { createFeatureStore } from 'mini-rx-store';
import store from '../store'
export default {
    storePerPage: (props, name) => {
        return createFeatureStore(name.replace('.', '-'), {
            ...props
        })
    },
    updateCurrentPage: (props, name) => {
        store.dispatch('updateCurrentPage', {
            props, name
        })
    }
}