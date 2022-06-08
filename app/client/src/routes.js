// import routes from modules
import dashboardComp from './components/dashboard.vue'
import settingsComp from './components/settings.vue'
import conf from './components/conf.js'
import { featureStores } from './store'
export default [
    /* Root */
    {
        path: '/',
        name: 'app',
        redirect: { name: 'app.dashboard' },
    },
    {
        path: '/app/&:urlParams?',
        name: 'app.dashboard',
        component: dashboardComp,
        props: true,
        beforeEnter: (to, from) => {
            featureStores.createPageStore({ ...to.params, ...conf.dashboard }, to.name)
        }
    },
    {
        path: '/settings/&:urlParams?',
        name: 'app.settings',
        component: settingsComp,
        props: true,
        beforeEnter: (to, from) => {
            featureStores.createPageStore({ ...to.params, ...conf.settings }, to.name)
        }
    },
]