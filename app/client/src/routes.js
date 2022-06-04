// import routes from modules
import Dashboard from './components/dashboard.vue'
import storeHandler from './lib/storeHandler'
export default [
    /* Root */
    {
        path: '/',
        redirect: { name: 'app.dashboard' },
    },
    {
        path: '/app:msg?',
        name: 'app.dashboard',
        component: Dashboard,
        props: true,
        beforeEnter: (to, from) => {
            storeHandler.storePerPage({ name: 'Lutz', title: 'the lutzness of life' }, to.name)
        }

    },


]