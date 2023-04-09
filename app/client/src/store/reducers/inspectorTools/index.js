import * as reducers from './reducers.js'

/*
 * dataReducer
 */
export default ($eventbus, widgetsLookup) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': reducers.init,
    'projectInit': reducers.projectInit,
    'inspectorTools/add': reducers.inspectorToolsAdd,
    'inspectorTools/update': reducers.inspectorToolsUpdate,
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus, widgetsLookup)
    : state
}
