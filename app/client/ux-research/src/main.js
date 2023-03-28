import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import vuetify from './setup/vuetify.js'


/* import dummy pages for routes */
import page1 from './components/pages/01/index.vue'
import page2 from './components/pages/02/index.vue'
import edit from './components/pages/edit-tickets/index.vue'

/* Routes */
const routes = [
  { path: '/1', name: 'page1', component: page1 },
  { path: '/2', name: 'page2', component: page2 },
  { path: '/edit', name: 'edit', component: edit }
]

/* create router */
const router = createRouter({
  history: createWebHistory(),
  routes,
})


/* create app */
const app = createApp(App)
app.use(router)
app.use(vuetify)

app.mount('#app')

