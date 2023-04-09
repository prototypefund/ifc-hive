import { applicationState } from '../../state'
import { mergeDeepRight } from 'ramda'
/*
 * upload reducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': () => applicationState.uploader,
    'projectInit': () => applicationState.uploader,
    'uploader/add': (state, action) => mergeDeepRight(state, action.payload),  
    'uploader/remove': (action) => JSON.parse(JSON.stringify(action.payload)),  
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
