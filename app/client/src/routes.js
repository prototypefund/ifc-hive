// import routes from modules
import Dashboard from './components/dashboard.vue'
import featureStoreHandler from './lib/featureStoreHandler'
export default [
    /* Root */
    {
        path: '/:msg?',
        name: 'dashboard',
        component: Dashboard,
        props: true,
        beforeEnter: (to, from) => {
            featureStoreHandler.page({ name: 'Lutz', title: 'the lutzness of life' }, to)
        },
    },
]