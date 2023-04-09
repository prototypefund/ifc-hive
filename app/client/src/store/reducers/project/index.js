import { applicationState } from '../../state'

/*
 * project reducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': () => applicationState.project,
    'project/addlist':  (state, action) => ({ ...state, ...{ list: action.payload } }),
    'project/addlookup': (state, action) => ({ ...state, ... { lookup: action.payload } }),
    'project/setId': (state, action) => ({ ...state, ...{ id: action.payload } }),
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
