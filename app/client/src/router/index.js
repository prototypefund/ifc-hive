/*
 * Create router
 */
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { beforeEachHook, beforeResolveHook, afterEachHook } from './routerHooks.js'

function createCustomRouter(store, $api) {

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes: routes(store)
  })

  /* Rooter hooks */
  router.beforeEach(beforeEachHook(store))
  router.beforeResolve(beforeResolveHook(store))
  router.afterEach(afterEachHook(store))

  return router
}


export default createCustomRouter
export { createCustomRouter }
