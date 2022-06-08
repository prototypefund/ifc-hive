import { createFeatureStore, createFeatureSelector, createSelector } from 'mini-rx-store';
import { mergeDeepRight } from 'ramda'
const createdStores = {}
const storePatterns = {
    pages: {
        loading: true,
        widgets: [],
        config: {}
    }
}
export default {
    storePerPage: (props, name) => {
        // create store name based on route name which must not include .
        const pageName = name.replace('.', '-')
        const compiledProps = mergeDeepRight(storePatterns.pages, props)
        let store
        const getPageFeatureStore = createFeatureSelector();
        if (createdStores[pageName]) {
            store = createSelector(getPageFeatureStore, (state) => state[pageName]);
        } else {
            store = createFeatureStore(pageName, {
                ...compiledProps
            })
            // TODO find out if that really is the only solution
            //remember that we created this store already
            createdStores[pageName] = true
        }

        return store
    }
}