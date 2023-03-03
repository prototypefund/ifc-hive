import { widgetConfLoader, widgetTypeConfLoader } from "@lib/widgetLoader"

export default function ($store, $log) {
  return {

    /*
     * dispatch 
     *
     * generic event handler which executes a store.dispatch
     * with the provided action
     * @param {object} action - a minirx-store action object
     */
    dispatch (action) {
      $store.dispatch(action)
    },

    /* @param {object} widget - a widget object */
    widgetConfLoaderHandler (widget) {
      widgetConfLoader($store)(widget)
    },

    /* @param {object} widget - a widget object */
    widgetTypeConfLoaderHandler (widget) {
      widgetTypeConfLoader($store)(widget)
    }
  }
}
