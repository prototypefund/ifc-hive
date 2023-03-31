import { createApp } from 'vue'
import Index from './Index.vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import vuetify from './setup/vuetify.js'


/* import dummy pages for routes */
import page1 from './components/pages/01/index.vue'
import page2 from './components/pages/02/index.vue'
import edit from './components/pages/edit-tickets/index.vue'
import login from './components/pages/login/index.vue'
import splash from './components/pages/splash/index.vue'
import projectRouter from './Project.vue'
import selectProject from './selectProject.vue'

/* Routes */
const routes = [

  { path: '/', redirect: { name: 'login' } },
  { path: '/login', name: 'login', component: login },

  // app chrome
  {
    path: '/app',
    name: 'app',
    props: false,
    component: App,
    children: [
      {
        path: 'project',
        name: 'app.project.select',
        component: selectProject,
      },
      {
        path: 'project/:id',
        name: 'app.project',
        component: projectRouter,
        props: true,
        children: [
          { path: 'splash', name: 'app.splash', component: splash },
          { path: '1', name: 'app.page1', component: page1 },
          { path: '2', name: 'app.page2', component: page2 },
          { path: 'edit', name: 'app.edit', component: edit },
        ]
      }
    ]
  },

]

/* create router */
const router = createRouter({
  history: createWebHistory(),
  routes,
})


/* create app */
const app = createApp(Index)
app.use(router)
app.use(vuetify)

app.mount('#app')

