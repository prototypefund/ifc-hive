/*
 * queries reducers
 */
import { searchHandler } from '@lib/dataHelper.js'

/*
 * execute queries
 */
function queriesExecute(state, action) {
  const { dataLookup } = action.meta
  let items
  if (Object.keys(state).length === 0) return state

  const queries = JSON.parse(JSON.stringify(state))
  if (action.actionId) {
    const query = JSON.parse(JSON.stringify(queries[action.actionId]))
    items = searchHandler(action.actionId, query.target, query.params || false, dataLookup)
    query.uuids = items
    queries[action.actionId] = query
    return queries
  } else {
    Object.values(queries).forEach(query => {
      items = searchHandler(action.actionId, query.target, query.params || false, dataLookup)
      query.uuids = items
    })
  }
  return queries
}

/*
 * add queries
 */
function queriesAdd(state, action) {
  const { $eventbus } = action.meta
  const queries = {}
  if (action.payload.actionId) {
    const params = JSON.parse(JSON.stringify(action.payload.params))
    if (!params.offset) params.offset = 0
    if (!params.limit) params.limit = 100
    queries[action.payload.actionId] = {
      target: action.payload.target,
      params: action.payload.params || false
    }
    // execute added query
    $eventbus.emit('storeDispatch', {
      type: 'queries/execute',
      actionId: action.payload.actionId
    })
  }
  return { ...state, ...queries }
}

/*
 * remove queries
 */
function queriesRemove(state, action) {
  const queries = JSON.parse(JSON.stringify(state))
  if (action.actionId) {
    delete queries[action.actionId]
  }
  return queries || {}
}

export {
  queriesExecute,
  queriesAdd,
  queriesRemove,
}
