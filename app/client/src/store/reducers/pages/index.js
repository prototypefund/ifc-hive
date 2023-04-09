import * as reducer from './reducers.js'
/*
 * pages reducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const pagesReducer = {
    'init': reducer.pagesInit,
    'projectInit': reducer.projectInit,
    'pages/add': reducer.pagesAdd,
    'pages/update': reducer.pagesUpdate
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return pagesReducer[action.type] 
    ? pagesReducer[action.type](state, action, $eventbus)
    : state
}
