// import routes from modules
import dashboardComp from '@p/dashboard/page.vue'
import dashboardConf from '@p/dashboard/conf.json'
import settingsComp from '@p/settings/page.vue'
import settingsConf from '@p/settings/conf.json'
import journalComp from '@p/journal/page.vue'
import journalConf from '@p/journal/conf.json'
import testboardComp from '@p/testboard/page.vue'
import testboardConf from '@p/testboard/conf.json'

import { store } from '../store/index.js'

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
                payload: dashboardConf
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
                payload: settingsConf
            });
        }
    },
    {
        path: '/journal',
        name: 'app.journal',
        component: journalComp,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pages/add',
                routeName: to.name,
                payload: journalConf
            });
        }
    },
    {
        path: '/testboard',
        name: 'app.testboard',
        component: testboardComp,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pages/add',
                routeName: to.name,
                payload: testboardConf
            });
        }
    },
]
