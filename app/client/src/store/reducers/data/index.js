import * as reducers from './reducers.js'

/*
 * dataReducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': reducers.init,
    'projectInit': reducers.projectInit,
    'data/push': reducers.dataPush,
    'data/update': reducers.dataUpdate,
    'data/delete': reducers.dataDelete,
    'data/clear': reducers.dataClear,
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
