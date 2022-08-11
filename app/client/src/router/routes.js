// import routes from modules
import dashboardComp from '@p/dashboard.vue'
import testboardComp from '@p/testboard.vue'
import settingsComp from '@p/settings.vue'
import journal from '@p/journal.vue'
import conf from '@p/conf.js'
import project_index from '@p/project_index.vue'
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
                payload: conf.dashboard
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
                payload: conf.testboard
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
    },
    {
        path: '/projects',
        name: 'app.projects',
        component: project_index,
        props: true,
        beforeEnter: (to, from) => {
            store.dispatch({
                type: 'pages/add',
                routeName: to.name,
                payload: conf.project_index
            });
        }
    }
]
