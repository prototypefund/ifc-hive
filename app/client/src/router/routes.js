// import routes from modules

import App from '../app/App.vue'
import Index from '../app/Index.vue'
import app_project_select from '../app/selectProject.vue'

import app_dashboard from '../app/components/pages/dashboard/page.vue'
import app_journal from '../app/components/pages/journal/page.vue'
import app_ticketboard from '../app/components/pages/ticketboard/page.vue'




import app_settings from '../app/components/pages/settings/page.vue'
import app_account from '../app/components/pages/account/page.vue'

import public_login from '../public/login.vue'
import public_terms from '../public/terms.vue'


export default function (store) {
  return [
    /* Root */
    { path: '/', redirect: { name: 'public.login' } },
    { path: '/login', name: 'public.login', component: public_login },
    { path: '/terms', name: 'public.terms', component: public_terms },
    {
      path: '/app',
      name: 'app.index',
      props: true,
      component: Index,
      children: [
        {
          path: 'projects',
          name: 'app.project.select',
          component: app_project_select,
        },
        {
          path: 'project/:id',
          name: 'app.project.index',
          component: App,
          props: true,
          children: [
            {
              path: 'dashboard',
              name: 'app.dashboard',
              component: app_dashboard,
              props: true,
            },
            {
              path: 'journal',
              name: 'app.project.journal',
              component: app_journal,
              props: true,
            },
            {
              path: 'ticketboard',
              name: 'app.project.ticketboard',
              component: app_ticketboard,
              props: true,
            },
            {
              path: 'account',
              name: 'app.project.account.settings',
              component: app_account,
              props: true,
            },
            {
              path: 'settings',
              name: 'app.project.settings',
              component: app_settings,
              props: true,
            },
          ]
        },
      ]
    },
  ]
} 
