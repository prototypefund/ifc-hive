// import routes from modules
import Dashboard from './components/dashboard.vue'
export default [
    /* Root */
    {
        path: '/:msg?',
        component: Dashboard,
        props: true
    },
]