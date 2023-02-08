// import routes from modules
import { store } from '../store/index.js'

const dashboardComp = () => import('../components/pages/dashboard/page.vue')
const settingsComp = () => import('../components/pages/settings/page.vue')
const journalComp = () => import('../components/pages/journal/page.vue')
const ticketboardComp = () => import('../components/pages/ticketboard/page.vue')
const accountComp = () => import('../components/pages/account/page.vue')
const documentsComp = () => import('../components/pages/documents/page.vue')
const blockchainComp = () => import('../components/pages/blockchain/page.vue')
const myTasksComp = () => import('../components/pages/myTasks/page.vue')
const timelineComp = () => import('../components/pages/timeline/page.vue')
const loadConf = (page) => import(`../components/pages/${page}/conf.js`)
const confCache = {}
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
            if (!confCache.dashboard) {
                loadConf('dashboard').then(conf => {
                    confCache.dashboard = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/documents',
        name: 'app.documents',
        component: documentsComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.documents) {
                loadConf('documents').then(conf => {
                    confCache.documents = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/blockchain',
        name: 'app.blockchainApproval',
        component: blockchainComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.blockchainApproval) {
                loadConf('blockchain').then(conf => {
                    confCache.blockchainApproval = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/my-tasks',
        name: 'app.myTasks',
        component: myTasksComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.myTasks) {
                loadConf('myTasks').then(conf => {
                    confCache.myTasks = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/timeline',
        name: 'app.timeline',
        component: timelineComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.timeline) {
                loadConf('timeline').then(conf => {
                    confCache.timeline = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/account',
        name: 'app.accountSettings',
        component: accountComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.accountSettings) {
                loadConf('account').then(conf => {
                    confCache.accountSettings = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/settings',
        name: 'app.settings',
        component: settingsComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.settings) {
                loadConf('settings').then(conf => {
                    confCache.settings = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/journal',
        name: 'app.journal',
        component: journalComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.journal) {
                loadConf('journal').then(conf => {
                    confCache.journal = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },
    {
        path: '/ticketboard',
        name: 'app.ticketboard',
        component: ticketboardComp,
        props: true,
        beforeEnter: (to, from) => {
            if (!confCache.testboard) {
                loadConf('ticketboard').then(conf => {
                    confCache.ticketboard = conf.default
                    store.dispatch({
                        type: 'pages/add',
                        routeName: to.name,
                        payload: conf.default
                    });
                })
            }
        }
    },

]
