// import routes from modules
import dashboardComp from '@p/dashboard.vue'
import settingsComp from '@p/settings.vue'
import daniel from '@p/daniel.vue'
import conf from '@p/conf.js'

import { store } from './store'
export default [
    /* Root */
    {
        path: '/',
        name: 'app',
        redirect: { name: 'app.dashboard' },
    },
    {
        path: '/dashboard',
        name: 'app.dashboard',
        component: dashboardComp,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pageAdd',
                routeName: to.name,
                payload: conf.dashboard
            });
        }
    },
    {
        path: '/settings',
        name: 'app.settings',
        component: settingsComp,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pageAdd',
                routeName: to.name,
                payload: conf.settings
            });
        }
    },
    {
        path: '/daniel',
        name: 'app.daniel',
        component: daniel,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pageAdd',
                routeName: to.name,
                payload: conf.daniel
            });
        }
    }
]
