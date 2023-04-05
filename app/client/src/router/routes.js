// import routes from modules

import App from '../app/App.vue'
import Index from '../app/Index.vue'
import app_project_select from '../app/selectProject.vue'

import app_dashboard from '../app/components/pages/dashboard/page.vue'
import app_journal from '../app/components/pages/journal/page.vue'
import app_ticketboard from '../app/components/pages/ticketboard/page.vue'
import app_test from '../app/components/pages/test/page.vue'

import app_settings from '../app/components/pages/settings/page.vue'
import app_account from '../app/components/pages/account/page.vue'

import public_login from '../public/login.vue'
import public_terms from '../public/terms.vue'
import public_logout from '../public/logout.vue'


export default function (store) {
  return [
    /* Root */
    { path: '/', props: true, redirect: { name: 'public.login' } },
    { path: '/login', name: 'public.login', component: public_login, props: true },
    { path: '/login', name: 'public.login', component: public_login, props: true },
    { path: '/logout', name: 'public.logout', component: public_logout, props: true },
    {
      path: '/app',
      name: 'app.index',
      props: { redirectURL: null, redirectProps: null },
      component: Index,
      redirect: { name: 'app.project.select' },
      children: [
        {
          path: 'projects',
          name: 'app.project.select',
          props: { redirectURL: null, redirectProps: null },
          component: app_project_select,
        },
        {
          path: 'project/:id',
          name: 'app.project.index',
          component: App,
          props: { redirectURL: null, redirectProps: null },
          children: [
            {
              path: 'dashboard',
              name: 'app.project.dashboard',
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
            {
              path: 'my-new-page',
              name: 'app.project.mynewpage',
              component: app_test,
              props: true,
            },
          ]
        },
      ]
    },
  ]
} 
