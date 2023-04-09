import { mergeDeepRight } from 'ramda'
import { applicationState } from '../../state.js'
import * as reducers from './reducers.js'

/*
 * toolbar reducer
 */
export default ($eventbus, widgetsLookup) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': () => applicationState.toolbar,
    'projectInit': () => applicationState.toolbar,
    'toolbar/add': reducers.toolbarAdd,
    'toolbar/update': (state, action) => mergeDeepRight(state, action.payload)
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus, widgetsLookup)
    : state
}
