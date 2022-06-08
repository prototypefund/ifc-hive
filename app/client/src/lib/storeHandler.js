import { createFeatureStore } from 'mini-rx-store';
import { mergeDeepLeft } from 'ramda'
const storePatterns = {
    pages: {
        loading: true,
        widgets: [],
        config: {}
    }
}
export default {
    storePerPage: (props, name) => {
        const pageName = name.replace('.', '-')
        const compiledProps = mergeDeepLeft(storePatterns.pages, props)
        return createFeatureStore(pageName, {
            ...compiledProps
        })
    }
}