/*
 * @TODO
 * Temporary data api for the store
 * this should be replace by the actual API
 */
import { ref, } from "vue"
import { forEachObjIndexed } from 'ramda'

const storeDataApi = (store) => ({
  // TODO rethink this whole thing as soon as we have the es and api
  queryObjects: {},
  update: (actionId, docUUID, doc) => { },
  get: (
    actionId,
    target,
    params = { offset: 0, limit: 100 },
    updateHook = false,
    hookCondition = 'all'
  ) => {
    // create a deep ref object which will contain the query data as well as the items
    const queryObj = ref({})
    // check if we have a query fullfilling the needs of the one requested
    // here. If not we will update the one with this actionId
    if (!store.$data.queryObjects[actionId]) {
      store.dispatch({
        type: "queries/add",
        payload: {
          actionId,
          target,
          params
        },
      })
    } else {
      return store.$data.queryObjects[actionId]
    }
    const subscriber$ = store.select((state) => state.queries[actionId])
      .subscribe((val) => {
        if (!val) return
        if (val?.uuids?.length > 0 && val.params?.endless) {
          // lets always create a vScrollItems attribute to our query return to virtualScroll over them
          const dataItems = []
          val.uuids.forEach(docUUID => {
            dataItems.push({
              docUUID
            })
          })
          queryObj.value.vScrollItems = dataItems
        }
        if (updateHook) {
          if (hookCondition === 'all' || !store.$data.queryObjects[actionId]) {
            // if we fire for the first time or we want to fire for all update events do it now
            updateHook(val, queryObj.value)
          } else if (hookCondition === 'count' && store.$data.queryObjects[actionId]) {
            // check if the uuid counts in the old result match it count of the new result. If not, fire hook
            if (val.uuids.length !== queryObj.value.uuids.length) {
              updateHook(val, queryObj.value)
            }
          }
        }

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

export default storeDataApi
export {
  storeDataApi
}
