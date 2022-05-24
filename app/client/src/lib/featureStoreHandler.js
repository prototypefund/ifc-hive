import { createFeatureStore } from 'mini-rx-store';
export default {
    page: (props, route) => {
        return createFeatureStore(route.name, {
            ...props,
            params: route.params,
        })
    }
}