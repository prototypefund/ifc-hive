import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { forEachHook, beforeResolveHook } from './routerHooks.js'
import { store } from '../store/index.js'

// create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* Rooter hooks */
router.beforeEach(forEachHook(store))
router.beforeResolve(beforeResolveHook(store))

export default router
