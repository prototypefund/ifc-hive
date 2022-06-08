import { createFeatureStore } from 'mini-rx-store';
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
        if (!createdStores[pageName]) {
            createFeatureStore(pageName, {
                ...mergeDeepRight(storePatterns.pages, props)
            })
            // TODO find out if that really is the only solution
            //remember that we created this store already
            createdStores[pageName] = true
        }
    }
}