import { widgetConfLoader, widgetTypeConfLoader } from "@lib/widgetLoader"
import log from '@lib/logger.js'

export default function ($store, $eventbus) {
  return {
    /*
     * dispatch 
     *
     * generic event handler which executes a store.dispatch
     * with the provided action
     * @param {object} action - a minirx-store action object
     */
    dispatch (action) {
      log.store(action, 'Event store/dispatch')
      $store.dispatch(action)
    },

    /* 
     * @param {object} widget - a widget object
     */
    widgetConfLoaderHandler (widget) {
      log.store(widget, 'Event widgetsConfLoaderHandler')
      widgetConfLoader($store)(widget)
    },

    /*
     * @param {object} widget - a widget object
     */
    widgetTypeConfLoaderHandler (widget) {
      log.store(widget, 'Event widgetsTypeConfLoaderHandler')
      widgetTypeConfLoader($store)(widget)
    },
  }
}
