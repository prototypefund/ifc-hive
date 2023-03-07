import { widgetConfLoader, widgetTypeConfLoader } from "@lib/widgetLoader"

export default function ($store, $api, $log) {
  return {

    /*
     * dispatch 
     *
     * generic event handler which executes a store.dispatch
     * with the provided action
     * @param {object} action - a minirx-store action object
     */
    dispatch (action) {
      $log.store(action, 'Event store/dispatch')
      $store.dispatch(action)
    },

    /* @param {object} widget - a widget object */
    widgetConfLoaderHandler (widget) {
      $log.store(widget, 'Event widgetsConfLoaderHandler')
      widgetConfLoader($store)(widget)
    },

    /* @param {object} widget - a widget object */
    widgetTypeConfLoaderHandler (widget) {
      $log.store(widget, 'Event widgetsTypeConfLoaderHandler')
      widgetTypeConfLoader($store)(widget)
    },


    /*
     * Update or create item by sending a complete object
     * We are expected to send a complete object in the form
     *    {
     *      _type: 'my-object-type',
     *      ...
     *      _source: {
     *        _id: '1234',
     *        title: 'my title',
     *        ...
     *      }
     *    }
     */
    apiUpdateItem (item) {
      // @TODO add api map for types and URL mapping
      if (!item._type) return false

      switch (item._type) {
        /* Update memo */
        case 'memo':
          $log.api(item, 'PUT memo')
          $api.put(`/lab/memo/${item._source._id}`, item)
          break

        /* update user */
        case 'user': 
          $log.api(item, 'PUT memo')
          $api.put(`/lab/memo/${item._id}`, item)
          break
        case 'tag':
          $log.api(item, 'PUT memo')
          $api.put(`/lab/memo/${item._id}`, item)
          break

        default: 
          $log.error(`The object type ${item_type} does not exist`, 'unknown object type')
      }
    }
  }
}
