import { applicationState } from '../../state'
import * as reducers from './reducers.js'

/*
 * user reducer
 */
export default ($eventbus) => (state, action) => {
  if (!state) return 

  const reducer = {
    'init': () => applicationState.widgets,
    'projectInid': () => applicationState.widgets,
    'widgets/update': reducers.widgetsUpdate,
    'widgets/add': reducers.widgetsAdd,
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}

