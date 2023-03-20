// import routes from modules

const dashboardComp = () => import('../components/pages/dashboard/page.vue')
const settingsComp = () => import('../components/pages/settings/page.vue')
const journalComp = () => import('../components/pages/journal/page.vue')
const ticketboardComp = () => import('../components/pages/ticketboard/page.vue')
const accountComp = () => import('../components/pages/account/page.vue')
const loadConf = (page) => import(`../components/pages/${page}/conf.js`)
const confCache = {}

export default function (store) {
  return [
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
        if (!confCache.ticketboard) {
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
} 
