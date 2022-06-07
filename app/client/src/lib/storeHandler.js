import { createFeatureStore } from 'mini-rx-store';
import store from '../store'
export default {
    storePerPage: (props, name) => {
        const pageName = name.replace('.', '-')
        return createFeatureStore(pageName, {
            ...props
        })
    }
}