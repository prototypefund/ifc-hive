/*
 * @TODO
 * Temporary data api for the store
 * this should be replace by the actual API
 */
import { ref, } from "vue"
import { basicStoreFilters, splitIdentifier } from '@lib/dataHelper.js'
import { mergeDeepRight, clone, forEachObjIndexed } from 'ramda'

export default (store, dataLookup) => ({

  // TODO rethink this whole thing as soon as we have the es and api
  queryObjects: {},
  dataLookup: dataLookup,
  update: (actionId, docUUID, doc) => {

  },

  get: (actionId, query, params = {}, updateHook = false, hookCondition = 'all') => {
    // create a deep ref object which will contain the query data as well as the items
    const queryObj = ref({ helper: { basicStoreFilters, splitIdentifier } })
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
        // this will fire whenever we have changes to our query
        if (queryObj.value !== val && val) {
          if (updateHook) {
            if (hookCondition === 'all' || !store.$data.queryObjects[actionId]) {
              // if we fire for the first time or we want to fire for all update events do it now
              updateHook(val, queryObj.value)

            } else if (hookCondition === 'count' && store.$data.queryObjects[actionId]) {
              // check if the uuid counts in the old result match it count of the new result. If not, fire hook
              if ((val.uuids && store.$data.queryObjects[actionId].value.uuids)
                && val.uuids.length !== store.$data.queryObjects[actionId].value.uuids.length) {
                updateHook(val, queryObj.value)
              }

            }
          }
          // iterate the val object to not override 
          forEachObjIndexed((value, attribute) => {
            queryObj.value[attribute] = value
          }, val)

        }

      })
    // add a unsubscribe function to our object so that we can trigger it easily on dismount
    queryObj.value.unsubscribe = () => {
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