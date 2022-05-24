import { createFeatureStore } from 'mini-rx-store';
export default (feature, props, params) => {
    return createFeatureStore(feature, {
        ...props,
        params,
    })
}