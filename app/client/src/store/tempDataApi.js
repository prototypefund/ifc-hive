/*
 * @TODO
 * Temporary data api for the store
 * this should be replace by the actual API
 */
import { ref, } from "vue"
import { getFullItem } from '@lib/dataHelper.js'
import { difference, forEachObjIndexed } from 'ramda'

export default (store) => ({

  // TODO rethink this whole thing as soon as we have the es and api
  queryObjects: {},
  update: (actionId, docUUID, doc) => {

  },

  get: (actionId, query, params = { offset: 0, limit: 100 }, updateHook = false, hookCondition = 'all') => {

    // create a deep ref object which will contain the query data as well as the items
    const queryObj = ref({ data: {} })
    // check if we have a query fullfilling the needs of the one requested here. If not we will update the one with this actionId
    if (!store.$data.queryObjects[actionId]
      || (store.$data.queryObjects[actionId].value.query !== query
        || store.$data.queryObjects[actionId].value.params !== params)) {
      store.dispatch({
        type: "queries/add",
        payload: {
          actionId,
          query,
          params
        },
      })
    } else {
      return store.$data.queryObjects[actionId]
    }
    const subscriber$ = store.select((state) => state.queries[actionId])
      .subscribe((val) => {
        if (!val) return
        const uuidsToAdd = difference(val.uuids, val.old_uuids);
        const uuidsToRemove = difference(val.old_uuids, val.uuids);
        /* uuidsToAdd.forEach(docUUID => {
           if (typeof (docUUID) === 'object') {
             queryObj.data[docUUID.actionId] = {
               ...docUUID,
               _id: docUUID.actionId
             }
           } else {
             queryObj.data[docUUID] = getFullItem(docUUID)
           }
 
         })
         uuidsToRemove.forEach(docUUID => {
           delete queryObj.data[docUUID]
         })
 */
        // iterate the val object to not override 
        forEachObjIndexed((value, attribute) => {
          if (attribute.uuids) {
            debugger
          }
          queryObj[attribute] = value
        }, val)



      })
    // add a unsubscribe function to our object so that we can trigger it easily on dismount
    queryObj.unsubscribe = () => {
      subscriber$.unsubscribe()
      store.dispatch({
        type: "queries/remove",
        actionId
      })
      delete store.$data.queryObjects[actionId]
    }
    store.$data.queryObjects[actionId] = queryObj
    return queryObj
  }
})
