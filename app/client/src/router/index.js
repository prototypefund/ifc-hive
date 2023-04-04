import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { beforeEachHook, beforeResolveHook, afterEachHook } from './routerHooks.js'

export function createCustomRouter(store, $api) {

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes: routes(store)
  })

  /* Rooter hooks */
  router.beforeEach(beforeEachHook(store, $api))
  router.beforeResolve(beforeResolveHook(store, $api))
  router.afterEach(afterEachHook(store, $api))

  return router
}


export default createCustomRouter
