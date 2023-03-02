import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { forEachHook, beforeResolveHook, afterEachHook } from './routerHooks.js'

export function createCustomRouter (store) {

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes: routes(store)
  })

  /* Rooter hooks */
  router.beforeEach(forEachHook(store))
  router.beforeResolve(beforeResolveHook(store))
  router.afterEach(afterEachHook(store))

  return router
}


export default createCustomRouter
