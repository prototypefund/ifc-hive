import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { forEachHook, beforeResolveHook, afterEachHook } from './routerHooks.js'
import { store } from '../store/index.js'

// create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* Rooter hooks */
router.beforeEach(forEachHook(store))
router.beforeResolve(beforeResolveHook(store))
router.afterEach(afterEachHook(store))

export default router
