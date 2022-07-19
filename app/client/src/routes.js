// import routes from modules
import dashboardComp from '@p/dashboard.vue'
import settingsComp from '@p/settings.vue'
import journal from '@p/journal.vue'
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
                type: 'pages/add',
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
                type: 'pages/add',
                routeName: to.name,
                payload: conf.settings
            });
        }
    },
    {
        path: '/journal',
        name: 'app.journal',
        component: journal,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pages/add',
                routeName: to.name,
                payload: conf.journal
            });
        }
    }
]
