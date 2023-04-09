import { applicationState } from '../../state'
import * as reducers from './reducers.js'

/*
 * UI reducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': () => applicationState.ui,
    'projectInit': reducers.projectInit,
    'currentPage/set': reducers.currentPageSet,  
    'ui/toggle': reducers.uiToggle,  
    'ui/update': reducers.uiUpdate,  
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
