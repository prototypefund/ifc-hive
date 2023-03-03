import { applicationState } from '../state'
import { basicStoreFilters } from '@lib/dataHelper.js'

export default ($eventbus, dataLookup) => (state, action) => {
  let queries, items, query
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.queries
      case 'queries/execute':
        queries = JSON.parse(JSON.stringify(state))
        if (action.actionId) {
          query = JSON.parse(JSON.stringify(queries[action.actionId]))
          query.data = basicStoreFilters(query.query, query.params || false, dataLookup)

          query.uuids = Object.keys(query.data)
          queries[action.actionId] = query
          return queries
        } else {
          Object.values(queries).forEach(query => {
            query.data = basicStoreFilters(query.query, query.params || false, dataLookup)
            query.uuids = Object.keys(query.data)
          })
        }
        return queries
      case 'queries/add':
        if (action.payload.actionId) {
          queries = {}
          queries[action.payload.actionId] = {
            query: action.payload.query,
            params: action.payload.params || false
          }
          $eventbus.emit('store/dispatch', {
            type: 'queries/execute',
            actionId: action.payload.actionId,

          })
        }
        return { ...state, ...queries }
      case 'queries/remove':
        queries = JSON.parse(JSON.stringify(state))
        if (action.actionId) {
          delete queries[action.actionId]
        }
        return queries || {}
      default:
        return state
    }
  }
}
