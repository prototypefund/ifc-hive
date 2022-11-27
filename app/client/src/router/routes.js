// import routes from modules
import { store } from '../store/index.js'

const dashboardComp = () => import('../components/pages/dashboard/page.vue')
const settingsComp = () => import('../components/pages/settings/page.vue')
const journalComp = () => import('../components/pages/journal/page.vue')
const testboardComp = () => import('../components/pages/testboard/page.vue')
const loadConf = (page) => import(`../components/pages/${page}/conf.json`)

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
        beforeEnter: async (to, from) => {
            loadConf('dashboard').then(conf => {
                store.dispatch({
                    type: 'pages/add',
                    routeName: to.name,
                    payload: conf
                });
            })
        }
    },
    {
        path: '/settings',
        name: 'app.settings',
        component: settingsComp,
        props: true,
        beforeEnter: (to, from) => {
            loadConf('settings').then(conf => {
                store.dispatch({
                    type: 'pages/add',
                    routeName: to.name,
                    payload: conf
                });
            })
        }
    },
    {
        path: '/journal',
        name: 'app.journal',
        component: journalComp,
        props: true,
        beforeEnter: (to, from) => {
            loadConf('journal').then(conf => {
                store.dispatch({
                    type: 'pages/add',
                    routeName: to.name,
                    payload: conf
                });
            })
        }
    },
    {
        path: '/testboard',
        name: 'app.testboard',
        component: testboardComp,
        props: true,
        beforeEnter: (to, from) => {
            loadConf('testboard').then(conf => {
                store.dispatch({
                    type: 'pages/add',
                    routeName: to.name,
                    payload: conf
                });
            })
        }
    },
]
