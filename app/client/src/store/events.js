/*
 * Collection of event handlers to be use in the store
 * see ./store/index.js for usage
 */
import { widgetConfLoader, widgetTypeConfLoader } from "@lib/widgetLoader"
import log from '@lib/logger.js'

function storeEventHandlers ($store, $eventbus) {
  return {
    /*
     * dispatch 
     *
     * generic event handler which executes a store.dispatch
     * with the provided action
     * @param {object} action - a minirx-store action object
     */
    dispatch (action) {
      log.store('Event store/dispatch', action)
      $store.dispatch(action)
    },

    /* 
     * @param {object} widget - a widget object
     */
    widgetConfLoaderHandler (widget) {
      log.store('Event widgetsConfLoaderHandler', widget)
      widgetConfLoader($store)(widget)
    },

    /*
     * @param {object} widget - a widget object
     */
    widgetTypeConfLoaderHandler (widget) {
      log.store('Event widgetsTypeConfLoaderHandler', widget)
      widgetTypeConfLoader($store)(widget)
    },
  }
}

export default storeEventHandlers
export {
  storeEventHandlers
}
