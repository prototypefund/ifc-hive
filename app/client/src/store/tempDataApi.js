/*
 * @TODO
 * Temporary data api for the store
 * this should be replace by the actual API
 */
import { ref, } from "vue"
import { forEachObjIndexed } from 'ramda'

export default (store) => ({

  // TODO rethink this whole thing as soon as we have the es and api
  queryObjects: {},
  update: (actionId, docUUID, doc) => {

  },

  get: (actionId, query, params = { offset: 0, limit: 100 }) => {

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
        // iterate the val object to not override 
        forEachObjIndexed((value, attribute) => {
          queryObj.value[attribute] = value
        }, val)



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
