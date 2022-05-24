// import routes from modules
import Dashboard from './components/dashboard.vue'
import { createFeatureStore } from 'mini-rx-store';
export default [
    /* Root */
    {
        path: '/:msg?',
        name: 'dashboard',
        component: Dashboard,
        props: route => ({
            store: createFeatureStore('dashboard', {
                name: 'lutz',
                msg: route.params.msg,
            })
        }),
    },
]