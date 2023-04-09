/*
 * queries reducers
 */
import { searchHandler } from '@lib/dataHelper.js'

/*
 * execute queries
 */
function queriesExecute (state, action) {
  const { dataLookup } = action.meta
  let queries, items, query
  if (Object.keys(state).length === 0) return state

  queries = JSON.parse(JSON.stringify(state))
  if (action.actionId) {
    query = JSON.parse(JSON.stringify(queries[action.actionId]))
    items = searchHandler(action.actionId, query.query, query.params || false, dataLookup)
    // remember the former state of uuids for later evaluation in dataAPI
    query.old_uuids = query.uuids || []
    query.uuids = items
    queries[action.actionId] = query
    return queries
  } else {
    Object.values(queries).forEach(query => {
      items = searchHandler(action.actionId, query.query, query.params || false, dataLookup)
      // remember the former state of uuids for later evaluation in dataAPI
      query.old_uuids = query.uuids || []
      query.uuids = items
    })
  }
  return queries
}

/*
 * add queries
 */
function queriesAdd (state, action) {
  const { $eventbus } = action.meta
  let queries, params
  if (action.payload.actionId) {
    queries = {}
    params = JSON.parse(JSON.stringify(action.payload.params))
    if (!params.offset) params.offset = 0
    if (!params.limit) params.limit = 100
    queries[action.payload.actionId] = {
      query: action.payload.query,
      params: action.payload.params || false
    }
    // execute added query
    $eventbus.emit('store/dispatch', {
      type: 'queries/execute',
      actionId: action.payload.actionId
    })
  }
  return { ...state, ...queries }
}

/*
 * remove queries
 */
function queriesRemove (state, action) {
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
