import { applicationState } from '../state'
import { mergeDeepRight } from 'ramda'
import { getSource } from "@lib/dataHelper.js";

export default ($eventbus) => (state, action) => {
  let data, items, item
  if (state) {
    switch (action.type) {
      case 'init':
        window.$pacificoData = {}
        return applicationState.data
      case 'projectInit':
        window.$pacificoData = {}
        return applicationState.data
      case 'data/push':
        if (action.payload.data) {
          $eventbus.emit('store/dispatch', {
            type: 'notifications/add',
            payload: {
              event: 'push',
              message: `we've received ${action.payload.data.length} new Items for you!`
            }
          })
          data = JSON.parse(JSON.stringify(state))
          action.payload.data.forEach(item => {
            if (item._type === 'delete') {
              delete window.$pacificoData[item._id]
              delete data[item._id]
            } else {
              data[item._id] = JSON.parse(JSON.stringify(item))
              // add full object to window for lookup
              window.$pacificoData[item._id] = Object.freeze(JSON.parse(JSON.stringify(item)))
              // delete source from dataStore item to prevent excessive memory usage
              delete data[item._id]._source
            }
          })
          $eventbus.emit('store/dispatch', {
            type: 'queries/execute',
            actionId: false
          })
          return data
        }
        return state
      case 'data/update':
        if (action.docUUID) {
          // @TODO review the differentiation between new and existing docs
          if (state[action.docUUID]) {
            // get the meta data from our dataStore
            item = JSON.parse(JSON.stringify(state[action.docUUID]))
            // retrieve the _source from our window store
            item._source = getSource(action.docUUID)

          } else {
            // create a new doc
            item = JSON.parse(JSON.stringify(action.objectDefinition))
          }

          item._source = mergeDeepRight(item._source, action.payload)
          $eventbus.emit('data_update', item)
        }
        if (!action.docUUID) {
          console.error("no docUUID given")
        }
        return state
      case 'data/delete':
        console.error("data/delete not implemented")
        return state
      case 'data/clear':
        console.error("data/clear not implemented")
        return state
      default:
        return state
    }
  }
}
