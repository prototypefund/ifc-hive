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
function forEachHook(store) {
  return (to, from) => {
    if (to === from) return

    // add default params to every route
    if (!to.params.locale) to.params.locale = 'de'
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
    if (to === from) return

    store.dispatch({
      type: 'currentPage/set',
      routeName: to.name,
      payload: { ...to.params, query: to.query }
    })
  }
}

export {
  forEachHook,
  beforeResolveHook,
}
