// import routes from modules
import dashboardComp from '@p/dashboard.vue'
import settingsComp from '@p/settings.vue'
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
        path: '/app',
        name: 'app.dashboard',
        component: dashboardComp,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'addPage',
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
                type: 'addPage',
                routeName: to.name,
                payload: conf.settings
            });
        }
    },
]