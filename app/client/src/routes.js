// import routes from modules
import Dashboard from './components/dashboard.vue'
import featureStoreHandler from './lib/featureStoreHandler'
export default [
    /* Root */
    {
        path: '/:msg?',
        name: 'dashboard',
        component: Dashboard,
        props: route => ({
            store: featureStoreHandler('dashboard', { name: 'Lutz', title: 'the lutzness of life' }, route.params)
        }),
    },
]