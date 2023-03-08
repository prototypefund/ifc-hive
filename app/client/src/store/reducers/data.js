import { applicationState } from '../state'
import { mergeDeepRight } from 'ramda'

export default ($eventbus) => (state, action) => {
  let data, items, item
  if (state) {
    switch (action.type) {
      case 'init':
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
              delete data[item._id]
            } else {
              data[item._id] = JSON.parse(JSON.stringify(item))
            }
          })
          $eventbus.emit('store/dispatch', {
            type: 'queries/execute',
            actionId: false
          })
          return data
        }
        return state
      case 'data/add':
        if (action.docUUID && action.objectDefinition) {
          $eventbus.emit('store/dispatch', {
            type: 'notifications/add',
            payload: {
              event: 'newItem',
              message: `a new Item with Id ${action.docUUID} of type ${action.type} was created`
            }
          })


          //TODO change this to api usage once it's available
          if (state[action.docUUID]) {
            console.error("we have a data/add but we have the item already in the dataStore, this should not happen!")
            // if we have the given doUUID in store already, we
            // already created it so lets redirect this call to
            // the update function
          }
          item = JSON.parse(JSON.stringify(action.objectDefinition))
          item._source = mergeDeepRight(item._source, action.payload)

          /*
           * request new object from server
           */
          switch (item._type) {
            // TODO send partial to type specific API endpoints: memo, user, tag etc. 
            case 'memo':

              break
            default:
              console.error(`Unknown object type ${item._type}`)
          }

          return state
        }
        return state
      case 'data/update':
        //TODO change this to api usage once it's available
        if (action.docUUID) {
          // @TODO review the differentiation between new and existing docs
          if (state[action.docUUID]) {
            // update existing doc
            item = JSON.parse(JSON.stringify(state[action.docUUID]))
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
