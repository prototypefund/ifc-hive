/*
 * Gather global router hooks and helper function.
 * The functions in this file are most likely applied in the main.js
 */

/*
 * ForEach Hook
 * @param { object } store, mini-rx store instance
 *
 * Keep track of the current route in the store
 */
import { loadingHold } from '../store/state'

/*
 * forEachHook
 * @param { object } store, mini-rx store instance
 */
function beforeEachHook(store) {
  return (to, from) => {
    if (to !== from) {
      store.dispatch({
        type: 'ui/update',
        payload: { loading: true }
      })
      // set the new route to the store
      store.dispatch({
        type: 'route/update',
        payload: to
      });
    }
  }
}

/*
 * afterEachHook
 * @param { object } store, mini-rx store instance
 *
 * removeLoading Animation
 */
function afterEachHook(store) {
  return (to, from) => {
    // change the currentPage, might often be just a change in url params
    if (to !== from) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        store.dispatch({
          type: 'ui/update',
          payload: { loading: false }
        })
      }, loadingHold);

    }
  }
}

/*
 * beforeResolveHook
 * @param { object } store, mini-rx store instance
 *
 * Pass route params and query data to the current page state
 */
function beforeResolveHook(store) {
  return (to, from) => {
    // change the currentPage, might often be just a change in url params
    if (to !== from) {
      store.dispatch({
        type: 'currentPage/set',
        routeName: to.name,
        payload: { ...to.params, query: to.query }
      })
    }
  }
}

export {
  beforeEachHook,
  afterEachHook,
  beforeResolveHook,
}
