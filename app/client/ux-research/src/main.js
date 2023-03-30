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
  { path: '/test', name: 'test', component: selectProject },

  // app chrome
  {
    path: '/app',
    name: 'app',
    props: false,
    component: App,
    children: [
      {
        path: 'project/:id',
        name: 'project',
        component: projectRouter,
        props: true,
        children: [
          { path: 'splash', name: 'splash', component: splash },
          { path: '1', name: 'page1', component: page1 },
          { path: '2', name: 'page2', component: page2 },
          { path: 'edit', name: 'edit', component: edit },
        ]  
      },
      { path: 'select', name: 'select', component: selectProject, props: false },
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

